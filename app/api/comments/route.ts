import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COMMENT_LIMIT = 50;
const COOLDOWN_SECONDS = 20;
const BLOCK_HOURS = 24;

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "127.0.0.1";
}

// GET - Fetch comments for a blog or unreplied comments for admin
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");
  const unreplied = searchParams.get("unreplied");

  // For admin: get unreplied comments count
  if (unreplied === "true") {
    try {
      // Get comments that don't have admin replies
      const comments = await prisma.comment.findMany({
        where: {
          parentId: null, // Only top-level comments
          isAdminReply: false, // Not admin comments
          replies: {
            none: {
              isAdminReply: true, // No admin reply exists
            },
          },
        },
        include: {
          blog: { select: { title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json(comments);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch unreplied comments" },
        { status: 500 }
      );
    }
  }

  // For public: get comments for specific blog
  if (!blogId) {
    return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
        approved: true,
        parentId: null, // Only top-level comments
      },
      include: {
        replies: {
          where: { approved: true },
          include: {
            admin: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        admin: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create new comment or reply
export async function POST(request: NextRequest) {
  try {
    const { blogId, name, message, parentId } = await request.json();
    const ipAddress = getClientIP(request);

    if (!blogId || !name || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (name.length > 50 || message.length > 500) {
      return NextResponse.json(
        { error: "Name or message too long" },
        { status: 400 }
      );
    }

    // Check rate limit
    let rateLimit = await prisma.commentRateLimit.findUnique({
      where: { ipAddress_blogId: { ipAddress, blogId } },
    });

    const now = new Date();

    if (rateLimit) {
      // Check if blocked
      if (rateLimit.blockedUntil && rateLimit.blockedUntil > now) {
        const remainingHours = Math.ceil(
          (rateLimit.blockedUntil.getTime() - now.getTime()) / (1000 * 60 * 60)
        );
        return NextResponse.json(
          {
            error: `Anda diblokir selama ${remainingHours} jam lagi. Silakan coba lagi nanti.`,
            blocked: true,
            blockedUntil: rateLimit.blockedUntil,
          },
          { status: 429 }
        );
      }

      // Check cooldown (20 seconds between comments)
      const timeSinceLastComment =
        (now.getTime() - rateLimit.lastComment.getTime()) / 1000;
      if (timeSinceLastComment < COOLDOWN_SECONDS) {
        const remainingSeconds = Math.ceil(
          COOLDOWN_SECONDS - timeSinceLastComment
        );
        return NextResponse.json(
          {
            error: `Tunggu ${remainingSeconds} detik sebelum mengirim komentar lagi.`,
            cooldown: true,
            remainingSeconds,
          },
          { status: 429 }
        );
      }

      // Reset count if 24 hours passed since block
      if (rateLimit.blockedUntil && rateLimit.blockedUntil <= now) {
        rateLimit = await prisma.commentRateLimit.update({
          where: { id: rateLimit.id },
          data: { commentCount: 0, blockedUntil: null },
        });
      }

      // Check if reached limit
      if (rateLimit.commentCount >= COMMENT_LIMIT) {
        const blockedUntil = new Date(
          now.getTime() + BLOCK_HOURS * 60 * 60 * 1000
        );
        await prisma.commentRateLimit.update({
          where: { id: rateLimit.id },
          data: { blockedUntil },
        });
        return NextResponse.json(
          {
            error: `Anda telah mencapai batas ${COMMENT_LIMIT} komentar. Diblokir selama 24 jam.`,
            blocked: true,
            blockedUntil,
          },
          { status: 429 }
        );
      }
    }

    // Create comment or reply
    const comment = await prisma.comment.create({
      data: {
        blogId,
        name,
        message,
        ipAddress,
        parentId: parentId || null,
      },
    });

    // Update rate limit
    if (rateLimit) {
      await prisma.commentRateLimit.update({
        where: { id: rateLimit.id },
        data: {
          commentCount: rateLimit.commentCount + 1,
          lastComment: now,
        },
      });
    } else {
      await prisma.commentRateLimit.create({
        data: { ipAddress, blogId, commentCount: 1, lastComment: now },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

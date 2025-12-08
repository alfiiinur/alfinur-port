import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIP) return realIP;
  return "127.0.0.1";
}

// GET - Get reactions for a comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ipAddress = getClientIP(request);

    const reactions = await prisma.commentReaction.groupBy({
      by: ["type"],
      where: { commentId: id },
      _count: { type: true },
    });

    // Check user's reactions
    const userReactions = await prisma.commentReaction.findMany({
      where: { commentId: id, ipAddress },
      select: { type: true },
    });

    const reactionCounts: Record<string, number> = {};
    reactions.forEach((r) => {
      reactionCounts[r.type] = r._count.type;
    });

    return NextResponse.json({
      counts: reactionCounts,
      userReactions: userReactions.map((r) => r.type),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get reactions" },
      { status: 500 }
    );
  }
}

// POST - Add/toggle reaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json();
    const ipAddress = getClientIP(request);

    const validTypes = ["LIKE", "DISLIKE", "LOVE", "LAUGH", "SAD", "ANGRY"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // Check if reaction exists
    const existing = await prisma.commentReaction.findUnique({
      where: { commentId_ipAddress_type: { commentId: id, ipAddress, type } },
    });

    if (existing) {
      // Remove reaction (toggle off)
      await prisma.commentReaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed", type });
    } else {
      // Add reaction
      await prisma.commentReaction.create({
        data: { commentId: id, ipAddress, type },
      });
      return NextResponse.json({ action: "added", type });
    }
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json(
      { error: "Failed to add reaction" },
      { status: 500 }
    );
  }
}

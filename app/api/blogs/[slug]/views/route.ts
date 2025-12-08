import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIP) return realIP;
  return "127.0.0.1";
}

// GET - Get view count for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const viewCount = await prisma.blogView.count({
      where: { blogId: blog.id },
    });

    return NextResponse.json({ views: viewCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
  }
}

// POST - Track a view (unique per IP)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ipAddress = getClientIP(request);

    const blog = await prisma.blog.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Upsert view (create if not exists)
    await prisma.blogView.upsert({
      where: { blogId_ipAddress: { blogId: blog.id, ipAddress } },
      create: { blogId: blog.id, ipAddress },
      update: {}, // Do nothing if exists
    });

    const viewCount = await prisma.blogView.count({
      where: { blogId: blog.id },
    });

    return NextResponse.json({ views: viewCount });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}

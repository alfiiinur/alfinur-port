import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check if already liked
    const existingLike = await prisma.designLike.findUnique({
      where: { designId_ipAddress: { designId: id, ipAddress: ip } },
    });

    if (existingLike) {
      // Unlike
      await prisma.designLike.delete({ where: { id: existingLike.id } });
      const count = await prisma.designLike.count({ where: { designId: id } });
      return NextResponse.json({ liked: false, count });
    }

    // Like
    await prisma.designLike.create({
      data: { designId: id, ipAddress: ip },
    });
    const count = await prisma.designLike.count({ where: { designId: id } });
    return NextResponse.json({ liked: true, count });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const [count, existingLike] = await Promise.all([
      prisma.designLike.count({ where: { designId: id } }),
      prisma.designLike.findUnique({
        where: { designId_ipAddress: { designId: id, ipAddress: ip } },
      }),
    ]);

    return NextResponse.json({ liked: !!existingLike, count });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 }
    );
  }
}

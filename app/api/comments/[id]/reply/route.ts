import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Admin reply to comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { message } = await request.json();

    if (!message || message.length > 500) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Get parent comment
    const parentComment = await prisma.comment.findUnique({
      where: { id },
      select: { blogId: true },
    });

    if (!parentComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Create admin reply
    const reply = await prisma.comment.create({
      data: {
        blogId: parentComment.blogId,
        parentId: id,
        name: session.user.name || "Admin",
        message,
        ipAddress: "admin",
        isAdminReply: true,
        adminId: session.user.id,
      },
      include: {
        admin: { select: { name: true } },
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

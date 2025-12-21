import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all chat sessions for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status");

    const sessions = await prisma.chatSession.findMany({
      where: status
        ? { status: status as "ACTIVE" | "WAITING" | "RESOLVED" | "CLOSED" }
        : undefined,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get last message for preview
        },
        assignedTo: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            messages: { where: { isRead: false, sender: "VISITOR" } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Admin chat GET error:", error);
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    );
  }
}

// POST - Admin send message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, content, isAiGenerated, attachments } =
      await request.json();

    if (
      !sessionId ||
      (!content && (!attachments || attachments.length === 0))
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        content: content || "",
        sender: isAiGenerated ? "AI" : "ADMIN",
        adminId: session.user.id,
        attachments: attachments || [],
        metadata: isAiGenerated ? { aiGenerated: true } : undefined,
      },
    });

    // Update session status
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status: "ACTIVE",
        assignedToId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Admin chat POST error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

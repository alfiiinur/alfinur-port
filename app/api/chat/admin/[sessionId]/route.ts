import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get single session with all messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            admin: { select: { id: true, name: true } },
          },
        },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Mark visitor messages as read
    await prisma.chatMessage.updateMany({
      where: { sessionId, sender: "VISITOR", isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json(chatSession);
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

// PATCH - Update session (status, AI toggle, etc)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const body = await request.json();

    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        ...(body.status && { status: body.status }),
        ...(typeof body.isAiEnabled === "boolean" && {
          isAiEnabled: body.isAiEnabled,
        }),
        ...(body.status === "CLOSED" && { closedAt: new Date() }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

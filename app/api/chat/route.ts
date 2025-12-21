import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get or create chat session for visitor
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (sessionId) {
      // Get existing session with messages
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(session);
    }

    // Check for existing active session from this IP
    const existingSession = await prisma.chatSession.findFirst({
      where: {
        visitorIp: ip,
        status: { in: ["ACTIVE", "WAITING"] },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (existingSession) {
      return NextResponse.json(existingSession);
    }

    // Create new session
    const newSession = await prisma.chatSession.create({
      data: {
        visitorIp: ip,
        status: "ACTIVE",
        isAiEnabled: true,
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json(
      { error: "Failed to get chat session" },
      { status: 500 }
    );
  }
}

// POST - Send message from visitor
export async function POST(request: NextRequest) {
  try {
    const { sessionId, content, visitorName, visitorEmail, attachments } =
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

    // Update session info if provided
    if (visitorName || visitorEmail) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          ...(visitorName && { visitorName }),
          ...(visitorEmail && { visitorEmail }),
        },
      });
    }

    // Create visitor message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        content: content || "",
        sender: "VISITOR",
        attachments: attachments || [],
      },
    });

    // Update session status to waiting for admin
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: "WAITING", updatedAt: new Date() },
    });

    // AI auto-reply (if enabled)
    // Uncomment below when AI is configured
    // try {
    //   const { processMessageWithAI } = await import("@/lib/chat-ai");
    //   await processMessageWithAI(sessionId, content);
    // } catch (error) {
    //   console.error("AI processing error:", error);
    // }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

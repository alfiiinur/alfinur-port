import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Test endpoint to check if chat tables exist and work
export async function GET() {
  try {
    // Test 1: Count sessions
    const sessionCount = await prisma.chatSession.count();

    // Test 2: Count messages
    const messageCount = await prisma.chatMessage.count();

    // Test 3: Get all sessions with messages
    const sessions = await prisma.chatSession.findMany({
      include: {
        messages: true,
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      sessionCount,
      messageCount,
      sessions,
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

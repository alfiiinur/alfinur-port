import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch user sessions
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.userSession.findMany({
      where: { userId: session.user.id },
      orderBy: { lastActive: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// DELETE - Revoke a session
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (sessionId === "all") {
      // Revoke all sessions except current
      await prisma.userSession.deleteMany({
        where: {
          userId: session.user.id,
          isCurrentSession: false,
        },
      });
    } else if (sessionId) {
      await prisma.userSession.delete({
        where: {
          id: sessionId,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ message: "Session revoked" });
  } catch (error) {
    console.error("Error revoking session:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all quick replies
export async function GET() {
  try {
    const replies = await prisma.quickReply.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Quick replies GET error:", error);
    return NextResponse.json(
      { error: "Failed to get quick replies" },
      { status: 500 }
    );
  }
}

// POST - Create quick reply (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, shortcut, content, category } = await request.json();

    if (!title || !shortcut || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reply = await prisma.quickReply.create({
      data: { title, shortcut, content, category },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Quick reply POST error:", error);
    return NextResponse.json(
      { error: "Failed to create quick reply" },
      { status: 500 }
    );
  }
}

// PUT - Update quick reply
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await request.json();

    const reply = await prisma.quickReply.update({
      where: { id },
      data,
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Quick reply PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update quick reply" },
      { status: 500 }
    );
  }
}

// DELETE - Delete quick reply
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    await prisma.quickReply.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quick reply DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete quick reply" },
      { status: 500 }
    );
  }
}

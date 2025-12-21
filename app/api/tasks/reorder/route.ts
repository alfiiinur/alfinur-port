import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST reorder tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tasks } = body;

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Tasks array is required" },
        { status: 400 }
      );
    }

    // Update sortOrder for each task
    await Promise.all(
      tasks.map((task: { id: string; sortOrder: number }) =>
        prisma.task.update({
          where: { id: task.id },
          data: { sortOrder: task.sortOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering tasks:", error);
    return NextResponse.json(
      { error: "Failed to reorder tasks" },
      { status: 500 }
    );
  }
}

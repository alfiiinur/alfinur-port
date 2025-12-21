import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST bulk actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, taskIds, data } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: "Task IDs are required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "delete":
        await prisma.task.deleteMany({
          where: { id: { in: taskIds } },
        });
        return NextResponse.json({ success: true, deleted: taskIds.length });

      case "updateStatus":
        if (!data?.status) {
          return NextResponse.json(
            { error: "Status is required" },
            { status: 400 }
          );
        }
        await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { status: data.status },
        });
        return NextResponse.json({ success: true, updated: taskIds.length });

      case "updatePriority":
        if (!data?.priority) {
          return NextResponse.json(
            { error: "Priority is required" },
            { status: 400 }
          );
        }
        await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { priority: data.priority },
        });
        return NextResponse.json({ success: true, updated: taskIds.length });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}

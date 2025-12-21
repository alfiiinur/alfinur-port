import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: {
          include: { assignees: true },
          orderBy: { sortOrder: "asc" },
        },
        assignees: true,
        parent: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PATCH update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      status,
      priority,
      paymentStatus,
      startDate,
      dueDate,
      tags,
      attachments,
      isCompleted,
      sortOrder,
      assignees,
    } = body;

    // If assignees are provided, delete existing and create new
    if (assignees !== undefined) {
      await prisma.taskAssignee.deleteMany({ where: { taskId: id } });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(tags !== undefined && { tags }),
        ...(attachments !== undefined && { attachments }),
        ...(isCompleted !== undefined && { isCompleted }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(assignees !== undefined && {
          assignees: {
            create: assignees.map(
              (a: { name: string; avatar?: string; email?: string }) => ({
                name: a.name,
                avatar: a.avatar,
                email: a.email,
              })
            ),
          },
        }),
      },
      include: {
        subtasks: { include: { assignees: true } },
        assignees: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

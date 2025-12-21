import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: Record<string, unknown> = {
      parentId: null, // Only get parent tasks
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        subtasks: {
          include: {
            assignees: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        assignees: true,
      },
      orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    // Group tasks by status
    const groupedTasks = {
      NOT_STARTED: tasks.filter((t) => t.status === "NOT_STARTED"),
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
      TESTING: tasks.filter((t) => t.status === "TESTING"),
      COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
    };

    return NextResponse.json({ tasks, groupedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
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
      parentId,
      assignees,
    } = body;

    const task = await prisma.task.create({
      data: {
        name,
        description,
        status: status || "NOT_STARTED",
        priority: priority || "MEDIUM",
        paymentStatus,
        startDate: startDate ? new Date(startDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags || [],
        attachments: attachments || [],
        parentId,
        assignees: assignees?.length
          ? {
              create: assignees.map(
                (a: { name: string; avatar?: string; email?: string }) => ({
                  name: a.name,
                  avatar: a.avatar,
                  email: a.email,
                })
              ),
            }
          : undefined,
      },
      include: {
        subtasks: true,
        assignees: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

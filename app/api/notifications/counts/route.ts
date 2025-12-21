import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch all notification counts for admin dashboard
export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Run all queries in parallel
    const [
      unreadContacts,
      unreadComments,
      waitingChats,
      overdueBills,
      pendingBills,
      overdueTasks,
      dueTodayTasks,
      todayEvents,
      upcomingEvents,
    ] = await Promise.all([
      // Contact submissions - NEW status
      prisma.contactSubmission.count({
        where: { status: "NEW" },
      }),

      // Comments without admin reply
      prisma.comment.count({
        where: {
          parentId: null,
          isAdminReply: false,
          replies: {
            none: { isAdminReply: true },
          },
        },
      }),

      // Chat sessions waiting for admin
      prisma.chatSession
        .count({
          where: { status: "WAITING" },
        })
        .catch(() => 0),

      // Bills - OVERDUE status
      prisma.bill
        .count({
          where: { status: "OVERDUE" },
        })
        .catch(() => 0),

      // Bills - PENDING and due within 3 days
      prisma.bill
        .count({
          where: {
            status: "PENDING",
            dueDate: {
              lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
          },
        })
        .catch(() => 0),

      // Tasks - overdue (past due date and not completed)
      prisma.task
        .count({
          where: {
            isCompleted: false,
            dueDate: { lt: today },
          },
        })
        .catch(() => 0),

      // Tasks - due today
      prisma.task
        .count({
          where: {
            isCompleted: false,
            dueDate: {
              gte: today,
              lt: tomorrow,
            },
          },
        })
        .catch(() => 0),

      // Calendar events - today
      prisma.calendarEvent
        .count({
          where: {
            startDate: {
              gte: today,
              lt: tomorrow,
            },
          },
        })
        .catch(() => 0),

      // Calendar events - upcoming (next 3 days)
      prisma.calendarEvent
        .count({
          where: {
            startDate: {
              gte: tomorrow,
              lt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
          },
        })
        .catch(() => 0),
    ]);

    return NextResponse.json({
      contact: unreadContacts,
      comments: unreadComments,
      chat: waitingChats,
      bills: {
        overdue: overdueBills,
        pending: pendingBills,
        total: overdueBills + pendingBills,
      },
      tasks: {
        overdue: overdueTasks,
        dueToday: dueTodayTasks,
        total: overdueTasks + dueTodayTasks,
      },
      calendar: {
        today: todayEvents,
        upcoming: upcomingEvents,
        total: todayEvents + upcomingEvents,
      },
      totalUnread:
        unreadContacts +
        unreadComments +
        waitingChats +
        overdueBills +
        overdueTasks +
        todayEvents,
    });
  } catch (error) {
    console.error("Error fetching notification counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification counts" },
      { status: 500 }
    );
  }
}

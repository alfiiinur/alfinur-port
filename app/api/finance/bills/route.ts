import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;

    // Auto-update overdue bills
    const now = new Date();
    await prisma.bill.updateMany({
      where: {
        status: "PENDING",
        dueDate: { lt: now },
      },
      data: { status: "OVERDUE" },
    });

    const bills = await prisma.bill.findMany({
      where,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
      include: {
        wallet: { select: { name: true } },
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Failed to fetch bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      amount,
      dueDate,
      category,
      description,
      isRecurring,
      recurringType,
      reminder,
      walletId,
    } = body;

    const bill = await prisma.bill.create({
      data: {
        name,
        amount,
        dueDate: new Date(dueDate),
        category,
        description,
        isRecurring: isRecurring || false,
        recurringType: isRecurring ? recurringType : null,
        reminder,
        walletId,
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("Failed to create bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}

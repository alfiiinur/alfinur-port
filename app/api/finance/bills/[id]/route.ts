import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        wallet: { select: { name: true } },
        transactions: true,
      },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Failed to fetch bill:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const bill = await prisma.bill.update({
      where: { id },
      data: {
        name,
        amount,
        dueDate: new Date(dueDate),
        category,
        description,
        isRecurring,
        recurringType: isRecurring ? recurringType : null,
        reminder,
        walletId,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Failed to update bill:", error);
    return NextResponse.json(
      { error: "Failed to update bill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bill:", error);
    return NextResponse.json(
      { error: "Failed to delete bill" },
      { status: 500 }
    );
  }
}

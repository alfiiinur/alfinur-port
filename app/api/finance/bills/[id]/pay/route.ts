import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the bill
    const bill = await prisma.bill.findUnique({
      where: { id },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    // Update bill status
    const updatedBill = await prisma.bill.update({
      where: { id },
      data: { status: "PAID" },
    });

    // If bill has a wallet, create expense transaction and update balance
    if (bill.walletId) {
      await prisma.transaction.create({
        data: {
          amount: bill.amount,
          type: "EXPENSE",
          category: bill.category,
          description: `Payment for ${bill.name}`,
          date: new Date(),
          walletId: bill.walletId,
          billId: bill.id,
        },
      });

      await prisma.wallet.update({
        where: { id: bill.walletId },
        data: { balance: { decrement: bill.amount } },
      });
    }

    // If recurring, create next bill
    if (bill.isRecurring && bill.recurringType) {
      const nextDueDate = new Date(bill.dueDate);

      switch (bill.recurringType) {
        case "DAILY":
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case "WEEKLY":
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case "MONTHLY":
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
        case "YEARLY":
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          break;
      }

      await prisma.bill.create({
        data: {
          name: bill.name,
          amount: bill.amount,
          dueDate: nextDueDate,
          category: bill.category,
          description: bill.description,
          isRecurring: true,
          recurringType: bill.recurringType,
          reminder: bill.reminder,
          walletId: bill.walletId,
        },
      });
    }

    return NextResponse.json(updatedBill);
  } catch (error) {
    console.error("Failed to pay bill:", error);
    return NextResponse.json({ error: "Failed to pay bill" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        wallet: { select: { name: true } },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
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
    const { amount, type, category, description, date, walletId } = body;

    // Get old transaction to revert balance
    const oldTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!oldTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Revert old balance change
    const oldBalanceChange =
      oldTransaction.type === "INCOME"
        ? -oldTransaction.amount
        : oldTransaction.amount;

    await prisma.wallet.update({
      where: { id: oldTransaction.walletId },
      data: { balance: { increment: oldBalanceChange } },
    });

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        type,
        category,
        description,
        date: new Date(date),
        walletId,
      },
    });

    // Apply new balance change
    const newBalanceChange = type === "INCOME" ? amount : -amount;
    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: newBalanceChange } },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
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

    // Get transaction to revert balance
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Revert balance change
    const balanceChange =
      transaction.type === "INCOME" ? -transaction.amount : transaction.amount;

    await prisma.wallet.update({
      where: { id: transaction.walletId },
      data: { balance: { increment: balanceChange } },
    });

    // Delete transaction
    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

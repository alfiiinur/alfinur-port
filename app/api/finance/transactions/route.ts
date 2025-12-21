import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("walletId");
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};

    if (walletId) where.walletId = walletId;
    if (type && type !== "all") where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate)
        (where.date as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, Date>).lte = new Date(endDate);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        wallet: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(
      transactions.map((t) => ({
        ...t,
        walletName: t.wallet.name,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, type, category, description, date, walletId, tags } = body;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        description,
        date: new Date(date),
        walletId,
        tags: tags || [],
      },
    });

    // Update wallet balance
    const balanceChange = type === "INCOME" ? amount : -amount;
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: balanceChange },
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

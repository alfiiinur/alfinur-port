import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const wallets = await prisma.wallet.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
    return NextResponse.json(wallets);
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, balance, currency, color, icon } = body;

    // Check if this is the first wallet (make it default)
    const existingWallets = await prisma.wallet.count();
    const isDefault = existingWallets === 0;

    const wallet = await prisma.wallet.create({
      data: {
        name,
        type,
        balance: balance || 0,
        currency: currency || "IDR",
        color: color || "#3b82f6",
        icon: icon || "wallet",
        isDefault,
        userId: "system", // Replace with actual user ID from session
      },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    console.error("Failed to create wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}

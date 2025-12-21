import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Remove default from all wallets
    await prisma.wallet.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set this wallet as default
    const wallet = await prisma.wallet.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Failed to set default wallet:", error);
    return NextResponse.json(
      { error: "Failed to set default wallet" },
      { status: 500 }
    );
  }
}

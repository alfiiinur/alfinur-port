import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all wallets
    const wallets = await prisma.wallet.findMany({
      where: { isActive: true },
      select: { id: true, name: true, balance: true, type: true, color: true },
    });

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    // Get this month's transactions
    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
    });

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    // Get pending bills count
    const pendingBills = await prisma.bill.count({
      where: { status: { in: ["PENDING", "OVERDUE"] } },
    });

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { wallet: { select: { name: true } } },
    });

    // ========== CHART DATA ==========

    // 1. Monthly trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthTx = await prisma.transaction.findMany({
        where: { date: { gte: monthStart, lte: monthEnd } },
      });

      const income = monthTx
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTx
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString("id-ID", { month: "short" }),
        income,
        expense,
      });
    }

    // 2. Expense by category (this month)
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        expenseByCategory[t.category] =
          (expenseByCategory[t.category] || 0) + t.amount;
      });

    const categoryData = Object.entries(expenseByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories

    // 3. Daily spending (last 7 days)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTx = await prisma.transaction.findMany({
        where: { date: { gte: day, lte: dayEnd } },
      });

      const income = dayTx
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTx
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      dailyData.push({
        day: day.toLocaleDateString("id-ID", { weekday: "short" }),
        date: day.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        income,
        expense,
      });
    }

    // 4. Wallet distribution
    const walletData = wallets.map((w) => ({
      name: w.name,
      value: w.balance,
      color: w.color,
    }));

    return NextResponse.json({
      totalBalance,
      totalIncome,
      totalExpense,
      pendingBills,
      wallets,
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description,
        date: t.date,
        walletName: t.wallet.name,
      })),
      // Chart data
      charts: {
        monthly: monthlyData,
        category: categoryData,
        daily: dailyData,
        walletDistribution: walletData,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

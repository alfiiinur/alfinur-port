/**
 * Telegram Finance Integration Service
 *
 * Bridge between Telegram bot and existing finance system.
 * Handles user mapping, transaction creation, wallet management, and recaps.
 *
 * Requirements: 2.4, 4.2, 4.3, 4.4, 4.6, 5.1, 5.2, 5.4, 8.4
 */

import { prisma } from "@/lib/prisma";
import {
  TransactionInput,
  RecapData,
  BalanceData,
  WalletBalance,
  TransactionSummary,
  TelegramUserMapping,
} from "@/types/telegram";
import { Transaction, Wallet } from "@/types/finance";

/**
 * Result type for service operations
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Gets or creates a user mapping for a Telegram user.
 * If the mapping doesn't exist, creates one with the first available wallet as default.
 *
 * Requirements: 8.4
 *
 * @param telegramUserId - The Telegram user ID
 * @param telegramUsername - Optional Telegram username
 * @returns ServiceResult containing the user mapping
 */
export async function getUserMapping(
  telegramUserId: number,
  telegramUsername?: string,
): Promise<ServiceResult<TelegramUserMapping>> {
  try {
    // Try to find existing mapping
    let mapping = await prisma.telegramUserMapping.findUnique({
      where: { telegramUserId: BigInt(telegramUserId) },
    });

    if (mapping) {
      // Update username if changed
      if (telegramUsername && mapping.telegramUsername !== telegramUsername) {
        mapping = await prisma.telegramUserMapping.update({
          where: { id: mapping.id },
          data: { telegramUsername },
        });
      }

      return {
        success: true,
        data: {
          ...mapping,
          telegramUserId: mapping.telegramUserId,
        } as TelegramUserMapping,
      };
    }

    // Create new mapping
    // Get the first user from the system (for single-user setup)
    const systemUser = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!systemUser) {
      return {
        success: false,
        error: "No system user found. Please create a user account first.",
      };
    }

    // Get default wallet
    const defaultWallet = await prisma.wallet.findFirst({
      where: { isDefault: true, isActive: true },
    });

    // Create the mapping
    mapping = await prisma.telegramUserMapping.create({
      data: {
        telegramUserId: BigInt(telegramUserId),
        telegramUsername,
        userId: systemUser.id,
        defaultWalletId: defaultWallet?.id,
      },
    });

    return {
      success: true,
      data: {
        ...mapping,
        telegramUserId: mapping.telegramUserId,
      } as TelegramUserMapping,
    };
  } catch (error) {
    console.error("Failed to get/create user mapping:", error);
    return {
      success: false,
      error: "Failed to process user mapping",
    };
  }
}

/**
 * Creates a transaction from Telegram input.
 * Integrates with existing finance API logic.
 *
 * Requirements: 2.4, 2.6, 2.7, 3.6
 *
 * @param input - The transaction input from command parser
 * @param telegramUserId - The Telegram user ID
 * @param attachments - Optional array of attachment URLs (for receipt images)
 * @returns ServiceResult containing the created transaction and wallet
 */
export async function createTransaction(
  input: TransactionInput,
  telegramUserId: number,
  attachments?: string[],
): Promise<ServiceResult<{ transaction: Transaction; wallet: Wallet }>> {
  try {
    // Get user mapping
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success || !mappingResult.data) {
      return {
        success: false,
        error: mappingResult.error || "Failed to get user mapping",
      };
    }

    const mapping = mappingResult.data;

    // Determine wallet to use
    let walletId = input.walletId || mapping.defaultWalletId;

    // If no wallet specified, get the default or first active wallet
    if (!walletId) {
      const defaultWallet = await prisma.wallet.findFirst({
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
      });

      if (!defaultWallet) {
        return {
          success: false,
          error: "No active wallet found. Please create a wallet first.",
        };
      }

      walletId = defaultWallet.id;
    }

    // Verify wallet exists and is active
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found",
      };
    }

    if (!wallet.isActive) {
      return {
        success: false,
        error: "Wallet is not active",
      };
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: input.amount,
        type: input.type,
        category: input.category,
        description: input.description,
        date: new Date(),
        walletId: wallet.id,
        attachments: attachments || [],
        tags: [],
      },
    });

    // Update wallet balance
    const balanceChange =
      input.type === "INCOME" ? input.amount : -input.amount;
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: balanceChange },
      },
    });

    return {
      success: true,
      data: {
        transaction: {
          ...transaction,
          date: transaction.date,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        } as Transaction,
        wallet: updatedWallet as Wallet,
      },
    };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      success: false,
      error: "Failed to create transaction",
    };
  }
}

/**
 * Gets all active wallets for a Telegram user.
 *
 * Requirements: 5.1
 *
 * @param telegramUserId - The Telegram user ID
 * @returns ServiceResult containing array of wallets
 */
export async function getWallets(
  telegramUserId: number,
): Promise<ServiceResult<Wallet[]>> {
  try {
    // Verify user mapping exists
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success) {
      return {
        success: false,
        error: mappingResult.error,
      };
    }

    const wallets = await prisma.wallet.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    return {
      success: true,
      data: wallets as Wallet[],
    };
  } catch (error) {
    console.error("Failed to get wallets:", error);
    return {
      success: false,
      error: "Failed to fetch wallets",
    };
  }
}

/**
 * Sets the default wallet for a Telegram user.
 *
 * Requirements: 5.2
 *
 * @param telegramUserId - The Telegram user ID
 * @param walletName - The name of the wallet to set as default
 * @returns ServiceResult containing the updated wallet
 */
export async function setDefaultWallet(
  telegramUserId: number,
  walletName: string,
): Promise<ServiceResult<Wallet>> {
  try {
    // Get user mapping
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success || !mappingResult.data) {
      return {
        success: false,
        error: mappingResult.error || "Failed to get user mapping",
      };
    }

    // Find wallet by name (case-insensitive)
    const wallet = await prisma.wallet.findFirst({
      where: {
        name: { equals: walletName, mode: "insensitive" },
        isActive: true,
      },
    });

    if (!wallet) {
      // Get available wallets for error message
      const availableWallets = await prisma.wallet.findMany({
        where: { isActive: true },
        select: { name: true },
      });

      return {
        success: false,
        error: `Wallet "${walletName}" not found. Available: ${availableWallets
          .map((w) => w.name)
          .join(", ")}`,
      };
    }

    // Update user mapping with new default wallet
    await prisma.telegramUserMapping.update({
      where: { telegramUserId: BigInt(telegramUserId) },
      data: { defaultWalletId: wallet.id },
    });

    return {
      success: true,
      data: wallet as Wallet,
    };
  } catch (error) {
    console.error("Failed to set default wallet:", error);
    return {
      success: false,
      error: "Failed to set default wallet",
    };
  }
}

/**
 * Gets the default wallet ID for a Telegram user.
 *
 * Requirements: 5.4
 *
 * @param telegramUserId - The Telegram user ID
 * @returns ServiceResult containing the default wallet ID or null
 */
export async function getDefaultWalletId(
  telegramUserId: number,
): Promise<ServiceResult<string | null>> {
  try {
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success || !mappingResult.data) {
      return {
        success: false,
        error: mappingResult.error || "Failed to get user mapping",
      };
    }

    return {
      success: true,
      data: mappingResult.data.defaultWalletId || null,
    };
  } catch (error) {
    console.error("Failed to get default wallet:", error);
    return {
      success: false,
      error: "Failed to get default wallet",
    };
  }
}

/**
 * Gets transaction recap for a specific period.
 *
 * Requirements: 4.2, 4.3, 4.4
 *
 * @param telegramUserId - The Telegram user ID
 * @param period - The period filter: "today", "week", or "month"
 * @returns ServiceResult containing recap data
 */
export async function getRecap(
  telegramUserId: number,
  period: "today" | "week" | "month",
): Promise<ServiceResult<RecapData>> {
  try {
    // Verify user mapping exists
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success) {
      return {
        success: false,
        error: mappingResult.error,
      };
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    let periodLabel: string;

    switch (period) {
      case "week":
        // Start of current week (Monday)
        startDate = new Date(now);
        const dayOfWeek = startDate.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
        startDate.setDate(startDate.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        periodLabel = "Minggu Ini";
        break;

      case "month":
        // Start of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        periodLabel = "Bulan Ini";
        break;

      case "today":
      default:
        // Start of today
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        periodLabel = "Hari Ini";
        break;
    }

    // End of today
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    // Fetch transactions for the period
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "desc" },
      include: {
        wallet: {
          select: { name: true },
        },
      },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Map transactions to summary format
    const transactionSummaries: TransactionSummary[] = transactions.map(
      (t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type as "INCOME" | "EXPENSE",
        category: t.category,
        description: t.description || undefined,
        date: t.date,
      }),
    );

    return {
      success: true,
      data: {
        period: periodLabel,
        totalIncome,
        totalExpense,
        netBalance,
        transactionCount: transactions.length,
        transactions: transactionSummaries,
      },
    };
  } catch (error) {
    console.error("Failed to get recap:", error);
    return {
      success: false,
      error: "Failed to fetch transaction recap",
    };
  }
}

/**
 * Gets balance for all active wallets.
 *
 * Requirements: 4.6
 *
 * @param telegramUserId - The Telegram user ID
 * @returns ServiceResult containing balance data
 */
export async function getBalance(
  telegramUserId: number,
): Promise<ServiceResult<BalanceData>> {
  try {
    // Verify user mapping exists
    const mappingResult = await getUserMapping(telegramUserId);
    if (!mappingResult.success) {
      return {
        success: false,
        error: mappingResult.error,
      };
    }

    // Fetch all active wallets
    const wallets = await prisma.wallet.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    // Map to WalletBalance format
    const walletBalances: WalletBalance[] = wallets.map((w) => ({
      id: w.id,
      name: w.name,
      balance: w.balance,
      currency: w.currency,
    }));

    // Calculate total balance
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    return {
      success: true,
      data: {
        wallets: walletBalances,
        totalBalance,
      },
    };
  } catch (error) {
    console.error("Failed to get balance:", error);
    return {
      success: false,
      error: "Failed to fetch wallet balances",
    };
  }
}

/**
 * Gets all finance categories grouped by type.
 *
 * @returns ServiceResult containing categories grouped by type
 */
export async function getCategories(): Promise<
  ServiceResult<{ income: string[]; expense: string[] }>
> {
  try {
    // Fetch custom categories from database
    const dbCategories = await prisma.financeCategory.findMany({
      orderBy: { name: "asc" },
    });

    // Group by type
    const incomeCategories = dbCategories
      .filter((c) => c.type === "INCOME")
      .map((c) => c.name);

    const expenseCategories = dbCategories
      .filter((c) => c.type === "EXPENSE")
      .map((c) => c.name);

    // Add default categories if database is empty
    const defaultIncome = [
      "Salary",
      "Freelance",
      "Investment",
      "Gift",
      "Others",
    ];
    const defaultExpense = [
      "Food & Drinks",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills & Utilities",
      "Health",
      "Education",
      "Others",
    ];

    return {
      success: true,
      data: {
        income: incomeCategories.length > 0 ? incomeCategories : defaultIncome,
        expense:
          expenseCategories.length > 0 ? expenseCategories : defaultExpense,
      },
    };
  } catch (error) {
    console.error("Failed to get categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
    };
  }
}

/**
 * Finds a wallet by name (case-insensitive).
 *
 * @param walletName - The wallet name to search for
 * @returns ServiceResult containing the wallet or null
 */
export async function findWalletByName(
  walletName: string,
): Promise<ServiceResult<Wallet | null>> {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        name: { equals: walletName, mode: "insensitive" },
        isActive: true,
      },
    });

    return {
      success: true,
      data: wallet as Wallet | null,
    };
  } catch (error) {
    console.error("Failed to find wallet:", error);
    return {
      success: false,
      error: "Failed to find wallet",
    };
  }
}

/**
 * Gets a transaction by ID.
 *
 * @param transactionId - The transaction ID
 * @returns ServiceResult containing the transaction
 */
export async function getTransactionById(
  transactionId: string,
): Promise<ServiceResult<Transaction>> {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        wallet: true,
      },
    });

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    return {
      success: true,
      data: transaction as unknown as Transaction,
    };
  } catch (error) {
    console.error("Failed to get transaction:", error);
    return {
      success: false,
      error: "Failed to fetch transaction",
    };
  }
}

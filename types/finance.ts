// Finance Types
export type WalletType =
  | "CASH"
  | "BANK"
  | "E_WALLET"
  | "CREDIT_CARD"
  | "INVESTMENT";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type BillStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type RecurringType = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: Date;
  attachments: string[];
  tags: string[];
  isRecurring: boolean;
  walletId: string;
  wallet?: Wallet;
  billId?: string;
  bill?: Bill;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  description?: string;
  status: BillStatus;
  isRecurring: boolean;
  recurringType?: RecurringType;
  reminder?: number;
  attachments: string[];
  walletId?: string;
  wallet?: Wallet;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault: boolean;
}

// Dashboard Stats
export interface FinanceStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  pendingBills: number;
  monthlyChange: number;
}

// Category presets
export const EXPENSE_CATEGORIES = [
  { name: "Food & Drinks", icon: "utensils", color: "#ef4444" },
  { name: "Transportation", icon: "car", color: "#f97316" },
  { name: "Shopping", icon: "shopping-bag", color: "#eab308" },
  { name: "Entertainment", icon: "gamepad-2", color: "#22c55e" },
  { name: "Bills & Utilities", icon: "receipt", color: "#3b82f6" },
  { name: "Health", icon: "heart-pulse", color: "#ec4899" },
  { name: "Education", icon: "graduation-cap", color: "#8b5cf6" },
  { name: "Others", icon: "more-horizontal", color: "#6b7280" },
];

export const INCOME_CATEGORIES = [
  { name: "Salary", icon: "briefcase", color: "#22c55e" },
  { name: "Freelance", icon: "laptop", color: "#3b82f6" },
  { name: "Investment", icon: "trending-up", color: "#8b5cf6" },
  { name: "Gift", icon: "gift", color: "#ec4899" },
  { name: "Others", icon: "more-horizontal", color: "#6b7280" },
];

export const WALLET_ICONS = [
  "wallet",
  "credit-card",
  "banknote",
  "piggy-bank",
  "landmark",
  "smartphone",
];

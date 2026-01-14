/**
 * Telegram Command Parser
 *
 * Parses text commands from Telegram messages and extracts parameters.
 * Handles /expense, /income, and other bot commands.
 *
 * Requirements: 2.2, 2.3
 */

import { ParsedCommand, TransactionInput, BotCommand } from "@/types/telegram";

/**
 * Result type for parsing operations
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * List of valid bot commands
 */
export const VALID_COMMANDS: BotCommand[] = [
  "/start",
  "/help",
  "/template",
  "/input",
  "/expense",
  "/income",
  "/recap",
  "/balance",
  "/wallets",
  "/setwallet",
  "/categories",
];

/**
 * Parses a text message to extract command and arguments.
 *
 * @param text - The raw text message from Telegram
 * @returns ParseResult containing ParsedCommand or error
 *
 * @example
 * parseCommand("/expense 50000 food lunch")
 * // Returns: { success: true, data: { command: "/expense", args: ["50000", "food", "lunch"], rawText: "/expense 50000 food lunch" } }
 */
export function parseCommand(text: string): ParseResult<ParsedCommand> {
  // Handle null/undefined/empty input
  if (!text || typeof text !== "string") {
    return {
      success: false,
      error: "Input text is empty or invalid",
    };
  }

  const trimmedText = text.trim();

  // Check if text starts with a command (/)
  if (!trimmedText.startsWith("/")) {
    return {
      success: false,
      error: "Message is not a command. Commands must start with /",
    };
  }

  // Split by whitespace, handling multiple spaces
  const parts = trimmedText.split(/\s+/).filter((part) => part.length > 0);

  if (parts.length === 0) {
    return {
      success: false,
      error: "Empty command",
    };
  }

  // Extract command (first part, lowercase for consistency)
  let command = parts[0].toLowerCase();

  // Handle bot username suffix (e.g., /expense@mybot)
  const atIndex = command.indexOf("@");
  if (atIndex !== -1) {
    command = command.substring(0, atIndex);
  }

  // Extract arguments (remaining parts)
  const args = parts.slice(1);

  return {
    success: true,
    data: {
      command,
      args,
      rawText: trimmedText,
    },
  };
}

/**
 * Checks if a command is a valid bot command
 *
 * @param command - The command string to validate
 * @returns true if the command is valid
 */
export function isValidCommand(command: string): command is BotCommand {
  return VALID_COMMANDS.includes(command as BotCommand);
}

/**
 * Parses amount string to number, handling Indonesian currency formats
 * Supports formats: 50000, 50.000, 50,000, Rp50000, Rp 50.000, IDR 50000
 *
 * @param amountStr - The amount string to parse
 * @returns The parsed number or null if invalid
 */
export function parseAmount(amountStr: string): number | null {
  if (!amountStr || typeof amountStr !== "string") {
    return null;
  }

  // Remove currency prefixes (Rp, IDR) and whitespace
  let cleaned = amountStr.replace(/^(Rp\.?|IDR)\s*/i, "").trim();

  // Handle empty string after cleaning
  if (!cleaned) {
    return null;
  }

  // Determine decimal separator based on format
  // Indonesian format: 50.000,50 (dot for thousands, comma for decimal)
  // International format: 50,000.50 (comma for thousands, dot for decimal)
  const hasIndonesianFormat = /^\d{1,3}(\.\d{3})*(,\d+)?$/.test(cleaned);
  const hasInternationalFormat = /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(cleaned);

  if (hasIndonesianFormat) {
    // Indonesian format: remove dots (thousands), replace comma with dot (decimal)
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasInternationalFormat) {
    // International format: remove commas (thousands)
    cleaned = cleaned.replace(/,/g, "");
  } else {
    // Simple format: just remove any remaining separators
    // Handle cases like "50000" or "50.5"
    cleaned = cleaned.replace(/,/g, "");
  }

  const amount = parseFloat(cleaned);

  // Validate the result
  if (isNaN(amount) || amount < 0 || !isFinite(amount)) {
    return null;
  }

  return amount;
}

/**
 * Sanitizes category string by removing special characters
 * and normalizing to lowercase
 *
 * @param category - The category string to sanitize
 * @returns Sanitized category string
 */
export function sanitizeCategory(category: string): string {
  if (!category || typeof category !== "string") {
    return "";
  }

  // Remove special characters except alphanumeric, spaces, and hyphens
  // Convert to lowercase and trim
  return category
    .replace(/[^a-zA-Z0-9\s\-_]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Parses /expense and /income commands to extract transaction input.
 *
 * Expected format: /expense <amount> <category> [description...]
 * Examples:
 *   /expense 50000 food
 *   /expense 50.000 food lunch with friends
 *   /income 1000000 salary monthly salary
 *
 * @param command - The command type ("/expense" or "/income")
 * @param args - Array of arguments from the parsed command
 * @returns ParseResult containing TransactionInput or error
 */
export function parseTransactionInput(
  command: string,
  args: string[]
): ParseResult<TransactionInput> {
  // Validate command type
  const normalizedCommand = command.toLowerCase();
  if (
    normalizedCommand !== "/expense" &&
    normalizedCommand !== "/income" &&
    normalizedCommand !== "/input"
  ) {
    return {
      success: false,
      error: "Invalid command. Use /expense, /income, or /input",
    };
  }

  // Check minimum required arguments
  if (!args || args.length < 2) {
    return {
      success: false,
      error: `Format: ${command} <amount> <category> [description]\nExample: ${command} 50000 food lunch`,
    };
  }

  // Parse amount (first argument)
  const amountStr = args[0];
  const amount = parseAmount(amountStr);

  if (amount === null) {
    return {
      success: false,
      error: `Invalid amount: "${amountStr}". Please enter a valid number.\nExamples: 50000, 50.000, Rp50000`,
    };
  }

  if (amount === 0) {
    return {
      success: false,
      error: "Amount must be greater than 0",
    };
  }

  // Parse category (second argument)
  const rawCategory = args[1];
  const category = sanitizeCategory(rawCategory);

  if (!category) {
    return {
      success: false,
      error: `Invalid category: "${rawCategory}". Category must contain alphanumeric characters.`,
    };
  }

  // Parse description (remaining arguments, optional)
  const description = args.slice(2).join(" ").trim() || undefined;

  // Determine transaction type
  let type: "INCOME" | "EXPENSE";
  if (normalizedCommand === "/income") {
    type = "INCOME";
  } else if (normalizedCommand === "/expense") {
    type = "EXPENSE";
  } else {
    // For /input command, we need to determine type from context
    // Default to EXPENSE if not specified
    type = "EXPENSE";
  }

  return {
    success: true,
    data: {
      type,
      amount,
      category,
      description,
    },
  };
}

/**
 * Parses /input command which requires explicit type specification.
 *
 * Expected format: /input <type> <amount> <category> [description...]
 * Examples:
 *   /input expense 50000 food
 *   /input income 1000000 salary monthly salary
 *
 * @param args - Array of arguments from the parsed command
 * @returns ParseResult containing TransactionInput or error
 */
export function parseInputCommand(
  args: string[]
): ParseResult<TransactionInput> {
  // Check minimum required arguments (type, amount, category)
  if (!args || args.length < 3) {
    return {
      success: false,
      error:
        "Format: /input <type> <amount> <category> [description]\nExample: /input expense 50000 food lunch",
    };
  }

  // Parse type (first argument)
  const typeStr = args[0].toLowerCase();
  if (typeStr !== "expense" && typeStr !== "income") {
    return {
      success: false,
      error: `Invalid type: "${args[0]}". Use "expense" or "income".`,
    };
  }

  const type: "INCOME" | "EXPENSE" =
    typeStr === "income" ? "INCOME" : "EXPENSE";

  // Parse amount (second argument)
  const amountStr = args[1];
  const amount = parseAmount(amountStr);

  if (amount === null) {
    return {
      success: false,
      error: `Invalid amount: "${amountStr}". Please enter a valid number.\nExamples: 50000, 50.000, Rp50000`,
    };
  }

  if (amount === 0) {
    return {
      success: false,
      error: "Amount must be greater than 0",
    };
  }

  // Parse category (third argument)
  const rawCategory = args[2];
  const category = sanitizeCategory(rawCategory);

  if (!category) {
    return {
      success: false,
      error: `Invalid category: "${rawCategory}". Category must contain alphanumeric characters.`,
    };
  }

  // Parse description (remaining arguments, optional)
  const description = args.slice(3).join(" ").trim() || undefined;

  return {
    success: true,
    data: {
      type,
      amount,
      category,
      description,
    },
  };
}

/**
 * Parses /recap command arguments to extract period filter.
 *
 * Expected format: /recap [period]
 * Valid periods: today (default), week, month
 *
 * @param args - Array of arguments from the parsed command
 * @returns The period filter string
 */
export function parseRecapPeriod(args: string[]): "today" | "week" | "month" {
  if (!args || args.length === 0) {
    return "today";
  }

  const period = args[0].toLowerCase();

  if (period === "week" || period === "weekly" || period === "minggu") {
    return "week";
  }

  if (period === "month" || period === "monthly" || period === "bulan") {
    return "month";
  }

  return "today";
}

/**
 * Parses /setwallet command arguments to extract wallet name.
 *
 * @param args - Array of arguments from the parsed command
 * @returns ParseResult containing wallet name or error
 */
export function parseSetWalletCommand(args: string[]): ParseResult<string> {
  if (!args || args.length === 0) {
    return {
      success: false,
      error: "Format: /setwallet <wallet_name>\nExample: /setwallet cash",
    };
  }

  // Join all args to support wallet names with spaces
  const walletName = args.join(" ").trim();

  if (!walletName) {
    return {
      success: false,
      error: "Wallet name cannot be empty",
    };
  }

  return {
    success: true,
    data: walletName,
  };
}

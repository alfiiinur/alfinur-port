// Telegram Bot Types

// Core Telegram Types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_bot?: boolean;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: TelegramPhotoSize[];
  caption?: string;
  reply_to_message?: TelegramMessage;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

// Telegram API Response Types
export interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

export interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

// Send Message Options
export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface ReplyKeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
}

export interface ReplyKeyboardMarkup {
  keyboard: ReplyKeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  selective?: boolean;
}

export interface ReplyKeyboardRemove {
  remove_keyboard: true;
  selective?: boolean;
}

export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove;

export interface SendMessageOptions {
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: ReplyMarkup;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

// Command Parser Types
export interface ParsedCommand {
  command: string;
  args: string[];
  rawText: string;
}

// Transaction Input Types
export interface TransactionInput {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description?: string;
  walletId?: string;
}

// Supported Bot Commands
export type BotCommand =
  | "/start"
  | "/help"
  | "/template"
  | "/input"
  | "/expense"
  | "/income"
  | "/recap"
  | "/balance"
  | "/wallets"
  | "/setwallet"
  | "/categories";

// Recap Data Types
export interface TransactionSummary {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  date: Date;
}

export interface RecapData {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  transactions: TransactionSummary[];
}

export interface WalletBalance {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface BalanceData {
  wallets: WalletBalance[];
  totalBalance: number;
}

// OCR Parsed Receipt Types
export interface ParsedReceipt {
  amount?: number;
  date?: string;
  merchant?: string;
  items?: string[];
  confidence: number;
  rawText: string;
}

// User Mapping Types
export interface TelegramUserMapping {
  id: string;
  telegramUserId: bigint;
  telegramUsername?: string | null;
  userId: string;
  defaultWalletId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

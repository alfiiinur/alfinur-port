/**
 * Telegram Bot Service
 *
 * Core service for handling Telegram bot logic and interactions.
 * Routes updates to appropriate handlers and communicates with Telegram API.
 *
 * Requirements: 1.4, 2.1, 2.6, 2.7, 3.1, 4.2, 4.3, 4.4, 4.6, 5.1, 5.2, 6.1
 */

import {
  TelegramUpdate,
  TelegramMessage,
  SendMessageOptions,
  TelegramFile,
  TelegramApiResponse,
  ParsedReceipt,
} from "@/types/telegram";
import {
  parseCommand,
  parseTransactionInput,
  parseInputCommand,
  parseRecapPeriod,
  parseSetWalletCommand,
  isValidCommand,
} from "./command-parser";
import {
  formatWelcome,
  formatHelp,
  formatTemplates,
  formatTransactionConfirm,
  formatRecap,
  formatBalance,
  formatWalletList,
  formatCategories,
  formatError,
  formatOCRConfirmation,
  formatAccessDenied,
  formatWalletNotFound,
  formatWalletSet,
  formatUnknownCommand,
  formatProcessing,
} from "./message-formatter";
import {
  createTransaction,
  getWallets,
  setDefaultWallet,
  getRecap,
  getBalance,
  getDefaultWalletId,
  getUserMapping,
} from "./finance-service";
import { isAuthorizedUser } from "./auth";

/**
 * Telegram Bot API base URL
 */
const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

/**
 * Get the bot token from environment
 */
function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
  }
  return token;
}

/**
 * Sends a message to a Telegram chat
 *
 * @param chatId - The chat ID to send message to
 * @param text - The message text
 * @param options - Optional message options (parse_mode, reply_markup, etc.)
 * @returns Promise resolving to the API response
 */
export async function sendMessage(
  chatId: number,
  text: string,
  options: SendMessageOptions = {},
): Promise<TelegramApiResponse<TelegramMessage>> {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/sendMessage`;

  const body = {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode || "HTML",
    ...options,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result as TelegramApiResponse<TelegramMessage>;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Gets file info from Telegram
 *
 * @param fileId - The file ID to get info for
 * @returns Promise resolving to file info
 */
export async function getFile(
  fileId: string,
): Promise<TelegramApiResponse<TelegramFile>> {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}${token}/getFile`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: fileId }),
    });

    return (await response.json()) as TelegramApiResponse<TelegramFile>;
  } catch (error) {
    console.error("Failed to get file info:", error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Downloads a file from Telegram servers
 *
 * @param fileId - The file ID to download
 * @returns Promise resolving to the file buffer
 */
export async function downloadFile(fileId: string): Promise<Buffer | null> {
  const token = getBotToken();

  // First, get the file path
  const fileInfo = await getFile(fileId);
  if (!fileInfo.ok || !fileInfo.result?.file_path) {
    console.error("Failed to get file path:", fileInfo.description);
    return null;
  }

  // Download the file
  const downloadUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.result.file_path}`;

  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      console.error("Failed to download file:", response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Failed to download file:", error);
    return null;
  }
}

/**
 * Handles /start command
 * Requirements: 1.4
 */
async function handleStartCommand(chatId: number): Promise<void> {
  await sendMessage(chatId, formatWelcome());
}

/**
 * Handles /help command
 */
async function handleHelpCommand(chatId: number): Promise<void> {
  await sendMessage(chatId, formatHelp());
}

/**
 * Handles /template command
 * Requirements: 2.1
 */
async function handleTemplateCommand(chatId: number): Promise<void> {
  // Send template message with inline keyboard for quick actions
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: "🍔 Makan", callback_data: "tpl_food" },
        { text: "🚗 Transport", callback_data: "tpl_transport" },
        { text: "🛒 Belanja", callback_data: "tpl_shopping" },
      ],
      [
        { text: "💡 Tagihan", callback_data: "tpl_bills" },
        { text: "🎮 Hiburan", callback_data: "tpl_entertainment" },
        { text: "💊 Kesehatan", callback_data: "tpl_health" },
      ],
      [
        { text: "💰 Gaji", callback_data: "tpl_salary" },
        { text: "💼 Freelance", callback_data: "tpl_freelance" },
        { text: "📈 Investasi", callback_data: "tpl_investment" },
      ],
    ],
  };

  await sendMessage(chatId, formatTemplates(), {
    reply_markup: inlineKeyboard,
  });
}

/**
 * Handles /expense command
 * Requirements: 2.6
 */
async function handleExpenseCommand(
  chatId: number,
  telegramUserId: number,
  args: string[],
): Promise<void> {
  const parseResult = parseTransactionInput("/expense", args);

  if (!parseResult.success || !parseResult.data) {
    await sendMessage(
      chatId,
      formatError(parseResult.error || "Invalid input"),
    );
    return;
  }

  const result = await createTransaction(parseResult.data, telegramUserId);

  if (!result.success || !result.data) {
    await sendMessage(
      chatId,
      formatError(result.error || "Failed to create transaction"),
    );
    return;
  }

  await sendMessage(
    chatId,
    formatTransactionConfirm(result.data.transaction, result.data.wallet),
  );
}

/**
 * Handles /income command
 * Requirements: 2.7
 */
async function handleIncomeCommand(
  chatId: number,
  telegramUserId: number,
  args: string[],
): Promise<void> {
  const parseResult = parseTransactionInput("/income", args);

  if (!parseResult.success || !parseResult.data) {
    await sendMessage(
      chatId,
      formatError(parseResult.error || "Invalid input"),
    );
    return;
  }

  const result = await createTransaction(parseResult.data, telegramUserId);

  if (!result.success || !result.data) {
    await sendMessage(
      chatId,
      formatError(result.error || "Failed to create transaction"),
    );
    return;
  }

  await sendMessage(
    chatId,
    formatTransactionConfirm(result.data.transaction, result.data.wallet),
  );
}

/**
 * Handles /input command
 */
async function handleInputCommand(
  chatId: number,
  telegramUserId: number,
  args: string[],
): Promise<void> {
  const parseResult = parseInputCommand(args);

  if (!parseResult.success || !parseResult.data) {
    await sendMessage(
      chatId,
      formatError(parseResult.error || "Invalid input"),
    );
    return;
  }

  const result = await createTransaction(parseResult.data, telegramUserId);

  if (!result.success || !result.data) {
    await sendMessage(
      chatId,
      formatError(result.error || "Failed to create transaction"),
    );
    return;
  }

  await sendMessage(
    chatId,
    formatTransactionConfirm(result.data.transaction, result.data.wallet),
  );
}

/**
 * Handles /recap command
 * Requirements: 4.2, 4.3, 4.4
 */
async function handleRecapCommand(
  chatId: number,
  telegramUserId: number,
  args: string[],
): Promise<void> {
  const period = parseRecapPeriod(args);
  const result = await getRecap(telegramUserId, period);

  if (!result.success || !result.data) {
    await sendMessage(
      chatId,
      formatError(result.error || "Failed to get recap"),
    );
    return;
  }

  await sendMessage(chatId, formatRecap(result.data));
}

/**
 * Handles /balance command
 * Requirements: 4.6
 */
async function handleBalanceCommand(
  chatId: number,
  telegramUserId: number,
): Promise<void> {
  const result = await getBalance(telegramUserId);

  if (!result.success || !result.data) {
    await sendMessage(
      chatId,
      formatError(result.error || "Failed to get balance"),
    );
    return;
  }

  await sendMessage(chatId, formatBalance(result.data));
}

/**
 * Handles /wallets command
 * Requirements: 5.1
 */
async function handleWalletsCommand(
  chatId: number,
  telegramUserId: number,
): Promise<void> {
  const walletsResult = await getWallets(telegramUserId);

  if (!walletsResult.success || !walletsResult.data) {
    await sendMessage(
      chatId,
      formatError(walletsResult.error || "Failed to get wallets"),
    );
    return;
  }

  const defaultWalletResult = await getDefaultWalletId(telegramUserId);
  const defaultWalletId = defaultWalletResult.success
    ? defaultWalletResult.data
    : undefined;

  await sendMessage(
    chatId,
    formatWalletList(walletsResult.data, defaultWalletId || undefined),
  );
}

/**
 * Handles /setwallet command
 * Requirements: 5.2
 */
async function handleSetWalletCommand(
  chatId: number,
  telegramUserId: number,
  args: string[],
): Promise<void> {
  const parseResult = parseSetWalletCommand(args);

  if (!parseResult.success || !parseResult.data) {
    await sendMessage(
      chatId,
      formatError(parseResult.error || "Invalid wallet name"),
    );
    return;
  }

  const walletName = parseResult.data;
  const result = await setDefaultWallet(telegramUserId, walletName);

  if (!result.success || !result.data) {
    // Get available wallets for error message
    const walletsResult = await getWallets(telegramUserId);
    const availableWallets =
      walletsResult.success && walletsResult.data
        ? walletsResult.data.map((w) => w.name)
        : [];

    await sendMessage(
      chatId,
      formatWalletNotFound(walletName, availableWallets),
    );
    return;
  }

  await sendMessage(chatId, formatWalletSet(result.data.name));
}

/**
 * Handles /categories command
 * Requirements: 6.1
 */
async function handleCategoriesCommand(chatId: number): Promise<void> {
  await sendMessage(chatId, formatCategories());
}

/**
 * Handles photo messages for OCR processing
 * Requirements: 3.1
 *
 * @param chatId - The chat ID to send responses to
 * @param _telegramUserId - The Telegram user ID (reserved for future receipt storage)
 * @param message - The Telegram message containing the photo
 */
async function handlePhotoMessage(
  chatId: number,
  _telegramUserId: number,
  message: TelegramMessage,
): Promise<void> {
  if (!message.photo || message.photo.length === 0) {
    await sendMessage(chatId, formatError("No photo found in message"));
    return;
  }

  // Send processing message
  await sendMessage(chatId, formatProcessing());

  // Get the largest photo (last in array)
  const photo = message.photo[message.photo.length - 1];

  try {
    // Download the image
    const imageBuffer = await downloadFile(photo.file_id);

    if (!imageBuffer) {
      await sendMessage(
        chatId,
        formatError("Gagal mengunduh gambar. Silakan coba lagi."),
      );
      return;
    }

    // Import OCR module dynamically to avoid circular dependencies
    const { scanReceipt } = await import("@/lib/ocr");

    // Convert buffer to base64 for OCR processing
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString(
      "base64",
    )}`;

    // Process with OCR
    const ocrResult = await scanReceipt(base64Image);

    // Convert OCR result to ParsedReceipt format for message formatter
    const parsedReceipt: ParsedReceipt = {
      amount: ocrResult.amount ?? undefined,
      date: ocrResult.date ?? undefined,
      merchant: ocrResult.merchant ?? undefined,
      items: ocrResult.items?.map((item) => item.name) || [],
      confidence: ocrResult.confidence,
      rawText: ocrResult.rawText,
    };

    // Send OCR confirmation message
    await sendMessage(chatId, formatOCRConfirmation(parsedReceipt));

    // Store the pending OCR result for confirmation
    // In a production system, you would store this in a session/cache
    // For now, we'll include instructions in the message for manual input

    // If confidence is high and amount is detected, offer quick confirmation
    if (parsedReceipt.confidence >= 0.7 && parsedReceipt.amount) {
      const category = ocrResult.category || "others";
      const description = parsedReceipt.merchant || "Receipt scan";

      // Create inline keyboard for quick actions
      const quickCommand = `/expense ${parsedReceipt.amount} ${category} ${description}`;
      await sendMessage(
        chatId,
        `\n💡 <b>Quick input:</b>\n<code>${quickCommand}</code>\n\nCopy dan kirim command di atas untuk menyimpan, atau input manual dengan format yang berbeda.`,
      );
    }
  } catch (error) {
    console.error("OCR processing error:", error);
    await sendMessage(
      chatId,
      formatError(
        "Gagal memproses gambar. Silakan coba lagi atau input manual dengan /expense atau /income.",
      ),
    );
  }
}

/**
 * Handles text messages (commands)
 */
async function handleTextMessage(
  chatId: number,
  telegramUserId: number,
  text: string,
): Promise<void> {
  const parseResult = parseCommand(text);

  // If not a command, ignore or send help
  if (!parseResult.success || !parseResult.data) {
    // Check if it looks like a command attempt
    if (text.startsWith("/")) {
      await sendMessage(
        chatId,
        formatError(parseResult.error || "Invalid command"),
      );
    }
    // Ignore non-command messages
    return;
  }

  const { command, args } = parseResult.data;

  // Check if command is valid
  if (!isValidCommand(command)) {
    await sendMessage(chatId, formatUnknownCommand(command));
    return;
  }

  // Route to appropriate handler
  switch (command) {
    case "/start":
      await handleStartCommand(chatId);
      break;

    case "/help":
      await handleHelpCommand(chatId);
      break;

    case "/template":
      await handleTemplateCommand(chatId);
      break;

    case "/expense":
      await handleExpenseCommand(chatId, telegramUserId, args);
      break;

    case "/income":
      await handleIncomeCommand(chatId, telegramUserId, args);
      break;

    case "/input":
      await handleInputCommand(chatId, telegramUserId, args);
      break;

    case "/recap":
      await handleRecapCommand(chatId, telegramUserId, args);
      break;

    case "/balance":
      await handleBalanceCommand(chatId, telegramUserId);
      break;

    case "/wallets":
      await handleWalletsCommand(chatId, telegramUserId);
      break;

    case "/setwallet":
      await handleSetWalletCommand(chatId, telegramUserId, args);
      break;

    case "/categories":
      await handleCategoriesCommand(chatId);
      break;

    default:
      await sendMessage(chatId, formatUnknownCommand(command));
  }
}

/**
 * Main update handler - routes all Telegram updates
 *
 * @param update - The Telegram update object
 * @returns Promise resolving when update is handled
 */
export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  // Only handle message updates for now
  if (!update.message) {
    return;
  }

  const message = update.message;
  const chatId = message.chat.id;
  const telegramUserId = message.from?.id;

  // Validate user
  if (!telegramUserId) {
    console.error("No user ID in message");
    return;
  }

  // Check authorization
  if (!isAuthorizedUser(telegramUserId)) {
    await sendMessage(chatId, formatAccessDenied());
    return;
  }

  // Ensure user mapping exists
  const mappingResult = await getUserMapping(
    telegramUserId,
    message.from?.username,
  );

  if (!mappingResult.success) {
    await sendMessage(
      chatId,
      formatError(mappingResult.error || "Failed to initialize user"),
    );
    return;
  }

  // Handle different message types
  if (message.photo && message.photo.length > 0) {
    // Photo message - process with OCR
    await handlePhotoMessage(chatId, telegramUserId, message);
  } else if (message.text) {
    // Text message - process as command
    await handleTextMessage(chatId, telegramUserId, message.text);
  }
  // Ignore other message types (stickers, documents, etc.)
}

/**
 * Template suggestions for callback buttons
 */
const TEMPLATE_SUGGESTIONS: Record<string, string> = {
  tpl_food: "/expense 50000 food ",
  tpl_transport: "/expense 25000 transport ",
  tpl_shopping: "/expense 100000 shopping ",
  tpl_bills: "/expense 500000 bills ",
  tpl_entertainment: "/expense 75000 entertainment ",
  tpl_health: "/expense 150000 health ",
  tpl_salary: "/income 5000000 salary ",
  tpl_freelance: "/income 1000000 freelance ",
  tpl_investment: "/income 500000 investment ",
};

/**
 * Handles callback query from inline buttons
 */
async function handleCallbackQuery(
  callbackQueryId: string,
  chatId: number,
  data: string,
): Promise<void> {
  const token = getBotToken();

  // Answer callback to remove loading state
  await fetch(`${TELEGRAM_API_BASE}${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });

  // Get template suggestion
  const template = TEMPLATE_SUGGESTIONS[data];
  if (template) {
    await sendMessage(
      chatId,
      `📝 <b>Template:</b>\n<code>${template}</code>\n\n💡 Copy template di atas, tambahkan keterangan, lalu kirim!`,
    );
  }
}

/**
 * Main update handler - routes all Telegram updates (with callback support)
 */
export async function handleUpdateWithCallback(
  update: TelegramUpdate,
): Promise<void> {
  // Handle callback query (inline button clicks)
  if (update.callback_query) {
    const query = update.callback_query;
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (chatId && data) {
      await handleCallbackQuery(query.id, chatId, data);
    }
    return;
  }

  // Handle regular messages
  await handleUpdate(update);
}

/**
 * Export individual handlers for testing
 */
export const handlers = {
  handleStartCommand,
  handleHelpCommand,
  handleTemplateCommand,
  handleExpenseCommand,
  handleIncomeCommand,
  handleInputCommand,
  handleRecapCommand,
  handleBalanceCommand,
  handleWalletsCommand,
  handleSetWalletCommand,
  handleCategoriesCommand,
  handlePhotoMessage,
  handleTextMessage,
};

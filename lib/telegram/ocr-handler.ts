/**
 * Telegram OCR Handler
 *
 * Handles receipt image processing for Telegram bot.
 * Integrates with existing OCR engine to extract transaction data from receipt images.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import { TelegramPhotoSize, TransactionInput } from "@/types/telegram";
import { ParsedReceipt as OCRParsedReceipt } from "@/lib/ocr/types";
import { scanReceipt } from "@/lib/ocr";
import { downloadFile } from "./bot-service";
import { createTransaction } from "./finance-service";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Confidence threshold for automatic processing
 * Below this threshold, user confirmation is required
 */
export const CONFIDENCE_THRESHOLD_HIGH = 0.7;
export const CONFIDENCE_THRESHOLD_LOW = 0.5;

/**
 * Result of OCR processing
 */
export interface OCRProcessingResult {
  success: boolean;
  data?: {
    parsedReceipt: ProcessedReceipt;
    suggestedTransaction?: TransactionInput;
    requiresConfirmation: boolean;
    attachmentUrl?: string;
  };
  error?: string;
}

/**
 * Processed receipt data with additional metadata
 */
export interface ProcessedReceipt {
  amount: number | null;
  date: string | null;
  merchant: string | null;
  items: string[];
  category: string | null;
  confidence: number;
  rawText: string;
  confidenceLevel: "high" | "medium" | "low";
}

/**
 * Transaction creation result from OCR
 */
export interface OCRTransactionResult {
  success: boolean;
  data?: {
    transactionId: string;
    amount: number;
    category: string;
    walletName: string;
    attachmentUrl: string;
  };
  error?: string;
}

/**
 * Determines confidence level based on numeric confidence value
 *
 * @param confidence - Numeric confidence value (0-1)
 * @returns Confidence level string
 */
export function getConfidenceLevel(
  confidence: number,
): "high" | "medium" | "low" {
  if (confidence >= CONFIDENCE_THRESHOLD_HIGH) return "high";
  if (confidence >= CONFIDENCE_THRESHOLD_LOW) return "medium";
  return "low";
}

/**
 * Converts image buffer to base64 data URL for OCR processing
 *
 * @param buffer - Image buffer
 * @param mimeType - MIME type of the image (default: image/jpeg)
 * @returns Base64 data URL string
 */
export function bufferToBase64DataUrl(
  buffer: Buffer,
  mimeType: string = "image/jpeg",
): string {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Stores receipt image to the uploads directory
 *
 * Requirements: 3.7
 *
 * @param buffer - Image buffer
 * @param telegramUserId - Telegram user ID for organizing uploads
 * @param fileId - Telegram file ID for unique naming
 * @returns URL path to the stored image
 */
export async function storeReceiptImage(
  buffer: Buffer,
  telegramUserId: number,
  fileId: string,
): Promise<string> {
  // Create uploads directory structure
  const uploadsDir = join(process.cwd(), "public", "uploads", "receipts");
  const userDir = join(uploadsDir, String(telegramUserId));

  // Ensure directories exist
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  if (!existsSync(userDir)) {
    await mkdir(userDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFileId = fileId.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
  const filename = `receipt_${timestamp}_${sanitizedFileId}.jpg`;
  const filePath = join(userDir, filename);

  // Write file
  await writeFile(filePath, buffer);

  // Return URL path (relative to public directory)
  return `/uploads/receipts/${telegramUserId}/${filename}`;
}

/**
 * Converts OCR parsed receipt to processed receipt format
 *
 * @param ocrResult - Raw OCR result from scanReceipt
 * @returns Processed receipt with additional metadata
 */
export function convertToProcessedReceipt(
  ocrResult: OCRParsedReceipt,
): ProcessedReceipt {
  return {
    amount: ocrResult.amount,
    date: ocrResult.date,
    merchant: ocrResult.merchant,
    items: ocrResult.items?.map((item) => item.name) || [],
    category: ocrResult.category,
    confidence: ocrResult.confidence,
    rawText: ocrResult.rawText,
    confidenceLevel: getConfidenceLevel(ocrResult.confidence),
  };
}

/**
 * Creates a suggested transaction input from processed receipt
 *
 * @param receipt - Processed receipt data
 * @returns Transaction input suggestion or null if amount not detected
 */
export function createSuggestedTransaction(
  receipt: ProcessedReceipt,
): TransactionInput | null {
  if (!receipt.amount || receipt.amount <= 0) {
    return null;
  }

  return {
    type: "EXPENSE", // Receipts are typically expenses
    amount: receipt.amount,
    category: receipt.category || "Others",
    description: receipt.merchant || "Receipt scan",
  };
}

/**
 * Processes a receipt image from Telegram
 *
 * Downloads the image, runs OCR, and returns structured data.
 * Handles low confidence results by flagging for user confirmation.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * @param photo - Telegram photo size object (use largest available)
 * @param telegramUserId - Telegram user ID for storage
 * @returns OCR processing result with parsed data
 */
export async function processReceiptImage(
  photo: TelegramPhotoSize,
  telegramUserId: number,
): Promise<OCRProcessingResult> {
  try {
    // Step 1: Download image from Telegram (Requirements: 3.1)
    const imageBuffer = await downloadFile(photo.file_id);

    if (!imageBuffer) {
      return {
        success: false,
        error: "Failed to download image from Telegram. Please try again.",
      };
    }

    // Step 2: Convert to base64 for OCR processing
    const base64Image = bufferToBase64DataUrl(imageBuffer);

    // Step 3: Run OCR scan (Requirements: 3.2, 3.3)
    const ocrResult = await scanReceipt(base64Image);

    // Step 4: Convert to processed receipt format
    const processedReceipt = convertToProcessedReceipt(ocrResult);

    // Step 5: Store receipt image (Requirements: 3.7)
    let attachmentUrl: string | undefined;
    try {
      attachmentUrl = await storeReceiptImage(
        imageBuffer,
        telegramUserId,
        photo.file_id,
      );
    } catch (storageError) {
      console.error("Failed to store receipt image:", storageError);
      // Continue without attachment - not critical
    }

    // Step 6: Create suggested transaction
    const suggestedTransaction = createSuggestedTransaction(processedReceipt);

    // Step 7: Determine if confirmation is required (Requirements: 3.4, 3.5)
    const requiresConfirmation =
      processedReceipt.confidenceLevel !== "high" ||
      !processedReceipt.amount ||
      processedReceipt.amount <= 0;

    return {
      success: true,
      data: {
        parsedReceipt: processedReceipt,
        suggestedTransaction: suggestedTransaction || undefined,
        requiresConfirmation,
        attachmentUrl,
      },
    };
  } catch (error) {
    console.error("OCR processing error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process receipt image",
    };
  }
}

/**
 * Creates a transaction from OCR result with attachment
 *
 * Requirements: 3.6, 3.7
 *
 * @param input - Transaction input data
 * @param telegramUserId - Telegram user ID
 * @param attachmentUrl - URL of the stored receipt image
 * @returns Transaction creation result
 */
export async function createTransactionFromOCR(
  input: TransactionInput,
  telegramUserId: number,
  attachmentUrl?: string,
): Promise<OCRTransactionResult> {
  try {
    const attachments = attachmentUrl ? [attachmentUrl] : [];

    const result = await createTransaction(input, telegramUserId, attachments);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Failed to create transaction",
      };
    }

    return {
      success: true,
      data: {
        transactionId: result.data.transaction.id,
        amount: result.data.transaction.amount,
        category: result.data.transaction.category,
        walletName: result.data.wallet.name,
        attachmentUrl: attachmentUrl || "",
      },
    };
  } catch (error) {
    console.error("Failed to create transaction from OCR:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create transaction from receipt",
    };
  }
}

/**
 * Gets the largest photo from a Telegram photo array
 *
 * Telegram sends multiple sizes of the same photo.
 * The largest one (last in array) has the best quality for OCR.
 *
 * @param photos - Array of Telegram photo sizes
 * @returns The largest photo or null if array is empty
 */
export function getLargestPhoto(
  photos: TelegramPhotoSize[],
): TelegramPhotoSize | null {
  if (!photos || photos.length === 0) {
    return null;
  }

  // Telegram sends photos sorted by size, largest last
  return photos[photos.length - 1];
}

/**
 * Validates if the OCR result has enough data for transaction creation
 *
 * @param receipt - Processed receipt data
 * @returns Validation result with missing fields
 */
export function validateOCRResult(receipt: ProcessedReceipt): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!receipt.amount || receipt.amount <= 0) {
    missingFields.push("amount");
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Formats OCR result for quick command suggestion
 *
 * @param receipt - Processed receipt data
 * @returns Command string for quick input
 */
export function formatQuickCommand(receipt: ProcessedReceipt): string | null {
  if (!receipt.amount || receipt.amount <= 0) {
    return null;
  }

  const category = receipt.category || "others";
  const description = receipt.merchant || "Receipt scan";

  return `/expense ${receipt.amount} ${category} ${description}`;
}

/**
 * Extracts amount from OCR text using multiple patterns
 *
 * This is a utility function for testing OCR text parsing.
 * The main parsing is done by the OCR parser module.
 *
 * Requirements: 3.3
 *
 * @param text - Raw OCR text
 * @returns Extracted amount or null
 */
export function extractAmountFromText(text: string): number | null {
  // Pattern untuk format Indonesia: Rp 100.000, Rp100000, 100,000, dll
  const patterns = [
    /(?:total|grand\s*total|jumlah|bayar|amount)[:\s]*(?:rp\.?|idr)?\s*([\d.,]+)/gi,
    /(?:rp\.?|idr)\s*([\d.,]+)/gi,
    /([\d]{1,3}(?:[.,][\d]{3})+)/g, // 100.000 atau 100,000
  ];

  let maxAmount = 0;

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const numStr =
        match[1]?.replace(/[.,]/g, "") || match[0].replace(/[^\d]/g, "");
      const num = parseInt(numStr, 10);
      if (num > maxAmount && num < 100000000) {
        // Max 100 juta
        maxAmount = num;
      }
    }
  }

  return maxAmount > 0 ? maxAmount : null;
}

/**
 * Extracts date from OCR text
 *
 * Requirements: 3.3
 *
 * @param text - Raw OCR text
 * @returns Extracted date string or null
 */
export function extractDateFromText(text: string): string | null {
  // Pattern tanggal Indonesia: 10/12/2025, 10-12-2025, 10 Des 2025
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)[a-z]*\s+(\d{2,4})/i,
    /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{2,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

/**
 * Suggests category based on merchant keywords
 *
 * Requirements: 6.3 (Auto-categorization)
 *
 * @param text - OCR text or merchant name
 * @returns Suggested category or null
 */
export function suggestCategoryFromText(text: string): string | null {
  const lowerText = text.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    "Food & Beverage": [
      "resto",
      "restaurant",
      "cafe",
      "coffee",
      "makan",
      "food",
      "drink",
      "kopi",
      "warung",
      "mcd",
      "kfc",
      "pizza",
      "burger",
      "starbucks",
      "jco",
      "hokben",
      "yoshinoya",
    ],
    Transportation: [
      "grab",
      "gojek",
      "uber",
      "taxi",
      "parkir",
      "bensin",
      "pertamina",
      "shell",
      "spbu",
      "tol",
      "transjakarta",
      "mrt",
      "lrt",
      "kereta",
    ],
    Shopping: [
      "mall",
      "store",
      "shop",
      "mart",
      "indomaret",
      "alfamart",
      "supermarket",
      "hypermart",
      "carrefour",
      "giant",
      "lottemart",
      "tokopedia",
      "shopee",
      "lazada",
    ],
    Utilities: [
      "pln",
      "listrik",
      "pdam",
      "air",
      "internet",
      "wifi",
      "telkom",
      "indihome",
      "biznet",
      "firstmedia",
    ],
    Entertainment: [
      "cinema",
      "bioskop",
      "game",
      "spotify",
      "netflix",
      "youtube",
      "cgv",
      "xxi",
      "cinepolis",
    ],
    Healthcare: [
      "apotek",
      "pharmacy",
      "rumah sakit",
      "hospital",
      "klinik",
      "dokter",
      "kimia farma",
      "guardian",
      "watson",
    ],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return category;
    }
  }

  return null;
}

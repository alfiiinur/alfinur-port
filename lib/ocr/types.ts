// OCR Types - Scalable untuk berbagai provider

export interface OCRResult {
  rawText: string;
  confidence: number;
  provider: OCRProvider;
}

export interface ParsedReceipt {
  amount: number | null;
  date: string | null;
  merchant: string | null;
  items: ReceiptItem[];
  category: string | null;
  rawText: string;
  confidence: number;
}

export interface ReceiptItem {
  name: string;
  quantity?: number;
  price?: number;
}

export type OCRProvider = "tesseract" | "google-vision" | "openai-vision";

export interface OCRProviderConfig {
  provider: OCRProvider;
  apiKey?: string;
  language?: string;
}

// Transaction form data setelah user review
export interface ScannedTransactionData {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  date: Date;
  walletId: string;
  attachments: string[];
}

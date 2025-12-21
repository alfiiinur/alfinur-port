// OCR Module - Main entry point

export * from "./types";
export * from "./parser";
export * from "./providers/base-provider";
export * from "./providers/tesseract-provider";
export * from "./providers/openai-vision-provider";

import { TesseractProvider } from "./providers/tesseract-provider";
import { OpenAIVisionProvider } from "./providers/openai-vision-provider";
import { ReceiptParser } from "./parser";
import { OCRProvider, OCRResult, ParsedReceipt } from "./types";

// Factory function untuk create provider
export function createOCRProvider(provider: OCRProvider, apiKey?: string) {
  switch (provider) {
    case "tesseract":
      return new TesseractProvider();
    case "openai-vision":
      if (!apiKey) throw new Error("API key required for OpenAI Vision");
      return new OpenAIVisionProvider(apiKey);
    default:
      return new TesseractProvider();
  }
}

// High-level function untuk scan receipt
export async function scanReceipt(
  imageData: string | File,
  provider: OCRProvider = "tesseract",
  apiKey?: string
): Promise<ParsedReceipt> {
  const ocrProvider = createOCRProvider(provider, apiKey);
  const parser = new ReceiptParser();

  const ocrResult: OCRResult = await ocrProvider.processImage(imageData);
  const parsed = parser.parse(ocrResult);

  // Cleanup tesseract worker
  if (provider === "tesseract" && "terminate" in ocrProvider) {
    await (ocrProvider as TesseractProvider).terminate();
  }

  return parsed;
}

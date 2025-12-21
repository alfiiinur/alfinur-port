// Receipt Parser - Extract structured data from OCR text

import { OCRResult, ParsedReceipt, ReceiptItem } from "./types";

export class ReceiptParser {
  parse(ocrResult: OCRResult): ParsedReceipt {
    const text = ocrResult.rawText;

    return {
      amount: this.extractAmount(text),
      date: this.extractDate(text),
      merchant: this.extractMerchant(text),
      items: this.extractItems(text),
      category: this.suggestCategory(text),
      rawText: text,
      confidence: ocrResult.confidence,
    };
  }

  private extractAmount(text: string): number | null {
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

  private extractDate(text: string): string | null {
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

  private extractMerchant(text: string): string | null {
    // Biasanya nama toko ada di baris pertama
    const lines = text.split("\n").filter((line) => line.trim().length > 2);

    if (lines.length > 0) {
      // Ambil baris pertama yang bukan angka saja
      for (const line of lines.slice(0, 3)) {
        const cleaned = line.trim();
        if (!/^\d+$/.test(cleaned) && cleaned.length > 2) {
          return cleaned.substring(0, 50); // Max 50 chars
        }
      }
    }

    return null;
  }

  private extractItems(text: string): ReceiptItem[] {
    const items: ReceiptItem[] = [];
    const lines = text.split("\n");

    // Pattern: nama item + harga
    const itemPattern = /^(.+?)\s+([\d.,]+)$/;

    for (const line of lines) {
      const match = line.trim().match(itemPattern);
      if (match) {
        const name = match[1].trim();
        const price = parseInt(match[2].replace(/[.,]/g, ""), 10);

        if (name.length > 1 && price > 0 && price < 10000000) {
          items.push({ name, price });
        }
      }
    }

    return items.slice(0, 20); // Max 20 items
  }

  private suggestCategory(text: string): string | null {
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
      ],
      Entertainment: [
        "cinema",
        "bioskop",
        "game",
        "spotify",
        "netflix",
        "youtube",
      ],
      Healthcare: [
        "apotek",
        "pharmacy",
        "rumah sakit",
        "hospital",
        "klinik",
        "dokter",
      ],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return category;
      }
    }

    return "Other";
  }
}

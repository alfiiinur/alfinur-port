// Base OCR Provider - Abstract class untuk scalability

import { OCRResult, OCRProvider } from "../types";

export abstract class BaseOCRProvider {
  abstract readonly provider: OCRProvider;

  abstract processImage(imageData: string | File): Promise<OCRResult>;

  protected validateImage(file: File): void {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Supported: JPG, PNG, WebP, GIF");
    }

    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size: 10MB");
    }
  }

  protected async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

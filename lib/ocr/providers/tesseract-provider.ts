// Tesseract OCR Provider - Free, client-side

import { createWorker, Worker } from "tesseract.js";
import { BaseOCRProvider } from "./base-provider";
import { OCRResult } from "../types";

export class TesseractProvider extends BaseOCRProvider {
  readonly provider = "tesseract" as const;
  private worker: Worker | null = null;

  async initialize(): Promise<void> {
    if (!this.worker) {
      this.worker = await createWorker("ind+eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
    }
  }

  async processImage(imageData: string | File): Promise<OCRResult> {
    await this.initialize();

    if (!this.worker) {
      throw new Error("Tesseract worker not initialized");
    }

    let imageSource: string;

    if (imageData instanceof File) {
      this.validateImage(imageData);
      imageSource = await this.fileToBase64(imageData);
    } else {
      imageSource = imageData;
    }

    const { data } = await this.worker.recognize(imageSource);

    return {
      rawText: data.text,
      confidence: data.confidence,
      provider: this.provider,
    };
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

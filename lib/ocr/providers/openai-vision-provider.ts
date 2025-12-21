// OpenAI Vision Provider - Placeholder untuk future use
// Uncomment dan implement ketika mau pakai OpenAI

import { BaseOCRProvider } from "./base-provider";
import { OCRResult } from "../types";

export class OpenAIVisionProvider extends BaseOCRProvider {
  readonly provider = "openai-vision" as const;
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async processImage(imageData: string | File): Promise<OCRResult> {
    let base64Image: string;

    if (imageData instanceof File) {
      this.validateImage(imageData);
      base64Image = await this.fileToBase64(imageData);
    } else {
      base64Image = imageData;
    }

    // TODO: Implement OpenAI Vision API call
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4-vision-preview',
    //     messages: [{
    //       role: 'user',
    //       content: [
    //         { type: 'text', text: 'Extract text from this receipt...' },
    //         { type: 'image_url', image_url: { url: base64Image } }
    //       ]
    //     }]
    //   })
    // });

    throw new Error(
      "OpenAI Vision provider not implemented yet. Use Tesseract for now."
    );
  }
}

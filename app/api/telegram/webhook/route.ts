/**
 * Telegram Webhook API Endpoint
 *
 * Receives updates from Telegram Bot API and routes them to the bot service.
 * Validates webhook signature and user authorization before processing.
 *
 * Requirements: 1.1, 1.2, 1.3, 7.1, 7.2
 */

import { NextRequest, NextResponse } from "next/server";
import { TelegramUpdate } from "@/types/telegram";
import { validateWebhookRequest } from "@/lib/telegram/auth";
import {
  handleUpdate,
  handleUpdateWithCallback,
} from "@/lib/telegram/bot-service";

/**
 * POST /api/telegram/webhook
 *
 * Receives Telegram updates via webhook.
 * Validates the request signature and processes the update.
 *
 * Requirements:
 * - 1.1: Register webhook endpoint to receive updates from Telegram API
 * - 1.2: Validate message authenticity using bot token
 * - 1.3: Reject unauthorized requests with 401 status
 * - 7.1: Handle database operation failures with user-friendly error messages
 * - 7.2: Handle OCR processing timeouts
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate webhook signature
    // Requirements: 1.2, 1.3
    const validationResult = validateWebhookRequest(request.headers);

    if (!validationResult.isValid) {
      console.error("Webhook validation failed:", validationResult.error);
      return NextResponse.json(
        { error: validationResult.error },
        { status: validationResult.statusCode || 401 },
      );
    }

    // Parse the request body
    let update: TelegramUpdate;
    try {
      update = await request.json();
    } catch (parseError) {
      console.error("Failed to parse webhook body:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate update structure
    if (!update || typeof update.update_id !== "number") {
      console.error("Invalid update structure:", update);
      return NextResponse.json(
        { error: "Invalid update structure" },
        { status: 400 },
      );
    }

    // Process the update asynchronously
    // The handleUpdate function handles authorization internally
    // Requirements: 7.1, 7.2
    await handleUpdateWithCallback(update);

    // Return 200 OK to acknowledge receipt
    // Telegram expects a 200 response to confirm the update was received
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    // Requirements: 7.4
    console.error("Webhook handler error:", error);

    // Return 500 but still acknowledge to prevent Telegram from retrying
    // In production, you might want to return 200 to prevent retry loops
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/telegram/webhook
 *
 * Health check endpoint for the webhook.
 * Can be used to verify the endpoint is accessible.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      message: "Telegram webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}

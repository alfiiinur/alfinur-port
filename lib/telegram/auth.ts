/**
 * Telegram Bot Authentication and Authorization
 *
 * Handles webhook signature validation and user authorization.
 *
 * Requirements: 1.2, 1.3, 8.1, 8.2, 8.3
 */

import { createHmac, timingSafeEqual } from "crypto";

/**
 * Get the webhook secret from environment
 * Requirements: 8.1
 */
function getWebhookSecret(): string | undefined {
  return process.env.TELEGRAM_WEBHOOK_SECRET;
}

/**
 * Get allowed Telegram user IDs from environment
 * Requirements: 8.1
 *
 * @returns Array of allowed Telegram user IDs
 */
export function getAllowedUserIds(): number[] {
  const allowedUsers = process.env.TELEGRAM_ALLOWED_USERS;
  if (!allowedUsers || allowedUsers.trim() === "") {
    return [];
  }
  return allowedUsers
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id) && id > 0);
}

/**
 * Validates the webhook request signature from Telegram
 *
 * Telegram sends a secret token in the X-Telegram-Bot-Api-Secret-Token header
 * when you set up the webhook with a secret_token parameter.
 *
 * Requirements: 1.2, 8.1
 *
 * @param secretToken - The secret token from the request header
 * @returns true if the signature is valid, false otherwise
 */
export function validateWebhookSignature(
  secretToken: string | null | undefined,
): boolean {
  const expectedSecret = getWebhookSecret();

  // If no webhook secret is configured, skip validation (development mode)
  if (!expectedSecret || expectedSecret.trim() === "") {
    console.warn(
      "TELEGRAM_WEBHOOK_SECRET not configured - skipping signature validation",
    );
    return true;
  }

  // If secret is configured but not provided in request, reject
  if (!secretToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(expectedSecret, "utf-8");
    const actualBuffer = Buffer.from(secretToken, "utf-8");

    // Buffers must be same length for timingSafeEqual
    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Validates webhook request using HMAC-SHA256 signature
 *
 * Alternative validation method using HMAC signature of the request body.
 * This can be used for additional security or custom webhook implementations.
 *
 * @param body - The raw request body as string
 * @param signature - The signature from the request header
 * @param secret - The secret key for HMAC
 * @returns true if the signature is valid
 */
export function validateHmacSignature(
  body: string,
  signature: string | null | undefined,
  secret?: string,
): boolean {
  const secretKey = secret || getWebhookSecret();

  if (!secretKey) {
    console.warn("No secret key provided for HMAC validation");
    return true; // Skip validation in development
  }

  if (!signature) {
    return false;
  }

  try {
    const expectedSignature = createHmac("sha256", secretKey)
      .update(body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const actualBuffer = Buffer.from(signature, "hex");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Check if a Telegram user is authorized to use the bot
 *
 * Requirements: 8.2, 8.3
 *
 * @param userId - Telegram user ID to check
 * @returns true if user is authorized, false otherwise
 */
export function isAuthorizedUser(userId: number): boolean {
  // Validate userId is a positive number
  if (!userId || typeof userId !== "number" || userId <= 0) {
    return false;
  }

  const allowedIds = getAllowedUserIds();

  // If no allowed users configured, allow all (development mode)
  if (allowedIds.length === 0) {
    console.warn(
      "TELEGRAM_ALLOWED_USERS not configured - allowing all users (development mode)",
    );
    return true;
  }

  return allowedIds.includes(userId);
}

/**
 * Validates a complete webhook request
 *
 * Combines signature validation and returns appropriate status.
 *
 * @param headers - Request headers object
 * @returns Object with isValid flag and optional error message
 */
export function validateWebhookRequest(headers: {
  get: (name: string) => string | null;
}): { isValid: boolean; error?: string; statusCode?: number } {
  const secretToken = headers.get("x-telegram-bot-api-secret-token");

  if (!validateWebhookSignature(secretToken)) {
    return {
      isValid: false,
      error: "Invalid or missing webhook signature",
      statusCode: 401,
    };
  }

  return { isValid: true };
}

/**
 * Authorization result type
 */
export interface AuthorizationResult {
  isAuthorized: boolean;
  userId?: number;
  error?: string;
}

/**
 * Authorizes a Telegram user from an update
 *
 * @param userId - The Telegram user ID from the update
 * @returns Authorization result with status and optional error
 */
export function authorizeUser(userId: number | undefined): AuthorizationResult {
  if (!userId) {
    return {
      isAuthorized: false,
      error: "No user ID provided",
    };
  }

  if (!isAuthorizedUser(userId)) {
    return {
      isAuthorized: false,
      userId,
      error: "User not authorized",
    };
  }

  return {
    isAuthorized: true,
    userId,
  };
}

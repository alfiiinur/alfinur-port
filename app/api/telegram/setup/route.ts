/**
 * API Endpoint untuk Setup Telegram Bot Commands
 *
 * GET /api/telegram/setup - Setup bot commands ke Telegram
 *
 * Endpoint ini akan mendaftarkan semua commands ke Telegram
 * sehingga muncul sebagai suggestions saat user ketik "/"
 */

import { NextResponse } from "next/server";

const BOT_COMMANDS = [
  { command: "start", description: "🚀 Mulai bot" },
  { command: "help", description: "❓ Bantuan" },
  { command: "expense", description: "💸 <jumlah> <kategori> [ket]" },
  { command: "income", description: "💵 <jumlah> <kategori> [ket]" },
  { command: "recap", description: "📊 [today/week/month]" },
  { command: "balance", description: "💰 Cek saldo" },
  { command: "wallets", description: "👛 Daftar wallet" },
  { command: "setwallet", description: "⚙️ <nama_wallet>" },
  { command: "categories", description: "📁 Daftar kategori" },
  { command: "template", description: "📝 Template & contoh" },
];

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 500 },
    );
  }

  try {
    // Set bot commands
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setMyCommands`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands: BOT_COMMANDS }),
      },
    );

    const result = await response.json();

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Bot commands berhasil di-setup!",
        commands: BOT_COMMANDS,
      });
    } else {
      return NextResponse.json({ error: result.description }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to setup commands:", error);
    return NextResponse.json(
      { error: "Failed to setup commands" },
      { status: 500 },
    );
  }
}

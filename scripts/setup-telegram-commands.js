/**
 * Script untuk setup Telegram Bot Commands
 *
 * Jalankan dengan: node scripts/setup-telegram-commands.js
 *
 * Pastikan TELEGRAM_BOT_TOKEN sudah di-set di .env
 */

require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env");
  process.exit(1);
}

const commands = [
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

async function setupCommands() {
  console.log("🔧 Setting up Telegram bot commands...\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands }),
      },
    );

    const result = await response.json();

    if (result.ok) {
      console.log("✅ Bot commands berhasil di-setup!\n");
      console.log("Commands yang terdaftar:");
      commands.forEach((cmd) => {
        console.log(`  /${cmd.command} - ${cmd.description}`);
      });
      console.log(
        '\n🎉 Sekarang ketik "/" di chat bot untuk lihat suggestions!',
      );
    } else {
      console.error("❌ Gagal setup commands:", result.description);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

setupCommands();

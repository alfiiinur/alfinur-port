/**
 * Telegram Message Formatter
 *
 * Formats response messages for Telegram with proper formatting.
 * Uses HTML parse mode for rich text formatting.
 *
 * Requirements: 2.5, 4.1, 4.5, 5.5
 */

import {
  RecapData,
  BalanceData,
  WalletBalance,
  ParsedReceipt,
  TransactionSummary,
} from "@/types/telegram";
import {
  Transaction,
  Wallet,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/types/finance";

/**
 * Formats currency amount to Indonesian Rupiah format
 * @param amount - The amount to format
 * @returns Formatted string like "Rp 50.000"
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return `Rp ${formatted}`;
}

/**
 * Formats date to Indonesian locale
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Formats short date without time
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(date);
}

/**
 * Escapes HTML special characters for Telegram HTML parse mode
 * @param text - The text to escape
 * @returns Escaped text safe for HTML
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Formats welcome message for /start command
 * @returns Welcome message with bot introduction
 */
export function formatWelcome(): string {
  return `🎉 <b>Selamat datang di Finance Bot!</b>

Bot ini membantu kamu mencatat transaksi keuangan dengan mudah.

<b>Fitur utama:</b>
• Catat pengeluaran & pemasukan via command
• Scan struk/receipt dengan kirim foto
• Lihat rekap & saldo wallet

Ketik /help untuk melihat daftar perintah.`;
}

/**
 * Formats help message with all available commands
 * @returns Help message with command list
 */
export function formatHelp(): string {
  return `📖 <b>Daftar Perintah</b>

<b>💰 Transaksi:</b>
/expense &lt;jumlah&gt; &lt;kategori&gt; [keterangan]
/income &lt;jumlah&gt; &lt;kategori&gt; [keterangan]
/input &lt;tipe&gt; &lt;jumlah&gt; &lt;kategori&gt; [keterangan]

<b>📊 Laporan:</b>
/recap - Rekap hari ini
/recap week - Rekap minggu ini
/recap month - Rekap bulan ini
/balance - Saldo semua wallet

<b>👛 Wallet:</b>
/wallets - Daftar wallet
/setwallet &lt;nama&gt; - Set default wallet

<b>📁 Lainnya:</b>
/categories - Daftar kategori
/template - Template input
/help - Bantuan

<b>📸 Scan Struk:</b>
Kirim foto struk untuk scan otomatis`;
}

/**
 * Formats template message with input examples
 * @returns Template message with examples
 */
export function formatTemplates(): string {
  return `📝 <b>Template Input Transaksi</b>

<b>Pengeluaran:</b>
<code>/expense 50000 food makan siang</code>
<code>/expense 25.000 transport ojol</code>
<code>/expense Rp100000 shopping belanja bulanan</code>

<b>Pemasukan:</b>
<code>/income 5000000 salary gaji bulanan</code>
<code>/income 500000 freelance project web</code>

<b>Input dengan tipe:</b>
<code>/input expense 30000 food</code>
<code>/input income 1000000 bonus</code>

<b>Format jumlah yang didukung:</b>
• 50000
• 50.000
• 50,000
• Rp50000
• Rp 50.000`;
}

/**
 * Formats transaction confirmation message
 * Requirements: 2.5, 5.5
 *
 * @param transaction - The created transaction
 * @param wallet - The wallet used for the transaction
 * @returns Confirmation message with transaction details
 */
export function formatTransactionConfirm(
  transaction: Transaction,
  wallet: Wallet
): string {
  const emoji = transaction.type === "INCOME" ? "💵" : "💸";
  const typeLabel = transaction.type === "INCOME" ? "Pemasukan" : "Pengeluaran";
  const sign = transaction.type === "INCOME" ? "+" : "-";

  let message = `${emoji} <b>${typeLabel} Tercatat!</b>

<b>Jumlah:</b> ${sign}${formatCurrency(transaction.amount)}
<b>Kategori:</b> ${escapeHtml(transaction.category)}`;

  if (transaction.description) {
    message += `\n<b>Keterangan:</b> ${escapeHtml(transaction.description)}`;
  }

  message += `\n<b>Wallet:</b> ${escapeHtml(wallet.name)}`;
  message += `\n<b>Saldo:</b> ${formatCurrency(wallet.balance)}`;
  message += `\n<b>Waktu:</b> ${formatDate(transaction.date)}`;

  return message;
}

/**
 * Formats recap message with transaction summary
 * Requirements: 4.1, 4.5
 *
 * @param data - The recap data containing totals and transactions
 * @returns Formatted recap message
 */
export function formatRecap(data: RecapData): string {
  const netSign = data.netBalance >= 0 ? "+" : "";
  const netEmoji = data.netBalance >= 0 ? "📈" : "📉";

  let message = `📊 <b>Rekap ${escapeHtml(data.period)}</b>

💵 <b>Pemasukan:</b> +${formatCurrency(data.totalIncome)}
💸 <b>Pengeluaran:</b> -${formatCurrency(data.totalExpense)}
${netEmoji} <b>Selisih:</b> ${netSign}${formatCurrency(data.netBalance)}
📝 <b>Jumlah Transaksi:</b> ${data.transactionCount}`;

  // Add recent transactions if available
  if (data.transactions && data.transactions.length > 0) {
    message += `\n\n<b>Transaksi Terakhir:</b>`;
    const recentTx = data.transactions.slice(0, 5);

    for (const tx of recentTx) {
      const emoji = tx.type === "INCOME" ? "💵" : "💸";
      const sign = tx.type === "INCOME" ? "+" : "-";
      const desc = tx.description ? ` - ${escapeHtml(tx.description)}` : "";
      message += `\n${emoji} ${sign}${formatCurrency(tx.amount)} (${escapeHtml(
        tx.category
      )})${desc}`;
    }

    if (data.transactions.length > 5) {
      message += `\n<i>...dan ${
        data.transactions.length - 5
      } transaksi lainnya</i>`;
    }
  }

  return message;
}

/**
 * Formats balance message with all wallet balances
 * @param data - The balance data containing wallet balances
 * @returns Formatted balance message
 */
export function formatBalance(data: BalanceData): string {
  let message = `💰 <b>Saldo Wallet</b>\n`;

  if (data.wallets.length === 0) {
    message += `\n<i>Belum ada wallet aktif</i>`;
    return message;
  }

  for (const wallet of data.wallets) {
    const emoji = getWalletEmoji(wallet.name);
    message += `\n${emoji} <b>${escapeHtml(wallet.name)}:</b> ${formatCurrency(
      wallet.balance
    )}`;
  }

  message += `\n\n💎 <b>Total:</b> ${formatCurrency(data.totalBalance)}`;

  return message;
}

/**
 * Gets emoji for wallet based on name
 * @param name - Wallet name
 * @returns Appropriate emoji
 */
function getWalletEmoji(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("cash") || lowerName.includes("tunai")) return "💵";
  if (
    lowerName.includes("bank") ||
    lowerName.includes("bca") ||
    lowerName.includes("mandiri")
  )
    return "🏦";
  if (
    lowerName.includes("gopay") ||
    lowerName.includes("ovo") ||
    lowerName.includes("dana") ||
    lowerName.includes("e-wallet")
  )
    return "📱";
  if (lowerName.includes("credit") || lowerName.includes("kartu")) return "💳";
  return "👛";
}

/**
 * Formats wallet list message
 * @param wallets - Array of wallets
 * @param defaultWalletId - ID of the default wallet (optional)
 * @returns Formatted wallet list message
 */
export function formatWalletList(
  wallets: Wallet[],
  defaultWalletId?: string
): string {
  let message = `👛 <b>Daftar Wallet</b>\n`;

  if (wallets.length === 0) {
    message += `\n<i>Belum ada wallet</i>`;
    return message;
  }

  for (const wallet of wallets) {
    const emoji = getWalletEmoji(wallet.name);
    const isDefault = wallet.id === defaultWalletId || wallet.isDefault;
    const defaultLabel = isDefault ? " ⭐" : "";
    const activeLabel = wallet.isActive ? "" : " (nonaktif)";

    message += `\n${emoji} <b>${escapeHtml(
      wallet.name
    )}</b>${defaultLabel}${activeLabel}`;
    message += `\n    Saldo: ${formatCurrency(wallet.balance)}`;
  }

  message += `\n\n💡 Gunakan /setwallet &lt;nama&gt; untuk set default`;

  return message;
}

/**
 * Formats categories list message
 * @returns Formatted categories message grouped by type
 */
export function formatCategories(): string {
  let message = `📁 <b>Daftar Kategori</b>\n`;

  message += `\n<b>💸 Pengeluaran:</b>`;
  for (const cat of EXPENSE_CATEGORIES) {
    message += `\n• ${escapeHtml(cat.name)}`;
  }

  message += `\n\n<b>💵 Pemasukan:</b>`;
  for (const cat of INCOME_CATEGORIES) {
    message += `\n• ${escapeHtml(cat.name)}`;
  }

  message += `\n\n💡 Kamu juga bisa menggunakan kategori custom`;

  return message;
}

/**
 * Formats error message
 * @param error - The error message or description
 * @returns Formatted error message
 */
export function formatError(error: string): string {
  return `❌ <b>Error</b>\n\n${escapeHtml(
    error
  )}\n\nKetik /help untuk bantuan.`;
}

/**
 * Formats OCR confirmation message for receipt scanning
 * @param parsed - The parsed receipt data from OCR
 * @returns Formatted confirmation message asking user to verify
 */
export function formatOCRConfirmation(parsed: ParsedReceipt): string {
  const confidenceEmoji =
    parsed.confidence >= 0.8 ? "✅" : parsed.confidence >= 0.5 ? "⚠️" : "❓";
  const confidenceLabel =
    parsed.confidence >= 0.8
      ? "Tinggi"
      : parsed.confidence >= 0.5
      ? "Sedang"
      : "Rendah";

  let message = `📸 <b>Hasil Scan Struk</b>\n`;
  message += `${confidenceEmoji} Confidence: ${confidenceLabel} (${Math.round(
    parsed.confidence * 100
  )}%)\n`;

  if (parsed.amount !== undefined) {
    message += `\n💰 <b>Jumlah:</b> ${formatCurrency(parsed.amount)}`;
  } else {
    message += `\n💰 <b>Jumlah:</b> <i>Tidak terdeteksi</i>`;
  }

  if (parsed.merchant) {
    message += `\n🏪 <b>Merchant:</b> ${escapeHtml(parsed.merchant)}`;
  }

  if (parsed.date) {
    message += `\n📅 <b>Tanggal:</b> ${escapeHtml(parsed.date)}`;
  }

  if (parsed.items && parsed.items.length > 0) {
    message += `\n\n📝 <b>Items:</b>`;
    const displayItems = parsed.items.slice(0, 5);
    for (const item of displayItems) {
      message += `\n• ${escapeHtml(item)}`;
    }
    if (parsed.items.length > 5) {
      message += `\n<i>...dan ${parsed.items.length - 5} item lainnya</i>`;
    }
  }

  if (parsed.confidence < 0.8) {
    message += `\n\n⚠️ <i>Hasil scan mungkin tidak akurat. Silakan periksa dan konfirmasi.</i>`;
  }

  message += `\n\n<b>Konfirmasi data ini?</b>`;
  message += `\nBalas "ya" untuk simpan atau input manual dengan /expense`;

  return message;
}

/**
 * Formats processing message when operation takes time
 * @returns Processing status message
 */
export function formatProcessing(): string {
  return `⏳ <b>Memproses...</b>\n\nMohon tunggu sebentar.`;
}

/**
 * Formats access denied message for unauthorized users
 * @returns Access denied message
 */
export function formatAccessDenied(): string {
  return `🚫 <b>Akses Ditolak</b>\n\nMaaf, kamu tidak memiliki akses ke bot ini.`;
}

/**
 * Formats wallet not found error
 * @param walletName - The wallet name that was not found
 * @param availableWallets - List of available wallet names
 * @returns Formatted error message with suggestions
 */
export function formatWalletNotFound(
  walletName: string,
  availableWallets: string[]
): string {
  let message = `❌ <b>Wallet Tidak Ditemukan</b>\n\n`;
  message += `Wallet "${escapeHtml(walletName)}" tidak ditemukan.\n`;

  if (availableWallets.length > 0) {
    message += `\n<b>Wallet tersedia:</b>`;
    for (const name of availableWallets) {
      message += `\n• ${escapeHtml(name)}`;
    }
  }

  return message;
}

/**
 * Formats wallet set confirmation
 * @param walletName - The wallet name that was set as default
 * @returns Confirmation message
 */
export function formatWalletSet(walletName: string): string {
  return `✅ <b>Default Wallet Diubah</b>\n\nWallet "${escapeHtml(
    walletName
  )}" sekarang menjadi default untuk transaksi berikutnya.`;
}

/**
 * Formats unknown command message
 * @param command - The unknown command that was received
 * @returns Message suggesting to use /help
 */
export function formatUnknownCommand(command: string): string {
  return `❓ <b>Perintah Tidak Dikenal</b>\n\nPerintah "${escapeHtml(
    command
  )}" tidak dikenali.\n\nKetik /help untuk melihat daftar perintah.`;
}

/**
 * Formats category suggestion when unknown category is used
 * @param category - The unknown category
 * @param suggestions - Array of suggested similar categories
 * @returns Message with suggestions
 */
export function formatCategorySuggestion(
  category: string,
  suggestions: string[]
): string {
  let message = `💡 <b>Kategori Baru</b>\n\n`;
  message += `Kategori "${escapeHtml(category)}" belum ada.\n`;

  if (suggestions.length > 0) {
    message += `\n<b>Mungkin maksud kamu:</b>`;
    for (const sug of suggestions) {
      message += `\n• ${escapeHtml(sug)}`;
    }
    message += `\n`;
  }

  message += `\nTransaksi tetap akan disimpan dengan kategori "${escapeHtml(
    category
  )}".`;

  return message;
}

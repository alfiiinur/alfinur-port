"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type PackageManagers = "npm" | "pnpm" | "yarn" | "bun";

export default function Snippet() {
  // State untuk melacak tab yang aktif
  const [activeTab, setActiveTab] = useState<PackageManagers>("npm");
  // State untuk animasi tombol copy
  const [isCopied, setIsCopied] = useState(false);

  // Data command untuk setiap package manager
  const commands: Record<PackageManagers, string> = {
    npm: "npx shadcn@latest add @magicui/animated-grid-pattern",
    pnpm: "pnpm dlx shadcn@latest add @magicui/animated-grid-pattern",
    yarn: "npx shadcn@latest add @magicui/animated-grid-pattern",
    bun: "bun x shadcn@latest add @magicui/animated-grid-pattern",
  };

  // Fungsi untuk menyalin text ke clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(commands[activeTab]);
      setIsCopied(true);
      // Reset icon checklist kembali ke copy setelah 2 detik
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin text", err);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {/* Header Bagian Tab */}
      <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
        {(Object.keys(commands) as PackageManagers[]).map((pm) => (
          <button
            key={pm}
            onClick={() => setActiveTab(pm)}
            className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === pm
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {pm}
          </button>
        ))}
      </div>

      {/* Area Code Block */}
      <div className="relative group">
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <span className="select-none text-gray-400 mr-2">$</span>
          {commands[activeTab]}
        </div>

        {/* Tombol Copy (Muncul saat hover atau selalu ada, sesuai selera) */}
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy to clipboard"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

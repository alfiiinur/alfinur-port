"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Wallet,
  Camera,
} from "lucide-react";

const financeNav = [
  { href: "/dashboard/finance", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/finance/transactions",
    label: "Money Track",
    icon: TrendingUp,
  },
  { href: "/dashboard/finance/bills", label: "Bills", icon: Receipt },
  { href: "/dashboard/finance/wallets", label: "My Wallets", icon: Wallet },
  {
    href: "/dashboard/finance/scanner",
    label: "OCR Scanner",
    icon: Camera,
    disabled: false,
  },
];

export default function FinanceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {financeNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : item.disabled
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

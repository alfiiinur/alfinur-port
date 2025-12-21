"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { NotificationProvider } from "@/components/admin/NotificationProvider";
import { NotificationAlert } from "@/components/admin/NotificationAlert";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <div className="lg:pl-64 transition-all duration-300">
            <Header />
            <main className="p-4 lg:p-6">{children}</main>
          </div>
          <NotificationAlert />
        </div>
      </NotificationProvider>
    </SessionProvider>
  );
}

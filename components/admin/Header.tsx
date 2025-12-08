"use client";

import { useSession } from "next-auth/react";
import { MoodToggle } from "@/components/public/shared/MoodToggle";
import { User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
        <h1 className="text-lg font-semibold hidden sm:block">
          Welcome back, {session?.user?.name || "Admin"}
        </h1>
        <div className="flex items-center gap-4">
          <MoodToggle />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

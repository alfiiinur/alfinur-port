"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Palette,
  LogOut,
  ChevronLeft,
  Menu,
  Calendar,
  CheckSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  MessageCircle,
  File,
  BarChart3,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Tipe data untuk item menu
type MenuItem = {
  label: string;
  href?: string;
  // Bisa nerima lucide, heroicons, atau custom SVG component
  icon: unknown;
  subItems?: {
    label: string;
    href: string;
    icon?: unknown;
  }[];
};
type MenuGroup = {
  label: string;
  items: MenuItem[];
};

// Data Struktur Menu Baru
const menuGroups: MenuGroup[] = [
  {
    label: "Main Menu",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      {
        label: "Blogs",
        icon: FileText,
        subItems: [
          { label: "All Blogs", href: "/dashboard/blogs", icon: File },
          {
            label: "Comments",
            href: "/dashboard/comments",
            icon: MessageCircle,
          },
          { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        ],
      },
      { href: "/dashboard/designs", label: "Designs", icon: Palette },
    ],
  },
  {
    label: "Productivity",
    items: [
      { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        label: "Settings",
        icon: Settings,
        // Contoh implementasi Tree / Dropdown (Item tanpa href tapi punya subItems)
        subItems: [
          { label: "Profile", href: "/dashboard/settings/profile", icon: User },
          {
            label: "Security",
            href: "/dashboard/settings/security",
            icon: Shield,
          },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // State untuk mengontrol dropdown mana yang terbuka
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDropdown = (label: string) => {
    // Jika sidebar sedang collapsed, buka sidebar dulu agar user bisa lihat dropdown
    if (collapsed) setCollapsed(false);

    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64",
          "lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
          {!collapsed && (
            <Link href="/dashboard" className="font-bold text-xl truncate">
              Admin Panel
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-6 px-3">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Group Label (Sembunyikan jika collapsed) */}
                {!collapsed && (
                  <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </h4>
                )}

                {/* Separator jika collapsed agar tetap rapi */}
                {collapsed && groupIndex > 0 && (
                  <div className="border-t my-2 mx-2" />
                )}

                <ul className="space-y-1">
                  {group.items.map((item) => {
                    // Cek apakah item ini aktif (termasuk jika sub-itemnya aktif)
                    const isSubItemActive = item.subItems?.some(
                      (sub) => pathname === sub.href
                    );
                    const isMainActive = item.href
                      ? pathname === item.href
                      : false;
                    const isActive = isMainActive || isSubItemActive;

                    const isDropdownOpen =
                      openDropdowns[item.label] || isSubItemActive;

                    return (
                      <li key={item.label}>
                        {item.subItems ? (
                          /* Render sebagai Dropdown/Tree */
                          <div className="flex flex-col">
                            <button
                              onClick={() => toggleDropdown(item.label)}
                              className={cn(
                                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                  ? "text-foreground bg-muted/50"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                              </div>
                              {!collapsed && (
                                <span className="text-muted-foreground">
                                  {openDropdowns[item.label] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </button>

                            {/* Sub Menu Items */}
                            {openDropdowns[item.label] && !collapsed && (
                              <div className="ml-4 mt-1 space-y-1 border-l pl-2">
                                {item.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                      pathname === subItem.href
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon className="h-4 w-4" />
                                    )}
                                    <span>{subItem.label}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Render sebagai Link Biasa */
                          <Link
                            href={item.href || "#"}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors",
              "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

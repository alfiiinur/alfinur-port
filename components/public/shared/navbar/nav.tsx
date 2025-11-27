"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoodToggle } from "../MoodToggle";
import {
  Briefcase,
  CommandIcon,
  FileDown,
  Home,
  Mail,
  PenTool,
  Search,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home, tooltip: "Home" },
    { name: "About", href: "/about", icon: User, tooltip: "About" },
    {
      name: "Projects",
      href: "/projects",
      icon: Briefcase,
      tooltip: "Projects",
    },
    { name: "Blog", href: "/blog", icon: PenTool, tooltip: "Blog" },
    { name: "Services", href: "/services", icon: Wrench, tooltip: "Services" },
    { name: "Contact", href: "/contact", icon: Mail, tooltip: "Contact" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cmd/Ctrl + P
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <TooltipProvider delayDuration={100}>
      <>
        {/* A. NAVBAR ATAS (Hanya muncul saat belum scroll) */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4  bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all duration-500 hidden lg:flex ${
            isScrolled
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="font-anton text-2xl font-bold">MyPortfolio</div>

          <div className="flex items-center gap-1 bg-black dark:bg-white p-1 rounded-full shadow-lg">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-black dark:bg-black dark:text-white shadow-sm"
                      : "text-white dark:text-black hover:opacity-80"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden xl:block text-sm font-bold border-b border-current">
              alfinurdanialin900@gmail.com
            </span>
            <div className="flex items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 cursor-pointer hover:opacity-80 transition">
              <FileDown size={16} className="text-white dark:text-black" />
              <span className="text-sm font-bold text-white dark:text-black">
                CV Alfi
              </span>
            </div>
            <MoodToggle />
          </div>
        </nav>

        {/* B. DOCK + TOOLTIP */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
            isScrolled
              ? "translate-y-0 opacity-100"
              : "translate-y-24 opacity-0 pointer-events-none"
          }`}
        >
          <Dock className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
            {/* Nav Items dengan Tooltip */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <DockIcon>
                      <Link href={item.href}>
                        <Icon
                          className={`size-5 transition-all ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400 scale-125"
                              : "text-black dark:text-white"
                          } hover:scale-125`}
                        />
                      </Link>
                    </DockIcon>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1.5 rounded-lg"
                  >
                    {item.tooltip}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Separator */}
            <div className="w-px h-10 bg-white/20 mx-3" />

            {/* Command Palette Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DockIcon
                  onClick={() => setOpenCommand(true)}
                  className="cursor-pointer"
                >
                  <Search className="size-5 text-black dark:text-white hover:scale-125 transition-transform" />
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
              >
                Search • Cmd/Ctrl + P
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle di Dock */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DockIcon>
                  <div className="scale-90">
                    <MoodToggle />
                  </div>
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
              >
                Toggle Theme
              </TooltipContent>
            </Tooltip>
          </Dock>
        </div>

        {/* C. COMMAND DIALOG */}
        <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
          <CommandInput placeholder="Search pages or actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenCommand(false)}
                >
                  <CommandItem className="cursor-pointer">
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.name}</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem className="cursor-pointer">
                <FileDown className="mr-3 h-4 w-4" />
                <span>Download CV</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    </TooltipProvider>
  );
};

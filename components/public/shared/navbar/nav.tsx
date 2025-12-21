"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoodToggle } from "../MoodToggle";
import {
  Briefcase,
  Check,
  Copy,
  FileDown,
  GalleryVerticalEnd,
  Home,
  Mail,
  Menu,
  PenTool,
  Search,
  User,
  Wrench,
} from "lucide-react";
import { CVHoverCard } from "../CVHoverCard";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  settingKey: string;
};

const allNavItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    tooltip: "Home",
    settingKey: "showHome",
  },
  {
    name: "About",
    href: "/about",
    icon: User,
    tooltip: "About",
    settingKey: "showAbout",
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
    tooltip: "Projects",
    settingKey: "showProjects",
  },
  {
    name: "Blog",
    href: "/blogs",
    icon: PenTool,
    tooltip: "Blog",
    settingKey: "showBlogs",
  },
  {
    name: "Design",
    href: "/design",
    icon: GalleryVerticalEnd,
    tooltip: "Design",
    settingKey: "showDesign",
  },
  {
    name: "Services",
    href: "/services",
    icon: Wrench,
    tooltip: "Services",
    settingKey: "showServices",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Mail,
    tooltip: "Contact",
    settingKey: "showContact",
  },
];

type Settings = {
  siteName?: string;
  contactEmail?: string;
  showHome?: boolean;
  showAbout?: boolean;
  showProjects?: boolean;
  showBlogs?: boolean;
  showDesign?: boolean;
  showServices?: boolean;
  showContact?: boolean;
};

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [designExpanded, setDesignExpanded] = useState(false);

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    const email = settings?.contactEmail || "alfinurdanialin900@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Filter nav items based on settings using useMemo
  const filteredNavItems = settings
    ? allNavItems.filter((item) => {
        const key = item.settingKey as keyof Settings;
        return settings[key] !== false;
      })
    : allNavItems;

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

  const siteName = settings?.siteName || "MyPortfolio";
  const contactEmail = settings?.contactEmail || "alfinurdanialin900@gmail.com";

  return (
    <TooltipProvider delayDuration={100}>
      <>
        {/* A. NAVBAR ATAS (Desktop: full nav, Mobile: logo + hamburger) */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all duration-500 ${
            isScrolled
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="font-anton text-2xl font-bold">{siteName}</div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-black dark:bg-white p-1 rounded-full shadow-lg">
            {filteredNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              // Special handling for Design with dropdown
              if (item.name === "Design") {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                          isActive
                            ? "bg-white text-black dark:bg-black dark:text-white shadow-sm"
                            : "text-white dark:text-black hover:opacity-80"
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="min-w-[160px]"
                    >
                      <DropdownMenuItem asChild>
                        <Link href="/design" className="cursor-pointer">
                          Design Grid
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/design/showcase"
                          className="cursor-pointer"
                        >
                          Design Showcase
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

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

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyEmail}
                  className="hidden xl:flex items-center gap-2 text-sm font-bold border-b border-current hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {contactEmail}
                  {copied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} className="opacity-50" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium"
              >
                {copied ? "Copied!" : "Click to copy"}
              </TooltipContent>
            </Tooltip>
            <CVHoverCard cvUrl="/frontend/cv/Alfi Nur Danialin-CV (1).pdf" />
            <MoodToggle />
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex lg:hidden items-center gap-3">
            <MoodToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] p-0 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span className="font-anton text-xl font-bold">
                      {siteName}
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <nav className="flex flex-col gap-1 px-3">
                      {filteredNavItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive =
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/");

                        // Special handling for Design with expandable submenu
                        if (item.name === "Design") {
                          return (
                            <div key={item.href}>
                              <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() =>
                                  setDesignExpanded(!designExpanded)
                                }
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                                  isActive
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="w-5 h-5" />
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    designExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </motion.button>
                              <AnimatePresence>
                                {designExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-12 py-2 flex flex-col gap-1">
                                      <Link
                                        href="/design"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-sm"
                                      >
                                        Design Grid
                                      </Link>
                                      <Link
                                        href="/design/showcase"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-sm"
                                      >
                                        Design Showcase
                                      </Link>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        }

                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-900"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                    <button
                      onClick={handleCopyEmail}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 rounded-xl hover:opacity-80 transition-opacity"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{contactEmail}</span>
                      {copied ? (
                        <Check size={14} className="text-green-500 shrink-0" />
                      ) : (
                        <Copy size={14} className="opacity-50 shrink-0" />
                      )}
                    </button>
                    <CVHoverCard cvUrl="/frontend/cv/Alfi Nur Danialin-CV (1).pdf" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              // Special handling for Design with dropdown in Dock
              if (item.name === "Design") {
                return (
                  <DropdownMenu key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <DockIcon className="cursor-pointer">
                            <Icon
                              className={`size-5 transition-all ${
                                isActive
                                  ? "text-blue-600 dark:text-blue-400 scale-125"
                                  : "text-black dark:text-white"
                              } hover:scale-125`}
                            />
                          </DockIcon>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        {item.tooltip}
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      align="center"
                      side="top"
                      className="mb-2"
                    >
                      <DropdownMenuItem asChild>
                        <Link href="/design" className="cursor-pointer">
                          Design Grid
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/design/showcase"
                          className="cursor-pointer"
                        >
                          Design Showcase
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

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
          <CommandInput
            placeholder="Search pages or actions..."
            illustration={
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative w-12 h-10"
              >
                {/* Grass */}
                <svg
                  viewBox="0 0 48 20"
                  className="absolute bottom-0 w-full h-5"
                >
                  <defs>
                    <linearGradient
                      id="grassGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                  {[
                    "M4,20 Q3,12 4,6",
                    "M8,20 Q9,14 8,8",
                    "M12,20 Q11,13 12,5",
                    "M16,20 Q17,15 16,7",
                    "M20,20 Q19,12 20,6",
                    "M24,20 Q25,14 24,8",
                    "M28,20 Q27,13 28,5",
                    "M32,20 Q33,15 32,7",
                    "M36,20 Q35,12 36,6",
                    "M40,20 Q41,14 40,8",
                    "M44,20 Q43,13 44,5",
                  ].map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      stroke="url(#grassGradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.1 + i * 0.02, duration: 0.3 }}
                    />
                  ))}
                </svg>
                {/* Fox character */}
                <motion.div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-2xl">🦊</span>
                </motion.div>
              </motion.div>
            }
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {filteredNavItems.map((item) => (
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

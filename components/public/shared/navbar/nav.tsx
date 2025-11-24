"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoodToggle } from "../MoodToggle";
import { FileDown } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className=" hidden lg:flex w-full py-4 px-8 justify-between items-center  bg-white dark:bg-black">
      {/* Logo */}
      <div className="font-anton text-2xl font-bold dark:text-white">
        MyPortfolio
      </div>
      <div className="flex items-center gap-1 bg-black dark:bg-white p-1 rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-black shadow-sm dark:bg-black dark:text-white"
                    : "text-white hover:text-white dark:text-black dark:hover:text-black"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-10">
        <h1 className="font-bold text-sm border-b border-black dark:border-white dark:text-white">
          alfinurdanialin900@gmail.com
        </h1>
        <div className="flex gap-2 items-center justify-center rounded-full px-2 py-1.5 bg-black dark:bg-white">
          <FileDown className="text-white dark:text-black" size={16} />
          <h1 className="font-bold text-sm  text-white  dark:text-black">
            CV Alfi Nur Danialin
          </h1>
        </div>
      </div>
      <div className="">
        <MoodToggle />
      </div>
    </nav>
  );
};

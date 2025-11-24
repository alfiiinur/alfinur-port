"use client";

import { Menu, X } from "lucide-react";
import { MoodToggle } from "../MoodToggle";
import { useState } from "react";

export const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="lg:hidden w-full py-4 px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">MyPortfolio</div>

        <div className="flex items-center gap-4">
          <MoodToggle />
          <button onClick={toggleMenu} className="z-50">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Overlay + Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        >
          <div
            className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-6 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6 mt-20">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

"use client";

// This component is deprecated - mobile navigation is now handled in nav.tsx
// Keeping for backward compatibility but it's hidden by default

import { Menu, X } from "lucide-react";
import { MoodToggle } from "../MoodToggle";
import { useState } from "react";

export const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  // Hidden - mobile nav is now integrated in nav.tsx with responsive dock
  return null;
};

"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-800 p-1 cursor-pointer transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle language"
    >
      {/* Background indicator */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-black dark:bg-white shadow-md"
        initial={false}
        animate={{
          x: language === "en" ? 0 : 32,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* EN Label */}
      <motion.span
        className="relative z-10 w-6 h-6 flex items-center justify-center text-xs font-bold"
        animate={{
          color: language === "en" ? "#ffffff" : "#6b7280",
        }}
        transition={{ duration: 0.2 }}
      >
        EN
      </motion.span>

      {/* ID Label */}
      <motion.span
        className="relative z-10 w-6 h-6 flex items-center justify-center text-xs font-bold ml-2"
        animate={{
          color: language === "id" ? "#ffffff" : "#6b7280",
        }}
        transition={{ duration: 0.2 }}
      >
        ID
      </motion.span>
    </button>
  );
}

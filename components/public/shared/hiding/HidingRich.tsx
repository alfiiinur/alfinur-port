"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Badge } from "./badge";

interface RichHeadingProps {
  badge?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function RichHeading({
  badge,
  description,
  children,
  className,
}: RichHeadingProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto text-center px-4 py-12",
        className
      )}
    >
      {/* 1. Badge Section */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge>{badge}</Badge>
        </motion.div>
      )}

      {/* 2. Main Title Section */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-3xl md:text-5xl lg:text-[4.5rem] font-bold leading-[1.2] md:leading-[1.15] tracking-tight text-black dark:text-white text-left"
      >
        {children}
      </motion.h2>

      {/* 3. Description Section */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-black max-w-2xl mx-auto leading-relaxed dark:text-white"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

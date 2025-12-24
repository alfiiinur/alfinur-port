"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  words: string[];
  className?: string;
  duration?: number;
}

export const FlipText = ({
  words,
  className,
  duration = 3000,
}: FlipTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={cn("inline-block relative", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ rotateX: -90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: -20 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Slicky text - slides in from bottom with stagger
interface SlickyTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const SlickyText = ({ text, className, delay = 0 }: SlickyTextProps) => {
  const words = text.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap gap-x-2", className)}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, rotateX: -45 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Reveal text - each character reveals with mask
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const RevealText = ({ text, className, delay = 0 }: RevealTextProps) => {
  return (
    <motion.span
      className={cn("inline-block overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.span
        className="inline-block"
        variants={{
          hidden: { y: "100%", opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          },
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
};

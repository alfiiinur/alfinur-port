"use client";

import { motion } from "motion/react";

const lineVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

// Split text into lines (roughly 6-8 words per line)
function splitIntoLines(text: string, wordsPerLine = 7): string[] {
  if (typeof text !== "string") return [];
  const words = text.split(" ");
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  return lines;
}

interface AnimatedTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  wordsPerLine?: number;
}

export const AnimatedText = ({
  children,
  className = "",
  as: Tag = "p",
  wordsPerLine = 7,
}: AnimatedTextProps) => {
  // Ensure children is a string
  const text = typeof children === "string" ? children : String(children);
  const lines = splitIntoLines(text, wordsPerLine);

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          variants={lineVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          custom={i}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </Tag>
  );
};

// For custom line splits (manual control)
interface AnimatedLinesProps {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export const AnimatedLines = ({
  lines,
  className = "",
  as: Tag = "p",
}: AnimatedLinesProps) => {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          variants={lineVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          custom={i}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </Tag>
  );
};

"use client";

import SectionLabel from "@/components/public/shared/SectionLabel";
import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { motion } from "motion/react";

const titleLines = ["What I Can Do", "For You"];

const descLines = [
  "Professional IT services tailored to your needs.",
  "From web design to consulting, I deliver quality",
  "solutions with a proven process.",
];

export default function ServicesHero() {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <SectionLabel text="SERVICES" />
      </motion.div>

      <AnimatedLines
        lines={titleLines}
        as="h1"
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
      />

      <AnimatedLines
        lines={descLines}
        as="p"
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
      />
    </div>
  );
}

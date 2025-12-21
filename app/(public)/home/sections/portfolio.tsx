"use client";

import { ThreeDMarqueeDemo } from "@/components/public/shared/3dMarque";
import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { motion } from "motion/react";

const descLines = [
  "We take pride in our diverse portfolio that showcases",
  "our expertise across various industries. From innovative",
  "startups to established enterprises, our work reflects",
  "our commitment to delivering exceptional design solutions.",
];

export default function PortfolioSection() {
  return (
    <section className="w-full bg-white text-black py-20 px-6 dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-anton font-bold text-5xl md:text-7xl"
          >
            My <span className="text-[#C4F135] italic">Portfolio</span>
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-anton font-medium self-end text-sm md:text-base text-gray-600 underline-offset-2 underline italic"
          >
            Scroll to explore
          </motion.span>
        </div>
        <div>
          <AnimatedLines
            lines={descLines}
            as="p"
            className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed mt-6"
          />
        </div>
        <ThreeDMarqueeDemo />
      </div>
    </section>
  );
}

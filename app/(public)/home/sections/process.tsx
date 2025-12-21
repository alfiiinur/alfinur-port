"use client";

import { processSteps } from "@/components/dataMock/processList";
import { ProcessList } from "@/components/public/shared/ProcessList";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { motion } from "motion/react";
import Image from "next/image";

// Animation variants for lines
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

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

// Split text into lines
const headlineLines = [
  "Welcome to my portfolio where I",
  "showcase my journey as an IT Developer,",
  "turning ideas into digital solutions",
  "that make a real impact.",
];

const descriptionLines = [
  "From web development to system design,",
  "I bring creativity and technical expertise together.",
  "Explore my projects, skills, and experiences",
  "as we build something amazing together.",
];

export const ProcessSection = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12 dark:bg-black overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* === KOLOM KIRI === */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.span
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-[10px] font-bold uppercase tracking-widest text-black mb-2 dark:text-white"
          >
            (My Approach)
          </motion.span>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative w-full aspect-square overflow-hidden bg-gray-100"
          >
            <Image
              src="/img/room.jpg"
              alt="Architecture Process"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProcessList items={processSteps} />
          </motion.div>
        </div>

        {/* === KOLOM KANAN === */}
        <div className="lg:col-span-8 flex flex-col justify-between pt-4">
          <div className="space-y-12">
            {/* Headline - per line animation */}
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.1] tracking-tight text-black dark:text-white">
              {headlineLines.map((line, i) => (
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
            </h2>

            {/* Description - per line animation */}
            <p className="text-2xl md:text-3xl lg:text-[2rem] leading-[1.2] font-medium text-black max-w-4xl dark:text-white">
              {descriptionLines.map((line, i) => (
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
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <RoundedButton href="/about">Learn More About Me</RoundedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

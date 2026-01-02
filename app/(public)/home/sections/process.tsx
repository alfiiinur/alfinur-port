"use client";

import {
  processStepsEn,
  processStepsId,
} from "@/components/dataMock/processList";
import { ProcessList } from "@/components/public/shared/ProcessList";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { Highlighter } from "@/components/ui/highlighter";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";

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

// Rotating roles
const rolesEn = [
  "IT Developer",
  "Web Developer",
  "UI/UX Designer",
  "Frontend Dev",
  "Graphic Designer",
];

const rolesId = [
  "Developer IT",
  "Developer Web",
  "Desainer UI/UX",
  "Dev Frontend",
  "Desainer Grafis",
];

// Rotating text component
const RotatingText = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const roles = language === "id" ? rolesId : rolesEn;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <span className="relative inline-block min-w-[280px] md:min-w-[340px]">
      <AnimatePresence mode="wait">
        <Highlighter action="box" color="#499CF5">
          <motion.span
            key={`${language}-${currentIndex}`}
            initial={{ y: 30, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -30, opacity: 0, rotateX: 90 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="inline-block text-[#499CF5] dark:text-[#499CF5]"
            style={{ transformOrigin: "center" }}
          >
            {roles[currentIndex]}
          </motion.span>
        </Highlighter>
      </AnimatePresence>
    </span>
  );
};

const descriptionLinesEn = [
  "From web development to system design,",
  "I bring creativity and technical expertise together.",
  "Explore my projects, skills, and experiences",
  "as we build something amazing together.",
];

const descriptionLinesId = [
  "Dari pengembangan web hingga desain sistem,",
  "Saya menggabungkan kreativitas dan keahlian teknis.",
  "Jelajahi proyek, keahlian, dan pengalaman saya",
  "saat kita membangun sesuatu yang luar biasa bersama.",
];

export const ProcessSection = () => {
  const { language, t } = useLanguage();
  const descriptionLines =
    language === "id" ? descriptionLinesId : descriptionLinesEn;
  const processSteps = language === "id" ? processStepsId : processStepsEn;

  const headlineLinesEn = [
    "Welcome to my portfolio where I",
    "showcase my journey as a",
    "turning ideas into digital solutions",
    "that make a real impact.",
  ];

  const headlineLinesId = [
    "Selamat datang di portfolio saya dimana saya",
    "menampilkan perjalanan saya sebagai",
    "mengubah ide menjadi solusi digital",
    "yang memberikan dampak nyata.",
  ];

  const headlineLines = language === "id" ? headlineLinesId : headlineLinesEn;

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
            {t("myApproach")}
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
            {/* Headline - with rotating role text */}
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.1] tracking-tight text-black dark:text-white">
              <motion.span
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                custom={0}
                className="block"
              >
                {headlineLines[0]}
              </motion.span>
              <motion.span
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                custom={1}
                className="block"
              >
                {headlineLines[1]} <RotatingText />,
              </motion.span>
              <motion.span
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                custom={2}
                className="block"
              >
                {headlineLines[2]}
              </motion.span>
              <motion.span
                variants={lineVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                custom={3}
                className="block"
              >
                {headlineLines[3]}
              </motion.span>
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
            <RoundedButton href="/about">{t("learnMoreAboutMe")}</RoundedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

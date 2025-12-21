"use client";

import { AnimatedText } from "@/components/public/shared/AnimatedText";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";

interface HeadingServiceProps {
  titleLine1: string;
  titleLine2: string;
  topDescription: string;
  bottomDescription: string;
  badgeText: string;
  imageSrc: string | StaticImageData;
  imageAlt?: string;
}

export default function HeadingService({
  titleLine1,
  titleLine2,
  topDescription,
  bottomDescription,
  badgeText,
  imageSrc,
  imageAlt = "Design interior",
}: HeadingServiceProps) {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 py-20 overflow-hidden bg-white mb-10 dark:bg-black">
      {/* --- BAGIAN ATAS: Header & Intro --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 relative z-10">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full aspect-4/3 md:aspect-video overflow-hidden rounded-sm shadow-sm group"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="ml-10 text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-black dark:text-white"
        >
          {titleLine1}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 md:mt-0 md:mb-4 max-w-xs text-sm md:text-xs font-medium text-gray-500 leading-relaxed md:text-right dark:text-white"
        >
          {topDescription}
        </motion.p>
      </div>

      {/* --- BAGIAN TENGAH: Layering Text & Image --- */}
      <div className="relative w-full mt-[-20px] md:mt-[-40px]">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[22vw] leading-[0.8] font-bold tracking-tighter text-black select-none opacity-90 dark:text-white italic"
        >
          {titleLine2}
        </motion.h2>

        <div className="relative md:absolute md:top-1/3 md:right-0 md:w-[70%] lg:w-[65%] mt-8 md:mt-0 z-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -top-6 right-4 md:-top-8 md:right-[20%] z-30 bg-white px-5 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2"
          >
            <span className="text-xs md:text-sm font-semibold text-gray-800 tracking-wide">
              {badgeText}
            </span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
          </motion.div>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: Deskripsi Panjang --- */}
      <div className="hidden md:block md:h-[15] lg:h-[10vw]" />

      <div className="mt-12 md:mt-0 max-w-2xl">
        <AnimatedText
          as="p"
          className="text-lg md:text-xl text-gray-800 leading-relaxed font-normal dark:text-white"
        >
          {bottomDescription}
        </AnimatedText>
      </div>
    </section>
  );
}

"use client";

import {
  services,
  serviceDetails,
  defaultServiceContent,
} from "@/components/dataMock/servicessList";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export const ServiceDetail = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  // Get current content based on active service
  const currentContent = activeService
    ? serviceDetails.find((s) => s.name === activeService)
    : null;

  // Display values with fallback to default
  const displayTitle = currentContent?.title ?? defaultServiceContent.title;
  const displayDescription =
    currentContent?.description ?? defaultServiceContent.description;
  const displayImage = currentContent?.image ?? defaultServiceContent.image;
  const displayLabel = currentContent?.label ?? defaultServiceContent.label;
  const displayNumber = currentContent?.id
    ? String(currentContent.id).padStart(2, "0")
    : "01";

  return (
    <section className="w-full bg-black text-black py-20 px-6 dark:bg-white dark:text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* KOLOM 1: Nomor Index dengan Animasi */}
        <div className="md:col-span-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-bold text-gray-400"
            >
              {displayNumber}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* KOLOM 2: Gambar Portfolio dengan Animasi */}
        <div className="md:col-span-4">
          <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={displayImage}
                  alt={displayLabel}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>
            {/* Label dengan Animasi */}
            <AnimatePresence mode="wait">
              <motion.div
                key={displayLabel}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute bottom-4 left-4 text-white font-bold text-xl z-10"
              >
                {displayLabel}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* KOLOM 3: Judul Besar & List Service */}
        <div className="md:col-span-7 flex flex-col justify-between">
          {/* Judul Besar dengan Animasi */}
          <div className="mb-12 min-h-[200px] md:min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={displayTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-5xl md:text-7xl font-black uppercase leading-[0.9] text-white dark:text-black whitespace-pre-line"
              >
                {displayTitle}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-700 dark:border-gray-300 pt-10">
            {/* Deskripsi dengan Animasi */}
            <div className="min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={displayDescription}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 0.1,
                  }}
                  className="text-white text-xl md:text-2xl font-medium leading-snug dark:text-black"
                >
                  {displayDescription}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* List Services */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm md:text-base font-medium">
              {services.map((item, index) => {
                const isActive = activeService === item;
                return (
                  <motion.div
                    key={index}
                    onClick={() => setActiveService(isActive ? null : item)}
                    className="group flex items-start gap-2 cursor-pointer"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Plus icon */}
                    <span
                      className={`mt-0.5 shrink-0 transition-all duration-300 ${
                        isActive
                          ? "text-[#C4F135] opacity-100 translate-x-0"
                          : "text-[#C4F135] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    >
                      <Plus size={16} />
                    </span>

                    {/* Text */}
                    <span
                      className={`leading-snug transition-colors duration-300 ${
                        isActive
                          ? "text-[#C4F135]"
                          : "text-gray-400 group-hover:text-white dark:group-hover:text-black"
                      }`}
                    >
                      {item}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

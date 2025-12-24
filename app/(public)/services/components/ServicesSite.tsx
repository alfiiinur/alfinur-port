"use client";

import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

export type ShowcaseMediaType = "image" | "video";

export interface ShowcaseMediaItem {
  id: string | number;
  type: ShowcaseMediaType;
  src: string | StaticImageData;
  alt?: string;
  className?: string;
}

interface ServicesSiteProps {
  title: ReactNode;
  topDescription: string;
  mediaItems: [ShowcaseMediaItem, ShowcaseMediaItem];
  bottomLabel?: string;
  bottomContent: ReactNode;
}

const MediaCard = ({
  item,
  index,
}: {
  item: ShowcaseMediaItem;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative w-full h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden ${
        item.className || "bg-gray-100"
      }`}
    >
      {item.type === "video" ? (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={item.src as string} type="video/mp4" />
          Your browser does not support video.
        </video>
      ) : (
        <Image
          src={item.src}
          alt={item.alt || "Service showcase"}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </motion.div>
  );
};

export default function ServicesSite({
  title,
  topDescription,
  mediaItems,
  bottomLabel,
  bottomContent,
}: ServicesSiteProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-black">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1] dark:text-white"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 text-sm md:text-base max-w-xs md:text-right leading-relaxed dark:text-white"
        >
          {topDescription}
        </motion.p>
      </div>

      {/* 2. Media Grid (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-24">
        {mediaItems.map((item, index) => (
          <MediaCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* 3. Bottom Content (Centered Typography) */}
      <div className="max-w-5xl mx-auto text-center">
        {bottomLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              /{bottomLabel}
            </span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl md:text-6xl leading-snug font-bold text-gray-900 dark:text-white"
        >
          {bottomContent}
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { AnimatedText } from "@/components/public/shared/AnimatedText";
import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export type MediaType = "image" | "video";

export interface MediaItem {
  type: MediaType;
  src: string | StaticImageData;
  alt?: string;
  className?: string;
}

interface MissionSectionProps {
  labelLink: {
    text: string;
    href: string;
  };
  badge?: string;
  title: string;
  description: string;
  mediaItems: MediaItem[];
}

const MediaRenderer = ({ item, index }: { item: MediaItem; index: number }) => {
  if (item.type === "video") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`relative w-full h-[400px] md:h-[500px] rounded-sm overflow-hidden bg-gray-100 ${item.className}`}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={typeof item.src === "string" ? item.src : undefined}
        >
          <source src={item.src as string} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative w-full h-[400px] md:h-[500px] rounded-sm overflow-hidden bg-gray-100 ${item.className}`}
    >
      <Image
        src={item.src}
        alt={item.alt || "Gallery image"}
        fill
        className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </motion.div>
  );
};

export default function MissionSection({
  labelLink,
  badge,
  title,
  description,
  mediaItems,
}: MissionSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* --- Left Column (Sticky Label) --- */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-10"
          >
            <Link
              href={labelLink.href}
              className="group inline-flex items-center text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors dark:text-white"
            >
              {labelLink.text}
              <ArrowUpRight
                size={20}
                className="ml-1 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* --- Right Column (Content) --- */}
        <div className="lg:col-span-9 flex flex-col gap-10">
          {/* Header Content */}
          <div className="space-y-6 max-w-4xl">
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-sm font-bold tracking-widest text-gray-800 uppercase"
              >
                <Star size={14} className="fill-current dark:text-white" />
                <span className="dark:text-white">{badge}</span>
              </motion.div>
            )}

            <AnimatedText
              as="h2"
              className="text-anton font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-gray-900 dark:text-white italic"
            >
              {title}
            </AnimatedText>

            <AnimatedText
              as="p"
              className="text-poppins font-medium text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl"
            >
              {description}
            </AnimatedText>
          </div>

          {/* Media Grid (Images/Videos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {mediaItems.map((item, index) => (
              <MediaRenderer key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

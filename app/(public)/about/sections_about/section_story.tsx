"use client";

import { AnimatedText } from "@/components/public/shared/AnimatedText";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// Star SVG Component - 8 point
const StarShape = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// 4-point star
const Star4Point = ({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

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
  const sectionRef = useRef<HTMLElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !starsRef.current) return;

    const stars = starsRef.current.querySelectorAll(".star-shape");

    // Initial appear animation
    gsap.fromTo(
      stars,
      { scale: 0, rotation: -180, opacity: 0 },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Continuous floating/pulsing animation for each star
    stars.forEach((star, index) => {
      // Twinkle effect - scale pulse
      gsap.to(star, {
        scale: 1.2,
        duration: 1.5 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3,
      });

      // Gentle rotation
      gsap.to(star, {
        rotation: index % 2 === 0 ? 15 : -15,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      });

      // Floating movement
      gsap.to(star, {
        y: index % 2 === 0 ? -8 : 8,
        x: index % 3 === 0 ? 5 : -5,
        duration: 2.5 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.15,
      });

      // Opacity pulse (twinkle)
      gsap.to(star, {
        opacity: 0.3,
        duration: 1.2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.25,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(stars);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-32 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      {/* Animated Star Shapes */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none">
        <StarShape
          size={32}
          className="star-shape absolute top-[10%] right-[15%] text-gray-800 dark:text-white"
        />
        <Star4Point
          size={20}
          className="star-shape absolute top-[25%] left-[8%] text-gray-800 dark:text-white"
        />
        <StarShape
          size={24}
          className="star-shape absolute top-[45%] right-[5%] text-gray-800 dark:text-white"
        />
        <Star4Point
          size={16}
          className="star-shape absolute bottom-[30%] left-[12%] text-gray-800 dark:text-white"
        />
        <StarShape
          size={28}
          className="star-shape absolute bottom-[15%] right-[20%] text-gray-800 dark:text-white"
        />
        <Star4Point
          size={14}
          className="star-shape absolute top-[60%] left-[3%] text-gray-800 dark:text-white"
        />
        <StarShape
          size={18}
          className="star-shape absolute bottom-[45%] right-[8%] text-gray-800 dark:text-white"
        />
        <Star4Point
          size={22}
          className="star-shape absolute top-[5%] left-[25%] text-gray-800 dark:text-white"
        />
        <StarShape
          size={16}
          className="star-shape absolute bottom-[10%] left-[40%] text-gray-800 dark:text-white"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
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
                className="flex items-center gap-2 text-sm font-bold tracking-widest text-gray-800 dark:text-white uppercase"
              >
                <StarShape
                  size={14}
                  className="text-gray-800 dark:text-white"
                />
                <span>{badge}</span>
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

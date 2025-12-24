"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  workHistoryData,
  workNowData,
} from "@/components/dataMock/timelineWork";

gsap.registerPlugin(ScrollTrigger);

interface WorkItem {
  title: string;
  company: string;
  period: string;
  description: string | string[];
  techStack?: string[];
  responsibilities?: string[];
  highlights?: string[];
  media?: { type: "image" | "video"; src: string }[];
}

// Media data for each work item
const workMediaData: { type: "image" | "video"; src: string }[][] = [
  // Freelance Developer
  [
    { type: "image", src: "/frontend/webImg/2.png" },
    { type: "image", src: "/frontend/webImg/7.png" },
    { type: "video", src: "/video/videoHome.mp4" },
  ],
  // Graphic Designer
  [
    { type: "image", src: "/frontend/webImg/18.png" },
    { type: "image", src: "/frontend/webImg/25.png" },
    { type: "image", src: "/frontend/webImg/2.png" },
  ],
  // Front-End Developer Intern
  [
    { type: "image", src: "/frontend/webImg/7.png" },
    { type: "video", src: "/video/videoHome.mp4" },
    { type: "image", src: "/frontend/webImg/18.png" },
  ],
  // Technical Intern
  [
    { type: "image", src: "/frontend/webImg/25.png" },
    { type: "image", src: "/frontend/webImg/2.png" },
    { type: "image", src: "/frontend/webImg/7.png" },
  ],
  // Practicum Assistant
  [
    { type: "video", src: "/video/videoHome.mp4" },
    { type: "image", src: "/frontend/webImg/18.png" },
    { type: "image", src: "/frontend/webImg/25.png" },
  ],
];

// Pre-generated random values for confetti particles
const confettiData = Array.from({ length: 20 }, (_, i) => ({
  size: 4 + (((i * 7) % 10) / 10) * 8,
  yOffset: (((i * 13) % 20) / 20 - 0.5) * 200,
  rotation: ((i * 17) % 36) * 10,
}));

// Confetti particle component
const ConfettiParticle = ({
  index,
  direction,
  isActive,
}: {
  index: number;
  direction: "left" | "right";
  isActive: boolean;
}) => {
  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];
  const color = colors[index % colors.length];
  const { size, yOffset, rotation } = confettiData[index];
  const delay = index * 0.05;

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top: "50%",
        left: direction === "right" ? "0%" : "100%",
      }}
      initial={{
        opacity: 0,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0,
      }}
      animate={
        isActive
          ? {
              opacity: [0, 1, 1, 0],
              x:
                direction === "right"
                  ? [0, 150, 250, 300]
                  : [0, -150, -250, -300],
              y: [0, yOffset * 0.5, yOffset, yOffset * 1.2],
              rotate: [0, rotation, rotation * 2, rotation * 3],
              scale: [0, 1, 1, 0.5],
            }
          : {
              opacity: 0,
              x: 0,
              y: 0,
              scale: 0,
            }
      }
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

// Media Gallery with confetti effect
const MediaGallery = ({
  media,
  direction,
  isActive,
}: {
  media: { type: "image" | "video"; src: string }[];
  direction: "left" | "right";
  isActive: boolean;
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            index={i}
            direction={direction}
            isActive={isActive}
          />
        ))}
      </div>

      {/* Media Grid */}
      <motion.div
        className="grid grid-cols-2 gap-2 h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isActive ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Large media item */}
        <div className="col-span-2 row-span-1 relative rounded-xl overflow-hidden h-32 md:h-40">
          {media[0]?.type === "video" ? (
            <video
              src={media[0].src}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <Image
              src={media[0]?.src || "/frontend/webImg/2.png"}
              alt="Work media"
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Two smaller items */}
        {media.slice(1, 3).map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden h-24 md:h-28"
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={item.src}
                alt="Work media"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function WorkHistory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeItems, setActiveItems] = useState<Set<number>>(new Set());

  // Gabungkan data work now dan history
  const allWorkData: WorkItem[] = [...workNowData, ...workHistoryData];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi untuk setiap work item
      const items = gsap.utils.toArray<HTMLElement>(".work-item");

      items.forEach((item, index) => {
        const isLeft = index % 2 === 0;

        // Set initial state
        gsap.set(item, {
          opacity: 0,
          x: isLeft ? -100 : 100,
        });

        // Animate on scroll
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              setActiveItems((prev) => new Set([...prev, index]));
            },
            onLeaveBack: () => {
              setActiveItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
              });
            },
          },
        });

        // Animate the dot
        const dot = item.querySelector(".timeline-dot");
        if (dot) {
          gsap.set(dot, { scale: 0 });
          gsap.to(dot, {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Animate the connecting line
        const line = item.querySelector(".timeline-line");
        if (line) {
          gsap.set(line, { scaleY: 0, transformOrigin: "top" });
          gsap.to(line, {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      // Animate the main vertical line
      if (timelineRef.current) {
        gsap.set(timelineRef.current, { scaleY: 0, transformOrigin: "top" });
        gsap.to(timelineRef.current, {
          scaleY: 1,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-white dark:bg-black overflow-hidden mt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

      <div ref={containerRef} className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
            Work Experience
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white text-left">
            Work History
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
            A timeline of my career path, showcasing the experiences and skills
            I&apos;ve gained along the way.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Main vertical line */}
          <div
            ref={timelineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"
          />

          {/* Mobile vertical line */}
          <div className="absolute left-4 w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:hidden" />

          {/* Work Items */}
          <div className="space-y-12 md:space-y-0">
            {allWorkData.map((work, index) => (
              <WorkItemComponent
                key={index}
                work={work}
                index={index}
                media={workMediaData[index] || workMediaData[0]}
                isActive={activeItems.has(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkItemComponent({
  work,
  index,
  media,
  isActive,
}: {
  work: WorkItem;
  index: number;
  media: { type: "image" | "video"; src: string }[];
  isActive: boolean;
}) {
  const isLeft = index % 2 === 0;
  const tags = work.techStack || work.highlights || [];

  return (
    <div
      className={`work-item relative flex flex-col md:flex-row items-start md:items-center gap-8 py-8 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content Card */}
      <div
        className={`flex-1 ml-12 md:ml-0 ${
          isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
        }`}
      >
        <div
          className={`relative p-6 rounded-2xl bg-black dark:bg-white border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 group`}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Period badge */}
          <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
            {work.period}
          </span>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors dark:text-black">
            {work.title}
          </h3>

          {/* Company */}
          <p className="text-sm text-white font-medium mb-3 dark:text-black">
            {work.company}
          </p>

          {/* Description */}
          {Array.isArray(work.description) ? (
            <ul
              className={`text-gray-400 text-sm leading-relaxed mb-4 space-y-2 ${
                isLeft ? "md:text-right" : "md:text-left"
              }`}
            >
              {work.description.map((point, i) => (
                <li
                  key={i}
                  className={`flex gap-2 ${
                    isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-blue-400 shrink-0">{i + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {work.description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 ${
                isLeft ? "md:justify-end" : "md:justify-start"
              }`}
            >
              {tags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs text-black dark:text-gray-300 bg-white dark:bg-black rounded-md border border-slate-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Connecting line to dot */}
          <div
            className={`timeline-line hidden md:block absolute top-1/2 w-12 h-[2px] bg-gradient-to-r ${
              isLeft
                ? "right-0 translate-x-full from-slate-700 to-blue-500"
                : "left-0 -translate-x-full from-blue-500 to-slate-700"
            }`}
          />
        </div>
      </div>

      {/* Timeline Dot - Center */}
      <div className="timeline-dot absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-lg shadow-blue-500/50 z-10">
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
      </div>

      {/* Media Gallery - opposite side */}
      <div className="hidden md:block flex-1 relative">
        <div className={`${isLeft ? "pl-12" : "pr-12"}`}>
          <MediaGallery
            media={media}
            direction={isLeft ? "right" : "left"}
            isActive={isActive}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
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
}

export default function WorkHistory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  const allWorkData: WorkItem[] = [...workNowData, ...workHistoryData];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !cardsRef.current)
      return;

    const cards = gsap.utils.toArray<HTMLElement>(".work-card");
    const totalCards = cards.length;
    const totalWidth =
      cardsRef.current.scrollWidth - containerRef.current.offsetWidth;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(cardsRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.min(
              Math.floor(progress * totalCards),
              totalCards - 1
            );
            setActiveIndex(newIndex);
          },
        },
      });

      if (progressLineRef.current) {
        gsap.to(progressLineRef.current, {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
          },
        });
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.4, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 85%",
              end: "left 50%",
              scrub: 1,
            },
          }
        );
        gsap.to(card, {
          opacity: 0.4,
          scale: 0.9,
          ease: "power2.in",
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "right 50%",
            end: "right 15%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [allWorkData.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-white dark:bg-black overflow-hidden h-screen min-h-[500px] max-h-[700px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent dark:from-blue-900/10" />

        <div
          ref={containerRef}
          className="relative h-full flex flex-col justify-between py-4 md:py-6"
        >
          {/* Header */}
          <div className="px-4 md:px-8 lg:px-12">
            <span className="inline-block px-3 py-1 mb-2 text-[10px] md:text-xs font-medium tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-100 dark:bg-blue-500/10 rounded-full">
              Work Experience
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">
              Work History
            </h2>
            <p className="mt-1 md:mt-2 text-gray-500 dark:text-gray-400 text-xs md:text-sm">
              Scroll to explore • Click card for details
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-4 md:px-8 lg:px-12 py-2 md:py-3">
            <div className="relative h-0.5 md:h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressLineRef}
                className="absolute left-0 top-0 h-full bg-black dark:bg-white rounded-full"
                style={{ width: "0%" }}
              />
            </div>
            <div className="relative flex justify-between mt-2 md:mt-3">
              {allWorkData.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index <= activeIndex
                      ? "bg-black dark:bg-white scale-125"
                      : "bg-black/20 dark:bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 min-h-0 overflow-hidden flex items-center">
            <div
              ref={cardsRef}
              className="flex gap-3 md:gap-4 lg:gap-5 px-4 md:px-8 lg:px-12"
              style={{ width: "fit-content" }}
            >
              {allWorkData.map((work, index) => (
                <WorkCard
                  key={index}
                  work={work}
                  index={index}
                  isActive={index === activeIndex}
                  onClick={() => setSelectedWork(work)}
                />
              ))}
              <div className="w-[20vw] shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </>
  );
}

function WorkCard({
  work,
  index,
  isActive,
  onClick,
}: {
  work: WorkItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="work-card relative w-[65vw] sm:w-[45vw] md:w-[240px] lg:w-[280px] shrink-0 cursor-pointer group"
    >
      <div
        className={`relative p-4 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl ${
          isActive
            ? "border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10"
            : "border-gray-200 dark:border-zinc-700 shadow-md"
        }`}
      >
        {/* Index */}
        <span className="absolute top-2 right-3 text-3xl md:text-4xl font-black text-gray-100 dark:text-zinc-800 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="relative z-10">
          <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 mb-2 text-[9px] sm:text-[10px] md:text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full">
            {work.period}
          </span>
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight pr-6 line-clamp-2">
            {work.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] md:text-xs text-blue-600 dark:text-blue-400 font-medium line-clamp-1">
            {work.company}
          </p>
        </div>

        {/* Hover hint */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500">
            Click for details
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkModal({
  work,
  onClose,
}: {
  work: WorkItem | null;
  onClose: () => void;
}) {
  const tags = work?.techStack || work?.highlights || [];

  useEffect(() => {
    if (work) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [work]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                {work.period}
              </span>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight pr-10">
                {work.title}
              </h3>

              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-6">
                {work.company}
              </p>

              {/* Description */}
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </h4>
                {Array.isArray(work.description) ? (
                  <ul className="space-y-3">
                    {work.description.map((desc, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {work.description}
                  </p>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                    Skills & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

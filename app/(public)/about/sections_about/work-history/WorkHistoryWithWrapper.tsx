"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkHistory from "./WorkHistory";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { Highlighter } from "@/components/ui/highlighter";
import { Boxes } from "@/components/ui/background-boxes";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

gsap.registerPlugin(ScrollTrigger);

export default function WorkHistoryWithWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperLineRef = useRef<SVGPathElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the wrapping line around Alfi Nur section
      if (wrapperLineRef.current) {
        const pathLength = wrapperLineRef.current.getTotalLength();

        gsap.set(wrapperLineRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(wrapperLineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: ".alfi-section",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Get bio text based on language
  const bioText = t("alfiNurBio");

  return (
    <div ref={containerRef} className="relative bg-white dark:bg-black">
      {/* Work History Section */}
      <WorkHistory />

      {/* Connecting line from timeline to wrapper */}
      <div className="relative">
        {/* Vertical line connecting to wrapper */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[2px] h-32 bg-linear-to-b from-pink-500 to-red-500" />
      </div>

      {/* Alfi Nur Section with wrapping progress line - Full width background */}
      <section className="alfi-section relative py-20 overflow-hidden">
        {/* Background Boxes - Full width */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Boxes className="opacity-50" />
          {/* Gradient overlay to fade boxes */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent z-10 pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto relative z-20 px-4 md:px-8">
          {/* SVG Wrapper Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{
              left: "-40px",
              top: "-40px",
              width: "calc(100% + 80px)",
              height: "calc(100% + 80px)",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              ref={wrapperLineRef}
              d="M 50 0 L 50 5 L 5 5 L 5 95 L 95 95 L 95 5 L 50 5"
              fill="none"
              stroke="url(#wrapperGradient)"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "3px" }}
            />
            <defs>
              <linearGradient
                id="wrapperGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Content */}
          <div className="relative z-10 space-y-6 p-8 md:p-12">
            <Highlighter action="underline" color="#FF9800">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
                ALFI NUR DANIALIN
              </h2>
            </Highlighter>

            {/* Use key to force re-render when language changes */}
            <TextGenerateEffect
              key={language}
              words={bioText}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            />

            <RoundedButton href="/contact">{t("getInTouchBtn")}</RoundedButton>
          </div>
        </div>
      </section>
    </div>
  );
}

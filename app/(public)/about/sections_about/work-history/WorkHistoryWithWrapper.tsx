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
      <div className="flex justify-center">
        <Highlighter action="underline" color="#FF9800">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
            ALFI NUR DANIALIN
          </h2>
        </Highlighter>
      </div>
      {/* Alfi Nur Section with wrapping progress line - Full width background */}
      <section className="alfi-section relative py-10 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-20 px-4 md:px-8">
          {/* Content */}
          <div className="relative z-10 space-y-6 p-8 md:p-12">
            {/* Use key to force re-render when language changes */}
            <TextGenerateEffect
              key={language}
              words={bioText}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            />

            <RoundedButton href="/contact">{t("getInTouchBtn")}</RoundedButton>
          </div>
        </div>
        {/* Work History Section */}
        <WorkHistory />
      </section>
    </div>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function GsapScrollHeader() {
  const container = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".scroll-row");

      rows.forEach((row, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const moveDistance = 300;

        gsap.fromTo(
          row,
          { x: direction === 1 ? -moveDistance : 0 },
          {
            x: direction === 1 ? 0 : -moveDistance,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      if (shapeRef.current) {
        gsap.to(shapeRef.current, {
          rotation: 360,
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative w-full min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center overflow-hidden py-12 md:py-20"
    >
      {/* Floating Shape */}
      <div
        className="absolute top-1/4 left-1/4 pointer-events-none z-10"
        ref={shapeRef}
      >
        <div className="w-12 h-12 md:w-20 md:h-20 border-4 md:border-[6px] border-[#C4F135] rounded-full opacity-80" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 md:gap-16 z-20">
        {/* Intro */}
        <div className="container mx-auto px-4 md:px-6 mb-6 md:mb-10">
          <div className="inline-block bg-[#C4F135] text-black px-3 py-1 md:px-4 rounded-full text-sm md:text-lg font-bold mb-3 md:mb-4 transform -rotate-2">
            My Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Crafting Digital <span className="text-[#C4F135]">Experiences</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-gray-400 max-w-2xl">
            From web development to UI/UX design, I bring ideas to life with
            clean code and creative solutions.
          </p>
        </div>

        {/* Row 1: Left to Right */}
        <div className="scroll-row w-[200vw] whitespace-nowrap">
          <span className="text-[2rem] sm:text-[3rem] md:text-[5rem] lg:text-[8rem] font-bold leading-none mx-2 md:mx-4">
            Building modern{" "}
            <span className="text-[#C4F135]">web applications</span>
          </span>
        </div>

        {/* Row 2: Right to Left */}
        <div className="scroll-row w-[140vw] whitespace-nowrap flex justify-end">
          <span className="text-[2rem] sm:text-[3rem] md:text-[5rem] lg:text-[8rem] font-bold leading-none mx-2 md:mx-4 flex items-center gap-2 md:gap-6">
            <span className="bg-[#47cf73] text-black px-3 md:px-6 rounded-lg rotate-3 inline-block text-[1.5rem] sm:text-[2rem] md:text-[4rem] lg:text-[6rem]">
              Creative
            </span>
            design solutions
          </span>
        </div>

        {/* Row 3: Left to Right */}
        <div className="scroll-row w-[200vw] whitespace-nowrap">
          <span className="text-[2rem] sm:text-[3rem] md:text-[5rem] lg:text-[8rem] font-bold leading-none mx-2 md:mx-4">
            Full-stack development with{" "}
            <span className="text-outline">Next.js & React</span>
          </span>
        </div>

        {/* Row 4: Right to Left */}
        <div className="scroll-row w-[170vw] whitespace-nowrap flex justify-end">
          <span className="text-[2rem] sm:text-[3rem] md:text-[5rem] lg:text-[8rem] font-bold leading-none mx-2 md:mx-4">
            <span className="bg-[#C4F135] text-black px-2 md:px-4 rounded md:-rotate-2 inline-block mr-2 md:mr-4 text-[1.5rem] sm:text-[2rem] md:text-[4rem] lg:text-[6rem]">
              Pixel-perfect
            </span>
            responsive interfaces
          </span>
        </div>
      </div>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        @media (min-width: 768px) {
          .text-outline {
            -webkit-text-stroke: 2px white;
          }
        }
      `}</style>
    </section>
  );
}

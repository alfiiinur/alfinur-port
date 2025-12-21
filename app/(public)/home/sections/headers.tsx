"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/moving-border";

const roles = [
  "IT Infrastructure",
  "UI/UX Designer",
  "FrontEnd Developer",
  "Graphic Designer",
];

const sentences = [
  "Welcome to my portfolio website!",
  "I'm passionate about crafting innovative and efficient IT solutions that drive success.",
  "Explore my projects, skills, and experiences as you get to know more about my journey in the tech world.",
];

export const SectionHeader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const typingRef = useRef<HTMLParagraphElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // Split text animation on mount
  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      const lines = headingRef.current?.querySelectorAll(".animate-line");
      if (lines) {
        gsap.fromTo(
          lines,
          {
            y: 100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.15,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Rotating roles animation
  useEffect(() => {
    if (!roleRef.current) return;

    const interval = setInterval(() => {
      gsap.to(roleRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          gsap.set(roleRef.current, { y: 30 });
          gsap.to(roleRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Go to next sentence
  const goToNextSentence = useCallback(() => {
    if (typingRef.current) {
      gsap.to(typingRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSentenceIndex((prev) => (prev + 1) % sentences.length);
          setDisplayedText("");
          gsap.set(typingRef.current, { y: 10 });
          gsap.to(typingRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    }
  }, []);

  // Typing animation
  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];
    let charIndex = 0;
    let typingTimeout: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (charIndex <= currentSentence.length) {
        setDisplayedText(currentSentence.slice(0, charIndex));
        charIndex++;
        typingTimeout = setTimeout(typeNextChar, 35);
      } else {
        // Finished typing, wait then go to next
        pauseTimeout = setTimeout(goToNextSentence, 2500);
      }
    };

    // Start typing after a small delay
    const startTimeout = setTimeout(typeNextChar, 300);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(typingTimeout);
      clearTimeout(pauseTimeout);
    };
  }, [sentenceIndex, goToNextSentence]);

  return (
    <div
      ref={containerRef}
      className="relative text-center max-w-7xl mx-auto py-12 px-4 mt-10 overflow-hidden"
    >
      <div className="relative z-10">
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 px-2 py-1 text-xs font-bold tracking-widest uppercase mb-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          HALLO EVERYONE
        </Button>
      </div>

      <h2
        ref={headingRef}
        className="relative z-10 font-anton text-3xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-black dark:text-white"
        style={{ perspective: "1000px" }}
      >
        <span className="animate-line block overflow-hidden">
          <span className="inline-block">I&apos;m Alfi Nur Danialin</span>
        </span>
        <span className="animate-line block overflow-hidden">
          <span className="inline-block">
            a{" "}
            <span className="font-Libre_Baskerville italic text-primary">
              <span ref={roleRef} className="inline-block">
                {roles[currentRoleIndex]}
              </span>
            </span>
          </span>
        </span>
        <span className="animate-line block overflow-hidden">
          <span className="inline-block">
            based in <span className="text-primary">Indonesia.</span>
          </span>
        </span>
      </h2>

      {/* Typing Text Animation */}
      <div className="relative z-10 min-h-16 sm:min-h-14 md:min-h-12 flex items-start justify-center mb-8 px-2 font-poppins font-medium text-lg">
        <p
          ref={typingRef}
          className="font-poppins text-black dark:text-white max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
        >
          {displayedText}
          <span className="inline-block w-0.5 h-4 md:h-5 bg-primary ml-0.5 animate-pulse align-middle" />
        </p>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="group relative bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-medium overflow-hidden transition-transform hover:scale-105">
          <span className="relative overflow-hidden h-5 inline-flex items-center">
            <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
              Let&apos;s Start
            </span>
            <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
              Let&apos;s Start
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

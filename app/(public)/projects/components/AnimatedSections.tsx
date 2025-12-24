"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, Observer);

interface SectionData {
  heading: string;
  bgImage: string;
}

const sectionsData: SectionData[] = [
  {
    heading: "IT Support",
    bgImage: "/frontend/webImg/10.png",
  },
  {
    heading: "Creative Projects",
    bgImage: "/frontend/webImg/7.png",
  },
  {
    heading: "Web Development",
    bgImage: "/frontend/webImg/14.png",
  },
  {
    heading: "UI/UX Design",
    bgImage: "/frontend/webImg/1.png",
  },
  {
    heading: "Keep Explore",
    bgImage: "/frontend/webImg/6.png",
  },
];

// Animated text component with character-by-character animation
const AnimatedHeading = ({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}) => {
  const characters = text.split("");

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.h2
          key={text}
          className="text-4xl md:text-6xl lg:text-8xl font-black text-white text-center leading-tight max-w-[90vw] md:max-w-[1200px] z-10 uppercase tracking-tight"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {characters.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                display: char === " " ? "inline" : "inline-block",
                whiteSpace: char === " " ? "pre" : "normal",
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 100,
                  rotateX: -90,
                  scale: 0.5,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: {
                    duration: 0.8,
                    delay: index * 0.03,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
                exit: {
                  opacity: 0,
                  y: -50,
                  rotateX: 45,
                  scale: 0.8,
                  transition: {
                    duration: 0.4,
                    delay: index * 0.01,
                  },
                },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>
      )}
    </AnimatePresence>
  );
};

export default function AnimatedSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const outerWrappersRef = useRef<HTMLDivElement[]>([]);
  const innerWrappersRef = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const headingsRef = useRef<HTMLHeadingElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const currentIndexRef = useRef(0);
  const isLastSlideRef = useRef(false);
  const isFirstSlideRef = useRef(true);

  const gotoSection = useCallback(
    (index: number, direction: number, allowExit: boolean = false) => {
      const sections = sectionsRef.current;
      const outerWrappers = outerWrappersRef.current;
      const innerWrappers = innerWrappersRef.current;
      const images = imagesRef.current;
      const headings = headingsRef.current;

      if (!sections.length) return false;

      // Check if we're at boundaries
      const isAtEnd = currentIndexRef.current === sections.length - 1;
      const isAtStart = currentIndexRef.current === 0;

      // If at last slide and scrolling down, allow page scroll
      if (isAtEnd && direction === 1 && allowExit) {
        isLastSlideRef.current = true;
        return true; // Signal to allow normal scroll
      }

      // If at first slide and scrolling up, allow page scroll
      if (isAtStart && direction === -1 && allowExit) {
        isFirstSlideRef.current = true;
        return true; // Signal to allow normal scroll
      }

      // Clamp index within bounds (no wrapping)
      if (index < 0 || index >= sections.length) return false;

      animatingRef.current = true;
      isLastSlideRef.current = false;
      isFirstSlideRef.current = false;

      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      const prevIndex = currentIndexRef.current;

      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          animatingRef.current = false;
          // Update boundary flags
          isLastSlideRef.current = index === sections.length - 1;
          isFirstSlideRef.current = index === 0;
        },
      });

      if (prevIndex >= 0 && prevIndex !== index) {
        gsap.set(sections[prevIndex], { zIndex: 0 });
        tl.to(images[prevIndex], { yPercent: -15 * dFactor }).set(
          sections[prevIndex],
          { autoAlpha: 0 }
        );
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        {
          yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
        },
        { yPercent: 0 },
        0
      )
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(
          headings[index],
          {
            autoAlpha: 0,
            yPercent: 150 * dFactor,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
          },
          0.2
        );

      currentIndexRef.current = index;
      setCurrentIndex(index);
      return false;
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const sections = sectionsRef.current;
    const outerWrappers = outerWrappersRef.current;
    const innerWrappers = innerWrappersRef.current;

    // Initial setup
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    // Set first section visible
    if (sections[0]) {
      gsap.set(sections[0], { autoAlpha: 1, zIndex: 1 });
      gsap.set(outerWrappers[0], { yPercent: 0 });
      gsap.set(innerWrappers[0], { yPercent: 0 });
      gsap.set(imagesRef.current[0], { yPercent: 0 });
      gsap.set(headingsRef.current[0], { autoAlpha: 1, yPercent: 0 });
    }

    // Create ScrollTrigger to pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: `+=${window.innerHeight * sectionsData.length}`,
      pin: containerRef.current,
      pinSpacing: true,
      onUpdate: (self) => {
        // Calculate which section should be active based on scroll progress
        const progress = self.progress;
        const targetIndex = Math.min(
          Math.floor(progress * sectionsData.length),
          sectionsData.length - 1
        );

        if (targetIndex !== currentIndexRef.current && !animatingRef.current) {
          const direction = targetIndex > currentIndexRef.current ? 1 : -1;
          gotoSection(targetIndex, direction);
        }
      },
    });

    const currentObserver = observerRef.current;

    return () => {
      pinTrigger.kill();
      if (currentObserver) currentObserver.kill();
    };
  }, [gotoSection]);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-20 text-white uppercase tracking-[0.5em] text-xs md:text-sm">
          <div>Animated Sections</div>
          <div className="flex items-center gap-4">
            <span className="text-white/50">
              {currentIndex + 1} / {sectionsData.length}
            </span>
          </div>
        </header>

        {/* Sections */}
        {sectionsData.map((section, index) => (
          <section
            key={index}
            ref={(el) => {
              if (el) sectionsRef.current[index] = el;
            }}
            className="absolute top-0 left-0 h-full w-full invisible"
            style={{ zIndex: 0 }}
          >
            <div
              ref={(el) => {
                if (el) outerWrappersRef.current[index] = el;
              }}
              className="outer w-full h-full overflow-hidden"
            >
              <div
                ref={(el) => {
                  if (el) innerWrappersRef.current[index] = el;
                }}
                className="inner w-full h-full overflow-hidden"
              >
                <div
                  ref={(el) => {
                    if (el) imagesRef.current[index] = el;
                  }}
                  className="bg absolute inset-0 flex items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%), url(${section.bgImage})`,
                  }}
                >
                  <div
                    ref={(el) => {
                      if (el) headingsRef.current[index] = el;
                    }}
                    className="z-10"
                  >
                    <AnimatedHeading
                      text={section.heading}
                      isActive={currentIndex === index}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Progress bar */}
        <div className="absolute bottom-8 left-8 right-8 z-50">
          <div className="flex items-center gap-2 mb-2">
            {sectionsData.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentIndex ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-white/50 text-xs uppercase tracking-widest">
            <span>Scroll to navigate</span>
            <span>
              {currentIndex + 1} / {sectionsData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

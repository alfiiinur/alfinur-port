"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SparklesCore } from "@/components/ui/sparkles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Design {
  id: string;
  title: string;
  image: string;
}

interface DesignFooterProps {
  designs: Design[];
}

const DEFAULT_COVER = "/default-cover.png";

// Draggable Card Component
function DraggableCard({
  design,
  initialPosition,
  onBringToFront,
  zIndex,
}: {
  design: Design;
  index: number;
  initialPosition: { x: number; y: number; rotate: number };
  onBringToFront: (id: string) => void;
  zIndex: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const dragStart = useRef({ x: 0, y: 0 });
  const cardStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      cardStart.current = { x: position.x, y: position.y };
      onBringToFront(design.id);
    },
    [position.x, position.y, design.id, onBringToFront]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      cardStart.current = { x: position.x, y: position.y };
      onBringToFront(design.id);
    },
    [position.x, position.y, design.id, onBringToFront]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      setPosition((prev) => ({
        ...prev,
        x: cardStart.current.x + deltaX,
        y: Math.min(Math.max(cardStart.current.y + deltaY, -150), 150),
      }));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.current.x;
      const deltaY = touch.clientY - dragStart.current.y;
      setPosition((prev) => ({
        ...prev,
        x: cardStart.current.x + deltaX,
        y: Math.min(Math.max(cardStart.current.y + deltaY, -150), 150),
      }));
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const handleMouseEnter = () => {
    if (!isDragging && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.08,
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
    onBringToFront(design.id);
  };

  const handleMouseLeave = () => {
    if (!isDragging && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 15px 40px -10px rgba(0, 0, 0, 0.4)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)`,
        zIndex: zIndex,
        transition: isDragging ? "none" : "transform 0.15s ease-out",
      }}
    >
      <div className="relative w-28 h-40 sm:w-36 sm:h-48 md:w-44 md:h-56 lg:w-52 lg:h-64 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <Image
          src={design.image || DEFAULT_COVER}
          alt={design.title}
          fill
          className="object-cover pointer-events-none"
          draggable={false}
        />
        {isDragging && <div className="absolute inset-0 bg-black/20" />}
      </div>
    </div>
  );
}

// Animated Marquee Text - Simple version for Row 1
function AnimatedMarqueeText({
  designs,
  direction = "left",
  rowIndex = 0,
}: {
  designs: Design[];
  direction?: "left" | "right";
  rowIndex?: number;
}) {
  const text = "SHOWREEL DESIGN ";

  // Get 4 random images for this row
  const rowImages = designs.slice(rowIndex * 4, rowIndex * 4 + 4);

  return (
    <div
      className="flex whitespace-nowrap"
      style={{
        animation: `${
          direction === "left" ? "marqueeLeft" : "marqueeRight"
        } 20s linear infinite`,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((repeatIndex) => (
        <div
          key={repeatIndex}
          className="flex items-center gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8 shrink-0"
        >
          <span
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground dark:text-white"
            style={{
              WebkitTextStroke:
                repeatIndex % 2 === 0 ? "1.5px currentColor" : "none",
              WebkitTextFillColor:
                repeatIndex % 2 === 0 ? "transparent" : "currentColor",
            }}
          >
            {text}
          </span>
          {/* Design image */}
          {rowImages[repeatIndex % rowImages.length] && (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden shadow-lg shrink-0 ring-2 ring-white/20 dark:ring-white/30">
              <Image
                src={
                  rowImages[repeatIndex % rowImages.length]?.image ||
                  DEFAULT_COVER
                }
                alt="Design"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Animated Marquee with GSAP Split Text - Bounce/Flip effect for Row 2
function AnimatedMarqueeWithSplit({
  designs,
  direction = "right",
  rowIndex = 1,
}: {
  designs: Design[];
  direction?: "left" | "right";
  rowIndex?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const text = "CREATIVE PORTFOLIO ";

  const rowImages = designs.slice(rowIndex * 4, rowIndex * 4 + 4);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;

    // Initial entrance animation - bounce/flip from random positions
    gsap.fromTo(
      chars,
      {
        y: () => gsap.utils.random(-120, 120),
        rotationX: () => gsap.utils.random(-180, 180),
        rotationY: () => gsap.utils.random(-90, 90),
        opacity: 0,
        scale: 0.3,
      },
      {
        y: 0,
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.015,
          from: "random",
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    // Continuous bounce animation for each character
    chars.forEach((char, i) => {
      gsap.to(char, {
        y: gsap.utils.random(-8, 8),
        rotationX: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(1.5, 2.5),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.03,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  let charIndex = 0;

  return (
    <div
      ref={containerRef}
      className="flex whitespace-nowrap"
      style={{
        animation: `${
          direction === "left" ? "marqueeLeft" : "marqueeRight"
        } 22s linear infinite`,
        perspective: "1000px",
      }}
    >
      {[0, 1, 2, 3, 4].map((repeatIndex) => (
        <div
          key={repeatIndex}
          className="flex items-center gap-3 md:gap-5 lg:gap-6 px-3 md:px-5 lg:px-6 shrink-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {text.split("").map((char, idx) => {
            const currentCharIndex = charIndex++;
            return (
              <span
                key={`${repeatIndex}-${idx}`}
                ref={(el) => {
                  charsRef.current[currentCharIndex] = el;
                }}
                className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground dark:text-white"
                style={{
                  WebkitTextStroke:
                    repeatIndex % 2 === 0 ? "1.5px currentColor" : "none",
                  WebkitTextFillColor:
                    repeatIndex % 2 === 0 ? "transparent" : "currentColor",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
          {/* Design image */}
          {rowImages[repeatIndex % rowImages.length] && (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden shadow-lg shrink-0 ring-2 ring-white/20 dark:ring-white/30">
              <Image
                src={
                  rowImages[repeatIndex % rowImages.length]?.image ||
                  DEFAULT_COVER
                }
                alt="Design"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Main Footer Component
export default function DesignFooter({ designs }: DesignFooterProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cardZIndices, setCardZIndices] = useState<Record<string, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(10);

  const cardDesigns = designs.slice(0, 8);

  // Scattered positions for cards
  const positions = [
    { x: -280, y: 10, rotate: -12 },
    { x: -140, y: -25, rotate: 6 },
    { x: 0, y: 20, rotate: -3 },
    { x: 140, y: -15, rotate: 9 },
    { x: 280, y: 25, rotate: -6 },
    { x: -200, y: 35, rotate: 8 },
    { x: 70, y: -30, rotate: -10 },
    { x: 200, y: 5, rotate: 4 },
  ];

  const bringToFront = useCallback(
    (id: string) => {
      setMaxZIndex((prev) => prev + 1);
      setCardZIndices((prev) => ({ ...prev, [id]: maxZIndex + 1 }));
    },
    [maxZIndex]
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] max-h-[900px] bg-background dark:bg-black overflow-hidden flex flex-col"
    >
      {/* Sparkles Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="design-footer-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.5}
          particleDensity={80}
          particleColor="#4AE3B5"
          speed={1}
          className="w-full h-full"
        />
      </div>

      {/* Title with Lamp Effect */}
      <div className="pt-4 md:pt-6 text-center z-20 relative">
        {/* Lamp Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] md:w-[40%] h-[2px] bg-linear-to-r from-transparent via-[#4AE3B5] to-transparent" />

        {/* Lamp Glow Effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] md:w-[35%] h-20 md:h-28"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(74, 227, 181, 0.3) 0%, rgba(74, 227, 181, 0.1) 40%, transparent 70%)",
          }}
        />

        {/* Title - Static, Uppercase, Bold */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#4AE3B5] uppercase tracking-wider mt-2 md:mt-3 ">
          DESIGN FOOTER
        </h2>
      </div>

      {/* Marquee Text Row 1 - Left direction */}
      <div className="absolute top-[20%] md:top-[25%] left-0 w-full overflow-hidden z-10">
        <AnimatedMarqueeText designs={designs} direction="left" rowIndex={0} />
      </div>

      {/* Marquee Text Row 2 - Right direction with GSAP Split Animation */}
      <div className="absolute top-[30%] md:top-[33%] left-0 w-full overflow-hidden z-10">
        <AnimatedMarqueeWithSplit
          designs={designs}
          direction="right"
          rowIndex={1}
        />
      </div>

      {/* Draggable Cards - Bottom half */}
      <div className="absolute bottom-0 left-0 right-0 h-[48%] flex items-center justify-center z-20">
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          {cardDesigns.map((design, index) => (
            <DraggableCard
              key={design.id}
              design={design}
              index={index}
              initialPosition={positions[index] || { x: 0, y: 0, rotate: 0 }}
              onBringToFront={bringToFront}
              zIndex={cardZIndices[design.id] || index + 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background/80 dark:from-black/80 to-transparent pointer-events-none z-30" />
    </section>
  );
}

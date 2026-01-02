"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface HoverArrowLabelProps {
  children: React.ReactNode;
  label: string;
  arrowDirection?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  arrowColor?: string;
  className?: string;
}

export default function HoverArrowLabel({
  children,
  label,
  arrowDirection = "top-right",
  arrowColor = "#FF6B35",
  className = "",
}: HoverArrowLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const arrowHeadRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Get arrow path based on direction
  // Arrow starts from edge of image and curves outward
  const getArrowConfig = () => {
    switch (arrowDirection) {
      case "top-right":
        return {
          // Arrow starts from right edge, curves up and to the right
          mainPath: "M 0 60 C 30 50, 60 30, 90 15 C 100 10, 110 8, 120 10",
          arrowHead: "M 112 3 L 122 10 L 112 17",
          viewBox: "0 0 130 70",
          // SVG positioned at right edge of container, extending outward
          svgPosition: "absolute top-0 left-full w-32 h-20 -ml-2",
          // Text positioned above the arrow tip
          textPosition: "absolute -top-8 left-full ml-24",
        };
      case "top-left":
        return {
          mainPath: "M 130 60 C 100 50, 70 30, 40 15 C 30 10, 20 8, 10 10",
          arrowHead: "M 18 3 L 8 10 L 18 17",
          viewBox: "0 0 130 70",
          svgPosition: "absolute top-0 right-full w-32 h-20 -mr-2",
          textPosition: "absolute -top-8 right-full mr-24",
        };
      case "bottom-right":
        return {
          mainPath: "M 0 10 C 30 20, 60 40, 90 55 C 100 60, 110 62, 120 60",
          arrowHead: "M 112 53 L 122 60 L 112 67",
          viewBox: "0 0 130 70",
          svgPosition: "absolute bottom-0 left-full w-32 h-20 -ml-2",
          textPosition: "absolute -bottom-8 left-full ml-24",
        };
      case "bottom-left":
        return {
          mainPath: "M 130 10 C 100 20, 70 40, 40 55 C 30 60, 20 62, 10 60",
          arrowHead: "M 18 53 L 8 60 L 18 67",
          viewBox: "0 0 130 70",
          svgPosition: "absolute bottom-0 right-full w-32 h-20 -mr-2",
          textPosition: "absolute -bottom-8 right-full mr-24",
        };
      default:
        return {
          mainPath: "M 0 60 C 30 50, 60 30, 90 15 C 100 10, 110 8, 120 10",
          arrowHead: "M 112 3 L 122 10 L 112 17",
          viewBox: "0 0 130 70",
          svgPosition: "absolute top-0 left-full w-32 h-20 -ml-2",
          textPosition: "absolute -top-8 left-full ml-24",
        };
    }
  };

  const config = getArrowConfig();

  // Typing animation with cursor blink
  const typeText = useCallback(() => {
    let currentIndex = 0;
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (currentIndex < label.length) {
        setDisplayText(label.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [label]);

  // GSAP animations
  useEffect(() => {
    if (
      !pathRef.current ||
      !svgRef.current ||
      !textRef.current ||
      !arrowHeadRef.current
    )
      return;

    const path = pathRef.current;
    const arrowHead = arrowHeadRef.current;
    const svg = svgRef.current;
    const text = textRef.current;
    const cursor = cursorRef.current;
    const pathLength = path.getTotalLength();

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Set initial state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(arrowHead, { opacity: 0, scale: 0.5 });
    gsap.set(svg, { opacity: 0 });
    gsap.set(text, { opacity: 0, y: 15, scale: 0.9 });

    if (isHovered) {
      // Create timeline for hover in
      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(svg, {
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
      })
        .to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.05"
        )
        .to(
          arrowHead,
          {
            opacity: 1,
            scale: 1,
            duration: 0.2,
            ease: "back.out(2)",
          },
          "-=0.15"
        )
        .to(
          text,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.5)",
            onStart: typeText,
          },
          "-=0.2"
        );

      // Cursor blink animation
      if (cursor) {
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    } else {
      // Create timeline for hover out
      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(text, {
        opacity: 0,
        y: 10,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
      })
        .to(
          arrowHead,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.15,
            ease: "power2.in",
          },
          "-=0.1"
        )
        .to(
          path,
          {
            strokeDashoffset: pathLength,
            duration: 0.35,
            ease: "power2.in",
          },
          "-=0.1"
        )
        .to(
          svg,
          {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in",
          },
          "-=0.15"
        );

      setDisplayText("");
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isHovered, typeText]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Arrow SVG - positioned at edge of container */}
      <svg
        ref={svgRef}
        viewBox={config.viewBox}
        className={`${config.svgPosition} pointer-events-none z-20`}
        fill="none"
        style={{ opacity: 0 }}
      >
        {/* Main curved path */}
        <path
          ref={pathRef}
          d={config.mainPath}
          stroke={arrowColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Arrow head */}
        <path
          ref={arrowHeadRef}
          d={config.arrowHead}
          stroke={arrowColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Label Text with typing effect - positioned above arrow tip */}
      <span
        ref={textRef}
        className={`${config.textPosition} whitespace-nowrap px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-full z-20 pointer-events-none shadow-lg`}
        style={{ opacity: 0 }}
      >
        {displayText}
        <span ref={cursorRef} className="ml-0.5 text-[#C4F135]">
          |
        </span>
      </span>
    </div>
  );
}

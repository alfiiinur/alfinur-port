"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import {
  DecorativeShapes,
  shapePresets,
} from "@/components/public/shared/decorative";

gsap.registerPlugin(ScrollTrigger);

// Helper to get responsive position
type ResponsiveValue = { mobile: number; tablet: number; desktop: number };
const getResponsiveValue = (
  value: ResponsiveValue,
  breakpoint: "mobile" | "tablet" | "desktop"
) => {
  return value[breakpoint];
};

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

interface ProjectHeroProps {
  projects?: Project[];
}

// Floating text - responsive positioning to prevent overlap
const floatingTexts = [
  // Desktop: horizontal spread, Mobile: vertical stack
  {
    text: "Building modern",
    x: { mobile: 5, tablet: 3, desktop: 3 },
    y: { mobile: 3, tablet: 5, desktop: 5 },
    row: 1,
  },
  {
    text: "web applications",
    x: { mobile: 5, tablet: 30, desktop: 30 },
    y: { mobile: 10, tablet: 5, desktop: 5 },
    row: 1,
    highlight: true,
    color: "#4ade80",
  },
  {
    text: "with passion",
    x: { mobile: 5, tablet: 55, desktop: 58 },
    y: { mobile: 17, tablet: 5, desktop: 5 },
    row: 1,
  },
  {
    text: "& precision",
    x: { mobile: 50, tablet: 78, desktop: 82 },
    y: { mobile: 17, tablet: 5, desktop: 5 },
    row: 1,
    highlight: true,
    color: "#d4f542",
  },
];

// Use preset decorative shapes
const decorativeShapes = shapePresets.projectHero;

// Helper function to check if URL is a video
function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

export default function ProjectHero({ projects = [] }: ProjectHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const floatingTextRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const rotateTextRef = useRef<HTMLDivElement>(null);
  const projectCardsRef = useRef<HTMLDivElement>(null);

  // Track current breakpoint for responsive positioning
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  // Update breakpoint on resize
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!carouselRef.current || !trackRef.current) return;

      // Much longer scroll (3x)
      const totalWidth = trackRef.current.scrollWidth - window.innerWidth;
      const scrollLength = totalWidth + window.innerWidth * 2.5;

      // Calculate when last card appears (for path completion)
      const lastCardProgress = 0.05 + (Math.min(projects.length, 8) - 1) * 0.02;
      const pathEndScroll =
        scrollLength * Math.min(lastCardProgress + 0.15, 0.85);

      // Setup SVG path animation - completes when reaching last card
      if (pathRef.current) {
        const path = pathRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top top",
            end: () => `+=${pathEndScroll}`,
            scrub: 2,
          },
        });
      }

      // Main horizontal scroll for track
      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: carouselRef.current,
          start: "top top",
          end: () => `+=${scrollLength}`,
          pin: true,
          scrub: 2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progressBar = document.querySelector(".progress-bar");
            if (progressBar) {
              (progressBar as HTMLElement).style.width = `${
                self.progress * 100
              }%`;
            }
          },
        },
      });

      // SVG follows scroll
      if (svgRef.current) {
        gsap.to(svgRef.current, {
          x: -totalWidth * 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 2,
          },
        });
      }

      // Floating texts - Row 1 stays
      const floatingTextElements =
        floatingTextRef.current?.querySelectorAll(".floating-text");
      floatingTextElements?.forEach((el) => {
        // Fade in animation
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top top",
              end: () => `top+=${scrollLength * 0.15} top`,
              scrub: 1,
            },
          }
        );
      });

      // Project cards - all positioned at bottom, below path curve
      if (projectCardsRef.current) {
        const cards = projectCardsRef.current.querySelectorAll(".project-card");

        // Animate entire container horizontally
        gsap.to(projectCardsRef.current, {
          x: -totalWidth * 0.8,
          ease: "none",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 2,
          },
        });

        // Individual card animations - ALL from bottom
        cards.forEach((card, index) => {
          // Different entry animations - all from bottom with variations
          const entryAnimations = [
            { x: -80, y: 120, rotation: 8 }, // from bottom-left
            { x: 0, y: 150, rotation: 0 }, // from bottom center
            { x: 80, y: 120, rotation: -8 }, // from bottom-right
            { x: -60, y: 140, rotation: 6 }, // from bottom-left
            { x: 60, y: 130, rotation: -6 }, // from bottom-right
            { x: 0, y: 160, rotation: 0 }, // from bottom center
            { x: -70, y: 135, rotation: 7 }, // from bottom-left
            { x: 70, y: 125, rotation: -7 }, // from bottom-right
          ];

          const entry = entryAnimations[index % 8];

          // Staggered fade in from bottom
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: entry.x,
              y: entry.y,
              scale: 0.5,
              rotation: entry.rotation,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: carouselRef.current,
                start: "top top",
                end: () => `top+=${scrollLength * (0.05 + index * 0.02)} top`,
                scrub: 1.2,
              },
            }
          );

          // Subtle floating animation - gentle up/down movement
          gsap.to(card, {
            y: `+=${15 + (index % 3) * 8}`,
            rotation: (index % 2 === 0 ? 1 : -1) * 2,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top top",
              end: () => `+=${scrollLength}`,
              scrub: 2.5 + index * 0.1,
            },
          });
        });
      }

      // Shapes animation - parallax, rotation, scale
      const shapeElements = shapesRef.current?.querySelectorAll(".deco-shape");
      shapeElements?.forEach((el, index) => {
        const speed = 0.2 + (index % 4) * 0.15;
        const rotateAmount = (index % 2 === 0 ? 1 : -1) * (60 + index * 20);

        // Horizontal movement with parallax
        gsap.to(el, {
          x: -totalWidth * speed,
          rotation: `+=${rotateAmount}`,
          ease: "none",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 2 + index * 0.3,
          },
        });

        // Scale breathing effect
        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0.6 },
          {
            scale: 1.1,
            opacity: 1,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top top",
              end: () => `top+=${scrollLength * 0.5} top`,
              scrub: 1,
            },
          }
        );
      });

      // Rotate text at the end
      if (rotateTextRef.current) {
        gsap.fromTo(
          rotateTextRef.current,
          { rotation: 0, opacity: 0, x: 150, scale: 0.8 },
          {
            rotation: -90,
            opacity: 1,
            x: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: () => `top+=${scrollLength * 0.5} top`,
              end: () => `top+=${scrollLength * 0.8} top`,
              scrub: 2,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  const wordsProject =
    " Below are a few select projects that showcase my skills across various areas of design and development.";

  // Dynamic path based on number of projects (max 8)
  const maxProjects = Math.min(projects.length, 8);

  const generatePath = () => {
    if (maxProjects === 0) return "M 0 400 L 100 400";

    // Much wider segment width - 900 units per project for more spacing
    const segmentWidth = 900;

    // Wave variations for organic look
    const waveVariations = [
      { cp1y: 180, cp2y: 520, endy: 380 },
      { cp1y: 120, cp2y: 480, endy: 420 },
      { cp1y: 200, cp2y: 550, endy: 350 },
      { cp1y: 150, cp2y: 500, endy: 400 },
      { cp1y: 170, cp2y: 530, endy: 370 },
      { cp1y: 130, cp2y: 490, endy: 410 },
      { cp1y: 190, cp2y: 540, endy: 360 },
      { cp1y: 160, cp2y: 510, endy: 390 },
    ];

    let path = "M -200 400";

    for (let i = 0; i < maxProjects; i++) {
      const baseX = i * segmentWidth;
      const endX = (i + 1) * segmentWidth;
      const variation = waveVariations[i % 8];

      if (i % 2 === 0) {
        // Wave down then up with variation
        path += ` C ${baseX + 300} ${variation.cp1y}, ${baseX + 700} ${
          variation.cp2y
        }, ${endX} ${variation.endy}`;
      } else {
        // Wave up then down with variation
        path += ` S ${baseX + 600} ${variation.cp1y - 50}, ${endX} ${
          variation.endy + 50
        }`;
      }
    }

    return path;
  };

  // Calculate viewBox width based on projects - much wider now
  const svgViewBoxWidth = maxProjects * 900 + 500;

  // Render project card
  const renderProjectCard = (project: Project, index: number) => {
    const thumbnailIsVideo = isVideo(project.thumbnail);

    return (
      <Link
        href={`/projects/${project.slug}`}
        className="block w-[260px] h-[180px] md:w-[300px] md:h-[200px] rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105"
      >
        {/* Thumbnail */}
        <div className="absolute inset-0">
          {thumbnailIsVideo ? (
            <video
              src={project.thumbnail}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Video indicator */}
        {thumbnailIsVideo && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs z-10">
            <Play className="w-3 h-3" />
            Video
          </div>
        )}

        {/* Index badge */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold z-10">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <span className="text-xs font-medium uppercase tracking-wider text-green-400 mb-1 block">
            {project.category}
          </span>
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2 group-hover:text-green-400 transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Hover border effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 rounded-2xl transition-colors" />
      </Link>
    );
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-black dark:bg-black dark:text-white"
    >
      {/* Hero Heading - No navbar so less top padding */}
      <section className="pt-16 pb-8 px-4 md:px-8 relative overflow-hidden">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.15}
          duration={3}
          className="inset-0 h-full w-full fill-black/10 stroke-black/10 dark:fill-white/10 dark:stroke-white/10 mask-[linear-gradient(to_bottom,white_20%,transparent_80%)]"
        />

        <div className="max-w-9xl mx-auto relative z-10">
          <Highlighter action="underline" color="#4CAF50">
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-black text-black dark:text-white uppercase leading-[0.85] tracking-tighter text-center">
              Creative Projects
            </h1>
          </Highlighter>

          <TextGenerateEffect
            words={wordsProject}
            className="text-4xl md:text-6xl mt-10 md:mt-5 leading-[1.2]"
          />
        </div>
      </section>

      {/* Horizontal Scroll Carousel */}
      <div ref={carouselRef} className="relative h-screen overflow-hidden">
        {/* Track for scroll width calculation */}
        <div
          ref={trackRef}
          className="absolute inset-0 w-[600vw] pointer-events-none"
        />

        {/* Decorative Shapes Layer - Hidden on mobile for cleaner look */}
        <div ref={shapesRef} className="hidden sm:block">
          <DecorativeShapes shapes={decorativeShapes} />
        </div>

        {/* Floating Text Layer - Row 1 - Responsive positioning */}
        <div
          ref={floatingTextRef}
          className="absolute inset-0 pointer-events-none z-5 overflow-visible"
        >
          {floatingTexts.map((item, index) => (
            <div
              key={index}
              data-row={item.row}
              className="floating-text absolute text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black whitespace-nowrap"
              style={{
                left: `${getResponsiveValue(item.x, breakpoint)}%`,
                top: `${getResponsiveValue(item.y, breakpoint)}%`,
                opacity: 0,
              }}
            >
              {item.highlight ? (
                <span style={{ color: item.color }}>{item.text}</span>
              ) : (
                <span className="text-black dark:text-white">{item.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Project Cards Row - Row 2 (replaces floating text row 2) */}
        {/* Cards now positioned along the path curve */}
        {projects.length > 0 && (
          <div
            ref={projectCardsRef}
            className="absolute inset-0 z-10 overflow-visible pointer-events-none"
          >
            {projects.slice(0, 8).map((project, index) => {
              // ALL cards positioned at BOTTOM area only (below the path curve)
              // Cards appear when path curves downward
              const verticalPositions = [
                { top: "55%" }, // Card 1
                { top: "58%" }, // Card 2
                { top: "54%" }, // Card 3
                { top: "60%" }, // Card 4
                { top: "56%" }, // Card 5
                { top: "58%" }, // Card 6
                { top: "62%" }, // Card 7
                { top: "57%" }, // Card 8
              ];

              // MUCH wider horizontal spacing - 45% gap between each card for better separation
              const horizontalPositions = [
                5, // Card 1
                50, // Card 2
                95, // Card 3
                140, // Card 4
                185, // Card 5
                230, // Card 6
                275, // Card 7
                320, // Card 8
              ];

              const pos = verticalPositions[index % 8];
              const leftPos = horizontalPositions[index % 8];

              return (
                <div
                  key={project.id}
                  className="project-card absolute pointer-events-auto"
                  style={{
                    left: `${leftPos}%`,
                    top: pos.top,
                    opacity: 0,
                  }}
                >
                  {renderProjectCard(project, index)}
                </div>
              );
            })}

            {/* Rotate text at the end */}
            <div
              ref={rotateTextRef}
              className="absolute right-[5%] top-[40%] text-2xl md:text-3xl lg:text-4xl font-black text-green-500 whitespace-nowrap origin-center pointer-events-auto"
              style={{ opacity: 0 }}
            >
              MORE PROJECTS →
            </div>
          </div>
        )}

        {/* SVG Path Animation */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-[600vw] h-full pointer-events-none z-1"
          viewBox={`0 0 ${svgViewBoxWidth} 800`}
          preserveAspectRatio="xMinYMid slice"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="20%" stopColor="#4ade80" />
              <stop offset="40%" stopColor="#d4f542" />
              <stop offset="60%" stopColor="#4ade80" />
              <stop offset="80%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          {/* Background path */}
          <path
            d={generatePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-800"
            strokeLinecap="round"
          />

          {/* Animated path */}
          <path
            ref={pathRef}
            d={generatePath()}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Decorative dots - one per project card with random positions */}
          {Array.from({ length: maxProjects }, (_, i) => {
            const dotOffsets = [20, -30, 45, -15, 35, -40, 25, -20];
            const dotSizes = [5, 7, 6, 8, 5, 7, 6, 8];
            return (
              <g key={i}>
                <circle
                  cx={(i + 1) * 900 - 450 + dotOffsets[i % 8]}
                  cy={380 + Math.sin(i * 1.2) * 60 + dotOffsets[i % 8]}
                  r={dotSizes[i % 8]}
                  className="fill-green-500"
                  opacity={0.4 + (i % 4) * 0.15}
                />
              </g>
            );
          })}
        </svg>

        {/* Progress bar */}
        {/* <div className="absolute bottom-8 left-8 right-8 z-20">
          <div className="h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-green-500 via-green-400 to-green-500 w-0 progress-bar" />
          </div>
        </div> */}

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll to explore
          </span>
          <div className="w-px h-10 bg-current animate-pulse" />
        </div> */}
      </div>
    </div>
  );
}

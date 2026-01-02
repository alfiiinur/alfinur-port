"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Decorative shapes - mix of SVG paths and images
const decorativeShapes = [
  { type: "flower", x: 8, y: 15, size: 70, color: "#ec4899", id: "flower1" },
  { type: "diamond", x: 92, y: 10, size: 30, color: "#f97316", id: "diamond1" },
  { type: "dot", x: 48, y: 42, size: 12, color: "#a855f7", id: "dot1" },
  { type: "circle", x: 5, y: 80, size: 100, color: "#14b8a6", id: "circle1" },
  { type: "ring", x: 90, y: 75, size: 25, color: "#22d3ee", id: "ring1" },
  { type: "star", x: 75, y: 20, size: 35, color: "#fbbf24", id: "star1" },
  { type: "wave", x: 20, y: 60, size: 80, color: "#4ade80", id: "wave1" },
];

// Floating text items that fade in/out during scroll
const floatingTexts = [
  { text: "Development", x: 15, y: 25, size: "lg", delay: 0.1 },
  { text: "Design", x: 70, y: 30, size: "md", delay: 0.2 },
  { text: "Innovation", x: 40, y: 70, size: "sm", delay: 0.3 },
  { text: "Code", x: 80, y: 65, size: "md", delay: 0.15 },
  { text: "Creative", x: 25, y: 80, size: "sm", delay: 0.25 },
];

// Main scroll text content
const scrollTexts = [
  {
    row: 1,
    items: [
      { text: "Building modern", type: "normal" },
      { text: "web applications", type: "highlight", color: "#4ade80" },
      { text: "with passion", type: "normal" },
      { text: "Creative", type: "badge", bgColor: "#86efac" },
      { text: "design solutions", type: "normal" },
      { text: "that inspire", type: "highlight", color: "#4ade80" },
    ],
  },
  {
    row: 2,
    items: [
      { text: "Full-stack development", type: "normal" },
      { text: "Next.js & React", type: "outline" },
      { text: "Pixel-perfect", type: "badge", bgColor: "#d4f542" },
      { text: "responsive interfaces", type: "normal" },
      { text: "Innovation", type: "badge", bgColor: "#86efac" },
      { text: "& Excellence", type: "highlight", color: "#22d3ee" },
    ],
  },
];

export default function GsapScrollHeader() {
  const container = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const rotateTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      const scrollLength = window.innerHeight * 3.5;

      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: () => `+=${scrollLength}`,
        pin: true,
        anticipatePin: 1,
      });

      // Row 1: Scroll left to right
      if (row1Ref.current) {
        const row1Width = row1Ref.current.scrollWidth;
        gsap.fromTo(
          row1Ref.current,
          { x: -row1Width * 0.35 },
          {
            x: 100,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: () => `+=${scrollLength}`,
              scrub: 1.5,
            },
          }
        );
      }

      // Row 2: Scroll right to left
      if (row2Ref.current) {
        const row2Width = row2Ref.current.scrollWidth;
        gsap.fromTo(
          row2Ref.current,
          { x: 100 },
          {
            x: -row2Width * 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: () => `+=${scrollLength}`,
              scrub: 1.5,
            },
          }
        );
      }

      // Floating texts - fade in and fade out
      const floatingElements =
        floatingRef.current?.querySelectorAll(".floating-text");
      floatingElements?.forEach((el, index) => {
        const startProgress = 0.1 + index * 0.08;
        const midProgress = startProgress + 0.2;
        const endProgress = midProgress + 0.25;

        // Fade in
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 0.15,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container.current,
              start: () => `top+=${scrollLength * startProgress} top`,
              end: () => `top+=${scrollLength * midProgress} top`,
              scrub: 1,
            },
          }
        );

        // Fade out
        gsap.to(el, {
          opacity: 0,
          y: -20,
          scale: 0.9,
          ease: "power2.in",
          scrollTrigger: {
            trigger: container.current,
            start: () => `top+=${scrollLength * midProgress} top`,
            end: () => `top+=${scrollLength * endProgress} top`,
            scrub: 1,
          },
        });
      });

      // Rotate text at the end - 90 degree rotation
      if (rotateTextRef.current) {
        gsap.fromTo(
          rotateTextRef.current,
          { rotation: 0, opacity: 0, scale: 0.5 },
          {
            rotation: -90,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container.current,
              start: () => `top+=${scrollLength * 0.5} top`,
              end: () => `top+=${scrollLength * 0.85} top`,
              scrub: 1.5,
            },
          }
        );
      }

      // Path animation
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 1.5,
          },
        });
      }

      // SVG follows scroll
      if (svgRef.current) {
        gsap.to(svgRef.current, {
          x: -window.innerWidth * 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 2,
          },
        });
      }

      // Shape animations with parallax and rotation
      const shapeElements = shapesRef.current?.querySelectorAll(".deco-shape");
      shapeElements?.forEach((el, index) => {
        const speed = 0.1 + (index % 4) * 0.12;
        const rotateAmount = (index % 2 === 0 ? 1 : -1) * (120 + index * 40);
        const yMove = (index % 2 === 0 ? -1 : 1) * (30 + index * 15);

        gsap.to(el, {
          x: -window.innerWidth * speed,
          y: yMove,
          rotation: rotateAmount,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: 2 + index * 0.2,
          },
        });
      });
    },
    { scope: container }
  );

  const generatePath = () => {
    return `
      M -100 400
      C 400 200, 800 500, 1200 350
      S 1800 150, 2400 400
      C 3000 550, 3600 250, 4200 380
      S 5000 500, 5800 320
      C 6400 150, 7000 450, 7600 350
      L 8000 350
    `;
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case "lg":
        return "text-6xl md:text-8xl";
      case "md":
        return "text-4xl md:text-6xl";
      case "sm":
        return "text-2xl md:text-4xl";
      default:
        return "text-4xl md:text-6xl";
    }
  };

  return (
    <section
      ref={container}
      className="relative w-full h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden"
    >
      {/* Decorative Shapes Layer */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
      >
        {decorativeShapes.map((shape) => (
          <div
            key={shape.id}
            className="deco-shape absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {shape.type === "flower" && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
                <circle
                  cx="35"
                  cy="35"
                  r="22"
                  fill={shape.color}
                  opacity="0.85"
                />
                <circle
                  cx="65"
                  cy="35"
                  r="22"
                  fill={shape.color}
                  opacity="0.85"
                />
                <circle
                  cx="35"
                  cy="65"
                  r="22"
                  fill={shape.color}
                  opacity="0.85"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="22"
                  fill={shape.color}
                  opacity="0.85"
                />
              </svg>
            )}
            {shape.type === "diamond" && (
              <div
                className="rounded-sm"
                style={{
                  width: shape.size,
                  height: shape.size,
                  background: `linear-gradient(135deg, #fbbf24, ${shape.color})`,
                  transform: "rotate(45deg)",
                }}
              />
            )}
            {shape.type === "circle" && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
                <defs>
                  <radialGradient
                    id={`grad-${shape.id}`}
                    cx="30%"
                    cy="30%"
                    r="70%"
                  >
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor={shape.color} />
                  </radialGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill={`url(#grad-${shape.id})`}
                />
              </svg>
            )}
            {shape.type === "dot" && (
              <div
                className="rounded-full"
                style={{
                  width: shape.size,
                  height: shape.size,
                  backgroundColor: shape.color,
                }}
              />
            )}
            {shape.type === "ring" && (
              <div
                className="rounded-full border-2"
                style={{
                  width: shape.size,
                  height: shape.size,
                  borderColor: shape.color,
                }}
              />
            )}
            {shape.type === "star" && (
              <svg
                width={shape.size}
                height={shape.size}
                viewBox="0 0 24 24"
                fill={shape.color}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {shape.type === "wave" && (
              <svg
                width={shape.size}
                height={shape.size * 0.5}
                viewBox="0 0 100 50"
                fill="none"
              >
                <path
                  d="M0 25 Q25 0, 50 25 T100 25"
                  stroke={shape.color}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Floating Texts - Fade in/out effect */}
      <div
        ref={floatingRef}
        className="absolute inset-0 pointer-events-none z-[5]"
      >
        {floatingTexts.map((item, index) => (
          <div
            key={index}
            className={`floating-text absolute font-black text-black/5 dark:text-white/5 ${getSizeClass(
              item.size
            )}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: 0,
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* SVG Path */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-[800vw] h-full pointer-events-none z-[1]"
        viewBox="0 0 8000 800"
        preserveAspectRatio="xMinYMid slice"
      >
        <path
          ref={pathRef}
          d={generatePath()}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Dots along path */}
        {[500, 1200, 1900, 2600, 3300, 4000, 4700, 5400, 6100, 6800].map(
          (cx, i) => (
            <circle
              key={i}
              cx={cx}
              cy={350 + (i % 2 === 0 ? -50 : 50)}
              r={3 + (i % 3)}
              fill={
                i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#14b8a6" : "#ec4899"
              }
              opacity="0.4"
            />
          )
        )}
      </svg>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col justify-center">
        {/* Intro Header */}
        <div className="container mx-auto px-4 md:px-6 mb-6 md:mb-10">
          <div className="inline-block bg-[#f472b6] text-white px-4 py-1.5 rounded-full text-sm md:text-base font-bold mb-4 transform -rotate-2">
            My Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
            Crafting Digital <span className="text-[#4ade80]">Experiences</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg">
            From web development to UI/UX design, I bring ideas to life with
            clean code and creative solutions.
          </p>
        </div>

        {/* Row 1 */}
        <div className="overflow-hidden mb-2 md:mb-4">
          <div
            ref={row1Ref}
            className="flex items-center gap-3 md:gap-6 whitespace-nowrap"
            style={{ width: "fit-content" }}
          >
            {scrollTexts[0].items.map((item, index) => (
              <span
                key={index}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              >
                {item.type === "badge" ? (
                  <span
                    className="px-3 md:px-5 py-1 rounded-lg text-black inline-block"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.text}
                  </span>
                ) : item.type === "highlight" ? (
                  <span style={{ color: item.color }}>{item.text}</span>
                ) : item.type === "outline" ? (
                  <span className="text-outline">{item.text}</span>
                ) : (
                  <span className="text-black dark:text-white">
                    {item.text}
                  </span>
                )}
              </span>
            ))}
            {scrollTexts[0].items.slice(0, 3).map((item, index) => (
              <span
                key={`r1-${index}`}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              >
                {item.type === "badge" ? (
                  <span
                    className="px-3 md:px-5 py-1 rounded-lg text-black inline-block"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.text}
                  </span>
                ) : item.type === "highlight" ? (
                  <span style={{ color: item.color }}>{item.text}</span>
                ) : (
                  <span className="text-black dark:text-white">
                    {item.text}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="overflow-hidden">
          <div
            ref={row2Ref}
            className="flex items-center gap-3 md:gap-6 whitespace-nowrap justify-end"
            style={{ width: "fit-content", marginLeft: "auto" }}
          >
            {scrollTexts[1].items.map((item, index) => (
              <span
                key={index}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              >
                {item.type === "badge" ? (
                  <span
                    className="px-3 md:px-5 py-1 rounded-lg text-black inline-block"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.text}
                  </span>
                ) : item.type === "highlight" ? (
                  <span style={{ color: item.color }}>{item.text}</span>
                ) : item.type === "outline" ? (
                  <span className="text-outline">{item.text}</span>
                ) : (
                  <span className="text-black dark:text-white">
                    {item.text}
                  </span>
                )}
              </span>
            ))}
            {scrollTexts[1].items.slice(0, 3).map((item, index) => (
              <span
                key={`r2-${index}`}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              >
                {item.type === "badge" ? (
                  <span
                    className="px-3 md:px-5 py-1 rounded-lg text-black inline-block"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.text}
                  </span>
                ) : item.type === "highlight" ? (
                  <span style={{ color: item.color }}>{item.text}</span>
                ) : (
                  <span className="text-black dark:text-white">
                    {item.text}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Rotated Text at End - 90deg rotation */}
        <div
          ref={rotateTextRef}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 origin-center z-30"
          style={{ opacity: 0 }}
        >
          <div className="text-4xl md:text-6xl lg:text-7xl font-black text-black dark:text-white whitespace-nowrap">
            <span className="block">MORE</span>
            <span className="block text-[#4ade80]">COMING</span>
            <span className="block">SOON</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-30">
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-6 bg-current animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 2px currentColor;
          color: transparent;
        }
        @media (min-width: 768px) {
          .text-outline {
            -webkit-text-stroke: 3px currentColor;
          }
        }
      `}</style>
    </section>
  );
}

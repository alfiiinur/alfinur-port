"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

gsap.registerPlugin(ScrollTrigger);

// Carousel items with different sizes
const carouselItems = [
  {
    type: "image" as const,
    src: "/frontend/webImg/2.png",
    title: "Web Development",
    subtitle: "Modern interfaces",
    size: "large", // large, medium, small
  },
  {
    type: "video" as const,
    src: "/video/videoHome.mp4",
    title: "Motion Design",
    subtitle: "Animated experiences",
    size: "medium",
  },
  {
    type: "image" as const,
    src: "/frontend/webImg/7.png",
    title: "UI/UX Design",
    subtitle: "User-centered approach",
    size: "small",
  },
  {
    type: "image" as const,
    src: "/frontend/webImg/18.png",
    title: "Branding",
    subtitle: "Visual identity",
    size: "medium",
  },
];

export default function ProjectHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!carouselRef.current || !trackRef.current) return;

      const totalWidth = trackRef.current.scrollWidth - window.innerWidth;

      // Horizontal scroll on vertical scroll
      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: carouselRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerWidth * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Animate each card
      const cards = trackRef.current.querySelectorAll(".carousel-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.5, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: card,
              start: "left 80%",
              end: "left 50%",
              scrub: 1,
              containerAnimation: gsap.getById("horizontalScroll") || undefined,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "w-[60vw] md:w-[50vw] h-[50vh] md:h-[60vh]";
      case "medium":
        return "w-[45vw] md:w-[35vw] h-[40vh] md:h-[50vh]";
      case "small":
        return "w-[35vw] md:w-[28vw] h-[35vh] md:h-[45vh]";
      default:
        return "w-[45vw] md:w-[35vw] h-[40vh] md:h-[50vh]";
    }
  };

  const wordsProject =
    " Below are a few select projects that showcase my skills across various areas of design and development.";

  return (
    <div
      ref={containerRef}
      className="bg-white text-black dark:bg-black dark:text-white"
    >
      {/* Hero Heading */}
      <section className="pt-32 pb-8 px-4 md:px-8 relative overflow-hidden">
        {/* Animated Grid Pattern - full width in heading section */}
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.15}
          duration={3}
          className="inset-0 h-full w-full fill-black/10 stroke-black/10 dark:fill-white/10 dark:stroke-white/10 [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)] "
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <Highlighter action="underline" color="#4CAF50">
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-black text-black dark:text-white uppercase leading-[0.85] tracking-tighter text-center">
              Creative Projects
              <br />
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
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 flex items-end gap-6 px-8 md:px-16"
        >
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`carousel-card relative shrink-0 rounded-2xl overflow-hidden group ${getSizeClasses(
                item.size
              )}`}
            >
              {/* Media */}
              {item.type === "video" ? (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/60 w-0 progress-bar transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Let's Build Section */}
      <section className="py-20 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Let&apos;s build
              <br />
              something bold
              <br />
              together.
            </h2>
            <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors group">
              <ArrowDownRight
                size={20}
                className="text-white group-hover:text-black transition-colors"
              />
            </button>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-white/50">
            <button className="hover:text-white transition-colors">
              PREVIOUS
            </button>
            <span>/</span>
            <button className="hover:text-white transition-colors">NEXT</button>
          </div>
        </div>
      </section>
    </div>
  );
}

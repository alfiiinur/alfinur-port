"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaCard } from "@/components/public/shared/MediaCard";
import { ArrowUpRight, Play, Tag } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Fullscreen stack items
const stackItems = [
  {
    type: "image" as const,
    src: "/frontend/webImg/2.png",
    title: "Creative Work",
    subtitle: "Featured Project",
    description:
      "Crafting digital experiences that inspire and engage users through innovative design solutions.",
  },
  {
    type: "image" as const,
    src: "/frontend/webImg/7.png",
    title: "Web Design",
    subtitle: "UI/UX Project",
    description:
      "Building modern web interfaces with attention to detail and user-centered approach.",
  },
  {
    type: "video" as const,
    src: "/video/videoHome.mp4",
    title: "Motion Design",
    subtitle: "Animation",
    description:
      "Bringing ideas to life through captivating motion graphics and animations.",
  },
  {
    type: "image" as const,
    src: "/frontend/webImg/18.png",
    title: "Branding",
    subtitle: "Identity Design",
    description:
      "Creating memorable brand identities that resonate with target audiences.",
  },
];

// Typing effect component
const TypingText = ({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      setShowCursor(false);
      return;
    }

    // Start typing effect
    let index = 0;
    setDisplayText("");
    setShowCursor(true);

    const interval = setInterval(() => {
      index += 1;
      setDisplayText(text.slice(0, index));
      if (index >= text.length) {
        setShowCursor(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <span className="text-white/70">
      {displayText}
      {showCursor && (
        <span className="inline-block w-0.5 h-5 bg-white/60 ml-1 animate-pulse" />
      )}
    </span>
  );
};

export const HeroGrids = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!horizontalRef.current || !trackRef.current) return;

      const cards = trackRef.current.querySelectorAll(".slide-card");
      const totalWidth = (cards.length - 1) * window.innerWidth;

      // Pin the section and scroll horizontally
      const horizontalTween = gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.round(progress * (cards.length - 1));
            setActiveIndex(newIndex);
          },
        },
      });

      // Animate each card
      cards.forEach((card, index) => {
        const cardInner = card.querySelector(".card-inner");
        const cardOverlay = card.querySelector(".card-overlay");
        const cardText = card.querySelector(".card-text");

        // First card starts visible and centered
        if (index === 0) {
          gsap.set(cardInner, { scale: 1, rotateY: 0, x: 0 });
          gsap.set(cardOverlay, { opacity: 0 });
          gsap.set(cardText, { opacity: 1, x: 0 });

          // Only exit animation for first card
          gsap.to(cardInner, {
            scale: 0.65,
            rotateY: -30,
            x: -150,
            ease: "power2.in",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "left -20%",
              scrub: 1,
            },
          });

          gsap.to(cardOverlay, {
            opacity: 0.8,
            ease: "power2.in",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "left -20%",
              scrub: 1,
            },
          });

          gsap.to(cardText, {
            opacity: 0,
            x: -200,
            ease: "power2.in",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "center center",
              end: "left 0%",
              scrub: 1,
            },
          });
        } else {
          // Other cards: entry + exit animation
          gsap.set(cardInner, { scale: 0.65, rotateY: 30, x: 150 });
          gsap.set(cardOverlay, { opacity: 0.8 });
          gsap.set(cardText, { opacity: 0, x: 200 });

          // Entry animation
          gsap.to(cardInner, {
            scale: 1,
            rotateY: 0,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 120%",
              end: "center center",
              scrub: 1,
            },
          });

          gsap.to(cardOverlay, {
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 120%",
              end: "center center",
              scrub: 1,
            },
          });

          gsap.to(cardText, {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 100%",
              end: "center center",
              scrub: 1,
            },
          });

          // Exit animation (not for last card)
          if (index < cards.length - 1) {
            gsap.to(cardInner, {
              scale: 0.65,
              rotateY: -30,
              x: -150,
              ease: "power2.in",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "center center",
                end: "left -20%",
                scrub: 1,
              },
            });

            gsap.to(cardOverlay, {
              opacity: 0.8,
              ease: "power2.in",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "center center",
                end: "left -20%",
                scrub: 1,
              },
            });

            gsap.to(cardText, {
              opacity: 0,
              x: -200,
              ease: "power2.in",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "center center",
                end: "left 0%",
                scrub: 1,
              },
            });
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      {/* Regular Grid Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] gap-3 md:gap-4">
          <MediaCard
            type="image"
            src="/img/room.jpg"
            className="md:row-span-2 md:col-span-1"
            alt="Fashion Model"
          />
          <MediaCard
            type="image"
            src="/frontend/webImg/7.png"
            className="md:col-span-2"
            overlay={
              <div className="flex justify-end items-end h-full">
                <button className="group bg-[#bbf7d0] text-black px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg overflow-hidden">
                  <Play size={14} fill="black" />
                  <span className="relative overflow-hidden h-4 inline-flex items-center">
                    <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                      Tutorials
                    </span>
                    <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                      Tutorials
                    </span>
                  </span>
                </button>
              </div>
            }
          />
          <MediaCard
            type="video"
            src="/video/videoHome.mp4"
            className="md:col-span-1"
            overlay={
              <div className="flex justify-end">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  LIVE
                </span>
              </div>
            }
          />
          <MediaCard
            type="image"
            src="/frontend/webImg/25.png"
            className="md:row-span-1 md:col-span-1"
          />
          <MediaCard
            type="image"
            src="/frontend/webImg/2.png"
            className="md:col-span-2"
          />
          <MediaCard
            type="image"
            src="/frontend/webImg/18.png"
            className="md:col-span-2"
          />
          <MediaCard
            type="video"
            src="/video/videoHome.mp4"
            className="md:col-span-2"
            overlay={
              <div className="flex flex-col justify-between h-full">
                <div className="flex gap-2">
                  <span className="bg-white/80 backdrop-blur text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Play size={10} /> ReelUp
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <button className="group bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 overflow-hidden">
                    <span className="relative overflow-hidden h-4 inline-flex items-center">
                      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                        View Product
                      </span>
                      <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                        View Product
                      </span>
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:rotate-45"
                    />
                  </button>
                  <div className="flex gap-2 text-white/80">
                    <Tag size={18} />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Horizontal Scroll Section */}
      <div
        ref={horizontalRef}
        className="relative h-screen mt-8 bg-black overflow-hidden"
        style={{ perspective: "1500px" }}
      >
        <div className="absolute inset-0 bg-slate-950" />

        {/* Progress indicator */}
        <div className="absolute top-8 left-8 right-8 z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Featured Projects
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              {activeIndex + 1} / {stackItems.length}
            </span>
          </div>
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{
                width: `${((activeIndex + 1) / stackItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Horizontal Track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {stackItems.map((item, index) => (
            <div
              key={index}
              className="slide-card relative w-screen h-screen flex items-center justify-center shrink-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Inner - Fullscreen */}
              <div
                className="card-inner relative w-full h-full overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
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
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
                <div className="card-overlay absolute inset-0 bg-black pointer-events-none" />
              </div>

              {/* Card Text - Side description with typing */}
              <div className="card-text absolute inset-0 flex items-center justify-between px-8 md:px-20 pointer-events-none">
                <div className="max-w-lg">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block text-white/50">
                    {item.subtitle}
                  </span>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                    {item.title}
                  </h2>
                  <p className="text-base md:text-lg text-white/70 leading-relaxed">
                    <TypingText
                      text={item.description}
                      isActive={activeIndex === index}
                    />
                  </p>
                </div>
              </div>

              {/* Card number */}
              <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-10">
                <span className="text-8xl md:text-[12rem] font-black text-white/5 leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-white/30">
            Scroll to explore
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-white/20 rounded-full overflow-hidden">
              <div className="w-full h-full bg-white/60 animate-[slideRight_1.5s_ease-in-out_infinite]" />
            </div>
            <ArrowUpRight size={14} className="text-white/30 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};

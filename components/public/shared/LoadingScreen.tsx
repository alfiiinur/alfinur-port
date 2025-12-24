"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { LightRays } from "@/components/ui/light-rays";
import { Meteors } from "@/components/ui/meteors";

const sliderImages = [
  "/frontend/webImg/1.png",
  "/frontend/webImg/3.png",
  "/frontend/webImg/12.png",
  "/frontend/webImg/25.png",
];

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Loading progress
  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Exit animation when loading complete
  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline({
        onComplete: onLoadingComplete,
      });

      tl.to([loadingTextRef.current, imageRef.current], {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.1,
      })
        .to(
          [logoRef.current, percentRef.current],
          {
            y: 30,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.1,
          },
          "-=0.2"
        )
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        });
    }
  }, [progress, onLoadingComplete]);

  // Entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        loadingTextRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
      );

      gsap.fromTo(
        logoRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(
        percentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );

      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.5,
        }
      );

      gsap.fromTo(
        bottomTextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 bg-black flex flex-col justify-between overflow-hidden"
    >
      {/* Light Rays Effect */}
      <LightRays
        className="z-0"
        count={8}
        color="rgba(196, 241, 53, 0.15)"
        blur={40}
        speed={12}
        length="80vh"
      />
      <Meteors number={30} />
      {/* Top Section */}
      <div className="flex justify-between items-start p-6 md:p-10">
        {/* Loading Text - Top Left */}
        <div ref={loadingTextRef} className="text-left">
          <p className="text-white font-black text-md md:text-xl ">Loading</p>
          <p className="text-white font-black text-md md:text-xl ">
            your experience...
          </p>
        </div>

        {/* Image Carousel - Top Right */}
        <div
          ref={imageRef}
          className="relative w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden"
        >
          {sliderImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Center - Empty */}
      <div className="flex-1" />

      {/* Bottom Section */}
      <div className="p-6 md:p-10 space-y-4">
        {/* Logo (Bottom Left) & Percentage (Bottom Right) */}
        <div className="flex justify-between items-end pt-4">
          {/* Logo - Bottom Left */}
          <div ref={logoRef} className="flex items-center gap-3">
            {/* Logo Text */}
            <div className="flex items-baseline">
              <span className="text-white font-extrabold text-4xl md:text-6xl lg:text-7xl  tracking-tight">
                ALFI NUR DANIALIN
              </span>
            </div>
          </div>

          {/* Percentage - Bottom Right */}
          <div ref={percentRef}>
            <span
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-tl
                        from-slate-800
                        via-violet-500
                        to-black
                        bg-clip-text
                        text-transparent"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="w-full h-[2px] bg-[#1a2a3a] rounded-full overflow-hidden origin-left"
        >
          <div
            className="h-full bg-linear-to-r from-[#4a9eff] to-[#6b8aad] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Bottom Info Text */}
        <div
          ref={bottomTextRef}
          className="flex justify-between items-center text-[#4a6a8a] text-xs md:text-sm"
        >
          <span>Frontend Developer</span>
          <span className="hidden md:block">
            Crafting digital experiences with passion
          </span>
          <span>Ready to innovate</span>
        </div>
      </div>

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 158, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 158, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

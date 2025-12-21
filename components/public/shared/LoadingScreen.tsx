"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

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
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Loading progress
  useEffect(() => {
    const duration = 3000; // 3 seconds loading
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

      tl.to(logoRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      })
        .to(
          taglineRef.current,
          {
            y: -30,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.3"
        )
        .to(
          imageRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.3"
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
        logoRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
      );

      gsap.fromTo(
        taglineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 bg-black flex flex-col justify-between overflow-hidden"
    >
      {/* Image Slider - Top Right */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10">
        <div
          ref={imageRef}
          className="w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden"
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

      {/* Main Content */}
      <div className="flex-1 flex items-end px-6 md:px-12 pb-8">
        <div ref={logoRef}>
          <h1 className="font-anton text-[80px] sm:text-[120px] md:text-[180px] lg:text-[220px] font-bold text-white leading-none tracking-tighter">
            ALFI NUR
          </h1>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 md:px-12 pb-8 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Tagline */}
          <p
            ref={taglineRef}
            className="text-white/60 text-xs md:text-sm tracking-widest uppercase"
          >
            (FrontEnd Developer + IT Infrastructure)
          </p>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="w-32 md:w-48 h-[2px] bg-white/20 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-white origin-left transition-transform duration-100"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <span className="text-white/60 text-xs md:text-sm font-mono w-12">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Circle - Bottom Right */}
      {/* <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            className="animate-spin-slow"
            style={{ animationDuration: "3s" }}
          />
          <path d="M12 6v6l4 2" />
        </svg>
      </div> */}
    </div>
  );
};

"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Home,
  Info,
  Share2,
  X,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Meteors } from "@/components/ui/meteors";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { ShineBorder } from "@/components/ui/shine-border";

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  tags: string[];
}

interface Props {
  designs: Design[];
}

export default function DesignShowcaseClient({ designs }: Props) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax untuk landing
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 20);
      mouseY.set((clientY - innerHeight / 2) / 20);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleStart = () => setIsStarted(true);

  const handleNext = () => {
    if (currentIndex < designs.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Sudah di slide terakhir, trigger completion screen
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentDesign = designs[currentIndex];

  if (designs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No designs available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Completion Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={designs[0]?.image || "/placeholder.jpg"}
                alt="Background"
                fill
                className="object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-sky-50/70 to-white/90" />
            </div>

            {/* Content */}
            <motion.div
              className="relative z-10 text-center max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Design Gallery is your creative space
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Explore all {designs.length} designs in our collection, your
                creative companion for inspiration.
              </p>

              <Link
                href="/design"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-full text-gray-900 font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
              >
                <Globe className="w-5 h-5" />
                Start Browsing
              </Link>
            </motion.div>

            {/* Floating Design Cards */}
            <motion.div
              className="absolute inset-x-0 bottom-32 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-4 justify-center flex-wrap px-4">
                {designs.slice(0, 6).map((design, i) => (
                  <motion.div
                    key={design.id}
                    className="bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-xs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={design.image}
                        alt={design.title}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm text-gray-700 truncate">
                      {design.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer Navigation */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm font-medium">Design Gallery</span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">2025 Collection</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentIndex(designs.length - 1);
                  }}
                  className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Link
                  href="/design"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Start Browsing
                </Link>
                <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-gray-600 text-sm">
                Progress <span className="font-bold text-gray-900">100%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Animated Grid Pattern */}
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.15}
          duration={3}
          className="absolute inset-0 h-full w-full fill-white/10 stroke-white/10 mask-[radial-gradient(600px_circle_at_center,white,transparent)]"
        />

        {/* Meteors */}
        <Meteors number={15} className="opacity-60" />

        {/* Animated Circle Orbs - White transparent */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 bg-white"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full opacity-5 bg-white"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <LandingView
              key="landing"
              designs={designs}
              onStart={handleStart}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          ) : (
            <SlideView
              key={`slide-${currentIndex}`}
              design={currentDesign}
              currentIndex={currentIndex}
              totalItems={designs.length}
              direction={direction}
              isLastSlide={currentIndex === designs.length - 1}
              onNext={handleNext}
              onPrev={handlePrev}
              onClose={() => setIsStarted(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== FLOATING IMAGE COMPONENT ====================
interface FloatingImageProps {
  design: Design;
  index: number;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    scale: number;
    rotate: number;
    delay: number;
  };
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}

function FloatingImage({
  design,
  index,
  position,
  smoothX,
  smoothY,
}: FloatingImageProps) {
  // Parallax effect based on cursor position only
  const parallaxStrength = (index % 3) + 1; // 1-3 strength variation
  const xTransform = useTransform(
    smoothX,
    (v) => v * parallaxStrength * (index % 2 === 0 ? 1.5 : -1.5)
  );
  const yTransform = useTransform(
    smoothY,
    (v) => v * parallaxStrength * (index % 2 === 0 ? 1 : -1)
  );

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
        x: xTransform,
        y: yTransform,
      }}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        scale: position.scale,
        rotate: position.rotate,
        opacity: 0.9,
      }}
      transition={{
        scale: { duration: 0.6, delay: position.delay },
        rotate: { duration: 0.6, delay: position.delay },
        opacity: { duration: 0.8, delay: position.delay },
      }}
      whileHover={{
        scale: position.scale * 1.15,
        rotate: 0,
        zIndex: 50,
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="relative w-32 h-24 sm:w-40 sm:h-28 md:w-56 md:h-40 rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={design.image}
          alt={design.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">
            {design.title}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== LANDING VIEW ====================
interface LandingViewProps {
  designs: Design[];
  onStart: () => void;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}

function LandingView({ designs, onStart, smoothX, smoothY }: LandingViewProps) {
  // Positions untuk floating images - tersebar di seluruh viewport dengan jarak yang cukup
  // Menggunakan viewport units agar responsive dan cards terlihat di pojok-pojok
  const positions = [
    // Top area
    { top: "8%", left: "5%", scale: 0.85, rotate: -12, delay: 0 },
    { top: "5%", left: "28%", scale: 0.9, rotate: 5, delay: 0.1 },
    { top: "10%", right: "28%", scale: 0.8, rotate: -8, delay: 0.2 },
    { top: "6%", right: "5%", scale: 0.95, rotate: 10, delay: 0.3 },
    // Middle area (sides only)
    { top: "38%", left: "3%", scale: 0.9, rotate: -15, delay: 0.4 },
    { top: "42%", right: "3%", scale: 0.85, rotate: 12, delay: 0.5 },
    // Bottom area
    { bottom: "25%", left: "6%", scale: 0.95, rotate: 8, delay: 0.6 },
    { bottom: "12%", left: "25%", scale: 0.85, rotate: -5, delay: 0.7 },
    { bottom: "15%", right: "25%", scale: 0.9, rotate: 12, delay: 0.8 },
    { bottom: "20%", right: "4%", scale: 0.88, rotate: -10, delay: 0.9 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Home Button - Top Center */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </motion.div>

      {/* Floating Images dari Database - Cursor parallax only */}
      <div className="absolute inset-0 pointer-events-none">
        {designs.slice(0, 10).map((design, i) => {
          const pos = positions[i % positions.length];
          return (
            <FloatingImage
              key={design.id}
              design={design}
              index={i}
              position={pos}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          );
        })}
      </div>

      {/* Center Content Card */}
      <motion.div
        className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-md sm:max-w-lg mx-4"
        initial={{ y: 60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <motion.div
          className="mb-4 sm:mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <div className="w-24 h-12 sm:w-32 sm:h-14   ">
            <span className="text-white font-bold text-xl sm:text-2xl">
              ALFI NUR
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl font-light text-white mb-2 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Design Gallery
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/80 font-light mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Explore {designs.length} + creative works
        </motion.p>
        <motion.div
          onClick={onStart}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.4,
          }}
        >
          <RoundedButton
            className="
    bg-white text-gray-900 
    px-8 sm:px-12 py-3 sm:py-4 
    rounded-full font-semibold text-base sm:text-lg 
    shadow-lg hover:shadow-2xl 
    transition-shadow duration-300 hover:bg-white hover:text-black
  "
          >
            Start Explore
          </RoundedButton>
        </motion.div>

        <motion.p
          className="mt-4 sm:mt-6 text-white/50 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Move cursor to explore • Click Start to begin
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ==================== SLIDE VIEW ====================
interface SlideViewProps {
  design: Design;
  currentIndex: number;
  totalItems: number;
  direction: number;
  isLastSlide: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

// Variants untuk animasi fly-in 3D
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 25 : -25,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 25 : -25,
  }),
};

function SlideView({
  design,
  currentIndex,
  totalItems,
  direction,
  isLastSlide,
  onNext,
  onPrev,
  onClose,
}: SlideViewProps) {
  const progress = Math.round(((currentIndex + 1) / totalItems) * 100);
  const [imageError, setImageError] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onClose]);

  // Check if current image has error
  const hasImageError = imageError === design.id;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Large Number Indicator - Top Left */}
      <motion.div
        className="absolute top-1/2 left-4 -translate-y-1/2 md:left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-6xl md:text-8xl font-black text-white/10">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3 text-white/80">
          <span className="text-sm font-medium hidden md:block">
            Design Gallery
          </span>
          <span className="text-white/40 hidden md:block">|</span>
          <span className="text-sm text-white/60 hidden md:block">
            2025 Collection
          </span>
        </div>

        {/* Home Button - Center */}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-all"
        >
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">Home</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Progress Dots */}
          <div className="hidden md:flex gap-1.5">
            {Array.from({ length: Math.min(totalItems, 10) }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
            {totalItems > 10 && (
              <span className="text-white/50 text-xs ml-1">
                +{totalItems - 10}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content - Responsive sizing */}
      <div
        className="flex-1 flex items-center justify-center px-3 py-2 md:px-6 md:py-4 pt-16 pb-20 md:pt-20 md:pb-24"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={design.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.5 },
            }}
            className="w-full max-w-5xl max-h-[calc(100vh-160px)] relative z-10"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[calc(100vh-160px)]">
              {/* Image Section */}
              <div className="lg:w-[60%] p-2 md:p-4 bg-gray-50 overflow-hidden">
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-inner">
                  {/* Browser Chrome */}
                  <div className="h-8 md:h-10 bg-gray-100 border-b flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-2 md:mx-4">
                      <div className="bg-white rounded-full px-2 md:px-3 py-1 text-xs text-gray-400 border truncate">
                        design-gallery.com/{design.slug}
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <motion.div
                    className="relative aspect-4/3 md:aspect-16/10 bg-gray-200"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {design.image && !hasImageError ? (
                      <Image
                        key={design.id}
                        src={design.image}
                        alt={design.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 60vw"
                        onError={() => setImageError(design.id)}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <svg
                          className="w-16 h-16 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">Image not available</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:w-[40%] p-4 md:p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-linear-to-r from-blue-500 to-cyan-500 mb-3"
                  >
                    {design.category}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3"
                  >
                    {design.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 leading-relaxed mb-3 md:mb-4 text-sm md:text-base line-clamp-3"
                  >
                    {design.description ||
                      "A beautiful design piece from our collection."}
                  </motion.p>

                  {design.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-1.5 mb-3 md:mb-4"
                    >
                      {design.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* More Info Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link
                      href={`/design/${design.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors group"
                    >
                      More info
                      <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                        <Info size={14} />
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 mt-4"
                >
                  <motion.button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: [0, -3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowLeft
                        size={18}
                        className="transition-transform group-hover:-translate-x-0.5"
                      />
                    </motion.div>
                  </motion.button>
                  <motion.button
                    onClick={onNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 h-11 md:h-12 rounded-full flex items-center justify-between px-5 md:px-6 transition-all group overflow-hidden ${
                      isLastSlide
                        ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="relative overflow-hidden h-5 inline-flex items-center">
                      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full font-medium text-sm md:text-base">
                        {isLastSlide ? "Finish" : "Next"}
                      </span>
                      <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 font-medium text-sm md:text-base">
                        {isLastSlide ? "Finish" : "Next"}
                      </span>
                    </span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Centered */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col items-center gap-2 text-white/60 text-sm">
        <span>Click next or use arrow keys</span>
        <div className="flex items-center gap-2">
          <span>Progress</span>
          <span className="font-bold text-white">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

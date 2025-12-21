"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Home,
  Info,
  Share2,
  X,
} from "lucide-react";

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

// Warna accent untuk setiap kategori
const categoryColors: Record<string, string> = {
  "UI Design": "#3b82f6",
  "Web Design": "#10b981",
  Branding: "#f59e0b",
  Illustration: "#ec4899",
  "3D Design": "#8b5cf6",
  default: "#6366f1",
};

export default function DesignShowcaseClient({ designs }: Props) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
  const accentColor =
    categoryColors[currentDesign?.category] || categoryColors.default;

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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
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
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundColor: isStarted ? accentColor : "#0f172a" }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${accentColor}40, transparent)`,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, white, transparent)` }}
        />
      </motion.div>

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
              designs={designs}
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
  dragX: number;
}

function FloatingImage({
  design,
  index,
  position,
  smoothX,
  smoothY,
  dragX,
}: FloatingImageProps) {
  const xTransform = useTransform(
    smoothX,
    (v) => v * (index % 2 === 0 ? 1.5 : -1.5) + dragX
  );
  const yTransform = useTransform(
    smoothY,
    (v) => v * (index % 2 === 0 ? 1 : -1)
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
        className="relative w-40 h-28 md:w-56 md:h-40 rounded-xl overflow-hidden shadow-2xl cursor-pointer"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Positions untuk floating images - tersebar di sekitar layar
  const positions = [
    { top: "5%", left: "3%", scale: 0.9, rotate: -12, delay: 0 },
    { top: "8%", left: "25%", scale: 1, rotate: 5, delay: 0.1 },
    { top: "3%", right: "30%", scale: 0.85, rotate: -8, delay: 0.2 },
    { top: "12%", right: "5%", scale: 1.1, rotate: 10, delay: 0.3 },
    { top: "40%", left: "2%", scale: 0.95, rotate: -15, delay: 0.4 },
    { bottom: "30%", left: "8%", scale: 1, rotate: 8, delay: 0.5 },
    { bottom: "10%", left: "20%", scale: 0.9, rotate: -5, delay: 0.6 },
    { bottom: "8%", right: "25%", scale: 1.05, rotate: 12, delay: 0.7 },
    { bottom: "25%", right: "3%", scale: 0.95, rotate: -10, delay: 0.8 },
    { top: "45%", right: "6%", scale: 0.85, rotate: 6, delay: 0.9 },
  ];

  // Drag handler untuk geser gambar
  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX =
        "touches" in moveEvent
          ? (moveEvent as TouchEvent).touches[0].clientX
          : (moveEvent as MouseEvent).clientX;
      setDragX((prev) => prev + (currentX - startX) * 0.1);
    };

    const handleEnd = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
  };

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      onMouseDown={handleDrag}
      onTouchStart={handleDrag}
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

      {/* Floating Images dari Database */}
      <div className="absolute inset-0">
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
              dragX={dragX}
            />
          );
        })}
      </div>

      {/* Center Content Card */}
      <motion.div
        className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-lg mx-4"
        initial={{ y: 60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">D</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-light text-white mb-2 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Design Gallery
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Explore {designs.length} creative works
        </motion.p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white text-gray-900 px-12 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
          Start
        </motion.button>

        <motion.p
          className="mt-6 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Drag to explore • Click Start to begin
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ==================== SLIDE VIEW ====================
interface SlideViewProps {
  design: Design;
  designs: Design[];
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

// Floating card positions - random di sekitar card utama
const floatingPositions = [
  { top: "5%", right: "5%", rotate: 12, scale: 0.6 },
  { top: "15%", left: "3%", rotate: -8, scale: 0.55 },
  { bottom: "10%", right: "8%", rotate: 15, scale: 0.5 },
  { bottom: "20%", left: "5%", rotate: -12, scale: 0.55 },
  { top: "40%", right: "2%", rotate: 8, scale: 0.45 },
  { top: "60%", left: "2%", rotate: -15, scale: 0.5 },
];

function SlideView({
  design,
  designs,
  currentIndex,
  totalItems,
  direction,
  isLastSlide,
  onNext,
  onPrev,
  onClose,
}: SlideViewProps) {
  const progress = Math.round(((currentIndex + 1) / totalItems) * 100);

  // Get 2-3 random floating cards (excluding current)
  const floatingCards = useMemo(() => {
    const otherDesigns = designs.filter((_, i) => i !== currentIndex);
    const shuffled = [...otherDesigns].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 2) + 2; // 2-3 cards
    return shuffled.slice(0, count);
  }, [designs, currentIndex]);

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

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating Cards di sekitar */}
      <div className="absolute inset-0 pointer-events-none z-20 hidden lg:block">
        {floatingCards.map((floatDesign, i) => {
          const pos = floatingPositions[i % floatingPositions.length];
          return (
            <motion.div
              key={floatDesign.id}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
              }}
              initial={{ opacity: 0, scale: 0, rotate: pos.rotate }}
              animate={{
                opacity: 0.8,
                scale: pos.scale,
                rotate: pos.rotate,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { delay: 0.5 + i * 0.2, duration: 0.5 },
                scale: { delay: 0.5 + i * 0.2, duration: 0.5 },
                y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative w-48 h-32 md:w-64 md:h-44 rounded-xl overflow-hidden shadow-2xl bg-white">
                <Image
                  src={floatDesign.image}
                  alt={floatDesign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">
                    {floatDesign.title}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3 text-white/80">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
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

      {/* Main Content - Card lebih besar */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8 pt-20"
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
            className="w-full max-w-6xl relative z-10"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
              {/* Image Section - Lebih besar */}
              <div className="lg:w-[65%] p-3 md:p-5 bg-gray-50">
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-inner">
                  {/* Browser Chrome */}
                  <div className="h-12 bg-gray-100 border-b flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-400 border">
                        design-gallery.com/{design.slug}
                      </div>
                    </div>
                  </div>

                  {/* Image - Aspect ratio lebih besar */}
                  <motion.div
                    className="relative aspect-[16/10]"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Image
                      src={design.image}
                      alt={design.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:w-[35%] p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 mb-5"
                  >
                    {design.category}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
                  >
                    {design.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 leading-relaxed mb-6 text-base"
                  >
                    {design.description ||
                      "A beautiful design piece from our collection."}
                  </motion.p>

                  {design.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-2 mb-6"
                    >
                      {design.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* More Info Button - Link ke detail */}
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
                      <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                        <Info size={16} />
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-3 mt-8"
                >
                  <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full border border-gray-200 hover:bg-gray-50 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <button
                    onClick={onNext}
                    className={`flex-1 h-14 rounded-full flex items-center justify-between px-8 transition-all group ${
                      isLastSlide
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="font-medium text-base">
                      {isLastSlide ? "Finish" : "Next"}
                    </span>
                    <ArrowRight
                      size={22}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
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

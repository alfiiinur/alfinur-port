"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  Grid3X3,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Video,
} from "lucide-react";

interface FeaturedItem {
  image: string;
  title: string;
  author?: string;
}

interface DesignHeroProps {
  featuredDesigns?: FeaturedItem[];
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

const popularTags = [
  "dashboard",
  "landing page",
  "e-commerce",
  "logo",
  "mobile app",
];

const tabs = [
  { id: "shots", label: "Shots", icon: Grid3X3 },
  { id: "designers", label: "Designers", icon: Users },
  { id: "services", label: "Services", icon: Briefcase },
];

function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

export default function DesignHero({
  featuredDesigns = [],
  onSearch,
  onTagClick,
}: DesignHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("shots");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const hasMultiple = featuredDesigns.length > 1;
  const currentItem = featuredDesigns[currentIndex];

  const goToNext = useCallback(() => {
    if (hasMultiple) {
      setCurrentIndex((prev) => (prev + 1) % featuredDesigns.length);
    }
  }, [hasMultiple, featuredDesigns.length]);

  const goToPrev = useCallback(() => {
    if (hasMultiple) {
      setCurrentIndex(
        (prev) => (prev - 1 + featuredDesigns.length) % featuredDesigns.length
      );
    }
  }, [hasMultiple, featuredDesigns.length]);

  // Auto-play carousel
  useEffect(() => {
    if (!isPlaying || !hasMultiple) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, hasMultiple, goToNext]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const toggleVideoPlay = () => {
    const video = document.querySelector(
      ".hero-video"
    ) as HTMLVideoElement | null;
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  return (
    <div className="mb-12 md:mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4 uppercase">
            Find Design Inspiration Here
          </h1>
          <p className="text-gray-700 font-medium text-base sm:text-lg mb-6 max-w-md">
            Explore our work here and find talented and experienced designers
            ready to work on your next project.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative flex items-center max-w-md">
              <input
                type="text"
                placeholder="What type of design are you interested in?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">
              Popular:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="px-3 py-1 rounded-full border text-sm hover:bg-muted transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right - Featured Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square max-w-lg mx-auto lg:ml-auto rounded-3xl overflow-hidden bg-linear-to-br from-slate-900 to-slate-800">
            {featuredDesigns.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {isVideo(currentItem?.image) ? (
                    <>
                      <video
                        src={currentItem.image}
                        className="hero-video w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      {/* Video Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                        <Video className="w-3 h-3" />
                        Video
                      </div>
                      {/* Video Play/Pause Button */}
                      <button
                        onClick={toggleVideoPlay}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                    </>
                  ) : (
                    <Image
                      src={currentItem?.image || ""}
                      alt={currentItem?.title || "Featured design"}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">04:32</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-white/60">
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                      -
                    </button>
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Author Badge */}
            {currentItem?.author && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full z-10">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                  {currentItem.author.charAt(0)}
                </div>
                <span className="text-sm font-medium">
                  {currentItem.author}
                </span>
              </div>
            )}

            {/* Dots Indicator */}
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {featuredDesigns.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
                {/* Play/Pause Carousel */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="ml-2 w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {hasMultiple && (
            <div className="flex gap-2 mt-4 justify-center lg:justify-end">
              {featuredDesigns.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                    index === currentIndex
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {isVideo(item.image) ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-4 sm:p-6 rounded-2xl border bg-card flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">
              NEW
            </span>
          </div>
          <span className="font-semibold text-sm sm:text-base">
            Get Matched Now
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
          Tell us what you need and instantly get matched with world-class
          talent ready to work on your project.
        </p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
          Get Started
        </button>
      </motion.div>
    </div>
  );
}

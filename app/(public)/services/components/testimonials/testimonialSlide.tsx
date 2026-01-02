"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface TestimonialSlideProps {
  data: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
    projectType: string | null;
    media?: string[];
  };
}

// Helper to check if URL is video
function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export const TestimonialSlide = ({ data }: TestimonialSlideProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const mediaItems =
    data.media && data.media.length > 0 ? data.media : ["/img/room.jpg"]; // Fallback to default image

  // Auto-advance carousel
  useEffect(() => {
    if (mediaItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  const currentMedia = mediaItems[currentMediaIndex];
  const isVideo = isVideoUrl(currentMedia);

  return (
    <div className="w-full min-h-[70vh] sm:min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Quote Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 opacity-50" />

            {/* Rating Stars */}
            <div className="flex gap-1 mb-4 sm:mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                    star <= data.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-white dark:text-black leading-relaxed mb-6 sm:mb-8">
              &ldquo;{data.quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden relative bg-gray-700 dark:bg-gray-300 shrink-0">
                {data.avatar && data.avatar !== "/avatars/default.jpg" ? (
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white dark:text-black text-base sm:text-lg lg:text-xl font-bold">
                    {data.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white dark:text-black text-sm sm:text-base lg:text-lg truncate">
                  {data.name}
                </p>
                <p className="text-gray-400 dark:text-gray-600 text-xs sm:text-sm truncate">
                  {data.role}
                </p>
              </div>
            </div>

            {/* Project Type Badge */}
            {data.projectType && (
              <div className="mt-4 sm:mt-6">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-full text-xs sm:text-sm">
                  Project: {data.projectType}
                </span>
              </div>
            )}
          </motion.div>

          {/* Right: Media Carousel Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-4/5 rounded-2xl overflow-hidden group">
              {/* Media Carousel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMediaIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {isVideo ? (
                    <video
                      src={currentMedia}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={currentMedia}
                      alt="Testimonial showcase"
                      fill
                      className="object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Video Badge */}
              {isVideo && (
                <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  Video
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

              {/* Navigation Arrows (show if multiple media) */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <p className="text-white text-sm font-medium">
                    Trusted by 100+ clients worldwide
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Carousel Dots */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {mediaItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentMediaIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

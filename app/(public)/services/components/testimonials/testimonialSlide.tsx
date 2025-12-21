"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialSlideProps {
  data: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
    projectType: string | null;
  };
}

export const TestimonialSlide = ({ data }: TestimonialSlideProps) => {
  return (
    <div className="w-full min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Quote Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote className="w-16 h-16 text-gray-700 dark:text-gray-300 mb-6 opacity-50" />

            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= data.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-white dark:text-black leading-relaxed mb-8">
              "{data.quote}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden relative bg-gray-700 dark:bg-gray-300">
                {data.avatar && data.avatar !== "/avatars/default.jpg" ? (
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white dark:text-black text-xl font-bold">
                    {data.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-white dark:text-black text-lg">
                  {data.name}
                </p>
                <p className="text-gray-400 dark:text-gray-600">{data.role}</p>
              </div>
            </div>

            {/* Project Type Badge */}
            {data.projectType && (
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-full text-sm">
                  Project: {data.projectType}
                </span>
              </div>
            )}
          </motion.div>

          {/* Right: Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/img/room.jpg"
                alt="Testimonial showcase"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                    <span className="text-white/80 text-xs ml-2">
                      5.0 Average Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

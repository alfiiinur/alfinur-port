"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestimonialSlide } from "./testimonialSlide";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  content: string;
  rating: number;
  projectType: string | null;
  isFeatured: boolean;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No testimonials available.
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Transform data to match TestimonialSlide expected format
  const currentTestimonial = testimonials[currentIndex];
  const slideData = {
    id: currentTestimonial.id,
    name: currentTestimonial.name,
    role:
      [currentTestimonial.role, currentTestimonial.company]
        .filter(Boolean)
        .join(" at ") || "Client",
    avatar: currentTestimonial.avatar || "/avatars/default.jpg",
    quote: currentTestimonial.content,
    rating: currentTestimonial.rating,
    projectType: currentTestimonial.projectType,
  };

  return (
    <section className="w-full min-h-screen bg-black relative overflow-hidden dark:bg-white">
      {/* Container Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          <TestimonialSlide data={slideData} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 md:top-[40%] right-4 md:right-10 flex flex-col gap-4 z-20">
        <button
          onClick={handlePrev}
          className="bg-white hover:bg-black hover:text-white text-black p-4 rounded-full border border-gray-200 shadow-lg transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="bg-black text-white p-4 rounded-full border border-black shadow-lg hover:scale-110 transition-transform"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Pagination Indicator */}
      <div className="absolute bottom-10 left-6 lg:left-16 flex gap-2">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 w-8 rounded-full cursor-pointer transition-all ${
              idx === currentIndex
                ? "bg-white dark:bg-black w-12"
                : "bg-gray-600 dark:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

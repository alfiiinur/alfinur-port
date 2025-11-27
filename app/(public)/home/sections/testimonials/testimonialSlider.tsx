"use client";

import { testimonials } from "@/components/dataMock/testimonialList";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestimonialSlide } from "./testimonialSlide";

export const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logic Next Slide
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  // Logic Prev Slide
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full min-h-screen bg-black relative overflow-hidden dark:bg-white ">
      {/* Container Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // Kunci penting agar animasi jalan saat index berubah
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          <TestimonialSlide data={testimonials[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons (Floating or Fixed) */}
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

      {/* Pagination Indicator (Optional - Bawah Kiri) */}
      <div className="absolute bottom-10 left-6 lg:left-16 flex gap-2">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 w-8 rounded-full cursor-pointer transition-all ${
              idx === currentIndex ? "bg-black w-12" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

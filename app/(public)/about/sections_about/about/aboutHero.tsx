"use client";

import { useState, useEffect } from "react";
import {
  workNowData,
  workHistoryData,
} from "@/components/dataMock/timelineWork";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

// Auto slider images
const sliderImages = [
  "/img-alfinur/IMG_2280.JPG",
  "/img-alfinur/IMG_2556.JPG",
  "/img-alfinur/IMG_4762.jpg",
  "/img-alfinur/IMG_2252.MOV",
];

export const AboutHero = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Kiri: Judul About Me + Nama & Bio */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <h1 className="text-anton text-[5rem] md:text-[7rem] font-black leading-none tracking-tighter uppercase italic text-black dark:text-white">
              About <br /> Me
            </h1>

            <div className="mt-12 md:mt-0 space-y-6 max-w-[280px]">
              <div>
                <h2 className="text-anton text-3xl md:text-3xl font-black uppercase tracking-tighter italic text-black dark:text-white">
                  ALFI NUR DANIALIN
                </h2>
                <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  I am an IT Developer based in Indonesia, passionate about
                  creating innovative and efficient IT solutions that drive
                  success.
                </p>
              </div>
              <div className="relative h-48 w-full rounded-3xl overflow-hidden">
                <Image
                  src="/img-alfinur/IMG_2280.JPG"
                  alt="Detail"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Auto Slider */}
              <AutoImageSlider />
            </div>
          </div>

          {/* Tengah: Foto utama + Bento Grid */}
          <div className="md:col-span-6 flex flex-col gap-6">
            {/* Foto Utama */}
            <div className="relative h-[400px] md:h-[600px] mt-20 md:mt-40">
              <Image
                src="/img-alfinur/IMG_4762.jpg"
                alt="ALFI NUR DANIALIN"
                fill
                className="object-cover rounded-[3rem]"
                priority
              />
            </div>

            {/* Bento Grid Photos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-3"
            >
              {/* Large Photo */}
              <div className="col-span-2 relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="/img-alfinur/IMG_2280.JPG"
                  alt="Work Environment"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Small Photo */}
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="/img-alfinur/IMG_2556.JPG"
                  alt="Creative Work"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Small Photo */}
              <div className="relative h-32 rounded-2xl overflow-hidden group">
                <video
                  src="/img-alfinur/IMG_2252.MOV"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Medium Photo */}
              <div className="col-span-2 relative h-32 rounded-2xl overflow-hidden group">
                <Image
                  src="/img-alfinur/IMG_4762.jpg"
                  alt="Portfolio"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>
            </motion.div>
          </div>

          {/* Kanan: Foto kecil + Work Now */}
          <div className="md:col-span-3 flex flex-col gap-10">
            <div className="relative h-48 w-full rounded-3xl overflow-hidden">
              <Image
                src="/img-alfinur/IMG_2556.JPG"
                alt="Detail"
                fill
                className="object-cover"
              />
            </div>

            {/* Work Now Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 italic text-black dark:text-white flex items-center gap-2">
                <Briefcase size={30} />
                WORK NOW
              </h3>
              {workNowData.map((work, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-4 bg-black dark:bg-white mb-4 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  {/* Company & Period */}
                  <h4 className="text-lg font-bold mb-1 italic text-white dark:text-black text-center">
                    {work.company.toUpperCase()}
                  </h4>
                  <div className="flex justify-center items-center gap-2 mb-3 flex-wrap">
                    <Badge className="bg-[#C4F135] text-black font-bold">
                      {work.title}
                    </Badge>
                    <Badge className="bg-blue-500 text-white">
                      {work.period}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-sm leading-relaxed dark:text-black/80 mb-3">
                    {work.description}
                  </p>

                  {/* Tech Stack */}
                  {work.techStack && (
                    <div className="mb-3">
                      <span className="text-xs font-bold text-[#C4F135] uppercase tracking-wider mb-2 block">
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {work.techStack.map((tech, tIndex) => (
                          <span
                            key={tIndex}
                            className="text-xs px-2 py-1 bg-white/10 dark:bg-black/10 text-white dark:text-black rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {work.responsibilities && (
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                        Key Tasks
                      </span>
                      <ul className="space-y-1">
                        {work.responsibilities.map((resp, rIndex) => (
                          <li
                            key={rIndex}
                            className="text-xs text-white/70 dark:text-black/70 flex items-start gap-1"
                          >
                            <ChevronRight
                              size={12}
                              className="mt-0.5 shrink-0 text-[#C4F135]"
                            />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work History Section */}
      <WorkHistorySection />
    </>
  );
};

// Work History Section Component
function WorkHistorySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
          Experience
        </span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
          Work History
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
          My professional journey through various roles in technology and
          development.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 transform md:-translate-x-1/2" />

        {workHistoryData.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 ${
              index % 2 === 0 ? "" : "md:direction-rtl"
            }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-[#C4F135] rounded-full transform -translate-x-1/2 z-10 ring-4 ring-white dark:ring-black" />

            {/* Content */}
            <div
              className={`pl-8 md:pl-0 ${
                index % 2 === 0
                  ? "md:pr-12 md:text-right"
                  : "md:col-start-2 md:pl-12"
              }`}
            >
              <div
                className={`bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${
                  index % 2 === 0 ? "md:ml-auto" : ""
                }`}
              >
                {/* Period Badge */}
                <div
                  className={`flex items-center gap-2 mb-3 ${
                    index % 2 === 0 ? "md:justify-end" : ""
                  }`}
                >
                  <Calendar size={14} className="text-[#C4F135]" />
                  <span className="text-xs font-bold text-[#C4F135] uppercase tracking-wider">
                    {work.period}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {work.title}
                </h3>

                {/* Company */}
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                  {work.company}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {work.description}
                </p>

                {/* Highlights */}
                {work.highlights && (
                  <div
                    className={`flex flex-wrap gap-2 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    {work.highlights.map((highlight, hIndex) => (
                      <span
                        key={hIndex}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        <ChevronRight size={12} />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Empty space for alternating layout */}
            {index % 2 === 0 ? (
              <div className="hidden md:block" />
            ) : (
              <div className="hidden md:block md:col-start-1 md:row-start-1" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Auto Image Slider Component
function AutoImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full rounded-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={sliderImages[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#C4F135] w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

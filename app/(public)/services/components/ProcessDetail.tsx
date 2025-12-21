"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ProcessStep {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    number: "01",
    title: "DISKUSI & ANALISIS",
    description:
      "Kita mulai dengan sesi konsultasi untuk memahami visi, kebutuhan, dan tujuan bisnis Anda. Saya akan menganalisis requirement secara mendalam, mengidentifikasi peluang dan tantangan teknis, serta menentukan scope proyek yang jelas.",
    image: "/img/room.jpg",
  },
  {
    id: 2,
    number: "02",
    title: "PROPOSAL & ESTIMASI",
    description:
      "Berdasarkan hasil analisis, saya menyusun proposal lengkap yang mencakup solusi teknis, estimasi biaya transparan, dan timeline realistis. Setiap milestone dijelaskan dengan jelas agar Anda memiliki gambaran penuh tentang proses pengembangan.",
    image: "/img/room.jpg",
  },
  {
    id: 3,
    number: "03",
    title: "DESAIN UI/UX",
    description:
      "Tahap kreasi visual dimulai. Saya merancang wireframe dan mockup interaktif yang mengutamakan user experience. Setiap desain melalui proses review dan iterasi bersama Anda hingga mencapai hasil yang sempurna.",
    image: "/img/room.jpg",
  },
  {
    id: 4,
    number: "04",
    title: "DEVELOPMENT",
    description:
      "Kode ditulis dengan standar industri terbaik menggunakan teknologi modern seperti Next.js, React, dan TypeScript. Clean code, performa optimal, dan skalabilitas menjadi prioritas utama dalam setiap baris kode.",
    image: "/img/room.jpg",
  },
  {
    id: 5,
    number: "05",
    title: "TESTING & QA",
    description:
      "Sebelum launch, setiap fitur diuji secara menyeluruh. Unit testing, integration testing, dan user acceptance testing memastikan aplikasi berjalan sempurna di berbagai device dan browser.",
    image: "/img/room.jpg",
  },
  {
    id: 6,
    number: "06",
    title: "LAUNCH & TRAINING",
    description:
      "Deployment dilakukan dengan zero-downtime strategy. Saya juga menyediakan sesi training dan dokumentasi lengkap agar tim Anda dapat mengelola sistem dengan percaya diri.",
    image: "/img/room.jpg",
  },
  {
    id: 7,
    number: "07",
    title: "MAINTENANCE & SUPPORT",
    description:
      "Hubungan tidak berakhir setelah launch. Saya menyediakan layanan maintenance berkelanjutan, monitoring performa, dan support teknis untuk memastikan aplikasi Anda selalu berjalan optimal.",
    image: "/img/room.jpg",
  },
];

function ProcessStep({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      className="min-h-screen w-full flex items-center justify-center sticky top-0 bg-neutral-50 dark:bg-neutral-950"
    >
      <motion.div
        style={{ opacity, y }}
        className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-20"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
            isEven ? "" : "lg:flex-row-reverse"
          }`}
        >
          {/* Number & Content */}
          <div className={`space-y-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
            {/* Large Number */}
            <span className="text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none text-black/10 dark:text-white/10 block">
              ({step.number})
            </span>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white -mt-16 md:-mt-24">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              {step.description}
            </p>
          </div>

          {/* Image */}
          <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function ProcessDetail() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div id="process" ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/img/room.jpg"
            alt="Process Overview"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white px-6 md:px-12 max-w-[1400px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-[120px] font-bold leading-[0.9] tracking-tight">
              OVERVIEW OF
              <br />
              OUR 7-STAGE
              <br />
              PROCESS
            </h1>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 right-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <div className="relative">
        {processSteps.map((step, index) => (
          <ProcessStep key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

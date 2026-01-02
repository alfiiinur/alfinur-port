"use client";

import MediaPolaroid from "@/components/public/shared/MediaPolaroid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/hooks/useLanguage";

export const HeroServices = () => {
  const { language } = useLanguage();

  const headlineEn = {
    line1: "I Build",
    line2: "Brands",
    line3: "With",
    line4: "Impact.",
  };

  const headlineId = {
    line1: "Saya Membangun",
    line2: "Brand",
    line3: "Dengan",
    line4: "Dampak.",
  };

  const headline = language === "id" ? headlineId : headlineEn;

  const descriptionEn =
    "Seamless design solutions that connect vision, function, and emotion";
  const descriptionId =
    "Solusi desain yang menghubungkan visi, fungsi, dan emosi secara mulus";

  const description = language === "id" ? descriptionId : descriptionEn;

  return (
    <section className="relative w-full min-h-[90vh] bg-white text-black px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-between dark:bg-black dark:text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full grow">
        <div className="relative h-[300px] sm:h-[400px] lg:h-auto hidden md:block">
          {/* Gambar 1 (Kiri Atas - Kecil) */}
          <div className="relative h-[400px] lg:h-[600px]">
            <MediaPolaroid
              src="/frontend/designGraphic/coverbook.png"
              alt="Interior 1"
              rotate="-8deg"
              size="lg"
              top="2rem"
              left="2rem"
            />

            <MediaPolaroid
              src="/video/videoHome.mp4"
              poster="/img/thumbnail-showreel.jpg"
              alt="Showreel"
              rotate="12deg"
              size="xl"
              top="8rem"
              left="12rem"
              zIndex={30}
            />

            <MediaPolaroid
              src="/frontend/webImg/1.png"
              alt="Fun animation"
              rotate="-15deg"
              size="md"
              top="20rem"
              left="4rem"
            />

            <MediaPolaroid
              src="/frontend/webImg/18.png"
              alt="Interior 2"
              rotate="6deg"
              size="sm"
              top="4rem"
              left="24rem"
            />
            <MediaPolaroid
              src="/frontend/webImg/26.png"
              alt="Interior 2"
              rotate="-12deg"
              size="xl"
              top="4rem"
              left="32rem"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase break-words">
            {headline.line1} <br />
            {headline.line2} <br />
            {headline.line3} <br />
            {headline.line4}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-8 sm:mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8 gap-6">
        <p className="max-w-md text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight">
          {description}
        </p>

        <div className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm font-semibold uppercase tracking-wide">
          <Link
            href="/about"
            className="flex items-center gap-1 hover:underline"
          >
            {language === "id" ? "Tentang Saya" : "About me"}{" "}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/services"
            className="flex items-center gap-1 hover:underline"
          >
            {language === "id" ? "Jelajahi Layanan" : "Explore Plans"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

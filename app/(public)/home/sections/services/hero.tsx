import MediaPolaroid from "@/components/public/shared/MediaPolaroid";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const HeroServices = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-white text-black px-6 py-12 flex flex-col justify-between dark:bg-black dark:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full grow">
        <div className="relative h-[400px] lg:h-auto hidden md:block">
          {/* Gambar 1 (Kiri Atas - Kecil) */}
          <div className="relative h-[600px]">
            <MediaPolaroid
              src="/frontend/designGraphic/coverbook.png"
              alt="Interior 1"
              rotate="-8deg"
              size="lg"
              top="4rem"
              left="4rem"
            />

            <MediaPolaroid
              src="/video/videoHome.mp4"
              poster="/img/thumbnail-showreel.jpg"
              alt="Showreel"
              rotate="12deg"
              size="xl"
              top="12rem"
              left="20rem"
              zIndex={30}
            />

            <MediaPolaroid
              src="/frontend/webImg/1.png"
              alt="Fun animation"
              rotate="-15deg"
              size="md"
              top="28rem"
              left="8rem"
            />

            <MediaPolaroid
              src="/frontend/webImg/18.png"
              alt="Interior 2"
              rotate="6deg"
              size="sm"
              top="6rem"
              left="32rem"
            />
            <MediaPolaroid
              src="/frontend/webImg/26.png"
              alt="Interior 2"
              rotate="-12deg"
              size="xl"
              top="6rem"
              left="40rem"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-end text-right">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase">
            We Build <br />
            Brands <br />
            With <br />
            Impact.
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mt-10 border-t border-gray-200 pt-8">
        <p className="max-w-md text-xl md:text-2xl font-medium leading-tight">
          Seamless design solutions that connect vision, function, and emotion
        </p>

        <div className="flex gap-8 mt-8 md:mt-0 text-sm font-semibold uppercase tracking-wide">
          <Link
            href="/about"
            className="flex items-center gap-1 hover:underline"
          >
            About us <ArrowRight size={16} />
          </Link>
          <Link
            href="/plans"
            className="flex items-center gap-1 hover:underline"
          >
            Explore Plans <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

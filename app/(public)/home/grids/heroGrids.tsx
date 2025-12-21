"use client";

import { MediaCard } from "@/components/public/shared/MediaCard";
import { ArrowUpRight, Play, Tag } from "lucide-react";

// Reusable animated button component
const AnimatedButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <button className={`group relative overflow-hidden ${className}`}>
    <span className="relative overflow-hidden h-4 inline-flex items-center">
      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        {children}
      </span>
    </span>
  </button>
);

export const HeroGrids = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] gap-3 md:gap-4">
        {/* Item 1: Tall Portrait */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:row-span-2 md:col-span-1"
          alt="Fashion Model"
        />

        {/* Item 2: Wide Landscape */}
        <MediaCard
          type="image"
          src="/frontend/webImg/7.png"
          className="md:col-span-2"
          overlay={
            <div className="flex justify-end items-end h-full">
              <button className="group bg-[#bbf7d0] text-black px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg overflow-hidden">
                <Play size={14} fill="black" />
                <span className="relative overflow-hidden h-4 inline-flex items-center">
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    Tutorials
                  </span>
                  <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                    Tutorials
                  </span>
                </span>
              </button>
            </div>
          }
        />

        {/* Item 3: Video */}
        <MediaCard
          type="video"
          src="/video/videoHome.mp4"
          className="md:col-span-1"
          overlay={
            <div className="flex justify-end">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                LIVE
              </span>
            </div>
          }
        />

        {/* Item 4: Portrait */}
        <MediaCard
          type="image"
          src="/frontend/webImg/25.png"
          className="md:row-span-1 md:col-span-1"
        />

        {/* Item 5: Wide Landscape */}
        <MediaCard
          type="image"
          src="/frontend/webImg/2.png"
          className="md:col-span-2"
        />

        {/* Item 6: Wide */}
        <MediaCard
          type="image"
          src="/frontend/webImg/18.png"
          className="md:col-span-2"
        />

        {/* Item 7: Video */}
        <MediaCard
          type="video"
          src="/video/videoHome.mp4"
          className="md:col-span-2"
          overlay={
            <div className="flex flex-col justify-between h-full">
              <div className="flex gap-2">
                <span className="bg-white/80 backdrop-blur text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Play size={10} /> ReelUp
                </span>
              </div>
              <div className="flex justify-between items-end">
                <button className="group bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 overflow-hidden">
                  <span className="relative overflow-hidden h-4 inline-flex items-center">
                    <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                      View Product
                    </span>
                    <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                      View Product
                    </span>
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:rotate-45"
                  />
                </button>
                <div className="flex gap-2 text-white/80">
                  <Tag size={18} />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

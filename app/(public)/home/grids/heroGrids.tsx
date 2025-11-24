import { MediaCard } from "@/components/public/shared/MediaCard";
import { ArrowUpRight, Play, Tag } from "lucide-react";

export const HeroGrids = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      {/* Grid Layout: 4 Kolom di Desktop, Auto Rows set ke tinggi tertentu */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4">
        {/* Item 1: Tall Portrait (Kiri Atas) */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:row-span-2 md:col-span-1"
          alt="Fashion Model"
        />

        {/* Item 2: Wide Landscape (Tengah Atas) */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:col-span-2"
          overlay={
            <div className="flex justify-end items-end h-full">
              <button className="bg-[#bbf7d0] text-black px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                <Play size={14} fill="black" /> Tutorials
              </button>
            </div>
          }
        />

        {/* Item 3: Square/Portrait (Kanan Atas) */}
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

        {/* Item 4: Tall Portrait (Kanan Bawah - Sesuai gambar, orang rambut pink) */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:row-span-1 md:col-span-1"
        />

        {/* Item 5: Wide Landscape (Kiri Bawah) */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:col-span-2"
          overlay={
            <div className="flex justify-center items-center h-full">
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full cursor-pointer hover:bg-white/50 transition">
                <Play fill="white" className="text-white" size={32} />
              </div>
            </div>
          }
        />

        {/* Item 6: Tall/Wide (Kanan Bawah Besar) */}
        <MediaCard
          type="image"
          src="/img/room.jpg"
          className="md:col-span-2"
          overlay={
            <div className="flex flex-col justify-between h-full">
              <div className="flex gap-2">
                <span className="bg-white/80 backdrop-blur text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Play size={10} /> ReelUp
                </span>
              </div>
              <div className="flex justify-between items-end">
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100">
                  View Product <ArrowUpRight size={14} />
                </button>
                <div className="flex gap-2 text-white/80">
                  <Tag size={18} />
                </div>
              </div>
            </div>
          }
        />
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
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100">
                  View Product <ArrowUpRight size={14} />
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

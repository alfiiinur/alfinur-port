import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface MediaCardProps {
  type: "image" | "video";
  src: string;
  className?: string; // Untuk mengatur col-span atau row-span
  overlay?: React.ReactNode; // Untuk badge kustom (e.g., "Live", "Tutorials")
  alt?: string;
}

export const MediaCard = ({
  type,
  src,
  className = "",
  overlay,
  alt = "Gallery Item",
}: MediaCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-zinc-800 ${className}`}
    >
      {/* Media Rendering Logic */}
      {type === "video" ? (
        <video
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Default Overlay Icon (Top Right Arrow) */}
      <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
          <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Custom Overlay Content (Badges, Play Buttons, etc) */}
      {overlay && (
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          {/* Kita gunakan z-index agar overlay tampil di atas media */}
          <div className="z-10 w-full h-full">{overlay}</div>
        </div>
      )}
    </div>
  );
};

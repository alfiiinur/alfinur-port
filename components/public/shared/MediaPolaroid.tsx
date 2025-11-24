import { cn } from "@/lib/utils";
import Image from "next/image";

type MediaPolaroidProps = {
  src: string; // bisa .jpg, .png, .gif, .mp4, .webm
  alt: string;
  rotate?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
  delay?: number;
  poster?: string; // optional: thumbnail untuk video (rekomendasi!)
};

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-40 h-40",
  xl: "w-48 h-48",
};

export default function MediaPolaroid({
  src,
  alt,
  rotate = "0deg",
  size = "md",
  className,
  top,
  left,
  right,
  bottom,
  zIndex = 10,
  delay = 0,
  poster,
}: MediaPolaroidProps) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  const isGif = src.endsWith(".gif");

  return (
    <div
      className={cn(
        "absolute transition-all duration-500 ease-out hover:z-50 hover:scale-110 hover:shadow-2xl",
        sizeClasses[size],
        className
      )}
      style={{
        top,
        left,
        right,
        bottom,
        rotate,
        zIndex,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border-4 border-white ">
        {isVideo ? (
          <video
            src={src}
            poster={poster} 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              "object-cover",
              isGif && "transition-none " 
            )}
          />
        )}
      </div>
    </div>
  );
}

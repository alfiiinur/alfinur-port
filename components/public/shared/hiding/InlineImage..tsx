import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface InlineImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}

export const InlineImage = ({ src, alt, className }: InlineImageProps) => {
  return (
    <span className="inline-block relative align-middle mx-1 -mt-1">
      <div className={cn(
        "relative h-10 w-10 md:h-14 md:w-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white",
        className
      )}>
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover p-2" // p-2 agar icon tidak terlalu penuh (padding)
        />
      </div>
    </span>
  );
};
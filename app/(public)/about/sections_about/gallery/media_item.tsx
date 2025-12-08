import { ArrowUpRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export type SocialMediaType = "image" | "video";

export interface SocialMediaItem {
  id: string | number;
  type: SocialMediaType;
  src: string | StaticImageData;
  alt?: string;
  link?: string; // Optional: jika gambar diklik mau ke link tertentu
}

export const MediaItemRenderer = ({ item }: { item: SocialMediaItem }) => {
  const content = (
    <div className="relative w-full h-[300px] md:h-[400px] grayscale hover:grayscale-0 transition-all duration-500 ease-out group overflow-hidden bg-gray-900 rounded-xl">
      {item.type === "video" ? (
        <video
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={item.src as string} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={item.src}
          alt={item.alt || "Social gallery"}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      )}

      {/* Optional: Icon overlay saat hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <ArrowUpRight className="text-white w-8 h-8 drop-shadow-lg" />
      </div>
    </div>
  );

  // Jika ada link, bungkus dengan Link
  if (item.link) {
    return (
      <Link href={item.link} className="block w-full" target="_blank">
        {content}
      </Link>
    );
  }

  return <div className="w-full">{content}</div>;
};

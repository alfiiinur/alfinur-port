import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MediaItemRenderer, SocialMediaItem } from "./media_item";
import { TextHeadingBottom } from "@/components/public/shared/TextHeadingBottom";

interface SocialGallerySectionProps {
  titleDescription: string;
  items: SocialMediaItem[];
  socialLinks: { label: string; href: string }[];
}

export default function SocialGallerySection({
  titleDescription,
  items,
  socialLinks,
}: SocialGallerySectionProps) {
  return (
    <section className="bg-black text-white px-6 py-16 md:py-24 border-t border-white/10 dark:bg-white dark:text-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <TextHeadingBottom
            text="ABOUT ME"
            className="text-white dark:text-black "
          />
        </div>

        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <p className="max-w-md text-md md:text-lg text-white font-normal leading-relaxed dark:text-black italic">
            {titleDescription}
          </p>
          <Link
            href="#"
            className="group flex items-center gap-1 text-sm font-medium uppercase tracking-wider border-b border-transparent hover:border-white transition-all pb-1 "
          >
            See Social
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2. Gallery Grid (5 Columns) */}
        {/* Menggunakan grid-cols-2 di mobile, dan grid-cols-5 di desktop agar persis referensi */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20 ">
          {items.map((item) => (
            <MediaItemRenderer key={item.id} item={item} />
          ))}
        </div>

        {/* 3. Big Typography Divider */}
        <div className="flex items-center justify-between w-full mb-20 overflow-hidden">
          <h2 className="text-[12vw] md:text-[8vw] leading-none font-normal tracking-tight">
            OUR
          </h2>
          {/* Garis pemisah yang responsif */}
          <div className="flex-grow mx-4 md:mx-12 h-[1px] bg-white/30 self-center dark:bg-black"></div>
          <h2 className="text-[12vw] md:text-[8vw] leading-none font-normal tracking-tight text-right">
            SOCIAL
          </h2>
        </div>

        {/* 4. Footer / Subscription Area */}
        <div className="grid md:grid-cols-2 gap-12 items-end">
          {/* Left: Newsletter */}
          <div className="space-y-6">
            <p className="text-white text-sm max-w-sm uppercase tracking-wide dark:text-black">
              Subscribe to our newsletter and receive more information about our
              world and products.
            </p>
            <form className="flex items-center border-b border-white/30 py-4 max-w-md group focus-within:border-white transition-colors">
              <input
                type="email"
                placeholder="SUBSCRIBE"
                className="bg-transparent border-none outline-none text-white placeholder-white/70 w-full text-sm tracking-wider uppercase dark:text-black dark:placeholder-black"
              />
              <button
                type="button"
                className="text-white hover:text-gray-300 dark:text-black dark:hover:text-black"
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right: Links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 md:justify-self-end text-sm text-gray-400">
            <div className="space-y-4 flex flex-col">
              <span className="text-white uppercase tracking-wider mb-2 dark:text-black font-bold ">
                Menu
              </span>
              <Link
                href="#"
                className="hover:text-white dark:hover:text-black transition-colors"
              >
                Services
              </Link>
              <Link
                href="#"
                className="hover:text-white dark:hover:text-black transition-colors"
              >
                Work
              </Link>
              <Link
                href="#"
                className="hover:text-white dark:hover:text-black transition-colors"
              >
                About
              </Link>
            </div>
            <div className="space-y-4 flex flex-col">
              <span className="text-white uppercase tracking-wider mb-2 dark:text-black font-bold">
                Follow Us
              </span>
              {socialLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="hover:text-white dark:hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

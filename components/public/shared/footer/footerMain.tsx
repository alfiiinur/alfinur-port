"use client";

import Image from "next/image";
import SocialSticker from "../SocialStikers";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/hooks/useLanguage";

export default function FooterMain() {
  const { language } = useLanguage();

  const introTextEn = {
    line1: "I keep things simple, creative and nonsense-free.",
    line2: "Drop us a line at",
  };

  const introTextId = {
    line1:
      "Saya menjaga hal-hal tetap sederhana, kreatif dan tanpa omong kosong.",
    line2: "Hubungi kami di",
  };

  const helloTextEn = "Hello Everyone 🙌.";
  const helloTextId = "Halo Semuanya 🙌.";

  const descEn =
    "From bases in Indonesia I work remotely with start-ups and famous names from all over the world.";
  const descId =
    "Dari Indonesia saya bekerja secara remote dengan start-up dan nama-nama terkenal dari seluruh dunia.";

  const copyrightEn = "© 2025 Helo. Alfi Nur Daniali - All rights reserved.";
  const copyrightId = "© 2025 Helo. Alfi Nur Daniali - Hak cipta dilindungi.";

  const builtWithEn = "Built with";
  const builtWithId = "Dibuat dengan";

  const introText = language === "id" ? introTextId : introTextEn;
  const helloText = language === "id" ? helloTextId : helloTextEn;
  const desc = language === "id" ? descId : descEn;
  const copyright = language === "id" ? copyrightId : copyrightEn;
  const builtWith = language === "id" ? builtWithId : builtWithEn;

  return (
    <div className="bg-white text-white relative overflow-hidden px-4 sm:px-6 py-12 sm:py-20 min-h-[600px] sm:min-h-[800px] dark:bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 relative z-10">
        {/* Center Top Text */}
        <div className="md:col-span-12 text-center mb-10 sm:mb-20">
          <p className="font-anton text-black text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed dark:text-white px-4">
            {introText.line1}
            <br />
            {introText.line2}{" "}
            <a
              href="mailto:alfinurdanialin900@gmail.com"
              className="underline decoration-gray-500 underline-offset-4 hover:text-gray-300 transition-colors break-all sm:break-normal"
            >
              alfinurdanialin900@gmail.com
            </a>
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col justify-between h-full mt-6 sm:mt-10">
          <div>
            <h2 className="text-black font-libre-baskerville text-2xl sm:text-3xl md:text-4xl italic mb-4 sm:mb-6 dark:text-white">
              {helloText}
            </h2>
            <p className="font-poppins text-black text-xs sm:text-sm max-w-xs leading-relaxed dark:text-white">
              {desc}
            </p>
          </div>
        </div>
        <div className="md:col-span-3 hidden md:block"></div>

        <div className="md:col-span-4 flex flex-col items-start md:items-end relative">
          <div className="mt-10 sm:mt-20 relative w-full h-32 sm:h-40 md:w-64">
            <div className="absolute right-4 sm:right-10 top-0">
              <SocialSticker href="#" label="Instagram" rotate="-rotate-2" />
            </div>
            <div className="absolute right-12 sm:right-20 top-10 sm:top-12">
              <SocialSticker href="#" label="Facebook" rotate="-rotate-6" />
            </div>
            <div className="absolute right-0 top-14 sm:top-16">
              <SocialSticker href="#" label="Dribbble" rotate="rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Images - Hidden on mobile */}
      <div className="hidden sm:block absolute top-10 left-[5%] w-24 sm:w-32 md:w-48 grayscale hover:grayscale-0 transition-all duration-500 rotate-3 opacity-80">
        <Image
          src="/img-footer/img1.jpg"
          alt="Decoration"
          width={200}
          height={150}
          className="shadow-lg rounded-2xl"
        />
      </div>
      <div className="hidden sm:block absolute top-40 right-[5%] w-32 sm:w-40 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 -rotate-3 z-0">
        <Image
          src="/img-footer/img2.jpg"
          alt="Decoration"
          width={300}
          height={400}
          className="shadow-xl rounded-2xl"
        />
      </div>
      <div className="hidden sm:block absolute bottom-32 left-[15%] w-36 sm:w-48 md:w-72 grayscale hover:grayscale-0 transition-all duration-500 -rotate-6 z-0">
        <Image
          src="/img-footer/img3.jpg"
          alt="Decoration"
          width={400}
          height={250}
          className="shadow-xl rounded-2xl"
        />
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-16 sm:mt-32 pt-8 sm:pt-12 text-[8px] sm:text-[10px] uppercase tracking-widest text-white/30">
        <Separator className="my-4 sm:my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8">
          <p className="text-black text-center md:text-left dark:text-white">
            {copyright}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-center">
            <span className="text-black dark:text-white">{builtWith}</span>
            <span className="text-black dark:text-white text-[7px] sm:text-[10px]">
              Next.js • Tailwind • shadcn/ui • gsap • framer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

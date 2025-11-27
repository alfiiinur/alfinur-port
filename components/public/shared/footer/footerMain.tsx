import Image from "next/image";

import SocialSticker from "../SocialStikers";
import { Separator } from "@/components/ui/separator";
import { HighlightTeks } from "../HighlightTeks";

export default function FooterMain() {
  return (
    <div className="bg-white text-white relative overflow-hidden px-6 py-20 min-h-[800px] dark:bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        {/* Center Top Text */}
        <div className="md:col-span-12 text-center mb-20">
          <p className="font-anton text-black text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed dark:text-white">
            I keep things simple, creative and nonsense-free.
            <br />
            Drop us a line at{" "}
            <a
              href="mailto:alfinurdanialin900@gmail.com"
              className="underline decoration-gray-500 underline-offset-4 hover:text-gray-300 transition-colors"
            >
              alfinurdanialin900@gmail.com
            </a>
          </p>
          {/* <HighlightTeks textHighlight="Let’s create something amazing together." /> */}
        </div>
        <div className="md:col-span-5 flex flex-col justify-between h-full mt-10">
          <div>
            <h2 className="text-black font-libre-baskerville text-4xl italic mb-6 dark:text-white">
              Hello.
            </h2>
            <p className="font-poppins text-black text-sm max-w-xs leading-relaxed dark:text-white">
              From bases in London and Melbourne I work remotely with start-ups
              and famous names from all over the world.
            </p>
          </div>
        </div>
        <div className="md:col-span-3"></div>

        <div className="md:col-span-4 flex flex-col items-start md:items-end relative">
          {/* Social Stickers (Absolute positioning relative to this col or scattered) */}
          <div className="mt-20 relative w-full h-40 md:w-64">
            <div className="absolute right-10 top-0">
              <SocialSticker href="#" label="Instagram" rotate="-rotate-2" />
            </div>
            <div className="absolute right-20 top-12">
              <SocialSticker href="#" label="Facebook" rotate="-rotate-6" />
            </div>
            <div className="absolute right-0 top-16">
              <SocialSticker href="#" label="Dribbble" rotate="rotate-12" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-10 left-[5%] w-32 md:w-48 grayscale hover:grayscale-0 transition-all duration-500 rotate-3 opacity-80">
        <Image
          src="/img-footer/img1.jpg"
          alt="Decoration"
          width={200}
          height={150}
          className="shadow-lg rounded-2xl"
        />
      </div>
      <div className="absolute top-40 right-[5%] w-40 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 -rotate-3 z-0">
        <Image
          src="/img-footer/img2.jpg"
          alt="Decoration"
          width={300}
          height={400}
          className="shadow-xl rounded-2xl"
        />
      </div>
      <div className="absolute bottom-32 left-[15%] w-48 md:w-72 grayscale hover:grayscale-0 transition-all duration-500 -rotate-6 z-0">
        <Image
          src="/img-footer/img3.jpg"
          alt="Decoration"
          width={400}
          height={250}
          className="shadow-xl rounded-2xl"
        />
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-32 pt-12 text-[10px] uppercase tracking-widest text-white/30">
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-black text-center md:text-left dark:text-white ">
            © 2025 Helo Claps. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="text-black dark:text-white">Built with</span>
            <span className="text-black dark:text-white">
              Next.js • Tailwind • shadcn/ui
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

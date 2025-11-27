import { scatteredImages } from "@/components/dataMock/not-found";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative w-full min-h-screen bg-[#fdfdfd] dark:bg-black text-black dark:text-white overflow-hidden font-anton antialiased">
      {/* Background Scattered Images */}
      <div className="absolute inset-0 pointer-events-none">
        {scatteredImages.map((img, idx) => (
          <div
            key={idx}
            className={`
              absolute transition-all duration-700 ease-out
              hover:scale-110 hover:z-50 hover:shadow-2xl
              will-change-transform
              ${img.className}
            `}
          >
            <div className="relative overflow-hidden rounded-xl shadow-xl bg-white dark:bg-zinc-900 p-1">
              <Image
                src={img.src}
                alt={img.alt}
                width={320}
                height={400}
                className="object-cover w-full h-full rounded-lg select-none pointer-events-none"
                sizes="(max-width: 768px) 100px, 160px"
                priority={idx < 5} // Faster load for visible ones
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-10 md:px-12 md:py-16 lg:px-20">
        {/* Top Left: ERROR PAGE */}
        <div className="flex flex-col leading-none">
          <h1 className="text-[16vw] xs:text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[10rem] xl:text-[12rem] font-black tracking-tighter uppercase select-none">
            ERROR
          </h1>
          <h1 className="text-[16vw] xs:text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[10rem] xl:text-[12rem] font-black tracking-tighter uppercase select-none -mt-4 sm:-mt-8 md:-mt-12">
            PAGE
          </h1>
        </div>

        {/* Bottom Right: BRING ME BACK */}
        <div className="flex flex-col items-end text-right leading-none">
          <Link
            href="/"
            className="group transition-all duration-500 hover:scale-105 active:scale-95"
            prefetch={false}
          >
            <span className="block text-[10vw] xs:text-[9vw] sm:text-[8vw] md:text-[7vw] lg:text-[6.5rem] xl:text-[7.5rem] font-black tracking-tighter uppercase transition-transform group-hover:translate-x-4">
              BRING
            </span>
            <span className="block text-[10vw] xs:text-[9vw] sm:text-[8vw] md:text-[7vw] lg:text-[6.5rem] xl:text-[7.5rem] font-black tracking-tighter uppercase transition-transform group-hover:translate-x-8">
              ME BACK
            </span>
            <span className="block text-[10vw] xs:text-[9vw] sm:text-[8vw] md:text-[7vw] lg:text-[6.5rem] xl:text-[7.5rem] font-black tracking-tighter uppercase transition-transform group-hover:translate-x-12">
              TO THE FEED
            </span>
          </Link>
          <RoundedButton href="/" className="mt-6">
            Go to Homepage
          </RoundedButton>
        </div>
      </div>

      {/* Full-screen invisible return link (mobile UX) */}
      <Link
        href="/"
        className="absolute inset-0 z-20"
        aria-label="Return to homepage"
      />
    </main>
  );
}

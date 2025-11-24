import { MarqueeContent } from "./MarqueContent";

export const ServicesMarquee = () => {
  return (
    <section className="w-full bg-[#004D43] py-8 md:py-16 overflow-hidden border-y border-[#C4F135]/20">
      {/* Wrapper untuk animasi */}
      <div className="flex whitespace-nowrap">
        {/* Loop Pertama */}
        <div className="flex animate-marquee items-center">
          <MarqueeContent />
        </div>

        {/* Loop Kedua (Duplikat untuk efek seamless) */}
        <div className="flex animate-marquee items-center absolute left-full top-0 md:static md:left-auto">
          <MarqueeContent />
        </div>

        {/* Untuk layar sangat lebar, kadang butuh 3 render agar aman */}
        <div className=" animate-marquee items-center hidden 2xl:flex">
          <MarqueeContent />
        </div>
      </div>
    </section>
  );
};

import { SocialLink } from "@/components/public/shared/SocialLinks";
import Image from "next/image";
import { motion } from "framer-motion";

interface TestimonialSlideProps {
  data: {
    headline: string;
    signature: string;
    image: string;
    socials: { label: string; href: string }[];
    bodyText: string;
    quote: string;
    author: string;
  };
}

export const TestimonialSlide = ({ data }: TestimonialSlideProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 ">
        {/* === BAGIAN ATAS KIRI (Headline) === */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 lg:pl-16 lg:pr-8 py-10 lg:py-0 relative z-10 bg-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`font-anton text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] uppercase tracking-tighter text-black mb-6`}
          >
            {data.headline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`font-anton text-5xl md:text-6xl text-black -rotate-6 ml-4`}
          >
            {data.signature}
          </motion.div>
        </div>

        {/* === BAGIAN ATAS KANAN (Foto) === */}
        <div className="lg:col-span-5 relative h-[400px] lg:h-[600px] bg-gray-100">
          {/* Background abu-abu separuh bawah untuk efek overlap */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#F5F5F5] z-0"></div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full h-full z-10"
          >
            <Image
              src={data.image}
              alt={data.signature}
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* === BAGIAN BAWAH (3 Kolom) === */}
      <div className="bg-[#F5F5F5] px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Kolom 1: Social Links */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-sm mb-4 text-black">Follow Us</h4>
            {data.socials.map((social, idx: number) => (
              <SocialLink key={idx} label={social.label} href={social.href} />
            ))}
          </div>

          {/* Kolom 2: Body Text (Drop Cap) */}
          <div className="text-gray-600 leading-relaxed text-sm md:text-base">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-black first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              {data.bodyText}
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor
              sit amet.
            </p>
          </div>

          {/* Kolom 3: Testimonial Quote */}
          <div className="flex flex-col justify-between h-full">
            <blockquote className="text-sm font-medium italic text-gray-800 mb-6">
              {data.quote}
            </blockquote>

            <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Testimonial By
                </p>
                <p className="font-bold text-black">{data.author}</p>
              </div>
              {/* Avatar Kecil (Opsional) */}
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-gray-300">
                <Image
                  src={data.image}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { timelineData } from "@/components/dataMock/timelineWork";
import { Timeline } from "@/components/public/shared/Timeline";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const AboutHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Kiri: Judul About Me + Nama & Bio (dipindah ke sini) */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <h1 className="text-anton text-[5rem] md:text-[7rem] font-black leading-none tracking-tighter uppercase italic">
            About <br /> Me
          </h1>

          {/* Nama + Bio dipindah ke bawah "About Me" */}
          <div className="mt-12 md:mt-0 space-y-6 max-w-[280px]">
            <div>
              <h2 className="text-anton text-3xl md:text-3xl font-black uppercase tracking-tighter italic text-black dark:text-white">
                ALFI NUR DANIALIN
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                I am an IT Developer based in Indonesia, passionate about
                creating innovative and efficient IT solutions that drive
                success.
              </p>
            </div>
          </div>
        </div>

        {/* Tengah: Foto utama */}
        <div className="md:col-span-6 relative h-[400px] md:h-[600px] mt-20 md:mt-40">
          <Image
            src="/img-alfinur/IMG_4762.jpg"
            alt="ALFI NUR DANIALIN"
            fill
            className="object-cover rounded-[3rem]"
            priority
          />
        </div>

        {/* Kanan: Foto kecil + Timeline pengalaman kerja */}
        <div className="md:col-span-3 flex flex-col gap-10">
          {/* Foto kecil */}
          <div className="relative h-48 w-full rounded-3xl overflow-hidden">
            <Image
              src="/img-alfinur/IMG_5870.JPG"
              alt="Detail"
              fill
              className="object-cover"
            />
          </div>

          {/* Timeline reusable */}
          <div className="mt-8">
            <div>
              <h3 className="text-xl font-bold mb-2 italic">WORK NOW </h3>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 italic">IT PERTAMINA</h3>
              <div className="gap-2 ">
                <Badge className="bg-green-100 text-green-800 mb-2 mt-1">
                  IT Developer
                </Badge>
              </div>

              <Badge className="bg-blue-100 text-blue-800 mb-4">2025-Now</Badge>

              <p className="text-black text-sm font-medium leading-relaxed font-poppins dark:text-white">
                I work in Pertamina Jagir Surabaya as an IT Developer. My role
                involves developing and maintaining IT systems to support the
                companys operations and enhance efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

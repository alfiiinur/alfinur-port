import { processSteps } from "@/components/dataMock/processList";
import { ProcessList } from "@/components/public/shared/ProcessList";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import Image from "next/image";

export const ProcessSection = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12 dark:bg-black">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* === KOLOM KIRI (35% Lebar) === */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Label Kecil */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-black mb-2 dark:text-white">
            (Our Process)
          </span>

          {/* Gambar Square */}
          <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
            {/* Ganti src dengan gambar arsitektur Anda */}
            <Image
              src="/img/room.jpg"
              alt="Architecture Process"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* List Component */}
          <ProcessList items={processSteps} />
        </div>
        <div className="lg:col-span-8 flex flex-col justify-between pt-4">
          <div className="space-y-12">
            {/* Headline Besar */}
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.1] tracking-tight text-black dark:text-white">
              Our approach at OH Architecture is designed to make your journey
              from concept to completion as smooth and enjoyable as possible.
            </h2>

            {/* Paragraf Deskripsi */}
            <p className="text-2xl md:text-3xl lg:text-[2rem] leading-[1.2] font-medium text-black max-w-4xl dark:text-white">
              With our 6-stage process, we prioritise clarity, collaboration,
              and your unique vision. At every step, we,ll keep you informed,
              inspired, and involved.
            </p>
          </div>

          {/* Tombol Reusable */}
          <div className="mt-16">
            <RoundedButton href="/process">
              Get to know our process
            </RoundedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

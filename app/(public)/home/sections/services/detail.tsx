import { services } from "@/components/dataMock/servicessList";
import { Plus } from "lucide-react";
import Image from "next/image";

export const ServiceDetail = () => {
  return (
    <section className="w-full bg-black text-black py-20 px-6 dark:bg-white dark:text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* KOLOM 1: Nomor Index (01) */}
        <div className="md:col-span-1">
          <span className="text-sm font-bold text-gray-400">01</span>
        </div>

        {/* KOLOM 2: Gambar Portfolio */}
        <div className="md:col-span-4">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group">
            <Image
              src="/img/room.jpg"
              alt="Brand Guidelines Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Text pada Gambar (Opsional seperti referensi) */}
            <div className="absolute bottom-4 left-4 text-white font-bold text-xl z-10">
              CELERO
            </div>
          </div>
        </div>

        {/* KOLOM 3: Judul Besar & List Service */}
        <div className="md:col-span-7 flex flex-col justify-between">
          {/* Judul Besar */}
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-12 text-white dark:text-black">
            Graphic & <br /> Branding <br /> Design
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-300 pt-10">
            {/* Deskripsi */}
            <div>
              <p className="text-white text-xl md:text-2xl font-medium leading-snug dark:text-black">
                We design cohesive visual identities—from logos to brand
                systems—that scale with your business.
              </p>
            </div>

            {/* List Services */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm md:text-base font-medium text-gray-600">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 cursor-pointer hover:text-black transition-all group"
                >
                  <span className="text-[#C4F135] font-bold text-xl translate-x-[-16px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all   ">
                    <Plus />
                  </span>
                  <span className=" text-white dark:text-black">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

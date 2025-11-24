import Image from "next/image";

export const PrincipalsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Container Background */}
      <div className="bg-[#F2F0EB] rounded-[3rem] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Principal 1 (Kiri) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="relative w-48 h-48 md:w-full md:h-72 rounded-2xl overflow-hidden">
              <Image
                src="/img-alfinur/IMG_4762.jpg"
                alt="Alfi Nur Danialin"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Alfi Nur Danialin</h3>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                IT Developer
              </p>
            </div>
          </div>

          {/* Tengah: Judul & Deskripsi */}
          <div className="text-center flex flex-col items-center justify-center space-y-6">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-sm">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                Meet The <br /> Principals
              </h2>
            </div>

            {/* Hiasan kecil (Gambar kecil di tengah) */}
            <div className="flex gap-2">
              <div className="w-24 h-16 bg-gray-300 rounded-md overflow-hidden relative">
                <Image
                  src="/img-alfinur/alfi.jpg"
                  alt="decor"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-24 h-16 bg-gray-300 rounded-md overflow-hidden relative">
                <Image
                  src="/img-alfinur/IMG_5870.jpg"
                  alt="decor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-600 max-w-xs mx-auto">
              As principal and licensed designer, the founder oversees the
              day-to-day operations of Britto-Charette and the design and
              manufacture of our firms custom furniture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

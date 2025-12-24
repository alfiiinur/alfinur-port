"use client";

import { MapPin, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LocationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.2297575873763!2d112.6895401720673!3d-7.500962627369682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e097924dd0e3%3A0xcdcfd77f945f48b7!2sWates%2C%20Kedensari%2C%20Tanggulangin%2C%20Sidoarjo%20Regency%2C%20East%20Java%2061272!5e0!3m2!1sen!2sid!4v1764543991237!5m2!1sen!2sid";

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-black ">
      {/* Container Utama */}
      <div
        className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Background Image Map (Grayscale) */}
        {/* Pastikan kamu punya gambar map statis di folder public/images atau ganti src nya */}
        <div className="absolute inset-0 w-full h-full bg-gray-200">
          {/* Placeholder Image: Ganti '/map-bg.jpg' dengan path gambarmu */}
          <Image
            src="/img/room.jpg"
            alt="Map Background"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
          />
          {/* Fallback jika gambar tidak ada, pakai warna solid agar text tetap terbaca */}
          <div className="absolute inset-0 bg-gray-200/50 mix-blend-multiply"></div>
        </div>

        {/* Floating Card (Kartu Alamat) */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs z-10 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-black text-white p-1.5 rounded-full">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                HOUSE ALFI NUR DANIALIN
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Sidoarjo-Sidoarjo
                <br />
                Sidoarjo
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Located 25 From City Sidoarjo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Text (Optional - Click to View) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-300">
          <span className="opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 rounded-full text-sm font-medium transition-opacity duration-300">
            Klik untuk melihat peta
          </span>
        </div>
      </div>

      {/* --- MODAL Component --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 shadow-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Google Maps Iframe */}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </section>
  );
}

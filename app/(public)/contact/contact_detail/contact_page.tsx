"use client";

import { TextHeadingBottom } from "@/components/public/shared/TextHeadingBottom";
import { useLanguage } from "@/lib/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";

export const ContactSection = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      studio: "Studio",
      address: {
        name: "Alfinur Studio",
        city: "Surabaya, Indonesia",
        region: "East Java 60xxx",
        phone: "(+62) 812 1722 1460",
      },
      generalEnquiries: "General Enquiries",
      follow: "Follow",
      manifesto:
        "Creative Developer & Designer — Passionate about crafting digital experiences that blend aesthetics with functionality. From web applications to brand identities, every project is an opportunity to create something meaningful and impactful.",
      headingText: "CONTACT",
    },
    id: {
      studio: "Studio",
      address: {
        name: "Alfinur Studio",
        city: "Surabaya, Indonesia",
        region: "Jawa Timur 60xxx",
        phone: "(+62) 812 1722 1460",
      },
      generalEnquiries: "Pertanyaan Umum",
      follow: "Ikuti",
      manifesto:
        "Developer & Desainer Kreatif — Bersemangat dalam menciptakan pengalaman digital yang memadukan estetika dengan fungsionalitas. Dari aplikasi web hingga identitas merek, setiap proyek adalah kesempatan untuk menciptakan sesuatu yang bermakna dan berdampak.",
      headingText: "KONTAK",
    },
  };

  const t = content[language];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/alfii_nur1",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/alfinur/",
    },
    { name: "GitHub", href: "https://github.com/alfiiinur" },
    {
      name: "Dribbble",
      href: "https://dribbble.com/alfiii2",
    },
  ];

  return (
    <section
      className={`w-full bg-black text-white min-h-screen flex flex-col justify-between pt-16 md:pt-24 overflow-hidden`}
    >
      {/* === BAGIAN ATAS: Info & Gambar === */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* KIRI: Informasi Kontak (7 Kolom) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          {/* Grid Informasi Kecil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-16">
            {/* Kolom 1: Alamat */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-500 mb-4 uppercase">
                {t.studio}
              </h4>
              <p className="text-xs leading-loose text-gray-300 uppercase tracking-wider">
                {t.address.name}
                <br />
                {t.address.city}
                <br />
                {t.address.region}
                <br />
                {t.address.phone}
              </p>
            </div>

            {/* Kolom 2: Email Links */}
            <div>
              <div className="mb-6">
                <h4 className="text-[10px] font-bold tracking-widest text-gray-500 mb-2 uppercase">
                  {t.generalEnquiries}
                </h4>
                <Link
                  href="mailto:alfinurdanialin900@gmail.com"
                  className="text-xs text-white border-b border-gray-600 pb-0.5 hover:border-white transition-colors uppercase tracking-wider"
                >
                  alfinurdanialin900@gmail.com
                </Link>
              </div>
            </div>

            {/* Kolom 3: Social Media */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-500 mb-4 uppercase">
                {t.follow}
              </h4>
              <div className="flex flex-col gap-2">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white uppercase tracking-wider underline decoration-gray-600 underline-offset-4 hover:decoration-white transition-all w-fit"
                  >
                    {social.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Paragraf Manifesto (Bawah Grid Info) */}
          <div className="max-w-md mt-auto mb-10 lg:mb-0">
            <p className="text-[10px] md:text-xs leading-relaxed uppercase tracking-widest text-gray-300 text-justify">
              {t.manifesto}
            </p>
          </div>
        </div>

        {/* KANAN: Gambar (5 Kolom) */}
        <div className="lg:col-span-5 relative h-[300px] lg:h-[400px]">
          <Image
            src="/img/room.jpg"
            alt="Studio Interior"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          />
        </div>
      </div>

      {/* === BAGIAN BAWAH: Typography Besar === */}
      <TextHeadingBottom
        text={t.headingText}
        className="text-black dark:text-white"
      />
    </section>
  );
};

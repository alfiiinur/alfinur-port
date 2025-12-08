"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Taruh gambar di folder: public/images/float/1.jpg dst
const images = [
  "/images/float/1.jpg",
  "/images/float/2.jpg",
  "/images/float/3.jpg",
  "/images/float/4.jpg",
  "/images/float/5.jpg",
  "/images/float/6.jpg",
  "/images/float/7.jpg",
  "/images/float/8.jpg",
  // tambah sesukamu
];

// Helper: generate random values sekali saat komponen mount
function useRandomValues() {
  const [values, setValues] = useState<
    Array<{
      rotate: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setValues(
      images.map(() => ({
        rotate: Math.random() * 40 - 20, // -20° sampai +20°
        x: Math.random() * 60 - 30, // gerak horizontal kecil horizontal
        y: Math.random() * 60 - 30, // gerak kecil vertikal
        duration: 20 + Math.random() * 25, // 20–45 detik
        delay: Math.random() * 10,
      }))
    );
  }, []);

  return values;
}

export default function FloatingImages() {
  const randomValues = useRandomValues();

  if (randomValues.length === 0) return null; // sementara render nothing sampai random siap

  return (
    <>
      {images.map((src, i) => {
        const { rotate, x, y, duration, delay } = randomValues[i];

        return (
          <motion.div
            key={src}
            className="pointer-events-none absolute left-1/2 top-1/2 select-none"
            initial={{
              x: `${Math.random() * 60 + 20}%`,
              y: `${Math.random() * 60 + 20}%`,
              rotate: rotate,
              opacity: 0,
            }}
            animate={{
              x: [`${Math.random() * 60 + 20}%`, `${Math.random() * 60 + 20}%`],
              y: [
                `${Math.random() * 70 + 15}%`,
                `${Math.random() * 70 + 15}%`,
                `${Math.random() * 70 + 15}%`,
              ],
              rotate: [rotate, rotate + 10, rotate - 10, rotate],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.15,
              opacity: 1,
              rotate: rotate + 15,
              transition: { duration: 0.4 },
            }}
            style={{
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <Image
              src={src}
              alt="Floating memory"
              width={220}
              height={220}
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 
                         object-cover rounded-2xl shadow-2xl border-4 border-white/10 
                         backdrop-blur-sm"
              priority={i < 4}
              draggable={false}
              unoptimized // kalau gambar di /public dan sudah dioptimasi manual
            />
          </motion.div>
        );
      })}
    </>
  );
}

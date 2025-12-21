"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { AwardData } from "./types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Download, Eye, FileText, Award } from "lucide-react";

// Pool of images for random popup
const popupImages = [
  "/img-alfinur/IMG_2280.JPG",
  "/img-alfinur/IMG_2556.JPG",
  "/img-alfinur/IMG_4762.jpg",
];

// Random positions for popup images (avoiding center content)
const positions = [
  { top: "-120px", left: "-80px", rotate: -12 },
  { top: "-100px", right: "-60px", rotate: 8 },
  { bottom: "-100px", left: "-70px", rotate: 15 },
  { bottom: "-120px", right: "-80px", rotate: -10 },
  { top: "50%", left: "-100px", rotate: -8 },
  { top: "50%", right: "-100px", rotate: 12 },
];

export default function AwardRow({ data }: { data: AwardData }) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate random images and positions on mount
  const randomPopups = useMemo(() => {
    const numPopups = Math.floor(Math.random() * 2) + 2; // 2-3 popups
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    const shuffledImages = [...popupImages].sort(() => Math.random() - 0.5);

    return Array.from({ length: numPopups }, (_, i) => ({
      image: shuffledImages[i % shuffledImages.length],
      position: shuffledPositions[i],
      delay: i * 0.05,
    }));
  }, []);

  const handleDownload = () => {
    if (!data.certificateUrl) return;
    const link = document.createElement("a");
    link.href = data.certificateUrl;
    link.download = `Certificate-${data.name.replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (data.certificateUrl) {
      window.open(data.certificateUrl, "_blank");
    }
  };

  const isPdf = data.certificateUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div
      className="relative grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-gray-100 dark:border-gray-800 group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors px-2 rounded-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popup Images - Hidden on mobile */}
      <AnimatePresence>
        {isHovered && (
          <>
            {randomPopups.map((popup, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  rotate: popup.position.rotate,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: popup.position.rotate,
                }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  duration: 0.3,
                  delay: popup.delay,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute z-50 hidden md:block pointer-events-none"
                style={{
                  top: popup.position.top,
                  bottom: popup.position.bottom,
                  left: popup.position.left,
                  right: popup.position.right,
                }}
              >
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white dark:ring-black">
                  <Image
                    src={popup.image}
                    alt="Achievement"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="md:col-span-4 relative z-10">
        <motion.h3
          animate={{ x: isHovered ? 8 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          {data.name}
        </motion.h3>
      </div>
      <div className="md:col-span-6 relative z-10">
        <p className="text-gray-500 leading-relaxed dark:text-gray-300">
          {data.description}
        </p>
      </div>
      <div className="md:col-span-1 text-right relative z-10">
        <motion.span
          animate={{
            color: isHovered ? "#C4F135" : undefined,
          }}
          className="text-gray-900 font-medium dark:text-white"
        >
          {data.year}
        </motion.span>
      </div>

      {/* Certificate Hover Card */}
      <div className="md:col-span-1 flex justify-end items-center relative z-10">
        {data.certificateUrl ? (
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-500" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-72 p-0 overflow-hidden"
              side="left"
              align="center"
            >
              {/* Certificate Preview */}
              <div className="relative bg-gray-100 dark:bg-gray-800 h-44 flex items-center justify-center overflow-hidden">
                {data.certificateImage ? (
                  <Image
                    src={data.certificateImage}
                    alt={`Certificate - ${data.name}`}
                    fill
                    className="object-cover"
                  />
                ) : isPdf ? (
                  <iframe
                    src={`${data.certificateUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0"
                    title="Certificate Preview"
                  />
                ) : (
                  <Image
                    src={data.certificateUrl}
                    alt={`Certificate - ${data.name}`}
                    fill
                    className="object-contain p-2"
                  />
                )}
                {/* Fallback */}
                {!data.certificateImage && !data.certificateUrl && (
                  <div className="flex flex-col items-center justify-center">
                    <FileText size={48} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Certificate</span>
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">
                    {data.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Certificate • {data.year}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleView}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-900">
            <Award className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}

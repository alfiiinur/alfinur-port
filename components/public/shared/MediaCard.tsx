"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUpRight, Play, Pause, X } from "lucide-react";
import Image from "next/image";

interface MediaCardProps {
  type: "image" | "video";
  src: string;
  className?: string;
  overlay?: React.ReactNode;
  alt?: string;
}

export const MediaCard = ({
  type,
  src,
  className = "",
  overlay,
  alt = "Gallery Item",
}: MediaCardProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  }, []);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-2xl md:rounded-4xl bg-gray-100 dark:bg-zinc-800 ${className}`}
      >
        {/* Media Rendering Logic */}
        {type === "video" ? (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all duration-300 hover:bg-black/70 hover:scale-110"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Expand Button (Top Right Arrow) */}
        <button
          onClick={openModal}
          className="absolute top-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 z-20 cursor-pointer"
          aria-label="View full size"
        >
          <div className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 hover:scale-110 transition-all">
            <ArrowUpRight size={20} />
          </div>
        </button>

        {/* Custom Overlay Content (Badges, Play Buttons, etc) */}
        {overlay && (
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
            <div className="z-10 w-full h-full">{overlay}</div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Media Content */}
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {type === "video" ? (
              <video
                ref={modalVideoRef}
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
                controls
                autoPlay
                playsInline
              >
                <source src={src} type="video/mp4" />
              </video>
            ) : (
              <div className="relative">
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[90vh] w-auto h-auto rounded-2xl shadow-2xl object-contain"
                />
              </div>
            )}

            {/* Caption */}
            {alt && alt !== "Gallery Item" && (
              <p className="text-white text-center mt-4 text-sm opacity-70">
                {alt}
              </p>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            Press ESC or click outside to close
          </p>
        </div>
      )}
    </>
  );
};

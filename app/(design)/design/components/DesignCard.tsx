"use client";

import Link from "next/link";
import { Video, Heart, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const DEFAULT_COVER = "/default-cover.png";

// Helper functions
function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

function isGif(url: string) {
  return url?.match(/\.gif$/i);
}

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  tags: string[];
  _count?: { likes: number };
}

interface DesignCardProps {
  design: Design;
  onLikeChange?: (id: string, count: number) => void;
}

export default function DesignCard({ design, onLikeChange }: DesignCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(design._count?.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageIsVideo = isVideo(design.image);
  const imageIsGif = isGif(design.image);

  useEffect(() => {
    // Check if user already liked this design
    fetch(`/api/designs/${design.id}/like`)
      .then((res) => res.json())
      .then((data) => {
        setLiked(data.liked);
        setLikeCount(data.count);
      })
      .catch(console.error);
  }, [design.id]);

  // Auto-play video when component mounts
  useEffect(() => {
    if (imageIsVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [imageIsVideo]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/designs/${design.id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
      onLikeChange?.(design.id, data.count);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/design/${design.slug}`} className="group">
      <article className="h-full">
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-4/3">
          {imageIsVideo ? (
            <>
              <video
                ref={videoRef}
                src={design.image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" /> Video
                </span>
              </div>
            </>
          ) : imageIsGif ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
                  <Play className="w-3 h-3" /> GIF
                </span>
              </div>
            </>
          ) : (
            <Image
              src={design.image || DEFAULT_COVER}
              alt={design.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fill
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {likeCount}
            </span>
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {design.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {design.title}
          </h3>
          {design.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {design.description}
            </p>
          )}
          {design.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {design.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

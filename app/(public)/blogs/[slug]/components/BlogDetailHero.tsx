"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ImageIcon,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Blog {
  title: string;
  thumbnail: string;
  media: string[];
  category: string;
  createdAt: Date;
  author: { name: string };
}

interface BlogDetailHeroProps {
  post: Blog;
}

export default function BlogDetailHero({ post }: BlogDetailHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Combine thumbnail with media for gallery
  const allImages = [post.thumbnail, ...(post.media || [])].filter(Boolean);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <div className="max-w-6xl mx-auto mb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/blogs" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
        {post.title}
      </h1>

      {/* Author Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
            {post.author.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-foreground text-sm sm:text-base">
                {post.author.name}
              </span>
              <span className="hidden sm:inline text-sm text-green-600 dark:text-green-400">
                Available for work
              </span>
              <button className="text-xs sm:text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
                Follow
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span>•</span>
              <time>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full border transition-colors ${
              isLiked
                ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-3 rounded-full border transition-colors ${
              isBookmarked
                ? "bg-blue-50 border-blue-200 text-blue-500 dark:bg-blue-900/20 dark:border-blue-800"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
          <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:opacity-90 transition-opacity">
            Get in touch
          </button>
        </div>
      </div>

      {/* Main Image with Side Actions */}
      <div className="relative">
        {/* Image Container */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted aspect-video sm:aspect-16/10">
          {allImages.length > 0 ? (
            <>
              <Image
                src={allImages[currentImageIndex]}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}

              {/* Side Action Buttons - Inside image on large screens */}
              <div className="hidden lg:flex flex-col gap-3 absolute right-4 top-4">
                <div className="flex flex-col items-center gap-1">
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors bg-black/30 backdrop-blur-sm text-white">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/80">49</span>
                </div>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors bg-black/30 backdrop-blur-sm text-white"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors bg-black/30 backdrop-blur-sm text-white">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-14 h-10 sm:w-20 sm:h-14 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all ${
                currentImageIndex === index
                  ? "ring-2 ring-primary ring-offset-1 sm:ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Action Buttons */}
      <div className="flex md:hidden items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2.5 sm:p-3 rounded-full border transition-colors ${
            isLiked
              ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
          />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2.5 sm:p-3 rounded-full border transition-colors ${
            isBookmarked
              ? "bg-blue-50 border-blue-200 text-blue-500 dark:bg-blue-900/20 dark:border-blue-800"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Bookmark
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isBookmarked ? "fill-current" : ""
            }`}
          />
        </button>
        <button
          onClick={handleShare}
          className="p-2.5 sm:p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium text-sm sm:text-base">
          Get in touch
        </button>
      </div>
    </div>
  );
}

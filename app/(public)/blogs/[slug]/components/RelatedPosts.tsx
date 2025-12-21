"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
  media?: string[];
}

interface RelatedPostsProps {
  posts: Blog[];
  authorName?: string;
}

export default function RelatedPosts({
  posts,
  authorName = "Author",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          More by {authorName}
        </h2>
        <Link
          href="/blogs"
          className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View profile
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Grid - Bento Style Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {posts.slice(0, 4).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blogs/${post.slug}`} className="group block">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 aspect-4/3">
                {/* Main Image */}
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  </div>
                )}

                {/* Overlay with multiple preview images */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating preview images - like in the reference */}
                {post.media && post.media.length > 0 && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1">
                    {post.media.slice(0, 2).map((mediaUrl, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-6 sm:w-12 sm:h-8 rounded-md overflow-hidden border-2 border-white/20 shadow-lg"
                      >
                        <Image
                          src={mediaUrl}
                          alt=""
                          width={48}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Services Section - Like in reference image */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Services by {authorName}
          </h2>
          <Link
            href="/services"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View all services
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {["Web Development", "UI/UX Design", "Consulting"].map(
            (service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href="/services" className="group block">
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors bg-white dark:bg-gray-900">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-white text-lg sm:text-xl">
                        {service.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                      {service}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Professional {service.toLowerCase()} services
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

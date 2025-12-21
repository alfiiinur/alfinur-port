"use client";

import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { Marquee } from "@/components/ui/marquee";
import { ArrowUpRight, Calendar, Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

interface BlogHeroProps {
  featuredBlogs?: Blog[];
  categories?: string[];
}

const marqueeWords = [
  "TECH",
  "✦",
  "CODE",
  "✦",
  "DESIGN",
  "✦",
  "DEV",
  "✦",
  "WEB",
  "✦",
  "TIPS",
  "✦",
];

export default function BlogHero({
  featuredBlogs = [],
  categories = [],
}: BlogHeroProps) {
  const featured = featuredBlogs.slice(0, 4);
  const mainFeatured = featured[0];
  const sideFeatured = featured.slice(1, 3);
  const bottomFeatured = featured[3];

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block"
          >
            • Alfi Journal
          </motion.span>
          <AnimatedLines
            lines={["Conscious Reads for", "the Modern Developer."]}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
          />
        </div>
        <RoundedButton href="#blog-content">Read Our Blog</RoundedButton>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden py-4 mb-8 border-y border-border">
        <Marquee className="[--duration:30s]" pauseOnHover>
          {marqueeWords.map((word, i) => (
            <span
              key={i}
              className="text-5xl md:text-7xl font-bold text-foreground/10 mx-4"
            >
              {word}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Bento Grid */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Main Featured - Left Large */}
          {mainFeatured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-5 md:row-span-2"
            >
              <Link
                href={`/blogs/${mainFeatured.slug}`}
                className="group block h-full"
              >
                <div className="relative h-[400px] md:h-full min-h-[500px] rounded-3xl overflow-hidden bg-[#E8E4D9]">
                  <Image
                    src={mainFeatured.thumbnail || "/img/room.jpg"}
                    alt={mainFeatured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-orange-400 p-2 rounded-full">
                      <span className="text-lg">🔥</span>
                    </span>
                  </div>
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                      <span className="font-medium">Category</span>
                      <span>.</span>
                      <span>{mainFeatured.category}</span>
                      <span className="mx-2">|</span>
                      <Calendar size={12} />
                      <span>
                        {new Date(mainFeatured.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">
                      {mainFeatured.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Middle Column - Featured Card + List */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Featured Card */}
            {sideFeatured[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#C4F135] rounded-3xl p-6 flex-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-black/70">Category</span>
                    <span className="text-black/50">.</span>
                    <span className="text-black/70">
                      {sideFeatured[0].category}
                    </span>
                  </div>
                  <Link
                    href={`/blogs/${sideFeatured[0].slug}`}
                    className="p-2 bg-white rounded-full hover:bg-black hover:text-white transition-colors"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight mb-4">
                  {sideFeatured[0].title}
                </h3>
                <p className="text-sm text-black/70 line-clamp-3 mb-4">
                  {sideFeatured[0].excerpt}
                </p>
                <Link
                  href={`/blogs/${sideFeatured[0].slug}`}
                  className="text-sm font-bold text-black underline underline-offset-4"
                >
                  More
                </Link>
              </motion.div>
            )}

            {/* List Items */}
            <div className="space-y-2">
              {sideFeatured.slice(0, 2).map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group flex items-center justify-between p-4 bg-muted/50 rounded-2xl hover:bg-muted transition-colors"
                  >
                    <h4 className="font-bold text-sm uppercase line-clamp-1 flex-1">
                      {blog.title}
                    </h4>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Small Featured */}
            {sideFeatured[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href={`/blogs/${sideFeatured[1].slug}`}
                  className="group block"
                >
                  <div className="relative h-[200px] rounded-3xl overflow-hidden bg-sky-100">
                    <Image
                      src={sideFeatured[1].thumbnail || "/img/room.jpg"}
                      alt={sideFeatured[1].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-medium bg-white/90 px-2 py-1 rounded-full">
                        Category . {sideFeatured[1].category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs text-white/80 mb-1 block">
                        Hot .{" "}
                        {new Date(sideFeatured[1].createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                      <h4 className="font-black text-white text-lg uppercase leading-tight">
                        {sideFeatured[1].title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Categories Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-purple-100 dark:bg-purple-900/30 rounded-3xl p-5 flex-1"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.slice(0, 8).map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-medium bg-white dark:bg-black/20 px-3 py-1.5 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="font-bold text-sm">View All Categories</span>
                <div className="p-2 bg-white dark:bg-black rounded-full">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Featured with Video */}
          {bottomFeatured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-7"
            >
              <Link
                href={`/blogs/${bottomFeatured.slug}`}
                className="group block"
              >
                <div className="relative h-[250px] rounded-3xl overflow-hidden bg-stone-200">
                  <Image
                    src={bottomFeatured.thumbnail || "/img/room.jpg"}
                    alt={bottomFeatured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="p-4 bg-white/90 rounded-full group-hover:scale-110 transition-transform">
                      <Play size={24} fill="black" className="text-black" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded-full">
                      Category . {bottomFeatured.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs text-white/80 mb-1 block">
                      5 Min .{" "}
                      {new Date(bottomFeatured.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </span>
                    <h4 className="font-black text-white text-xl uppercase">
                      {bottomFeatured.title}
                    </h4>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}

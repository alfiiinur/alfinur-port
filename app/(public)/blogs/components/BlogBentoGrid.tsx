"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  MessageCircle,
  ImageIcon,
  Play,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

interface BlogBentoGridProps {
  blogs: Blog[];
  categories: string[];
}

export default function BlogBentoGrid({
  blogs,
  categories,
}: BlogBentoGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      return activeCategory === "All" || post.category === activeCategory;
    });
  }, [blogs, activeCategory]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari`;
    if (hours > 0) return `${hours} jam`;
    if (minutes > 0) return `${minutes} menit`;
    return "Baru saja";
  };

  // Split posts for different sections
  const featuredPost = filteredPosts[0];
  const topPosts = filteredPosts.slice(1, 4);
  const trendingPosts = filteredPosts.slice(0, 5);
  const popularPosts = filteredPosts.slice(5, 10);
  const gridPosts = filteredPosts.slice(4, 12);
  const bottomPosts = filteredPosts.slice(12, 18);

  return (
    <section className="scroll-mt-24">
      {/* Categories Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Main Content Area - Left Side */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            {/* Top Row - Featured + 2 Medium Cards - Same Height */}
            <div className="grid grid-cols-12 gap-4 h-[280px]">
              {/* Featured Large Card */}
              {featuredPost && (
                <div className="col-span-12 md:col-span-5 h-full">
                  <FeaturedCard
                    post={featuredPost}
                    timeAgo={getTimeAgo(featuredPost.createdAt)}
                  />
                </div>
              )}

              {/* Right side - 2 medium cards side by side */}
              <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4 h-full">
                {topPosts.slice(0, 2).map((post) => (
                  <MediumCard
                    key={post.id}
                    post={post}
                    timeAgo={getTimeAgo(post.createdAt)}
                  />
                ))}
              </div>
            </div>

            {/* Second Row - News List + Grid Cards */}
            <div className="grid grid-cols-12 gap-4">
              {/* Berita Teratas - News List Card */}
              <div className="col-span-12 md:col-span-3">
                <NewsListCard
                  title="Berita Teratas"
                  icon={<Flame className="w-4 h-4 text-orange-500" />}
                  posts={trendingPosts}
                  getTimeAgo={getTimeAgo}
                />
              </div>

              {/* Grid of 4 cards */}
              <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
                {gridPosts.slice(0, 4).map((post) => (
                  <SmallCard
                    key={post.id}
                    post={post}
                    timeAgo={getTimeAgo(post.createdAt)}
                  />
                ))}
              </div>
            </div>

            {/* Third Row - More Grid Cards */}
            <div className="grid grid-cols-12 gap-4">
              {/* Suka Terbanyak - Popular List Card */}
              <div className="col-span-12 md:col-span-3">
                <NewsListCard
                  title="Suka Terbanyak"
                  icon={<Heart className="w-4 h-4 text-red-500" />}
                  posts={popularPosts}
                  getTimeAgo={getTimeAgo}
                />
              </div>

              {/* Bottom grid cards */}
              <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
                {gridPosts.slice(4, 8).map((post) => (
                  <SmallCard
                    key={post.id}
                    post={post}
                    timeAgo={getTimeAgo(post.createdAt)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Row - More posts */}
            {bottomPosts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {bottomPosts.map((post) => (
                  <SmallCard
                    key={post.id}
                    post={post}
                    timeAgo={getTimeAgo(post.createdAt)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Trending Section */}
            <SidebarCard title="Trending Now">
              <div className="space-y-3">
                {trendingPosts.slice(0, 4).map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(post.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* Categories Card */}
            <SidebarCard title="Kategori">
              <div className="flex flex-wrap gap-2">
                {categories.slice(1).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </SidebarCard>

            {/* Recent with thumbnails */}
            <SidebarCard title="Terbaru">
              <div className="space-y-3">
                {filteredPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(post.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </SidebarCard>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category.
          </p>
        </div>
      )}
    </section>
  );
}

// Featured Large Card with slider arrows
function FeaturedCard({ post, timeAgo }: { post: Blog; timeAgo: string }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full">
      <article className="relative h-full rounded-2xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded">
              {post.category}
            </span>
            <span className="text-xs text-gray-300">• {timeAgo}</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-tight line-clamp-3 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> 24
            </span>
            <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">
              <ThumbsDown className="w-3.5 h-3.5" /> 2
            </span>
            <span className="flex items-center gap-1 hover:text-green-400 cursor-pointer transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> 7
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Sedang tren
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Medium Card - Full height with image background
function MediumCard({ post, timeAgo }: { post: Blog; timeAgo: string }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full">
      <article className="relative h-full rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2 text-xs">
            <span className="text-blue-400 font-medium">{post.category}</span>
            <span className="text-gray-400">• {timeAgo}</span>
          </div>
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
              <ThumbsUp className="w-3 h-3" /> 12
            </span>
            <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">
              <ThumbsDown className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1 hover:text-green-400 cursor-pointer transition-colors">
              <MessageCircle className="w-3 h-3" /> 3
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Small Card
function SmallCard({ post, timeAgo }: { post: Blog; timeAgo: string }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article className="relative h-[180px] rounded-xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-400">{timeAgo}</span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-0.5 hover:text-blue-400 cursor-pointer transition-colors">
                <ThumbsUp className="w-3 h-3" /> 8
              </span>
              <span className="flex items-center gap-0.5 hover:text-green-400 cursor-pointer transition-colors">
                <MessageCircle className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// News List Card (like "Berita teratas")
function NewsListCard({
  title,
  icon,
  posts,
  getTimeAgo,
}: {
  title: string;
  icon: React.ReactNode;
  posts: Blog[];
  getTimeAgo: (date: Date) => string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="space-y-3">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="flex items-start gap-2 group"
          >
            <span className="w-5 h-5 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-red-600">N</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {getTimeAgo(post.createdAt)}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <ThumbsUp className="w-2.5 h-2.5" /> 5
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="w-2.5 h-2.5" /> 2
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Sidebar Card wrapper
function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-blue-600 rounded-full" />
        {title}
      </h3>
      {children}
    </div>
  );
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Calendar, ArrowRight } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
  author?: string;
}

interface BlogContentGridProps {
  blogs: Blog[];
  categories: string[];
}

export default function BlogContentGrid({
  blogs,
  categories,
}: BlogContentGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      return activeCategory === "All" || blog.category === activeCategory;
    });
  }, [blogs, activeCategory]);

  const featuredBlog = filteredBlogs[0];
  const otherBlogs = filteredBlogs.slice(1);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="py-8">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {filteredBlogs.length > 0 ? (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured Card - Large */}
              {featuredBlog && (
                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="group block mb-6"
                >
                  <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-muted/30 dark:bg-zinc-900 rounded-3xl overflow-hidden p-6">
                    {/* Content */}
                    <div className="flex flex-col justify-center order-2 lg:order-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 text-xs font-medium bg-muted dark:bg-zinc-800 rounded-full">
                          {featuredBlog.category}
                        </span>
                        {blogs.indexOf(featuredBlog) === 0 && (
                          <span className="px-3 py-1 text-xs font-medium bg-muted dark:bg-zinc-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                        {featuredBlog.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted dark:bg-zinc-800 overflow-hidden">
                          <Image
                            src="/img/profile.jpg"
                            alt="Author"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {featuredBlog.author || "Alfi"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(featuredBlog.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden order-1 lg:order-2">
                      <Image
                        src={featuredBlog.thumbnail || "/img/room.jpg"}
                        alt={featuredBlog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </article>
                </Link>
              )}

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GridCard blog={blog} formatDate={formatDate} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListCard blog={blog} formatDate={formatDate} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

// Grid Card Component
function GridCard({
  blog,
  formatDate,
}: {
  blog: Blog;
  formatDate: (date: Date) => string;
}) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <article className="h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-muted dark:bg-zinc-900">
          <Image
            src={blog.thumbnail || "/img/room.jpg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded-full">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {blog.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// List Card Component
function ListCard({
  blog,
  formatDate,
}: {
  blog: Blog;
  formatDate: (date: Date) => string;
}) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <article className="flex gap-4 md:gap-6 p-4 rounded-2xl bg-muted/30 dark:bg-zinc-900 hover:bg-muted/50 dark:hover:bg-zinc-800 transition-colors">
        {/* Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 bg-muted dark:bg-zinc-800">
          <Image
            src={blog.thumbnail || "/img/room.jpg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-medium bg-muted dark:bg-zinc-800 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(blog.createdAt)}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 hidden sm:block">
            {blog.excerpt}
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center">
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </div>
      </article>
    </Link>
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
  author?: string;
}

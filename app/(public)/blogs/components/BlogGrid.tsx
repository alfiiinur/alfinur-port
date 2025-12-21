"use client";

import BlogCard from "./BlogCard";
import Pagination from "@/components/public/shared/Pagination";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

interface BlogGridProps {
  blogs: Blog[];
  categories: string[];
}

const ITEMS_PER_PAGE = 8;

export default function BlogGrid({ blogs, categories }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <section id="blog-content" className="scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block"
          >
            • Alfi Journal
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Conscious Reads for the Modern Developer.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Welcome to Alfi Journal — your space for thoughtful reads on web
            development, design tips, coding tutorials, and behind-the-scenes
            glimpses of how I build with intention.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#4A5D4A] text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-8"
      >
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 rounded-2xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        )}
      </motion.div>

      {/* Results info */}
      <p className="text-sm text-muted-foreground mb-8">
        Showing {paginatedPosts.length} of {filteredPosts.length} article
        {filteredPosts.length !== 1 ? "s" : ""}
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </p>

      {filteredPosts.length > 0 ? (
        <>
          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import BlogCard from "./BlogCard";
import { useState, useMemo } from "react";

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

export default function BlogGrid({ blogs, categories }: BlogGridProps) {
  const [visiblePosts, setVisiblePosts] = useState(6);
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

  const loadMore = () => setVisiblePosts((prev) => prev + 3);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border bg-background"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {visiblePosts < filteredPosts.length && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90"
              >
                Load more articles
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

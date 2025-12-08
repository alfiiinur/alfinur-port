"use client";

import DesignCard from "./DesignCard";
import { useMemo, useState } from "react";

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  tags: string[];
}

interface DesignGridProps {
  designs: Design[];
  categories: string[];
}

export default function DesignGrid({ designs, categories }: DesignGridProps) {
  const [visibleCount, setVisibleCount] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const matchesSearch =
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        activeCategory === "All" || design.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [designs, searchQuery, activeCategory]);

  const loadMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border bg-background"
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

      {filteredDesigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDesigns.slice(0, visibleCount).map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
          {visibleCount < filteredDesigns.length && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No designs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

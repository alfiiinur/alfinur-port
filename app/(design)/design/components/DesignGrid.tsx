"use client";

import DesignCard from "./DesignCard";
import Pagination from "@/components/public/shared/Pagination";
import { useMemo, useState } from "react";
import { ArrowUpDown, Heart, Clock, Search } from "lucide-react";

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  tags: string[];
  _count?: { likes: number };
  createdAt: Date;
}

interface DesignGridProps {
  designs: Design[];
  categories: string[];
}

type SortOption = "latest" | "oldest" | "most-liked";

const ITEMS_PER_PAGE = 6;

export default function DesignGrid({ designs, categories }: DesignGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const handleLikeChange = (id: string, count: number) => {
    setLikeCounts((prev) => ({ ...prev, [id]: count }));
  };

  const filteredAndSortedDesigns = useMemo(() => {
    let filtered = designs.filter((design) => {
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

    // Sort
    switch (sortBy) {
      case "most-liked":
        filtered = [...filtered].sort((a, b) => {
          const aLikes = likeCounts[a.id] ?? (a._count?.likes || 0);
          const bLikes = likeCounts[b.id] ?? (b._count?.likes || 0);
          return bLikes - aLikes;
        });
        break;
      case "oldest":
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "latest":
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [designs, searchQuery, activeCategory, sortBy, likeCounts]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    filteredAndSortedDesigns.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDesigns = filteredAndSortedDesigns.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>

        {/* Categories & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => handleSortChange("latest")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  sortBy === "latest"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Latest
              </button>
              <button
                onClick={() => handleSortChange("most-liked")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  sortBy === "most-liked"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Most Liked
              </button>
              <button
                onClick={() => handleSortChange("oldest")}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  sortBy === "oldest"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                Oldest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results info */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {paginatedDesigns.length} of {filteredAndSortedDesigns.length}{" "}
        design
        {filteredAndSortedDesigns.length !== 1 ? "s" : ""}
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </p>

      {filteredAndSortedDesigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onLikeChange={handleLikeChange}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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

"use client";

import { useState, useMemo, useRef } from "react";
import DesignHero from "./DesignHero";
import DesignCard from "./DesignCard";
import Pagination from "@/components/public/shared/Pagination";
import { ArrowUpDown, Heart, Clock, Grid3X3, LayoutGrid } from "lucide-react";

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
  author?: { name: string };
}

interface DesignPageClientProps {
  designs: Design[];
  categories: string[];
  featuredDesigns: Design[];
}

type SortOption = "latest" | "oldest" | "most-liked";
type ViewMode = "grid" | "masonry";

const ITEMS_PER_PAGE = 12;

export default function DesignPageClient({
  designs,
  categories,
  featuredDesigns,
}: DesignPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  const handleLikeChange = (id: string, count: number) => {
    setLikeCounts((prev) => ({ ...prev, [id]: count }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(1);
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <DesignHero
          featuredDesigns={featuredDesigns.map((d) => ({
            image: d.image,
            title: d.title,
            author: d.author?.name,
          }))}
          onSearch={handleSearch}
          onTagClick={handleTagClick}
        />

        {/* Filters Section */}
        <div ref={gridRef} className="mb-8 space-y-4 scroll-mt-20">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & View Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Results info */}
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedDesigns.length} design
              {filteredAndSortedDesigns.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "masonry"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  }`}
                  title="Masonry view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
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
                    <span className="hidden sm:inline">Latest</span>
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
                    <span className="hidden sm:inline">Popular</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Grid */}
        {filteredAndSortedDesigns.length > 0 ? (
          <>
            <div
              className={
                viewMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {paginatedDesigns.map((design) => (
                <div
                  key={design.id}
                  className={viewMode === "masonry" ? "break-inside-avoid" : ""}
                >
                  <DesignCard design={design} onLikeChange={handleLikeChange} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Grid3X3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No designs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

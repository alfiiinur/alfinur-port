"use client";

import { designCategories } from "@/components/dataMock/designs";
import { useState } from "react";

interface DesignFiltersProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function DesignFilters({
  onSearchChange,
  onCategoryChange,
}: DesignFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects by title, tags, or client..."
            className="w-full px-6 py-4 pl-14 pr-12 rounded-full bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {designCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              activeCategory === category.name
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
            <span
              className={`ml-2 text-sm ${
                activeCategory === category.name
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            >
              ({category.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

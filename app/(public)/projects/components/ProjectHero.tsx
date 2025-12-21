"use client";

import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

interface ProjectHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  totalProjects: number;
}

export default function ProjectHero({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  totalProjects,
}: ProjectHeroProps) {
  return (
    <section className="pt-32 pb-12 px-4 bg-black text-white dark:bg-white dark:text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block"
            >
              Selected Work — Vol. {totalProjects}
            </motion.span>
            <AnimatedLines
              lines={["Creative", "Projects"]}
              as="h1"
              className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter"
            />
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full lg:w-80"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-white dark:text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white dark:hover:text-black"
              >
                <X size={18} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-white text-black dark:bg-black dark:text-white"
                  : "bg-white/10 dark:bg-black/10 text-white/70 dark:text-black/70 hover:bg-white/20 dark:hover:bg-black/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

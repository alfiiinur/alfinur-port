"use client";

import { useState, useMemo } from "react";
import ProjectSearch from "./ProjectSearch";
import ProjectFilter from "./ProjectFilter";
import ProjectGrid from "./ProjectGrid";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
}

interface ProjectsSectionProps {
  projects: Project[];
  categories: string[];
}

export default function ProjectsSection({
  projects,
  categories,
}: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    <section className="pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
          <ProjectSearch value={searchQuery} onChange={setSearchQuery} />
          <ProjectFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </p>

        {/* Project Grid */}
        <ProjectGrid projects={filteredProjects} />
      </div>
    </section>
  );
}

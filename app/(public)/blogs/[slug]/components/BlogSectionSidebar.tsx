"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
}

interface Section {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  blogs: Blog[];
}

interface BlogSectionSidebarProps {
  sections: Section[];
  uncategorizedBlogs: Blog[];
  currentSlug: string;
}

export default function BlogSectionSidebar({
  sections,
  uncategorizedBlogs,
  currentSlug,
}: BlogSectionSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.map((s) => s.id)
  );
  const [filterText, setFilterText] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      blogs: section.blogs.filter((blog) =>
        blog.title.toLowerCase().includes(filterText.toLowerCase())
      ),
    }))
    .filter(
      (section) =>
        section.blogs.length > 0 ||
        section.name.toLowerCase().includes(filterText.toLowerCase())
    );

  const filteredUncategorized = uncategorizedBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const SidebarContent = () => (
    <>
      {/* Filter Input */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter sidebar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full h-8 px-3 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Sections */}
      <nav className="p-2">
        {filteredSections.map((section) => (
          <div key={section.id} className="mb-1">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <Folder className="w-4 h-4" style={{ color: section.color }} />
              <span className="truncate">{section.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {section.blogs.length}
              </span>
            </button>

            {expandedSections.includes(section.id) && (
              <div className="ml-4 pl-2 border-l border-border">
                {section.blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentSlug === blog.slug
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{blog.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Uncategorized */}
        {filteredUncategorized.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Other Posts
            </p>
            {filteredUncategorized.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                  currentSlug === blog.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{blog.title}</span>
              </Link>
            ))}
          </div>
        )}

        {filteredSections.length === 0 &&
          filteredUncategorized.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No posts found
            </p>
          )}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 lg:hidden bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-background border-r border-border transform transition-transform duration-300 lg:hidden overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="font-semibold">Blog Navigation</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border bg-muted/30 overflow-y-auto h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}

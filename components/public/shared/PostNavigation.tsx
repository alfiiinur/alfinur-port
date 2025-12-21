"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationItem {
  slug: string;
  title: string;
  thumbnail?: string | null;
}

interface PostNavigationProps {
  previous: NavigationItem | null;
  next: NavigationItem | null;
  basePath: string; // e.g., "/blogs", "/projects", "/design"
}

export default function PostNavigation({
  previous,
  next,
  basePath,
}: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <div className="border-t pt-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous */}
        {previous ? (
          <Link
            href={`${basePath}/${previous.slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent transition-colors"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs text-muted-foreground mb-1">Previous</p>
              <p className="font-medium truncate group-hover:text-primary transition-colors">
                {previous.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {next ? (
          <Link
            href={`${basePath}/${next.slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent transition-colors md:flex-row-reverse md:text-right"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Next</p>
              <p className="font-medium truncate group-hover:text-primary transition-colors">
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

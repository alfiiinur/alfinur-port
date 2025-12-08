"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Track view and get count
    const trackView = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}/views`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error("Failed to track view");
      }
    };

    trackView();
  }, [slug]);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Eye className="w-4 h-4" />
      <span className="text-sm">{views} views</span>
    </div>
  );
}

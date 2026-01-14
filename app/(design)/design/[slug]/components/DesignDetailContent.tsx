"use client";

import { Design } from "@/components/dataMock/designs";
import { useState } from "react";

interface DesignDetailContentProps {
  design: Design;
}

export default function DesignDetailContent({
  design,
}: DesignDetailContentProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.title,
          text: design.description,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article>
      {/* Share Button */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
        >
          {copied ? (
            <>
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        {design.content ? (
          <div
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: design.content
                .replace(/\n\n/g, "</p><p>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        ) : (
          <p className="text-foreground leading-relaxed">
            {design.description}
          </p>
        )}
      </div>

      {/* Additional Images Grid */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Project Gallery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 aspect-video"
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="pt-8 border-t border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Project Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {design.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

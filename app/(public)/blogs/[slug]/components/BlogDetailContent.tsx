"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import MarkdownContent from "@/components/public/MarkdownContent";

interface Blog {
  title: string;
  excerpt: string;
  content: string;
  media: string[];
  tags: string[];
}

interface BlogDetailContentProps {
  post: Blog;
}

function MediaItem({ url, index }: { url: string; index: number }) {
  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="relative rounded-xl overflow-hidden bg-muted my-6">
      {isVideo ? (
        <div className="relative">
          <video
            src={url}
            controls
            className="w-full aspect-video object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
            <Video className="w-3 h-3" /> Video
          </div>
        </div>
      ) : (
        <img
          src={url}
          alt={`Media ${index + 1}`}
          className="w-full object-cover"
        />
      )}
    </div>
  );
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
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
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <div className="not-prose mb-8 flex justify-end">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
        >
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Content */}
      <div className="not-prose">
        <MarkdownContent content={post.content || post.excerpt} />
      </div>

      {/* Media Gallery */}
      {post.media.length > 0 && (
        <div className="not-prose mt-12">
          <h3 className="text-xl font-semibold mb-4">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.media.map((url, index) => (
              <MediaItem key={index} url={url} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="not-prose mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

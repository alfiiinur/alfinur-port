"use client";

import { X, Video, ExternalLink, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MarkdownContent from "@/components/public/MarkdownContent";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "project" | "blog" | "design";
  data: {
    title: string;
    description?: string;
    content?: string;
    excerpt?: string;
    thumbnail?: string;
    image?: string;
    media: string[];
    category: string;
    tags: string[];
    client?: string;
    link?: string;
  };
}

function MediaItem({ url, index }: { url: string; index: number }) {
  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);
  return (
    <div className="relative rounded-xl overflow-hidden bg-muted">
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
        <Image
          src={url}
          alt={`Media ${index + 1}`}
          fill
          className="w-full aspect-video object-cover"
          sizes="100vw"
          priority
        />
      )}
    </div>
  );
}

export default function PreviewModal({
  isOpen,
  onClose,
  type,
  data,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const mainImage = data.thumbnail || data.image;
  const isMainVideo = mainImage?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4">
      <div className="relative w-full max-w-4xl my-8 bg-background rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Preview</Badge>
            <span className="text-sm text-muted-foreground capitalize">
              {type}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hero Image */}
          {mainImage && (
            <div className="rounded-xl overflow-hidden bg-muted">
              {isMainVideo ? (
                <video
                  src={mainImage}
                  controls
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <div className="relative w-full h-96 rounded-xl overflow-hidden">
                  <Image
                    src={mainImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              )}
            </div>
          )}

          {/* Title & Category */}
          <div>
            <Badge className="mb-3">{data.category || "Uncategorized"}</Badge>
            <h1 className="text-3xl font-bold">{data.title || "Untitled"}</h1>
          </div>

          {/* Project specific info */}
          {type === "project" && (
            <div className="flex flex-wrap gap-6 text-sm">
              {data.client && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{data.client}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              {data.link && (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Project</span>
                </a>
              )}
            </div>
          )}

          {/* Blog excerpt */}
          {type === "blog" && data.excerpt && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              {data.excerpt}
            </p>
          )}

          {/* Description / Content */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              {type === "blog" ? "Content" : "About"}
            </h2>
            {type === "blog" && data.content ? (
              <MarkdownContent content={data.content} />
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.description || data.content || "No description provided."}
              </p>
            )}
          </div>

          {/* Media Gallery */}
          {data.media.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.media.map((url, index) => (
                  <MediaItem key={index} url={url} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t bg-background rounded-b-2xl">
          <p className="text-sm text-muted-foreground text-center">
            This is a preview. Click outside or press X to close.
          </p>
        </div>
      </div>
    </div>
  );
}

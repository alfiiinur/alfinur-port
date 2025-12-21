"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiMediaUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function MultiMediaUpload({
  value = [],
  onChange,
  maxFiles = 10,
  className,
}: MultiMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|ogg)$/i);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (value.length + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setError(null);
      setIsUploading(true);

      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Upload failed");
          }

          newUrls.push(data.url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        }
      }

      onChange([...value, ...newUrls]);
      setIsUploading(false);
    },
    [value, onChange, maxFiles]
  );

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden border bg-muted aspect-video"
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleRemove(index)}
              >
                <X className="w-3 h-3" />
              </Button>
              {isVideo(url) && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
                  <Video className="w-3 h-3" /> Video
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                <Plus className="w-4 h-4 inline mr-1" />
                Add images or videos
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or click ({value.length}/{maxFiles})
              </p>
              {/* Size Guide */}
              <div className="mt-1 px-3 py-2 bg-muted/50 rounded-md text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  📐 Recommended: 1920 x 1080px
                </p>
                <p>Ratio 16:9 • Gallery / Showcase Images</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,video/mp4,video/webm,video/ogg"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

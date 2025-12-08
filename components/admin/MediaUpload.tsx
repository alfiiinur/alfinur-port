"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: "image" | "video" | "all";
  className?: string;
}

export default function MediaUpload({
  value,
  onChange,
  accept = "all",
  className,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = {
    image: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
    video: "video/mp4,video/webm,video/ogg",
    all: "image/png,image/jpeg,image/jpg,image/gif,image/webp,video/mp4,video/webm,video/ogg",
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

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

        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    onChange("");
    setError(null);
  }, [onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          {isVideo ? (
            <video
              src={value}
              controls
              className="w-full max-h-64 object-contain"
            />
          ) : (
            <div className="relative aspect-video">
              <Image
                src={value}
                alt="Uploaded media"
                fill
                className="object-contain"
              />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {(accept === "image" || accept === "all") && (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
                {(accept === "video" || accept === "all") && (
                  <Video className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">Drag & drop or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {accept === "image" && "PNG, JPG, GIF, WEBP (max 50MB)"}
                  {accept === "video" && "MP4, WEBM, OGG (max 50MB)"}
                  {accept === "all" && "Images or Videos (max 50MB)"}
                </p>
              </div>
              <Upload className="w-5 h-5 text-muted-foreground mt-2" />
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes[accept]}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

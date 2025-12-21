"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CameraCapture } from "./CameraCapture";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

export function ImageUploader({
  onImageSelect,
  isProcessing,
  selectedImage,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device and camera availability
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasCamera(videoDevices.length > 0);
      } catch {
        setHasCamera(false);
      }
    };

    checkMobile();
    checkCamera();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleCameraCapture = useCallback(
    (file: File) => {
      setShowCamera(false);
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleOpenCamera = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCamera(true);
  }, []);

  // Show camera view
  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  // Show preview when image is selected
  if (selectedImage) {
    return (
      <Card className="relative overflow-hidden">
        <div className="relative aspect-4/3 bg-muted">
          <img
            src={selectedImage}
            alt="Receipt preview"
            className="w-full h-full object-contain"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Processing image...
                </p>
              </div>
            </div>
          )}
        </div>
        {!isProcessing && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Card>
    );
  }

  // Default upload view
  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">Upload Receipt Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isMobile
            ? "Take a photo or choose from gallery"
            : "Drag & drop or click to browse"}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Camera Button - Show on mobile or if camera available */}
          {hasCamera && (
            <Button
              variant="default"
              className="gap-2"
              onClick={handleOpenCamera}
            >
              <Camera className="h-4 w-4" />
              {isMobile ? "Take Photo" : "Open Camera"}
            </Button>
          )}

          {/* Upload Button */}
          <Button
            variant={hasCamera ? "outline" : "default"}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <Upload className="h-4 w-4" />
            {isMobile ? "Choose from Gallery" : "Upload Image"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Supports: JPG, PNG, WebP (Max 10MB)
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture={isMobile ? "environment" : undefined}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
}

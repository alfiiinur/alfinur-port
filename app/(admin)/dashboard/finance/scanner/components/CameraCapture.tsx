"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw, Check, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please allow camera permission.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Failed to access camera. Please try again.");
        }
      }
    }
  }, [facingMode, stream]);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);

    // Stop camera
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [stream]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleConfirm = useCallback(() => {
    if (!capturedImage) return;

    // Convert base64 to File
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `receipt-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
      });
  }, [capturedImage, onCapture]);

  const handleSwitchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, []);

  const handleClose = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  }, [stream, onClose]);

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={startCamera}>Try Again</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black">
        {/* Video / Captured Image */}
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full aspect-4/3 object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-4/3 object-cover"
          />
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Close button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Switch camera button (mobile) */}
        {!capturedImage && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 left-2"
            onClick={handleSwitchCamera}
          >
            <SwitchCamera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex justify-center gap-4">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button onClick={handleConfirm} className="gap-2">
              <Check className="h-4 w-4" />
              Use Photo
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            className="w-16 h-16 rounded-full"
            onClick={handleCapture}
          >
            <Camera className="h-6 w-6" />
          </Button>
        )}
      </div>
    </Card>
  );
}

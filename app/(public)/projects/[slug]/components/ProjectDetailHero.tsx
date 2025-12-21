"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ImageIcon, Video, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface Project {
  title: string;
  thumbnail: string;
  category: string;
}

interface ProjectDetailHeroProps {
  project: Project;
}

function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

export default function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailIsVideo = isVideo(project.thumbnail);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="pt-24 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        {/* Category Badge */}
        <Badge variant="secondary" className="mb-4">
          {project.category}
        </Badge>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          {project.title}
        </h1>

        {/* Hero Image/Video */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
          {project.thumbnail ? (
            thumbnailIsVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={project.thumbnail}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                {/* Video Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm z-10">
                  <Video className="w-4 h-4" />
                  Video
                </div>
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </>
            ) : (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

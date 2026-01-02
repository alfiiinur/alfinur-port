"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  ArrowUpRight,
  Play,
  Video,
  LayoutGrid,
  List,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSections from "./AnimatedSections";
import { Highlighter } from "@/components/ui/highlighter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  images: string[]; // Additional images
  media: string[]; // Gallery images & videos from project
  category: string;
  tags: string[];
  client?: string | null;
  createdAt: Date | string;
}

interface ProjectsPageProps {
  projects: Project[];
  categories: string[];
}

export default function ProjectsPage({
  projects,
  categories,
}: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white overflow-x-hidden">
      <AnimatedSections />
      {/* Hero Section with Carousel */}
      {/* <ProjectHero projects={projects} /> */}

      {/* Animated Continuous Sections */}
      {/* Animated Text Section with Sticky Scroll */}
      <AnimatedTextSection />

      {/* Filter Section */}
      <section className="py-12 px-4 border-t border-gray-200 dark:border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
                }`}
                title="List View"
                type="button"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
                }`}
                title="Grid View"
                type="button"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          {/* Results Count & Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Showing {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
            </p>

            {/* Active Filters Display */}
            {(activeCategory !== "All" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Active filters:</span>
                {activeCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    {activeCategory}
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                    &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-purple-900 dark:hover:text-purple-100"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-white underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Project Rows/Grid */}
          {filteredProjects.length > 0 ? (
            <AnimatePresence mode="wait">
              {viewMode === "list" ? (
                <ProjectList projects={filteredProjects} />
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index + 1}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

// Animated Text Section with Sticky Scroll Effect
function AnimatedTextSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Text content split into segments for animation
  const textSegments = [
    {
      text: "Explore my portfolio",
      highlight: "underline" as const,
      color: "#E03D1B",
      textColor: "text-red-400",
    },
    {
      text: "where creativity meets technology. Every project showcases my dedication to building innovative that",
      highlight: null,
      color: null,
      textColor: null,
    },
    {
      text: "solve real problems",
      highlight: "circle" as const,
      color: "#61FF74",
      textColor: "text-green-400",
    },
    {
      text: "and deliver exceptional",
      highlight: null,
      color: null,
      textColor: null,
    },
    {
      text: "user experiences.",
      highlight: "box" as const,
      color: "#30A2F2",
      textColor: "text-blue-400",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current || !textContainerRef.current) return;

    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    // Set initial state - all words hidden
    gsap.set(words, {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    // Animate each word sequentially
    words.forEach((word, index) => {
      tl.to(
        word,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        index * 0.03
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Split text into words and create refs
  let wordIndex = 0;
  const renderTextSegments = () => {
    return textSegments.map((segment, segmentIndex) => {
      const words = segment.text.split(" ").filter((w) => w);

      return (
        <span key={segmentIndex}>
          {words.map((word, i) => {
            const currentIndex = wordIndex++;
            const isHighlighted = segment.highlight !== null;

            return (
              <span
                key={`${segmentIndex}-${i}`}
                ref={(el) => {
                  wordsRef.current[currentIndex] = el;
                }}
                className={`inline-block mr-[0.25em] ${
                  segment.textColor || ""
                } ${isHighlighted ? "italic" : ""}`}
              >
                {isHighlighted ? (
                  <Highlighter
                    action={segment.highlight!}
                    color={segment.color || undefined}
                  >
                    <span>{word}</span>
                  </Highlighter>
                ) : (
                  word
                )}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[40vh] md:min-h-[50vh] flex items-center py-16 md:py-24"
    >
      <div ref={textContainerRef} className="max-w-7xl mx-auto px-5">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.5] md:leading-[1.4]">
          {renderTextSegments()}
        </p>
      </div>
    </section>
  );
}

// Helper function to check if URL is a video
function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

// Project List Container - manages hover state for all rows
function ProjectList({ projects }: { projects: Project[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHover = useCallback(
    (id: string | null) => {
      // Prevent spam - only allow hover change if not animating
      if (isAnimating && id !== null) return;

      setHoveredId(id);
      if (id !== null) {
        setIsAnimating(true);
        // Reset animating state after animation completes
        setTimeout(() => setIsAnimating(false), 600);
      }
    },
    [isAnimating]
  );

  return (
    <motion.div
      ref={containerRef}
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-0"
    >
      {projects.map((project, index) => (
        <ProjectRow
          key={project.id}
          project={project}
          index={index + 1}
          isHovered={hoveredId === project.id}
          isOtherHovered={hoveredId !== null && hoveredId !== project.id}
          onHover={handleHover}
        />
      ))}
    </motion.div>
  );
}

// Simple List Row Component with GSAP Wave Animation
function ProjectRow({
  project,
  index,
  isHovered,
  isOtherHovered,
  onHover,
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagePopupRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const floatAnimationRef = useRef<gsap.core.Tween | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Get image from project (use index-based selection instead of random)
  const projectImage = useMemo(() => {
    const images =
      project.media?.filter(
        (m) =>
          !m.includes(".mp4") && !m.includes(".mov") && !m.includes(".webm")
      ) ||
      project.images ||
      [];
    if (images.length > 0) {
      return images[index % images.length];
    }
    return project.thumbnail;
  }, [project.media, project.images, project.thumbnail, index]);

  // Start floating animation when image is shown
  useEffect(() => {
    if (showImage && imagePopupRef.current) {
      // Create smooth floating/swaying animation
      floatAnimationRef.current = gsap.to(imagePopupRef.current, {
        x: "+=15",
        y: "+=8",
        rotation: 3,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      if (floatAnimationRef.current) {
        floatAnimationRef.current.kill();
      }
    };
  }, [showImage]);

  // Handle mouse move to update image position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!rowRef.current || !imagePopupRef.current || !showImage) return;

      const rect = rowRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mousePos.current = { x, y };

      // Smooth follow mouse with offset - more fluid movement
      gsap.to(imagePopupRef.current, {
        left: x + 20,
        top: y - 100,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    [showImage]
  );

  // Run animation when hover state changes
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      onHover(project.id);

      if (!rowRef.current || !waveRef.current || !contentRef.current) return;

      // Get initial mouse position
      const rect = rowRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Kill any existing animation
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create new timeline
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Lift effect first
      tl.to(
        rowRef.current,
        {
          y: -12,
          scale: 1.01,
          zIndex: 50,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );

      // Wave animation with wavy clipPath effect
      tl.fromTo(
        waveRef.current,
        {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            setShowImage(true);
            // Animate popup image - blip effect from mouse position
            if (imagePopupRef.current) {
              gsap.fromTo(
                imagePopupRef.current,
                {
                  scale: 0,
                  opacity: 0,
                  left: mousePos.current.x,
                  top: mousePos.current.y - 40,
                  filter: "blur(10px)",
                },
                {
                  scale: 1,
                  opacity: 1,
                  left: mousePos.current.x + 20,
                  top: mousePos.current.y - 100,
                  filter: "blur(0px)",
                  duration: 0.5,
                  ease: "elastic.out(1, 0.5)",
                }
              );
            }
          },
        },
        0.1
      );
    },
    [onHover, project.id]
  );

  const handleMouseLeave = useCallback(() => {
    onHover(null);

    if (!rowRef.current || !waveRef.current) return;

    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (floatAnimationRef.current) {
      floatAnimationRef.current.kill();
    }

    // Hide popup image with blip out effect
    if (imagePopupRef.current && showImage) {
      // Get current position for smooth exit
      const currentLeft = gsap.getProperty(
        imagePopupRef.current,
        "left"
      ) as number;
      const currentTop = gsap.getProperty(
        imagePopupRef.current,
        "top"
      ) as number;

      gsap.to(imagePopupRef.current, {
        scale: 0,
        opacity: 0,
        left: currentLeft - 10,
        top: currentTop + 30,
        filter: "blur(8px)",
        rotation: -5,
        duration: 0.3,
        ease: "back.in(2)",
        onComplete: () => setShowImage(false),
      });
    }

    // Wave animation reverse (from right to left)
    gsap.to(waveRef.current, {
      clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
      duration: 0.4,
      ease: "power2.in",
    });

    // Reset lift
    gsap.to(rowRef.current, {
      y: 0,
      scale: 1,
      zIndex: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [onHover, showImage]);

  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        ref={rowRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={`group relative grid grid-cols-12 gap-4 py-5 border-b border-gray-200 dark:border-white/10 cursor-pointer px-4 -mx-4 rounded-lg overflow-visible transition-opacity duration-300 ${
          isOtherHovered ? "opacity-30" : "opacity-100"
        }`}
        style={{ position: "relative" }}
      >
        {/* Wave Background with wavy shape */}
        <div
          ref={waveRef}
          className="absolute inset-0 bg-black dark:bg-white rounded-lg z-0"
          style={{
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
          }}
        />

        {/* Content */}
        <div
          ref={contentRef}
          className={`col-span-12 grid grid-cols-12 gap-4 relative z-10 transition-colors duration-300 ${
            isHovered
              ? "text-white dark:text-black"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {/* Number */}
          <div className="col-span-1 flex items-center">
            <span
              className={`text-sm font-bold transition-colors duration-300 ${
                isHovered
                  ? "text-white/70 dark:text-black/70"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              {String(index).padStart(2, "0")}
            </span>
          </div>

          {/* Category */}
          <div className="col-span-2 flex items-center">
            <span
              className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded transition-colors duration-300 ${
                isHovered
                  ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                  : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10"
              }`}
            >
              {project.category}
            </span>
          </div>

          {/* Title */}
          <div className="col-span-3 flex items-center">
            <h3
              className={`font-semibold transition-colors duration-300 line-clamp-1 ${
                isHovered
                  ? "text-white dark:text-black"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <div className="col-span-3 flex items-center">
            <p
              className={`text-sm transition-colors duration-300 line-clamp-1 ${
                isHovered
                  ? "text-white/80 dark:text-black/80"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {project.description}
            </p>
          </div>

          {/* Date & Client */}
          <div className="col-span-2 flex items-center gap-2">
            <div
              className={`text-xs transition-colors duration-300 ${
                isHovered
                  ? "text-white/70 dark:text-black/70"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {project.createdAt && (
                <span>
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              )}
              {project.client && (
                <span className="block truncate">{project.client}</span>
              )}
            </div>
          </div>

          {/* Tags & Arrow */}
          <div className="col-span-1 flex items-center justify-end gap-2">
            {project.tags && project.tags.length > 0 && (
              <span
                className={`text-xs hidden lg:block transition-colors duration-300 ${
                  isHovered
                    ? "text-white/70 dark:text-black/70"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {project.tags.length} tags
              </span>
            )}
            <ArrowUpRight
              size={16}
              className={`transition-colors duration-300 ${
                isHovered ? "text-[#C4F135]" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Popup Image - Follows Mouse with Floating Animation */}
        {showImage && projectImage && (
          <div
            ref={imagePopupRef}
            className="absolute z-[100] pointer-events-none hidden lg:block"
            style={{
              left: 0,
              top: 0,
            }}
          >
            <div className="relative w-40 h-48 xl:w-48 xl:h-56 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20 dark:ring-black/20">
              <Image
                src={projectImage}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

// Grid Card Component
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const thumbnailIsVideo = isVideo(project.thumbnail);

  const handleVideoHover = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.play();
    setIsVideoPlaying(true);
  };

  const handleVideoLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.pause();
    video.currentTime = 0;
    setIsVideoPlaying(false);
  };

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-4/3 overflow-hidden">
          {project.thumbnail ? (
            thumbnailIsVideo ? (
              <>
                <video
                  src={project.thumbnail}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  onMouseOver={handleVideoHover}
                  onMouseOut={handleVideoLeave}
                />
                {/* Video Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs z-10">
                  <Video className="w-3 h-3" />
                  Video
                </div>
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
              <span className="text-4xl">📁</span>
            </div>
          )}

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
          />

          {/* Index number */}
          <span className="absolute top-3 right-3 text-xs font-bold text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            {String(index).padStart(2, "0")}
          </span>

          {/* Hover Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#C4F135] flex items-center justify-center z-20"
          >
            <ArrowUpRight size={18} className="text-black" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 block">
            {project.category}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#C4F135] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-gray-500">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

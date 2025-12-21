"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { Search, X, ArrowUpRight, Play, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block"
              >
                Selected Work — Vol. {projects.length}
              </motion.span>
              <AnimatedLines
                lines={["Creative", "Projects"]}
                as="h1"
                className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter"
              />
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative w-full lg:w-80"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-white dark:text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white dark:hover:text-black"
                >
                  <X size={18} />
                </button>
              )}
            </motion.div>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "bg-white/10 dark:bg-black/10 text-white/70 dark:text-black/70 hover:bg-white/20 dark:hover:bg-black/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section with Scroll Trigger */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 mb-12 border-b border-gray-800 dark:border-gray-200 pb-4"
          >
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </motion.p>

          {/* Project Rows */}
          {filteredProjects.length > 0 ? (
            <div className="space-y-0">
              {filteredProjects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index + 1}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center mb-4">
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

// Fixed popup position configurations
const popupPositionConfigs = [
  [
    { top: "-60px", left: "10%", rotate: -8 },
    { top: "-80px", right: "15%", rotate: 12 },
    { bottom: "-70px", left: "5%", rotate: 10 },
  ],
  [
    { bottom: "-60px", right: "10%", rotate: -6 },
    { top: "20%", left: "-80px", rotate: -12 },
  ],
  [
    { top: "30%", right: "-70px", rotate: 8 },
    { top: "-60px", left: "10%", rotate: -8 },
    { bottom: "-70px", right: "5%", rotate: 10 },
  ],
  [
    { top: "-80px", left: "15%", rotate: 12 },
    { bottom: "-60px", left: "10%", rotate: -6 },
  ],
  [
    { top: "20%", right: "-80px", rotate: -12 },
    { bottom: "-70px", left: "5%", rotate: 10 },
    { top: "-60px", right: "10%", rotate: -8 },
  ],
];

// Helper function to check if URL is a video
function isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg|mov)$/i);
}

// Individual Project Row with Scroll Trigger Animation - Large Version
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const thumbnailIsVideo = isVideo(project.thumbnail);

  // Get popup config based on index and use project's gallery (media) images
  const popups = useMemo(() => {
    const configIndex = (index - 1) % popupPositionConfigs.length;
    const positions = popupPositionConfigs[configIndex];

    // Use project's media array (gallery), fallback to images, then thumbnail
    const projectImages =
      project.media?.length > 0
        ? project.media.filter(
            (m) =>
              !m.includes(".mp4") && !m.includes(".mov") && !m.includes(".webm")
          ) // Filter out videos
        : project.images?.length > 0
        ? project.images
        : [project.thumbnail];

    // Only show popups if we have images
    if (!projectImages || projectImages.length === 0) return [];

    // Max 3 popup images
    const maxPopups = 3;
    const numPopups = Math.min(
      maxPopups,
      positions.length,
      projectImages.length
    );

    return positions.slice(0, numPopups).map((pos, i) => ({
      ...pos,
      delay: i * 0.08,
      image: projectImages[i % projectImages.length],
    }));
  }, [index, project.media, project.images, project.thumbnail]);

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
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative py-12 md:py-20 border-b border-gray-800 dark:border-gray-200 cursor-pointer"
      >
        {/* Popup Images on Hover - Hidden on mobile */}
        <AnimatePresence>
          {isHovered && (
            <>
              {popups.map((popup, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5, rotate: popup.rotate }}
                  animate={{ opacity: 1, scale: 1, rotate: popup.rotate }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.35,
                    delay: popup.delay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute z-50 hidden lg:block pointer-events-none"
                  style={{
                    top: popup.top,
                    bottom: popup.bottom,
                    left: popup.left,
                    right: popup.right,
                  }}
                >
                  <div className="relative w-28 h-28 xl:w-36 xl:h-36 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                    <Image
                      src={popup.image}
                      alt="Gallery"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Top Row: Number & Category */}
        <div className="flex items-center justify-between mb-6">
          <motion.span
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            className="text-2xl md:text-4xl font-black text-gray-600 transition-colors"
          >
            {String(index).padStart(2, "0")}
          </motion.span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: isHovered ? -10 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400"
          >
            {project.category}
          </motion.span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Large Thumbnail - Now supports video */}
          <motion.div
            animate={{ scale: isHovered ? 1.02 : 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-100"
          >
            {project.thumbnail ? (
              thumbnailIsVideo ? (
                <>
                  <video
                    src={project.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                    onMouseOver={handleVideoHover}
                    onMouseOut={handleVideoLeave}
                  />
                  {/* Video Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs z-10">
                    <Video className="w-3 h-3" />
                    Video
                  </div>
                  {/* Play indicator when not playing */}
                  {!isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <span className="text-6xl">📁</span>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/20"
            />

            {/* Hover Arrow Overlay - Only this has green color */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#C4F135] flex items-center justify-center z-20"
            >
              <ArrowUpRight size={24} className="text-black" />
            </motion.div>
          </motion.div>

          {/* Title & Description */}
          <div className="flex flex-col justify-center relative z-10">
            <motion.h3
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 20 : 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] mb-6 transition-colors"
            >
              {project.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0.6 }}
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              className="text-base md:text-lg text-gray-400 leading-relaxed mb-6 max-w-lg"
            >
              {project.description}
            </motion.p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 dark:bg-black/10 text-gray-300 dark:text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date & Client */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              {project.createdAt && (
                <span>
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              )}
              {project.client && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>Client: {project.client}</span>
                </>
              )}
            </div>

            <motion.div
              initial={{ x: 0, opacity: 0.5 }}
              animate={{
                x: isHovered ? 20 : 0,
                opacity: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-base font-bold uppercase tracking-wider"
            >
              <span>View Project</span>
              <ArrowUpRight size={20} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

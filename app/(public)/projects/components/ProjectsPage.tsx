"use client";

import { useState, useMemo } from "react";
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
import ProjectHero from "./ProjectHero";
import AnimatedSections from "./AnimatedSections";
import { Highlighter } from "@/components/ui/highlighter";

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
      {/* Hero Section with Carousel */}
      <ProjectHero />

      {/* Animated Continuous Sections */}
      <AnimatedSections />
      <p className="mt-10 mx-5 text-4xl font-bold md:text-5xl leading-[1.3]">
        <Highlighter action="underline" color="#E03D1B">
          <span className="text-red-400 italic">Explore my portfolio</span>
        </Highlighter>
        where creativity meets technology. Every project showcases my dedication
        to building innovative that
        <Highlighter action="circle" color="#61FF74">
          <span className="text-green-400 italic"> solve real problems</span>
        </Highlighter>
        and deliver exceptional{" "}
        <Highlighter action="box" color="#30A2F2">
          <span className="text-blue-400 italic">user experiences.</span>
        </Highlighter>
      </p>

      {/* Filter Section */}
      <section className="py-12 px-4 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
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
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
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
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
                title="Grid View"
                type="button"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500 border-b border-white/10 pb-4">
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Project Rows/Grid */}
          {filteredProjects.length > 0 ? (
            <AnimatePresence mode="wait">
              {viewMode === "list" ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-0"
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      index={index + 1}
                    />
                  ))}
                </motion.div>
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
        className="group relative py-12 md:py-20 border-b border-white/10 cursor-pointer"
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
            className="relative aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden bg-gray-900"
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
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300"
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

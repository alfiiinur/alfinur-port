"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

interface BentoItem {
  id: string;
  type: "image" | "video";
  url: string;
  size: "small" | "medium" | "large" | "wide" | "tall";
  caption?: string;
}

interface ProjectSection {
  id: string;
  title: string;
  content: string;
  bentoItems: BentoItem[];
  order: number;
}

interface ProjectSectionsProps {
  sections: ProjectSection[];
  projectTitle: string;
}

const bentoSizeClasses: Record<string, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
  wide: "col-span-3 row-span-1",
  tall: "col-span-1 row-span-2",
};

export default function ProjectSections({
  sections,
  projectTitle,
}: ProjectSectionsProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ""
  );
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sortedSections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sortedSections]);

  const scrollToSection = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (sortedSections.length === 0) return null;

  return (
    <section className="py-16 px-4 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                About {projectTitle}
              </h3>
              <nav className="space-y-1">
                {sortedSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {section.title || "Untitled Section"}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-20">
            {sortedSections.map((section, index) => (
              <motion.article
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="scroll-mt-24"
              >
                {/* Section Title */}
                <h2 className="text-2xl font-bold mb-6">
                  {section.title || "Untitled Section"}
                </h2>

                {/* Section Content */}
                {section.content && (
                  <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                )}

                {/* Bento Grid Media */}
                {section.bentoItems && section.bentoItems.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[180px]">
                    {section.bentoItems.map((item) => (
                      <BentoMediaItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoMediaItem({ item }: { item: BentoItem }) {
  const sizeClass = bentoSizeClasses[item.size] || bentoSizeClasses.small;

  return (
    <motion.div
      className={`relative group rounded-xl overflow-hidden bg-muted ${sizeClass}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {item.type === "video" ? (
        <>
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full flex items-center gap-1">
            <Video className="w-3 h-3" />
            Video
          </div>
        </>
      ) : (
        <img
          src={item.url}
          alt={item.caption || "Project image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Caption Overlay */}
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm">{item.caption}</p>
        </div>
      )}
    </motion.div>
  );
}

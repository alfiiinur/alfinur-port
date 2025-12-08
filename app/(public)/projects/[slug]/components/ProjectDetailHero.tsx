import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ImageIcon } from "lucide-react";

interface Project {
  title: string;
  thumbnail: string;
  category: string;
}

interface ProjectDetailHeroProps {
  project: Project;
}

export default function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
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

        {/* Hero Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
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

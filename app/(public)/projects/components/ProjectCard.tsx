import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ImageIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Hover Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Badge variant="secondary" className="mb-3 text-xs">
          {project.category}
        </Badge>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ImageIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
}

interface RelatedProjectsProps {
  projects: Project[];
}

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  return (
    <section className="py-16 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block overflow-hidden rounded-xl bg-card border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-3 text-xs">
                  {project.category}
                </Badge>
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

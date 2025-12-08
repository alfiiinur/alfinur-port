import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, User, Video } from "lucide-react";

interface Project {
  title: string;
  description: string;
  media: string[];
  client: string | null;
  link: string | null;
  tags: string[];
  createdAt: Date;
}

interface ProjectDetailContentProps {
  project: Project;
}

function MediaItem({
  url,
  title,
  index,
}: {
  url: string;
  title: string;
  index: number;
}) {
  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="relative rounded-xl overflow-hidden bg-muted">
      {isVideo ? (
        <div className="relative">
          <video
            src={url}
            controls
            className="w-full aspect-video object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
            <Video className="w-3 h-3" /> Video
          </div>
        </div>
      ) : (
        <img
          src={url}
          alt={`${title} - ${index + 1}`}
          className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  );
}

export default function ProjectDetailContent({
  project,
}: ProjectDetailContentProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" }
  );

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {project.media.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Project Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.media.map((url, index) => (
                    <MediaItem
                      key={index}
                      url={url}
                      title={project.title}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 p-6 rounded-2xl bg-card border">
              <h3 className="font-semibold text-lg">Project Details</h3>
              {project.client && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              {project.tags.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {project.link && (
                <Button asChild className="w-full">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Project
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

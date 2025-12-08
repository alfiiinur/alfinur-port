import Link from "next/link";
import { ImageIcon, Video } from "lucide-react";

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  tags: string[];
}

interface DesignCardProps {
  design: Design;
}

export default function DesignCard({ design }: DesignCardProps) {
  const isVideo = design.image?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <Link href={`/design/${design.slug}`} className="group">
      <article className="h-full">
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-4/3">
          {design.image ? (
            isVideo ? (
              <video
                src={design.image}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {isVideo && (
            <div className="absolute top-4 left-4">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
                <Video className="w-3 h-3" /> Video
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {design.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {design.title}
          </h3>
          {design.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {design.description}
            </p>
          )}
          {design.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {design.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

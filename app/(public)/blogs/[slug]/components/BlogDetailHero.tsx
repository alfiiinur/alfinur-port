import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface Blog {
  title: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
  author: { name: string };
}

interface BlogDetailHeroProps {
  post: Blog;
}

export default function BlogDetailHero({ post }: BlogDetailHeroProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/blogs" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>
      <div className="mb-4">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
          {post.category}
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
        {post.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {post.author.name.charAt(0)}
          </div>
          <span className="font-medium text-foreground">
            {post.author.name}
          </span>
        </div>
        <span>•</span>
        <time>{formattedDate}</time>
      </div>
      <div className="mt-8 rounded-2xl overflow-hidden bg-muted aspect-video">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

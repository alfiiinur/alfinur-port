import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
}

interface RelatedPostsProps {
  posts: Blog[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="mt-16 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
            <div className="rounded-xl overflow-hidden bg-muted aspect-video mb-4">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="text-sm text-primary font-semibold">
              {post.category}
            </span>
            <h3 className="font-semibold mt-1 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

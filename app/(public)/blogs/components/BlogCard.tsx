"use client";

import { ArrowUpRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

interface BlogCardProps {
  post: Blog;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article>
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-[3/4]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Category Badge */}
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            {post.category}
          </span>

          {/* Title with Arrow */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <ArrowUpRight
              size={18}
              className="shrink-0 mt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

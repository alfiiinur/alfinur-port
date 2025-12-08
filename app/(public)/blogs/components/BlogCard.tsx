"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";

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
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/blogs/${post.slug}`}>
      <article
        className={`group cursor-pointer ${featured ? "col-span-1" : ""}`}
      >
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-muted aspect-4/3">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {post.category}
          </span>
          <h3
            className={`font-bold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}
          >
            {post.title}
          </h3>
          {featured && (
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

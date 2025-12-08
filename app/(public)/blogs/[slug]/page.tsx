import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogDetailHero from "./components/BlogDetailHero";
import BlogDetailContent from "./components/BlogDetailContent";
import RelatedPosts from "./components/RelatedPosts";
import CommentSection from "./components/CommentSection";
import ViewCounter from "./components/ViewCounter";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  return prisma.blog.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });
}

async function getRelatedPosts(slug: string, category: string) {
  return prisma.blog.findMany({
    where: { slug: { not: slug }, category, published: true },
    take: 3,
  });
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return { title: "Blog Not Found" };
  return { title: `${post.title} | Blog`, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.category);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <BlogDetailHero post={post} />
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <ViewCounter slug={slug} />
          </div>
          <BlogDetailContent post={post} />
          <CommentSection blogId={post.id} />
          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </div>
      </div>
    </div>
  );
}

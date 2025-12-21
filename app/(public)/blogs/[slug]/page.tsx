import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogDetailHero from "./components/BlogDetailHero";
import BlogDetailContent from "./components/BlogDetailContent";
import RelatedPosts from "./components/RelatedPosts";
import CommentSection from "./components/CommentSection";
import ViewCounter from "./components/ViewCounter";
import PostNavigation from "@/components/public/shared/PostNavigation";

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
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      category: true,
      media: true,
    },
  });
}

async function getAdjacentPosts(currentDate: Date) {
  const [previous, next] = await Promise.all([
    prisma.blog.findFirst({
      where: { published: true, createdAt: { lt: currentDate } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, thumbnail: true },
    }),
    prisma.blog.findFirst({
      where: { published: true, createdAt: { gt: currentDate } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true, thumbnail: true },
    }),
  ]);
  return { previous, next };
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

  const [relatedPosts, { previous, next }] = await Promise.all([
    getRelatedPosts(slug, post.category),
    getAdjacentPosts(post.createdAt),
  ]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-16 md:py-24">
        <BlogDetailHero post={post} />

        <div className="max-w-4xl mx-auto">
          <div className="mb-3 sm:mb-4">
            <ViewCounter slug={slug} />
          </div>
          <BlogDetailContent post={post} />
          <CommentSection blogId={post.id} />

          {/* Previous/Next Navigation */}
          <PostNavigation previous={previous} next={next} basePath="/blogs" />
        </div>

        {/* Related Posts - Full Width */}
        <div className="max-w-6xl mx-auto">
          {relatedPosts.length > 0 && (
            <RelatedPosts posts={relatedPosts} authorName={post.author.name} />
          )}
        </div>
      </div>
    </div>
  );
}

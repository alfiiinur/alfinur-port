import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogDetailHero from "./components/BlogDetailHero";
import BlogDetailContent from "./components/BlogDetailContent";
import RelatedPosts from "./components/RelatedPosts";
import CommentSection from "./components/CommentSection";
import ViewCounter from "./components/ViewCounter";
import PostNavigation from "@/components/public/shared/PostNavigation";
import BlogSectionSidebar from "./components/BlogSectionSidebar";
import TableOfContents from "./components/TableOfContents";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  return prisma.blog.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true } },
      section: true,
    },
  });
}

async function getBlogSections() {
  return prisma.blogSection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      blogs: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, slug: true },
      },
    },
  });
}

async function getUncategorizedBlogs() {
  return prisma.blog.findMany({
    where: { published: true, sectionId: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true },
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
  const [post, sections, uncategorizedBlogs] = await Promise.all([
    getBlog(slug),
    getBlogSections(),
    getUncategorizedBlogs(),
  ]);

  if (!post) notFound();

  const [relatedPosts, { previous, next }] = await Promise.all([
    getRelatedPosts(slug, post.category),
    getAdjacentPosts(post.createdAt),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Blog Sections */}
        <BlogSectionSidebar
          sections={sections}
          uncategorizedBlogs={uncategorizedBlogs}
          currentSlug={slug}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex">
            <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <BlogDetailHero post={post} />

              <div className="max-w-3xl mx-auto">
                <div className="mb-3 sm:mb-4">
                  <ViewCounter slug={slug} />
                </div>
                <BlogDetailContent post={post} />
                <CommentSection blogId={post.id} />

                {/* Previous/Next Navigation */}
                <PostNavigation
                  previous={previous}
                  next={next}
                  basePath="/blogs"
                />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="max-w-5xl mx-auto mt-12">
                  <RelatedPosts
                    posts={relatedPosts}
                    authorName={post.author.name}
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar - Table of Contents */}
            <aside className="hidden lg:block w-48 xl:w-56 shrink-0 pr-4 py-8">
              <div className="sticky top-20">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

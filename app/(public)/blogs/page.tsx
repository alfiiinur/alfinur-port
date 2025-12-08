import { prisma } from "@/lib/prisma";
import BlogHero from "./components/BlogHero";
import BlogSidebar from "./components/BlogSidebar";
import BlogGrid from "./components/BlogGrid";
import VisitSection from "./components/VisitSection";
import Snippet from "@/components/admin/terminal";

export const metadata = {
  title: "Blog | Articles & Insights",
  description: "Read our latest articles and insights.",
};

async function getBlogs() {
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return ["All", ...blogs.map((b) => b.category)];
}

export default async function Blogs() {
  const [blogs, categories] = await Promise.all([getBlogs(), getCategories()]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <BlogHero />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <BlogSidebar categories={categories} />
            </div>
          </div>
          <div className="lg:col-span-9 order-1 lg:order-2">
            <BlogGrid blogs={blogs} categories={categories} />
          </div>
        </div>
        <VisitSection />
        <Snippet />
      </div>
    </div>
  );
}

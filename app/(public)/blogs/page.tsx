import { prisma } from "@/lib/prisma";
import BlogContentGrid from "./components/BlogContentGrid";
import BlogHero from "./components/BlogHero";

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

  // Get featured blog (first one)
  const featuredBlog = blogs[0] || null;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <BlogHero featuredBlog={featuredBlog} />

      {/* Blog Content */}
      <div id="blog-content" className="container mx-auto px-4 pb-16">
        <BlogContentGrid blogs={blogs} categories={categories} />
      </div>
    </div>
  );
}

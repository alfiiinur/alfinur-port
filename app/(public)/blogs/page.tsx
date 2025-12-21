import { prisma } from "@/lib/prisma";
import BlogBentoGrid from "./components/BlogBentoGrid";

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
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            • Alfi Journal
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Discover Stories & Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore articles on web development, design, and technology.
          </p>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="container mx-auto px-4 pb-16">
        <BlogBentoGrid blogs={blogs} categories={categories} />
      </div>
    </div>
  );
}

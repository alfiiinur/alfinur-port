import { prisma } from "@/lib/prisma";
import BlogSectionsManager from "./components/BlogSectionsManager";

async function getSections() {
  return prisma.blogSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      blogs: {
        orderBy: { sortOrder: "asc" },
        distinct: ["id"],
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          category: true,
        },
      },
    },
  });
}

async function getUncategorizedBlogs() {
  return prisma.blog.findMany({
    where: { sectionId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      category: true,
    },
  });
}

export default async function BlogSectionsPage() {
  const [sections, uncategorizedBlogs] = await Promise.all([
    getSections(),
    getUncategorizedBlogs(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog Sections</h1>
        <p className="text-muted-foreground">
          Organize your blogs into sections. Drag and drop to reorder.
        </p>
      </div>

      <BlogSectionsManager
        initialSections={sections}
        initialUncategorized={uncategorizedBlogs}
      />
    </div>
  );
}

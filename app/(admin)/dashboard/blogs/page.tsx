import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogsTable from "./components/BlogsTable";

async function getBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blogs</h2>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Blog
          </Link>
        </Button>
      </div>

      <BlogsTable blogs={blogs} />
    </div>
  );
}

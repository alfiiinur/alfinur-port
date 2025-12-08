import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogForm from "../../components/BlogForm";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Blog</h2>
        <p className="text-muted-foreground">Update blog details</p>
      </div>
      <BlogForm blog={blog} />
    </div>
  );
}

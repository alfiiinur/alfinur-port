"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getAuthorId() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  if (session.user.id) return session.user.id;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function createBlog(formData: FormData) {
  const authorId = await getAuthorId();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.blog.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      media,
      category,
      tags,
      published,
      authorId,
    },
  });

  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
  redirect("/dashboard/blogs");
}

export async function updateBlog(id: string, formData: FormData) {
  await getAuthorId();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      media,
      category,
      tags,
      published,
    },
  });

  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
  redirect("/dashboard/blogs");
}

export async function deleteBlog(id: string) {
  await getAuthorId();
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
}

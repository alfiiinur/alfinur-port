"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSection(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if slug exists and add suffix if needed
  const existingSection = await prisma.blogSection.findUnique({
    where: { slug },
  });

  if (existingSection) {
    const count = await prisma.blogSection.count({
      where: { slug: { startsWith: slug } },
    });
    slug = `${slug}-${count + 1}`;
  }

  const maxOrder = await prisma.blogSection.aggregate({
    _max: { sortOrder: true },
  });

  await prisma.blogSection.create({
    data: {
      name,
      slug,
      description: description || null,
      icon: icon || "folder",
      color: color || "#3b82f6",
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
    },
  });

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

export async function updateSection(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await prisma.blogSection.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      icon: icon || "folder",
      color: color || "#3b82f6",
    },
  });

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

export async function deleteSection(id: string) {
  // Remove section reference from blogs first
  await prisma.blog.updateMany({
    where: { sectionId: id },
    data: { sectionId: null },
  });

  await prisma.blogSection.delete({
    where: { id },
  });

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

export async function updateSectionOrder(
  sections: { id: string; sortOrder: number }[]
) {
  await Promise.all(
    sections.map((section) =>
      prisma.blogSection.update({
        where: { id: section.id },
        data: { sortOrder: section.sortOrder },
      })
    )
  );

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

export async function moveBlogToSection(
  blogId: string,
  sectionId: string | null
) {
  await prisma.blog.update({
    where: { id: blogId },
    data: { sectionId },
  });

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

export async function updateBlogOrder(
  blogs: { id: string; sortOrder: number; sectionId: string | null }[]
) {
  await Promise.all(
    blogs.map((blog) =>
      prisma.blog.update({
        where: { id: blog.id },
        data: { sortOrder: blog.sortOrder, sectionId: blog.sectionId },
      })
    )
  );

  revalidatePath("/dashboard/blogs/sections");
  revalidatePath("/blogs");
}

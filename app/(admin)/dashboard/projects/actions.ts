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

export async function createProject(formData: FormData) {
  const authorId = await getAuthorId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const client = formData.get("client") as string;
  const link = formData.get("link") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      thumbnail,
      images: [thumbnail],
      media,
      category,
      client: client || null,
      link: link || null,
      tags,
      published,
      authorId,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  redirect("/dashboard/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await getAuthorId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const client = formData.get("client") as string;
  const link = formData.get("link") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      thumbnail,
      images: [thumbnail],
      media,
      category,
      client: client || null,
      link: link || null,
      tags,
      published,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  redirect("/dashboard/projects");
}

export async function deleteProject(id: string) {
  await getAuthorId();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
}

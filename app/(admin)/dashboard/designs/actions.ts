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

export async function createDesign(formData: FormData) {
  const authorId = await getAuthorId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.design.create({
    data: {
      title,
      slug,
      description: description || null,
      image,
      media,
      category,
      tags,
      published,
      authorId,
    },
  });

  revalidatePath("/dashboard/designs");
  revalidatePath("/design");
  redirect("/dashboard/designs");
}

export async function updateDesign(id: string, formData: FormData) {
  await getAuthorId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const mediaJson = formData.get("media") as string;
  const media = mediaJson ? JSON.parse(mediaJson) : [];
  const category = formData.get("category") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  await prisma.design.update({
    where: { id },
    data: {
      title,
      slug,
      description: description || null,
      image,
      media,
      category,
      tags,
      published,
    },
  });

  revalidatePath("/dashboard/designs");
  revalidatePath("/design");
  redirect("/dashboard/designs");
}

export async function deleteDesign(id: string) {
  await getAuthorId();
  await prisma.design.delete({ where: { id } });
  revalidatePath("/dashboard/designs");
  revalidatePath("/design");
}

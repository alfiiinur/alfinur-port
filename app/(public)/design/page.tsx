import { prisma } from "@/lib/prisma";
import DesignPageClient from "./components/DesignPageClient";

export const metadata = {
  title: "Design Gallery | Creative Works",
  description: "Explore our design gallery.",
};

async function getDesigns() {
  return prisma.design.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { likes: true } },
      author: { select: { name: true } },
    },
  });
}

async function getCategories() {
  const designs = await prisma.design.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return ["All", ...designs.map((d) => d.category)];
}

async function getFeaturedDesigns() {
  // Get top 5 most liked designs for carousel
  const designs = await prisma.design.findMany({
    where: { published: true },
    include: {
      _count: { select: { likes: true } },
      author: { select: { name: true } },
    },
  });

  if (designs.length === 0) return [];

  // Sort by likes count and get top 5
  const sorted = designs.sort((a, b) => b._count.likes - a._count.likes);
  return sorted.slice(0, 5);
}

export default async function Designs() {
  const [designs, categories, featuredDesigns] = await Promise.all([
    getDesigns(),
    getCategories(),
    getFeaturedDesigns(),
  ]);

  return (
    <DesignPageClient
      designs={designs}
      categories={categories}
      featuredDesigns={featuredDesigns}
    />
  );
}

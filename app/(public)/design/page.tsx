import { prisma } from "@/lib/prisma";
import DesignHero from "./components/DesignHero";
import DesignGrid from "./components/DesignGrid";

export const metadata = {
  title: "Design Gallery | Creative Works",
  description: "Explore our design gallery.",
};

async function getDesigns() {
  return prisma.design.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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

export default async function Designs() {
  const [designs, categories] = await Promise.all([
    getDesigns(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <DesignHero />
        <DesignGrid designs={designs} categories={categories} />
      </div>
    </div>
  );
}

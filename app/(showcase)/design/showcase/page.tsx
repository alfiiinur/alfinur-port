import { prisma } from "@/lib/prisma";
import DesignShowcaseClient from "@/app/(public)/design/components/DesignShowcaseClient";

export const metadata = {
  title: "Design Showcase | Year in Review",
  description: "Explore our design showcase with immersive animations.",
};

async function getDesigns() {
  return prisma.design.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      category: true,
      tags: true,
    },
  });
}

export default async function ShowcasePage() {
  const designs = await getDesigns();
  return <DesignShowcaseClient designs={designs} />;
}

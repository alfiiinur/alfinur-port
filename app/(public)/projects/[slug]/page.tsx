import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectDetailHero from "./components/ProjectDetailHero";
import ProjectDetailContent from "./components/ProjectDetailContent";
import RelatedProjects from "./components/RelatedProjects";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug, published: true },
  });
}

async function getRelatedProjects(slug: string, category: string) {
  return prisma.project.findMany({
    where: {
      slug: { not: slug },
      category,
      published: true,
    },
    take: 3,
  });
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(slug, project.category);

  return (
    <main className="min-h-screen bg-background">
      <ProjectDetailHero project={project} />
      <ProjectDetailContent project={project} />
      {relatedProjects.length > 0 && (
        <RelatedProjects projects={relatedProjects} />
      )}
    </main>
  );
}

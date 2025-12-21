import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectDetailHero from "./components/ProjectDetailHero";
import ProjectDetailContent from "./components/ProjectDetailContent";
import RelatedProjects from "./components/RelatedProjects";
import PostNavigation from "@/components/public/shared/PostNavigation";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      images: true,
      media: true,
      category: true,
      client: true,
      link: true,
      tags: true,
      published: true,
      hasSections: true,
      sections: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
    },
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

async function getAdjacentProjects(currentDate: Date) {
  const [previous, next] = await Promise.all([
    prisma.project.findFirst({
      where: { published: true, createdAt: { lt: currentDate } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, thumbnail: true },
    }),
    prisma.project.findFirst({
      where: { published: true, createdAt: { gt: currentDate } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true, thumbnail: true },
    }),
  ]);
  return { previous, next };
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

  const [relatedProjects, { previous, next }] = await Promise.all([
    getRelatedProjects(slug, project.category),
    getAdjacentProjects(project.createdAt),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <ProjectDetailHero project={project} />
      <ProjectDetailContent project={project} />

      {/* Previous/Next Navigation */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <PostNavigation
            previous={previous}
            next={next}
            basePath="/projects"
          />
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <RelatedProjects projects={relatedProjects} />
      )}
    </main>
  );
}

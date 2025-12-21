import { prisma } from "@/lib/prisma";
import ProjectsPage from "@/app/(public)/projects/components/ProjectsPage";

export const metadata = {
  title: "Projects | Alfi Nur Portfolio",
  description:
    "Explore my portfolio of innovative designs and digital solutions.",
};

async function getProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return ["All", ...projects.map((p) => p.category)];
}

export default async function Projects() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ]);

  return <ProjectsPage projects={projects} categories={categories} />;
}

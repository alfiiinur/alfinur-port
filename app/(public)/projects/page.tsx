import { prisma } from "@/lib/prisma";
import ProjectHero from "./components/ProjectHero";
import ProjectsSection from "./components/ProjectsSection";

export const metadata = {
  title: "Projects | Our Creative Portfolio",
  description:
    "Explore our portfolio of innovative designs and digital solutions.",
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

  return (
    <main className="min-h-screen">
      <ProjectHero />
      <ProjectsSection projects={projects} categories={categories} />
    </main>
  );
}

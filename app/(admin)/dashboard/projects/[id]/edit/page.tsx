import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "../../components/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Project</h2>
        <p className="text-muted-foreground">Update project details</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}

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

  // Normalize sections from DB to match ProjectForm expected `ProjectSection[]` shape.
  const generateId = () => Math.random().toString(36).slice(2, 9);

  const normalizeSections = () => {
    const raw = project.sections as any;
    if (!raw) return undefined;

    // If already in the new shape (has id and bentoItems), return as-is
    if (Array.isArray(raw) && raw.length > 0 && raw[0].id && raw[0].bentoItems) {
      return raw;
    }

    // Legacy shape handling: { type, content, media?: string[] }
    if (Array.isArray(raw)) {
      return raw.map((s: any, idx: number) => ({
        id: s.id || generateId(),
        title: s.title || s.type || `Section ${idx + 1}`,
        content: s.content || "",
        bentoItems: (s.bentoItems || s.media || []).map((url: string) => ({
          id: generateId(),
          type: url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
          url,
          size: "small",
        })),
        order: typeof s.order === "number" ? s.order : idx,
      }));
    }

    return undefined;
  };

  const projectData = {
    ...project,
    sections: normalizeSections(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Project</h2>
        <p className="text-muted-foreground">Update project details</p>
      </div>
      <ProjectForm project={projectData} />
    </div>
  );
}

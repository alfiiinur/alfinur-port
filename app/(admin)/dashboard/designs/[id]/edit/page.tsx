import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DesignForm from "../../components/DesignForm";

interface EditDesignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDesignPage({ params }: EditDesignPageProps) {
  const { id } = await params;

  const design = await prisma.design.findUnique({
    where: { id },
  });

  if (!design) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Design</h2>
        <p className="text-muted-foreground">Update design details</p>
      </div>
      <DesignForm design={design} />
    </div>
  );
}

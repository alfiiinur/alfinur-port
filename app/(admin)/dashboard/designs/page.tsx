import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DesignsTable from "./components/DesignsTable";

async function getDesigns() {
  return prisma.design.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export default async function DesignsPage() {
  const designs = await getDesigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Designs</h2>
          <p className="text-muted-foreground">Manage your design gallery</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/designs/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Design
          </Link>
        </Button>
      </div>

      <DesignsTable designs={designs} />
    </div>
  );
}

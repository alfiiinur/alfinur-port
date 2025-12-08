"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, MoreHorizontal, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "../actions";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  published: boolean;
  createdAt: Date;
  author: { name: string };
}

interface ProjectsTableProps {
  projects: Project[];
}

function ThumbnailImage({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className="w-12 h-12 object-cover rounded-md"
      unoptimized={true} // atau hapus jika sudah konfigurasi remotePatterns
      onError={() => setError(true)}
    />
  );
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(id);
    await deleteProject(id);
    setIsDeleting(null);
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">No projects found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/projects/new">Create your first project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <ThumbnailImage src={project.thumbnail} alt={project.title} />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {project.description}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">{project.category}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={project.published ? "default" : "outline"}>
                  {project.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {new Date(project.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting === project.id}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting === project.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

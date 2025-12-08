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
import { deleteDesign } from "../actions";

interface Design {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  category: string;
  published: boolean;
  createdAt: Date;
  author: { name: string };
}

interface DesignsTableProps {
  designs: Design[];
}

function ThumbnailImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const isVideo = src?.match(/\.(mp4|webm|ogg)$/i);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <ImageIcon className="w-5 h-5" />
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        onError={() => setError(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function DesignsTable({ designs }: DesignsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this design?")) return;

    setIsDeleting(id);
    await deleteDesign(id);
    setIsDeleting(null);
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">No designs found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/designs/new">Create your first design</Link>
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
          {designs.map((design) => (
            <TableRow key={design.id}>
              <TableCell>
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <ThumbnailImage src={design.image} alt={design.title} />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{design.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {design.description || "No description"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">{design.category}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={design.published ? "default" : "outline"}>
                  {design.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {new Date(design.createdAt).toLocaleDateString()}
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
                      <Link href={`/design/${design.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/designs/${design.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(design.id)}
                      disabled={isDeleting === design.id}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting === design.id ? "Deleting..." : "Delete"}
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

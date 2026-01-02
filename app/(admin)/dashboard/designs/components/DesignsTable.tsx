"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ImageIcon,
  ArrowUpDown,
  Filter,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteDesign } from "../actions";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

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

type SortOrder = "asc" | "desc";
type SortField = "title" | "category" | "status" | "date";

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
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    design: Design | null;
  }>({
    open: false,
    design: null,
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(designs.map((d) => d.category))];
    return cats.sort();
  }, [designs]);

  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    let result = [...designs];

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((d) => d.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((d) =>
        filterStatus === "published" ? d.published : !d.published
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "status":
          comparison = Number(b.published) - Number(a.published);
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [designs, filterCategory, filterStatus, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  async function handleDelete() {
    if (!deleteModal.design) return;

    setIsDeleting(deleteModal.design.id);
    await deleteDesign(deleteModal.design.id);
    setIsDeleting(null);
    setDeleteModal({ open: false, design: null });
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredDesigns.length} of {designs.length} items
        </span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("title")}
                >
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("category")}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDesigns.map((design) => (
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
                        onClick={() => setDeleteModal({ open: true, design })}
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

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({ open, design: open ? deleteModal.design : null })
        }
        onConfirm={handleDelete}
        title="Delete Design"
        itemName={deleteModal.design?.title}
        isLoading={isDeleting === deleteModal.design?.id}
      />
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Pencil,
  Trash2,
  Folder,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BlogItem from "./BlogItem";
import { deleteSection } from "../actions";

interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
}

interface Section {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  blogs: Blog[];
}

interface SectionCardProps {
  section: Section;
  onEdit: () => void;
}

export default function SectionCard({ section, onEdit }: SectionCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dedupe blogs by id
  const uniqueBlogs = useMemo(() => {
    const seen = new Set<string>();
    return section.blogs.filter((blog) => {
      if (seen.has(blog.id)) return false;
      seen.add(blog.id);
      return true;
    });
  }, [section.blogs]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete section "${section.name}"? Blogs will be moved to uncategorized.`
      )
    )
      return;
    setIsDeleting(true);
    await deleteSection(section.id);
    router.refresh();
  };

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/50">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <Folder className="w-4 h-4" style={{ color: section.color }} />

          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{section.name}</h3>
            {section.description && (
              <p className="text-xs text-muted-foreground truncate">
                {section.description}
              </p>
            )}
          </div>

          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {uniqueBlogs.length} posts
          </span>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-3 min-h-[60px]">
          <SortableContext
            items={uniqueBlogs.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {uniqueBlogs.map((blog) => (
              <BlogItem key={blog.id} blog={blog} />
            ))}
          </SortableContext>

          {uniqueBlogs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Drag blogs here
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

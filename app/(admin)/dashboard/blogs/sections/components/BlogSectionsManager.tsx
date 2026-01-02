"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SectionCard from "./SectionCard";
import BlogItem from "./BlogItem";
import SectionFormModal from "./SectionFormModal";
import { updateSectionOrder, updateBlogOrder } from "../actions";

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
  sortOrder: number;
  blogs: Blog[];
}

interface BlogSectionsManagerProps {
  initialSections: Section[];
  initialUncategorized: Blog[];
}

export default function BlogSectionsManager({
  initialSections,
  initialUncategorized,
}: BlogSectionsManagerProps) {
  const [sections, setSections] = useState(initialSections);
  const [uncategorized, setUncategorized] = useState(initialUncategorized);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"section" | "blog" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findBlogContainer = (id: string) => {
    if (uncategorized.find((b) => b.id === id)) return "uncategorized";
    for (const section of sections) {
      if (section.blogs.find((b) => b.id === id)) return section.id;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;

    if (sections.find((s) => s.id === id)) {
      setActiveType("section");
    } else {
      setActiveType("blog");
    }
    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || activeType !== "blog") return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findBlogContainer(activeId);
    let overContainer = findBlogContainer(overId);

    // If over a section header, use that section
    if (sections.find((s) => s.id === overId)) {
      overContainer = overId;
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    // Move blog between containers
    setSections((prev) => {
      const newSections = [...prev];

      // Find and remove from source
      let movedBlog: Blog | undefined;
      if (activeContainer === "uncategorized") {
        const idx = uncategorized.findIndex((b) => b.id === activeId);
        if (idx !== -1) {
          movedBlog = uncategorized[idx];
          setUncategorized((u) => u.filter((b) => b.id !== activeId));
        }
      } else {
        const sourceSection = newSections.find((s) => s.id === activeContainer);
        if (sourceSection) {
          const idx = sourceSection.blogs.findIndex((b) => b.id === activeId);
          if (idx !== -1) {
            movedBlog = sourceSection.blogs[idx];
            sourceSection.blogs = sourceSection.blogs.filter(
              (b) => b.id !== activeId
            );
          }
        }
      }

      if (!movedBlog) return prev;

      // Add to destination
      if (overContainer === "uncategorized") {
        setUncategorized((u) => [...u, movedBlog!]);
      } else {
        const destSection = newSections.find((s) => s.id === overContainer);
        if (destSection) {
          destSection.blogs = [...destSection.blogs, movedBlog];
        }
      }

      return newSections;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeType === "section") {
      // Reorder sections
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);

      if (oldIndex !== newIndex) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        setSections(newSections);

        await updateSectionOrder(
          newSections.map((s, i) => ({ id: s.id, sortOrder: i }))
        );
      }
    } else {
      // Save blog positions
      const allBlogs: {
        id: string;
        sortOrder: number;
        sectionId: string | null;
      }[] = [];

      uncategorized.forEach((blog, i) => {
        allBlogs.push({ id: blog.id, sortOrder: i, sectionId: null });
      });

      sections.forEach((section) => {
        section.blogs.forEach((blog, i) => {
          allBlogs.push({ id: blog.id, sortOrder: i, sectionId: section.id });
        });
      });

      await updateBlogOrder(allBlogs);
    }
  };

  const getActiveBlog = () => {
    if (!activeId || activeType !== "blog") return null;
    const blog = uncategorized.find((b) => b.id === activeId);
    if (blog) return blog;
    for (const section of sections) {
      const found = section.blogs.find((b) => b.id === activeId);
      if (found) return found;
    }
    return null;
  };

  const getActiveSection = () => {
    if (!activeId || activeType !== "section") return null;
    return sections.find((s) => s.id === activeId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6">
        {/* Sections Column */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sections</h2>
            <Button
              size="sm"
              onClick={() => {
                setEditingSection(null);
                setShowModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Section
            </Button>
          </div>

          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onEdit={() => {
                  setEditingSection(section);
                  setShowModal(true);
                }}
              />
            ))}
          </SortableContext>

          {sections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No sections yet. Create one to organize your blogs.
            </div>
          )}
        </div>

        {/* Uncategorized Column */}
        <div className="w-80 shrink-0">
          <h2 className="text-lg font-semibold mb-4">Uncategorized</h2>
          <div className="bg-muted/50 rounded-lg p-3 min-h-[200px]">
            <SortableContext
              items={uncategorized.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {uncategorized.map((blog) => (
                <BlogItem key={blog.id} blog={blog} />
              ))}
            </SortableContext>

            {uncategorized.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Drag blogs here to uncategorize
              </p>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeType === "blog" && getActiveBlog() && (
          <BlogItem blog={getActiveBlog()!} isDragging />
        )}
        {activeType === "section" && getActiveSection() && (
          <div className="bg-card border rounded-lg p-4 shadow-lg opacity-90">
            <span className="font-medium">{getActiveSection()!.name}</span>
          </div>
        )}
      </DragOverlay>

      <SectionFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSection(null);
        }}
        section={editingSection}
      />
    </DndContext>
  );
}

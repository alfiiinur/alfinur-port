"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultiMediaUpload from "@/components/admin/MultiMediaUpload";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export interface BentoItem {
  id: string;
  type: "image" | "video";
  url: string;
  size: "small" | "medium" | "large" | "wide" | "tall";
  caption?: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  bentoItems: BentoItem[];
  order: number;
}

interface SectionBuilderProps {
  sections: ProjectSection[];
  onChange: (sections: ProjectSection[]) => void;
}

const bentoSizes = [
  { value: "small", label: "Small (1x1)", className: "col-span-1 row-span-1" },
  {
    value: "medium",
    label: "Medium (2x1)",
    className: "col-span-2 row-span-1",
  },
  { value: "large", label: "Large (2x2)", className: "col-span-2 row-span-2" },
  { value: "wide", label: "Wide (3x1)", className: "col-span-3 row-span-1" },
  { value: "tall", label: "Tall (1x2)", className: "col-span-1 row-span-2" },
];

export default function SectionBuilder({
  sections,
  onChange,
}: SectionBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addSection = () => {
    const newSection: ProjectSection = {
      id: generateId(),
      title: "",
      content: "",
      bentoItems: [],
      order: sections.length,
    };
    onChange([...sections, newSection]);
    setExpandedSections([...expandedSections, newSection.id]);
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
    setExpandedSections(expandedSections.filter((eid) => eid !== id));
  };

  const updateSection = (id: string, updates: Partial<ProjectSection>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleReorder = (newOrder: ProjectSection[]) => {
    onChange(newOrder.map((s, i) => ({ ...s, order: i })));
  };

  // Bento item handlers
  const addBentoItem = (sectionId: string, urls: string[]) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newItems: BentoItem[] = urls.map((url) => ({
      id: generateId(),
      type: url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
      url,
      size: "small",
    }));

    updateSection(sectionId, {
      bentoItems: [...section.bentoItems, ...newItems],
    });
  };

  const updateBentoItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<BentoItem>
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      bentoItems: section.bentoItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const removeBentoItem = (sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      bentoItems: section.bentoItems.filter((item) => item.id !== itemId),
    });
  };

  return (
    <div className="space-y-4">
      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={handleReorder}
        className="space-y-4"
      >
        <AnimatePresence>
          {sections.map((section) => (
            <Reorder.Item
              key={section.id}
              value={section}
              className="list-none"
            >
              <Card className="border-2 border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        placeholder="Section Title (e.g., Status Quo, Process)"
                        className="font-semibold border-0 p-0 h-auto text-lg focus-visible:ring-0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(section.id)}
                    >
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="space-y-4 pt-2">
                        {/* Content */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Content
                          </Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) =>
                              updateSection(section.id, {
                                content: e.target.value,
                              })
                            }
                            placeholder="Write section content here..."
                            rows={4}
                          />
                        </div>

                        {/* Bento Grid Media */}
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            Bento Grid Media
                          </Label>

                          {/* Bento Preview */}
                          {section.bentoItems.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 auto-rows-[100px]">
                              {section.bentoItems.map((item) => {
                                const sizeClass =
                                  bentoSizes.find((s) => s.value === item.size)
                                    ?.className || "col-span-1 row-span-1";

                                return (
                                  <div
                                    key={item.id}
                                    className={`relative group rounded-lg overflow-hidden bg-muted ${sizeClass}`}
                                  >
                                    {item.type === "image" ? (
                                      <img
                                        src={item.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                        muted
                                      />
                                    )}

                                    {/* Overlay controls */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                      <select
                                        value={item.size}
                                        onChange={(e) =>
                                          updateBentoItem(section.id, item.id, {
                                            size: e.target
                                              .value as BentoItem["size"],
                                          })
                                        }
                                        className="text-xs bg-white/20 text-white border-0 rounded px-2 py-1"
                                      >
                                        {bentoSizes.map((size) => (
                                          <option
                                            key={size.value}
                                            value={size.value}
                                            className="text-black"
                                          >
                                            {size.label}
                                          </option>
                                        ))}
                                      </select>
                                      <Input
                                        value={item.caption || ""}
                                        onChange={(e) =>
                                          updateBentoItem(section.id, item.id, {
                                            caption: e.target.value,
                                          })
                                        }
                                        placeholder="Caption"
                                        className="text-xs h-7 bg-white/20 text-white placeholder:text-white/60 border-0"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          removeBentoItem(section.id, item.id)
                                        }
                                        className="h-7 text-xs"
                                      >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add Media */}
                          <MultiMediaUpload
                            value={[]}
                            onChange={(urls) => addBentoItem(section.id, urls)}
                            maxFiles={20}
                          />
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
}

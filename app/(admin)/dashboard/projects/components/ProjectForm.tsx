"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import MediaUpload from "@/components/admin/MediaUpload";
import MultiMediaUpload from "@/components/admin/MultiMediaUpload";
import PreviewModal from "@/components/admin/PreviewModal";
import { createProject, updateProject } from "../actions";
import { useState, useRef } from "react";
import { Loader2, Eye } from "lucide-react";

const categories = [
  "Web Design",
  "Mobile App",
  "Branding",
  "UI/UX",
  "Illustration",
];

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  media: string[];
  category: string;
  client: string | null;
  link: string | null;
  tags: string[];
  published: boolean;
}

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || "");
  const [media, setMedia] = useState<string[]>(project?.media || []);
  const [showPreview, setShowPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const getFormData = () => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);
    return {
      title: (formData.get("title") as string) || "",
      description: (formData.get("description") as string) || "",
      thumbnail,
      media,
      category: (formData.get("category") as string) || "",
      client: (formData.get("client") as string) || "",
      link: (formData.get("link") as string) || "",
      tags: ((formData.get("tags") as string) || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  };

  async function handleSubmit(formData: FormData) {
    if (!thumbnail) {
      alert("Please upload a thumbnail");
      return;
    }

    setIsLoading(true);
    formData.set("thumbnail", thumbnail);
    formData.set("media", JSON.stringify(media));

    try {
      if (project) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const previewData = getFormData();

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <form ref={formRef} action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={project?.title}
                  required
                  placeholder="Project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={project?.category}
                  required
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project?.description}
                required
                placeholder="Project description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail *</Label>
              <MediaUpload
                value={thumbnail}
                onChange={setThumbnail}
                accept="image"
              />
            </div>

            <div className="space-y-2">
              <Label>Gallery (Images & Videos)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add additional images or videos to showcase your project
              </p>
              <MultiMediaUpload
                value={media}
                onChange={setMedia}
                maxFiles={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  defaultValue={project?.client || ""}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Project Link</Label>
                <Input
                  id="link"
                  name="link"
                  defaultValue={project?.link || ""}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={project?.tags.join(", ")}
                placeholder="web, design, responsive"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                value="true"
                defaultChecked={project?.published}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="published" className="font-normal">
                Publish this project
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {project ? "Update Project" : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {previewData && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          type="project"
          data={previewData}
        />
      )}
    </>
  );
}

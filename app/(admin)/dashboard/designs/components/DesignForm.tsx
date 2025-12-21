"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import MediaUpload from "@/components/admin/MediaUpload";
import MultiMediaUpload from "@/components/admin/MultiMediaUpload";
import PreviewModal from "@/components/admin/PreviewModal";
import { createDesign, updateDesign } from "../actions";
import { useState, useRef } from "react";
import { Loader2, Eye } from "lucide-react";

const categories = [
  "UI Design",
  "Graphic Design",
  "Illustration",
  "Logo",
  "Poster",
  "Social Media",
  "Product",
];

// Size guide per category
const categorySizeGuide: Record<
  string,
  { width: number; height: number; ratio: string; note: string }
> = {
  "UI Design": {
    width: 1920,
    height: 1080,
    ratio: "16:9",
    note: "Desktop/Web UI",
  },
  "Graphic Design": {
    width: 1600,
    height: 1200,
    ratio: "4:3",
    note: "General graphic",
  },
  Illustration: {
    width: 2000,
    height: 2000,
    ratio: "1:1",
    note: "Square artwork",
  },
  Logo: { width: 1080, height: 1080, ratio: "1:1", note: "Square logo" },
  Poster: { width: 2480, height: 3508, ratio: "A4", note: "Print-ready A4" },
  "Social Media": {
    width: 1080,
    height: 1080,
    ratio: "1:1",
    note: "Instagram/Social",
  },
  Product: {
    width: 1920,
    height: 1080,
    ratio: "16:9",
    note: "Product showcase",
  },
};

interface Design {
  id: string;
  title: string;
  description: string | null;
  image: string;
  media: string[];
  category: string;
  tags: string[];
  published: boolean;
}

interface DesignFormProps {
  design?: Design;
}

export default function DesignForm({ design }: DesignFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(design?.image || "");
  const [media, setMedia] = useState<string[]>(design?.media || []);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    design?.category || ""
  );
  const formRef = useRef<HTMLFormElement>(null);

  const currentSizeGuide = categorySizeGuide[selectedCategory] || {
    width: 1600,
    height: 1200,
    ratio: "4:3",
    note: "Select category for size guide",
  };

  const getFormData = () => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);
    return {
      title: (formData.get("title") as string) || "",
      description: (formData.get("description") as string) || "",
      image,
      media,
      category: (formData.get("category") as string) || "",
      tags: ((formData.get("tags") as string) || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  };

  async function handleSubmit(formData: FormData) {
    if (!image) {
      alert("Please upload a main image or video");
      return;
    }

    setIsLoading(true);
    formData.set("image", image);
    formData.set("media", JSON.stringify(media));

    try {
      if (design) {
        await updateDesign(design.id, formData);
      } else {
        await createDesign(formData);
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
                  defaultValue={design?.title}
                  required
                  placeholder="Design title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
              <Label>Main Image / Video *</Label>
              {/* Dynamic Size Guide based on Category */}
              <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-sm font-medium flex items-center gap-2">
                  📐 Recommended Size for {selectedCategory || "Design"}:
                </p>
                <p className="text-lg font-bold text-primary">
                  {currentSizeGuide.width} x {currentSizeGuide.height}px
                </p>
                <p className="text-xs text-muted-foreground">
                  Ratio: {currentSizeGuide.ratio} • {currentSizeGuide.note}
                </p>
              </div>
              <MediaUpload
                value={image}
                onChange={setImage}
                accept="all"
                mediaType="design"
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Media Gallery</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add more images or videos to showcase your design
              </p>
              {/* Size guide info for gallery */}
              <div className="mb-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded">
                💡 Gallery images should match the main image size (
                {currentSizeGuide.width} x {currentSizeGuide.height}px)
              </div>
              <MultiMediaUpload
                value={media}
                onChange={setMedia}
                maxFiles={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={design?.description || ""}
                placeholder="Design description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={design?.tags.join(", ")}
                placeholder="ui, design, modern"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                value="true"
                defaultChecked={design?.published}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="published" className="font-normal">
                Publish this design
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
                {design ? "Update Design" : "Create Design"}
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
          type="design"
          data={previewData}
        />
      )}
    </>
  );
}

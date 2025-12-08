"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import MediaUpload from "@/components/admin/MediaUpload";
import MultiMediaUpload from "@/components/admin/MultiMediaUpload";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import PreviewModal from "@/components/admin/PreviewModal";
import { createBlog, updateBlog } from "../actions";
import { useState, useRef } from "react";
import { Loader2, Eye } from "lucide-react";

const categories = ["Technology", "Design", "Development", "Tutorial", "News"];

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  media: string[];
  category: string;
  tags: string[];
  published: boolean;
}

interface BlogFormProps {
  blog?: Blog;
}

export default function BlogForm({ blog }: BlogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(blog?.thumbnail || "");
  const [media, setMedia] = useState<string[]>(blog?.media || []);
  const [content, setContent] = useState(blog?.content || "");
  const [showPreview, setShowPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const getFormData = () => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);
    return {
      title: (formData.get("title") as string) || "",
      excerpt: (formData.get("excerpt") as string) || "",
      content,
      thumbnail,
      media,
      category: (formData.get("category") as string) || "",
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
    if (!content.trim()) {
      alert("Please write some content");
      return;
    }

    setIsLoading(true);
    formData.set("thumbnail", thumbnail);
    formData.set("media", JSON.stringify(media));
    formData.set("content", content);

    try {
      if (blog) {
        await updateBlog(blog.id, formData);
      } else {
        await createBlog(formData);
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
                  defaultValue={blog?.title}
                  required
                  placeholder="Blog title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={blog?.category}
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
              <Label>Thumbnail *</Label>
              <MediaUpload
                value={thumbnail}
                onChange={setThumbnail}
                accept="image"
              />
            </div>

            <div className="space-y-2">
              <Label>Media Gallery (Images & Videos)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add images or videos to include in your blog post
              </p>
              <MultiMediaUpload
                value={media}
                onChange={setMedia}
                maxFiles={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={blog?.excerpt}
                required
                placeholder="Short description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Content * (Markdown supported)</Label>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog content here... Use ```js for code blocks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={blog?.tags.join(", ")}
                placeholder="react, nextjs, tutorial"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                value="true"
                defaultChecked={blog?.published}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="published" className="font-normal">
                Publish this blog
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
                {blog ? "Update Blog" : "Create Blog"}
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
          type="blog"
          data={previewData}
        />
      )}
    </>
  );
}

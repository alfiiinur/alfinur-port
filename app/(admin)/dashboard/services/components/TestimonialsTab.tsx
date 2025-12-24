"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  Quote,
  X,
  ImageIcon,
  Video,
} from "lucide-react";
import MediaUpload from "@/components/admin/MediaUpload";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  content: string;
  rating: number;
  projectType: string | null;
  media: string[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

// Helper to check if URL is video
function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "",
    content: "",
    rating: 5,
    projectType: "",
    media: [] as string[],
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing
        ? `/api/testimonials/${editing.id}`
        : "/api/testimonials";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchTestimonials();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Testimonial) => {
    setEditing(item);
    setFormData({
      name: item.name,
      role: item.role || "",
      company: item.company || "",
      avatar: item.avatar || "",
      content: item.content,
      rating: item.rating,
      projectType: item.projectType || "",
      media: item.media || [],
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      avatar: "",
      content: "",
      rating: 5,
      projectType: "",
      media: [],
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
    });
  };

  const addMedia = (url: string) => {
    if (url && !formData.media.includes(url)) {
      setFormData({ ...formData, media: [...formData.media, url] });
    }
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index),
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Testimonials</CardTitle>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="CEO, Manager, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Input
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    placeholder="Website, Mobile App"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label>Avatar</Label>
                <MediaUpload
                  value={formData.avatar}
                  onChange={(url) => setFormData({ ...formData, avatar: url })}
                  accept="image"
                  mediaType="general"
                />
              </div>

              <div className="space-y-2">
                <Label>Testimonial Content *</Label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>

              {/* Showcase Media Gallery */}
              <div className="space-y-2">
                <Label>Showcase Media (Images/Videos for Carousel)</Label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {formData.media.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border bg-muted group"
                    >
                      {isVideoUrl(url) ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-1 left-1">
                        {isVideoUrl(url) ? (
                          <Video className="w-4 h-4 text-white drop-shadow" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <MediaUpload
                  value=""
                  onChange={addMedia}
                  accept="all"
                  mediaType="general"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= formData.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, isFeatured: v })
                    }
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, isActive: v })
                    }
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className={`relative ${!item.isActive ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-primary">
                          {item.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {[item.role, item.company].filter(Boolean).join(" at ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= item.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 h-4 w-4 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground pl-4 line-clamp-3">
                    {item.content}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  {item.isFeatured && <Badge>Featured</Badge>}
                  {item.projectType && (
                    <Badge variant="outline">{item.projectType}</Badge>
                  )}
                  {item.media && item.media.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {item.media.length} media
                    </Badge>
                  )}
                  {!item.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              No testimonials yet. Add your first testimonial.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

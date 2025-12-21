"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash2, Upload, File, Eye, Pin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Note, NoteFormData, NOTE_COLORS } from "../types";
import { cn } from "@/lib/utils";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NoteFormData) => void;
  onDelete?: () => void;
  note?: Note | null;
}

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  note,
}: NoteModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    color: "#fef08a",
    isPinned: false,
    attachments: [],
    noteDate: null,
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        color: note.color,
        isPinned: note.isPinned,
        attachments: note.attachments || [],
        noteDate: note.noteDate
          ? new Date(note.noteDate).toISOString().split("T")[0]
          : null,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        color: "#fef08a",
        isPinned: false,
        attachments: [],
        noteDate: null,
      });
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newAttachments: string[] = [];

    for (const file of Array.from(files)) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          newAttachments.push(data.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || url;
  };

  const handleViewFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b sticky top-0 z-10 rounded-t-lg"
            style={{ backgroundColor: formData.color }}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {note ? "Edit Note" : "New Note"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPinned: !prev.isPinned }))
                }
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  formData.isPinned
                    ? "bg-black/20 text-gray-800"
                    : "hover:bg-black/10 text-gray-600"
                )}
              >
                <Pin
                  className={cn("h-4 w-4", formData.isPinned && "fill-current")}
                />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-black/10 rounded-md transition-colors text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-lg font-medium"
              required
            />

            {/* Content */}
            <textarea
              placeholder="Write your note here..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full min-h-[200px] px-3 py-2 text-sm rounded-md border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {/* Date for Calendar */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date (for Calendar)
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={formData.noteDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noteDate: e.target.value || null,
                    })
                  }
                  className="flex-1"
                />
                {formData.noteDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, noteDate: null })}
                    className="text-muted-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Set a date to show this note in the calendar
              </p>
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Note Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform border-2",
                      formData.color === color.value
                        ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110 border-gray-400"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Attachments
              </label>

              {/* Upload Button */}
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="note-file-upload"
                />
                <label
                  htmlFor="note-file-upload"
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    "hover:border-primary hover:bg-primary/5",
                    isUploading && "opacity-50 pointer-events-none"
                  )}
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? "Uploading..." : "Upload images or files"}
                  </span>
                </label>
              </div>

              {/* Attachment List */}
              {formData.attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.attachments.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden bg-muted"
                    >
                      {isImageFile(url) ? (
                        <img
                          src={url}
                          alt={getFileName(url)}
                          className="w-full h-24 object-cover"
                        />
                      ) : (
                        <div className="w-full h-24 flex flex-col items-center justify-center gap-1 p-2">
                          <File className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate max-w-full px-2">
                            {getFileName(url)}
                          </span>
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewFile(url)}
                          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-2 bg-red-500/50 rounded-full hover:bg-red-500/70 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t sticky bottom-0 bg-card">
            {note && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

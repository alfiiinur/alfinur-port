"use client";

import {
  X,
  Calendar,
  Pin,
  Pencil,
  Trash2,
  Eye,
  Download,
  File,
  Paperclip,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "../types";
import { cn } from "@/lib/utils";

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function NoteViewModal({
  isOpen,
  onClose,
  note,
  onEdit,
  onDelete,
}: NoteViewModalProps) {
  if (!isOpen || !note) return null;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handleDownloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = getFileName(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const imageAttachments =
    note.attachments?.filter((url) => isImageFile(url)) || [];
  const fileAttachments =
    note.attachments?.filter((url) => !isImageFile(url)) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b shrink-0"
          style={{ backgroundColor: note.color }}
        >
          <div className="flex items-center gap-2">
            {note.isPinned && (
              <Pin className="h-4 w-4 text-gray-700 fill-current" />
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {note.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-md transition-colors text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(note.createdAt)}</span>
            </div>
            {note.updatedAt !== note.createdAt && (
              <span>Updated: {formatDate(note.updatedAt)}</span>
            )}
            {note.noteDate && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full text-primary">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Calendar:{" "}
                  {new Date(note.noteDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {note.content}
            </p>
          </div>

          {/* Image Attachments */}
          {imageAttachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Images ({imageAttachments.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imageAttachments.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden bg-muted aspect-video"
                  >
                    <img
                      src={url}
                      alt={getFileName(url)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewFile(url)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(url)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Attachments */}
          {fileAttachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <File className="h-4 w-4" />
                Files ({fileAttachments.length})
              </h4>
              <div className="space-y-2">
                {fileAttachments.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
                  >
                    <File className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-sm truncate">
                      {getFileName(url)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewFile(url)}
                        className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(url)}
                        className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t shrink-0 bg-card">
          {onDelete ? (
            <Button
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
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

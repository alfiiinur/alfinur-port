"use client";

import {
  Calendar,
  Pin,
  Eye,
  Pencil,
  Trash2,
  Paperclip,
  CalendarDays,
} from "lucide-react";
import { Note } from "../types";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export default function NoteCard({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const hasAttachments = note.attachments && note.attachments.length > 0;
  const imageAttachments = note.attachments?.filter((url) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  );

  return (
    <div
      className="group relative rounded-2xl p-4 transition-all hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: note.color }}
      onClick={onView}
    >
      {/* Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin();
        }}
        className={cn(
          "absolute top-3 right-3 p-1.5 rounded-full transition-all",
          note.isPinned
            ? "text-gray-700 bg-black/10"
            : "text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-black/10"
        )}
      >
        <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
      </button>

      {/* Date */}
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
        {note.noteDate && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-black/10 rounded-full">
            <CalendarDays className="h-3 w-3" />
            <span>{formatDate(note.noteDate)}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-lg mb-2 pr-8 line-clamp-2">
        {note.title}
      </h3>

      {/* Content Preview */}
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-5 mb-3">
        {note.content}
      </p>

      {/* Image Preview */}
      {imageAttachments && imageAttachments.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-hidden">
          {imageAttachments.slice(0, 3).map((url, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg overflow-hidden bg-black/10"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {imageAttachments.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center text-xs font-medium text-gray-700">
              +{imageAttachments.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Attachments indicator */}
      {hasAttachments && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
          <Paperclip className="h-3 w-3" />
          <span>{note.attachments.length} attachment(s)</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 pt-2 border-t border-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-black/10 rounded transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-black/10 rounded transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-500/10 rounded transition-colors ml-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

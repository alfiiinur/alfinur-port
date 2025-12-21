"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Clock,
  Users,
  AlignLeft,
  Trash2,
  Paperclip,
  Image,
  Video,
  File,
  Calendar,
  Upload,
  Eye,
  Download,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarEvent, EventFormData, DEFAULT_CALENDARS } from "../types";
import { EVENT_COLORS } from "../utils";
import { cn } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  onSaveAsNote?: (data: EventFormData) => void;
  onDelete?: () => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onSaveAsNote,
  onDelete,
  event,
  selectedDate,
}: EventModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "10:00",
    allDay: false,
    color: "#3b82f6",
    calendarId: "personal",
    guests: "",
    attachments: [],
    reminder: null,
  });

  useEffect(() => {
    if (event) {
      const start = new Date(event.startDate);
      const end = event.endDate ? new Date(event.endDate) : start;

      setFormData({
        title: event.title,
        description: event.description || "",
        startDate: start.toISOString().split("T")[0],
        startTime: start.toTimeString().slice(0, 5),
        endDate: end.toISOString().split("T")[0],
        endTime: end.toTimeString().slice(0, 5),
        allDay: event.allDay,
        color: event.color,
        calendarId: event.calendarId,
        guests: event.guests.join(", "),
        attachments: event.attachments || [],
        reminder: event.reminder || null,
      });
    } else if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setFormData({
        title: "",
        description: "",
        startDate: dateStr,
        endDate: dateStr,
        startTime: "09:00",
        endTime: "10:00",
        allDay: false,
        color: "#3b82f6",
        calendarId: "personal",
        guests: "",
        attachments: [],
        reminder: null,
      });
    }
  }, [event, selectedDate, isOpen]);

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

  const getFileIcon = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-4 w-4" />;
    }
    if (["mp4", "webm", "mov", "avi"].includes(ext || "")) {
      return <Video className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || url;
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
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
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  // Get calendar color based on selected calendarId
  const getCalendarColor = (calendarId: string) => {
    const calendar = DEFAULT_CALENDARS.find((c) => c.id === calendarId);
    return calendar?.color || "#3b82f6";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
            <h2 className="text-lg font-semibold">
              {event ? "Edit event" : "New event"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <Input
              placeholder="Event name"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-lg font-medium"
              required
            />

            {/* Calendar Type */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Calendar
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_CALENDARS.map((cal) => (
                    <button
                      key={cal.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, calendarId: cal.id })
                      }
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                        formData.calendarId === cal.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cal.color }}
                      />
                      {cal.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Date & Time */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1 space-y-3">
                {/* Start */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Start
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                      className="flex-1"
                    />
                    {!formData.allDay && (
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                        className="w-32"
                      />
                    )}
                  </div>
                </div>

                {/* End */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    End
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      min={formData.startDate}
                      className="flex-1"
                    />
                    {!formData.allDay && (
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-32"
                      />
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) =>
                      setFormData({ ...formData, allDay: e.target.checked })
                    }
                    className="rounded border-muted-foreground/30"
                  />
                  <span className="text-sm">All day</span>
                </label>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Guests
                </label>
                <Input
                  placeholder="Add guests (comma separated emails)"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <AlignLeft className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Description
                </label>
                <textarea
                  placeholder="Add description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="flex items-start gap-3">
              <Paperclip className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Attachments
                </label>

                {/* Upload Button */}
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                      "hover:border-primary hover:bg-primary/5",
                      isUploading && "opacity-50 pointer-events-none"
                    )}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {isUploading
                        ? "Uploading..."
                        : "Upload images, videos, or files"}
                    </span>
                  </label>
                </div>

                {/* Attachment List */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((url, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg group"
                      >
                        {/* Preview for images */}
                        {isImageFile(url) && (
                          <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                            <img
                              src={url}
                              alt={getFileName(url)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Preview for videos */}
                        {isVideoFile(url) && (
                          <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                            <video
                              src={url}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Video className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        )}

                        {/* File info and actions */}
                        <div className="flex items-center gap-2">
                          {getFileIcon(url)}
                          <span className="flex-1 text-sm truncate">
                            {getFileName(url)}
                          </span>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleViewFile(url)}
                              className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                              title="View file"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(url)}
                              className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors"
                              title="Remove file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Color */}
            <div className="flex items-center gap-3">
              <div className="w-5" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Event Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={cn(
                        "w-7 h-7 rounded-full transition-transform",
                        formData.color === color.value &&
                          "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Reminder */}
            <div className="flex items-center gap-3">
              <div className="w-5" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Reminder
                </label>
                <select
                  value={formData.reminder || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reminder: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No reminder</option>
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t sticky bottom-0 bg-card">
            {event && onDelete ? (
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
              {!event && onSaveAsNote && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSaveAsNote(formData)}
                  className="gap-2"
                >
                  <StickyNote className="h-4 w-4" />
                  Save as Note
                </Button>
              )}
              <Button type="submit">Save Event</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

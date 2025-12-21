"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  PaymentStatus,
  TaskAssignee,
} from "../types";
import Image from "next/image";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => Promise<void>;
  task?: Task | null;
  parentId?: string;
}

export interface TaskFormData {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  paymentStatus: PaymentStatus | "";
  startDate: string;
  dueDate: string;
  tags: string[];
  attachments: string[];
  assignees: Omit<TaskAssignee, "id">[];
}

const defaultFormData: TaskFormData = {
  name: "",
  description: "",
  status: "NOT_STARTED",
  priority: "MEDIUM",
  paymentStatus: "",
  startDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  tags: [],
  attachments: [],
  assignees: [],
};

export function TaskModal({
  open,
  onClose,
  onSave,
  task,
  parentId,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [tagInput, setTagInput] = useState("");
  const [assigneeInput, setAssigneeInput] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        paymentStatus: task.paymentStatus || "",
        startDate: task.startDate.split("T")[0],
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        tags: task.tags,
        attachments: task.attachments || [],
        assignees: task.assignees.map((a) => ({
          name: a.name,
          avatar: a.avatar,
          email: a.email,
        })),
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addAssignee = () => {
    if (assigneeInput.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        assignees: [...prev.assignees, { ...assigneeInput }],
      }));
      setAssigneeInput({ name: "", email: "" });
    }
  };

  const removeAssignee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const isImage = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : parentId ? "Add Subtask" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter task name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as TaskStatus,
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="TESTING">Testing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as TaskPriority,
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <select
              id="paymentStatus"
              value={formData.paymentStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentStatus: e.target.value as PaymentStatus | "",
                }))
              }
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">None</option>
              <option value="NOT_PAID">Not Paid</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
            {formData.attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.attachments.map((url, idx) => (
                  <div key={idx} className="relative group">
                    {isImage(url) ? (
                      <Image
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                        fill
                      />
                    ) : (
                      <div className="w-full h-20 flex flex-col items-center justify-center bg-muted rounded border">
                        <File className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate max-w-full px-1">
                          {url.split("/").pop()}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label>Assignees</Label>
            <div className="flex gap-2">
              <Input
                value={assigneeInput.name}
                onChange={(e) =>
                  setAssigneeInput((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Name"
                className="flex-1"
              />
              <Input
                value={assigneeInput.email}
                onChange={(e) =>
                  setAssigneeInput((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Email (optional)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addAssignee}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.assignees.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.assignees.map((assignee, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium">{assignee.name}</p>
                      {assignee.email && (
                        <p className="text-xs text-muted-foreground">
                          {assignee.email}
                        </p>
                      )}
                    </div>
                    <button type="button" onClick={() => removeAssignee(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? "Saving..." : task ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

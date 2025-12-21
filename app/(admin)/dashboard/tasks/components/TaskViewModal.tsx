"use client";

import {
  X,
  Calendar,
  Users,
  Tag,
  Paperclip,
  BarChart3,
  CreditCard,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task } from "../types";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  PAYMENT_CONFIG,
  TAG_COLORS,
} from "../types";
import Image from "next/image";

interface TaskViewModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskViewModal({ open, onClose, task }: TaskViewModalProps) {
  if (!task) return null;

  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const paymentConfig = task.paymentStatus
    ? PAYMENT_CONFIG[task.paymentStatus]
    : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFileIcon = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const isImage = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle
                className={cn(
                  "text-xl",
                  task.isCompleted && "line-through text-muted-foreground"
                )}
              >
                {task.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge
                  className={cn(
                    "text-xs",
                    statusConfig.bgColor,
                    statusConfig.color
                  )}
                >
                  {statusConfig.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs", priorityConfig.color)}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {priorityConfig.label}
                </Badge>
                {paymentConfig && (
                  <Badge
                    variant="outline"
                    className={cn("text-xs", paymentConfig.color)}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {paymentConfig.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <p className="text-sm">{formatDate(task.startDate)}</p>
            </div>
            {task.dueDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <p className="text-sm">{formatDate(task.dueDate)}</p>
              </div>
            )}
          </div>

          {/* Assignees */}
          {task.assignees.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Assignees ({task.assignees.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg"
                  >
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {assignee.avatar ? (
                        <Image
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="h-full w-full rounded-full object-cover"
                          fill
                        />
                      ) : (
                        assignee.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{assignee.name}</p>
                      {assignee.email && (
                        <p className="text-xs text-muted-foreground">
                          {assignee.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full border",
                      TAG_COLORS[tag.toLowerCase()] ||
                        "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Paperclip className="h-4 w-4" />
                Attachments ({task.attachments.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {task.attachments.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-lg border overflow-hidden hover:border-primary transition-colors"
                  >
                    {isImage(url) ? (
                      <img
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 flex flex-col items-center justify-center bg-muted/50 gap-2">
                        {getFileIcon(url)}
                        <span className="text-xs text-muted-foreground truncate max-w-[80%]">
                          {url.split("/").pop()}
                        </span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Subtasks ({task.subtasks.length})
              </div>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border bg-muted/30",
                      subtask.isCompleted && "opacity-60"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      readOnly
                      className="h-4 w-4 rounded"
                    />
                    <span
                      className={cn(
                        "text-sm flex-1",
                        subtask.isCompleted &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {subtask.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        PRIORITY_CONFIG[subtask.priority].color
                      )}
                    >
                      {PRIORITY_CONFIG[subtask.priority].label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>Created: {formatDate(task.createdAt)}</p>
            <p>Updated: {formatDate(task.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

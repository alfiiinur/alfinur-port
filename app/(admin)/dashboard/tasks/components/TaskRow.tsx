"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  BarChart3,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "../types";
import { PRIORITY_CONFIG, PAYMENT_CONFIG, TAG_COLORS } from "../types";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  isSubtask?: boolean;
}

export function TaskRow({
  task,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView,
  onToggleComplete,
  isSubtask = false,
}: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const paymentConfig = task.paymentStatus
    ? PAYMENT_CONFIG[task.paymentStatus]
    : null;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleComplete(task.id, e.target.checked);
  };

  return (
    <>
      <tr
        className={cn(
          "border-b transition-colors hover:bg-muted/50",
          isSelected && "bg-muted/30",
          isSubtask && "bg-muted/20",
          task.isCompleted && "opacity-60"
        )}
      >
        {/* Expand + Checkbox + Drag */}
        <td className="w-24 px-2 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => hasSubtasks && setExpanded(!expanded)}
              className={cn(
                "p-1 rounded hover:bg-muted",
                !hasSubtasks && "invisible"
              )}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(task.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-primary"
            />
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          </div>
        </td>

        {/* Complete Checkbox + Task Name */}
        <td className={cn("px-3 py-3 font-medium", isSubtask && "pl-8")}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 accent-green-500"
              title="Mark as completed"
            />
            <span
              className={cn(
                "truncate max-w-[150px]",
                task.isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.name}
            </span>
            {task.attachments && task.attachments.length > 0 && (
              <span
                className="text-muted-foreground"
                title={`${task.attachments.length} attachment(s)`}
              >
                <Paperclip className="h-3 w-3" />
              </span>
            )}
          </div>
        </td>

        {/* Description */}
        <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">
          <span
            className={cn(
              "truncate block max-w-[200px]",
              task.isCompleted && "line-through"
            )}
          >
            {task.description || "—"}
          </span>
        </td>

        {/* Assignees */}
        <td className="px-3 py-3 hidden lg:table-cell">
          <div className="flex items-center -space-x-2">
            {task.assignees.slice(0, 3).map((assignee) => (
              <div
                key={assignee.id}
                className="h-7 w-7 rounded-full bg-linear-to-br from-blue-400 to-purple-500 border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                title={assignee.name}
              >
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  assignee.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        </td>

        {/* Start Date */}
        <td className="px-3 py-3 text-sm hidden sm:table-cell">
          {formatDate(task.startDate)}
        </td>

        {/* Priority */}
        <td className="px-3 py-3">
          <div className={cn("flex items-center gap-1", priorityConfig.color)}>
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">
              {priorityConfig.label}
            </span>
          </div>
        </td>

        {/* Payment Status */}
        <td className="px-3 py-3 hidden xl:table-cell">
          {paymentConfig ? (
            <span className={cn("text-sm", paymentConfig.color)}>
              {paymentConfig.label}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>

        {/* Tags */}
        <td className="px-3 py-3 hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full border",
                  TAG_COLORS[tag.toLowerCase()] ||
                    "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                )}
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(task)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Subtasks */}
      {expanded &&
        hasSubtasks &&
        task.subtasks.map((subtask) => (
          <TaskRow
            key={subtask.id}
            task={subtask}
            isSelected={isSelected}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onToggleComplete={onToggleComplete}
            isSubtask
          />
        ))}
    </>
  );
}

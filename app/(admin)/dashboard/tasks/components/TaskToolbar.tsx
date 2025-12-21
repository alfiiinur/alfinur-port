"use client";

import { useState } from "react";
import {
  Download,
  Layers,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExportModal } from "./ExportModal";
import type { Task, TaskStatus, TaskPriority, GroupedTasks } from "../types";
import { STATUS_CONFIG, PRIORITY_CONFIG, PAYMENT_CONFIG } from "../types";

interface TaskToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: TaskStatus) => void;
  onBulkPriorityChange: (priority: TaskPriority) => void;
  onRefresh: () => void;
  onNewTask: () => void;
  onFilterChange: (
    filter: { status?: TaskStatus; priority?: TaskPriority } | null
  ) => void;
  activeFilter: { status?: TaskStatus; priority?: TaskPriority } | null;
  selectedTasks: Task[];
  groupedTasks: GroupedTasks;
}

export function TaskToolbar({
  search,
  onSearchChange,
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onBulkPriorityChange,
  onRefresh,
  onNewTask,
  onFilterChange,
  activeFilter,
  selectedTasks,
  groupedTasks,
}: TaskToolbarProps) {
  const [viewSelectedOpen, setViewSelectedOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedCount === 0}
              >
                <Layers className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Bulk Actions</span>
                {selectedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                    {selectedCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setViewSelectedOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                View Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onBulkStatusChange("NOT_STARTED")}
              >
                <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                Not Started
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBulkStatusChange("IN_PROGRESS")}
              >
                <CheckCircle className="h-4 w-4 mr-2 text-amber-500" />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkStatusChange("TESTING")}>
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                Testing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkStatusChange("COMPLETED")}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onBulkPriorityChange("LOW")}>
                Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkPriorityChange("MEDIUM")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkPriorityChange("HIGH")}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkPriorityChange("URGENT")}>
                Urgent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onBulkDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search task name"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeFilter ? "default" : "outline"}
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onFilterChange({ status: "NOT_STARTED" })}
              >
                Not Started
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange({ status: "IN_PROGRESS" })}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange({ status: "TESTING" })}
              >
                Testing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange({ status: "COMPLETED" })}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onFilterChange({ priority: "HIGH" })}
              >
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange({ priority: "URGENT" })}
              >
                Urgent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilterChange(null)}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onNewTask} className="shrink-0">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* View Selected Tasks Dialog */}
      <Dialog open={viewSelectedOpen} onOpenChange={setViewSelectedOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selected Tasks ({selectedTasks.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks selected
              </p>
            ) : (
              selectedTasks.map((task) => {
                const statusConfig = STATUS_CONFIG[task.status];
                const priorityConfig = PRIORITY_CONFIG[task.priority];
                const paymentConfig = task.paymentStatus
                  ? PAYMENT_CONFIG[task.paymentStatus]
                  : null;

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "p-4 rounded-lg border bg-card",
                      task.isCompleted && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "font-medium truncate",
                            task.isCompleted &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {task.name}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
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
                            {priorityConfig.label}
                          </Badge>
                          {paymentConfig && (
                            <Badge
                              variant="outline"
                              className={cn("text-xs", paymentConfig.color)}
                            >
                              {paymentConfig.label}
                            </Badge>
                          )}
                          {task.isCompleted && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-500 border-green-500"
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center -space-x-2 shrink-0">
                        {task.assignees.slice(0, 3).map((assignee) => (
                          <div
                            key={assignee.id}
                            className="h-7 w-7 rounded-full bg-linear-to-br from-blue-400 to-purple-500 border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                            title={assignee.name}
                          >
                            {assignee.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        groupedTasks={groupedTasks}
      />
    </>
  );
}

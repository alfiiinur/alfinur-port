"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { SortableTaskRow } from "./SortableTaskRow";
import type { Task, TaskStatus } from "../types";
import { STATUS_CONFIG } from "../types";

interface TaskGroupProps {
  status: TaskStatus;
  tasks: Task[];
  selectedTasks: Set<string>;
  onSelectTask: (id: string, checked: boolean) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onReorder: (status: TaskStatus, oldIndex: number, newIndex: number) => void;
}

export function TaskGroup({
  status,
  tasks,
  selectedTasks,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onToggleComplete,
  onReorder,
}: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const config = STATUS_CONFIG[status];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      onReorder(status, oldIndex, newIndex);
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Group Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 border-b",
          config.bgColor
        )}
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className={cn("font-medium", config.color)}>
            {config.label}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-background border">
            {tasks.length}
          </span>
        </div>
      </button>

      {/* Task Table */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                <th className="w-24 px-2 py-2 text-left"></th>
                <th className="px-3 py-2 text-left font-medium">Task Name</th>
                <th className="px-3 py-2 text-left font-medium hidden md:table-cell">
                  Description
                </th>
                <th className="px-3 py-2 text-left font-medium hidden lg:table-cell">
                  Assigned to
                </th>
                <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">
                  Start Date
                </th>
                <th className="px-3 py-2 text-left font-medium">Priority</th>
                <th className="px-3 py-2 text-left font-medium hidden xl:table-cell">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-medium hidden lg:table-cell">
                  Tags
                </th>
                <th className="px-3 py-2 text-left font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No tasks in this category
                  </td>
                </tr>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks.map((task) => (
                      <SortableTaskRow
                        key={task.id}
                        task={task}
                        isSelected={selectedTasks.has(task.id)}
                        onSelect={onSelectTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        onView={onViewTask}
                        onToggleComplete={onToggleComplete}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

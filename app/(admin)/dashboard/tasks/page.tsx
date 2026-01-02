"use client";

import { useState, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskStats } from "./components/TaskStats";
import { TaskToolbar } from "./components/TaskToolbar";
import { TaskGroup } from "./components/TaskGroup";
import { TaskModal, TaskFormData } from "./components/TaskModal";
import { TaskViewModal } from "./components/TaskViewModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import type { Task, GroupedTasks, TaskStatus, TaskPriority } from "./types";

const emptyGroupedTasks: GroupedTasks = {
  NOT_STARTED: [],
  IN_PROGRESS: [],
  TESTING: [],
  COMPLETED: [],
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] =
    useState<GroupedTasks>(emptyGroupedTasks);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    task: Task | null;
    isBulk: boolean;
  }>({
    open: false,
    task: null,
    isBulk: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeFilter?.status) params.set("status", activeFilter.status);
      if (activeFilter?.priority) params.set("priority", activeFilter.priority);

      const res = await fetch(`/api/tasks?${params}`);
      const data = await res.json();
      setTasks(data.tasks || []);
      setGroupedTasks(data.groupedTasks || emptyGroupedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchTasks, 300);
    return () => clearTimeout(debounce);
  }, [fetchTasks]);

  const handleSelectTask = (id: string, checked: boolean) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
        // Also select all subtasks
        const task = tasks.find((t) => t.id === id);
        if (task?.subtasks) {
          task.subtasks.forEach((st) => next.add(st.id));
        }
      } else {
        next.delete(id);
        // Also deselect all subtasks
        const task = tasks.find((t) => t.id === id);
        if (task?.subtasks) {
          task.subtasks.forEach((st) => next.delete(st.id));
        }
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    setDeleteModal({ open: true, task: null, isBulk: true });
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          taskIds: Array.from(selectedTasks),
        }),
      });
      setSelectedTasks(new Set());
      fetchTasks();
      setDeleteModal({ open: false, task: null, isBulk: false });
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatusChange = async (status: TaskStatus) => {
    if (selectedTasks.size === 0) return;

    try {
      await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          taskIds: Array.from(selectedTasks),
          data: { status },
        }),
      });
      setSelectedTasks(new Set());
      fetchTasks();
    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  };

  const handleBulkPriorityChange = async (priority: TaskPriority) => {
    if (selectedTasks.size === 0) return;

    try {
      await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updatePriority",
          taskIds: Array.from(selectedTasks),
          data: { priority },
        }),
      });
      setSelectedTasks(new Set());
      fetchTasks();
    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const handleReorder = async (
    status: TaskStatus,
    oldIndex: number,
    newIndex: number
  ) => {
    // Optimistic update
    setGroupedTasks((prev) => {
      const newTasks = arrayMove([...prev[status]], oldIndex, newIndex);
      return { ...prev, [status]: newTasks };
    });

    // Get the reordered tasks with new sortOrder
    const reorderedTasks = arrayMove(
      [...groupedTasks[status]],
      oldIndex,
      newIndex
    );

    // Update sortOrder for all affected tasks
    try {
      await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to reorder tasks:", error);
      // Revert on error
      fetchTasks();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setViewModalOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    setDeleteModal({ open: true, task, isBulk: false });
  };

  const confirmDeleteTask = async () => {
    if (!deleteModal.task) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/tasks/${deleteModal.task.id}`, { method: "DELETE" });
      fetchTasks();
      setDeleteModal({ open: false, task: null, isBulk: false });
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveTask = async (data: TaskFormData) => {
    const payload = {
      ...data,
      paymentStatus: data.paymentStatus || null,
    };

    if (editingTask) {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setEditingTask(null);
    fetchTasks();
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewingTask(null);
  };

  // Get selected tasks data for bulk view
  const getSelectedTasksData = () => {
    const selected: Task[] = [];
    tasks.forEach((task) => {
      if (selectedTasks.has(task.id)) {
        selected.push(task);
      }
      task.subtasks?.forEach((st) => {
        if (selectedTasks.has(st.id)) {
          selected.push(st);
        }
      });
    });
    return selected;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      {/* Stats Cards */}
      <TaskStats groupedTasks={groupedTasks} />

      {/* Toolbar */}
      <TaskToolbar
        search={search}
        onSearchChange={setSearch}
        selectedCount={selectedTasks.size}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkPriorityChange={handleBulkPriorityChange}
        onRefresh={fetchTasks}
        onNewTask={handleNewTask}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        selectedTasks={getSelectedTasksData()}
        groupedTasks={groupedTasks}
      />

      {/* Task Groups */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(
            [
              "NOT_STARTED",
              "IN_PROGRESS",
              "TESTING",
              "COMPLETED",
            ] as TaskStatus[]
          ).map((status) => (
            <TaskGroup
              key={status}
              status={status}
              tasks={groupedTasks[status]}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewTask={handleViewTask}
              onToggleComplete={handleToggleComplete}
              onReorder={handleReorder}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Task View Modal */}
      <TaskViewModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        task={viewingTask}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({
            open,
            task: open ? deleteModal.task : null,
            isBulk: deleteModal.isBulk,
          })
        }
        onConfirm={deleteModal.isBulk ? confirmBulkDelete : confirmDeleteTask}
        title={deleteModal.isBulk ? "Delete Tasks" : "Delete Task"}
        description={
          deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedTasks.size} task(s)? This action cannot be undone.`
            : undefined
        }
        itemName={deleteModal.task?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}

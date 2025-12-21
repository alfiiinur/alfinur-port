"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus, GroupedTasks } from "../types";
import { STATUS_CONFIG, PRIORITY_CONFIG, PAYMENT_CONFIG } from "../types";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  groupedTasks: GroupedTasks;
}

type ExportFormat = "pdf" | "excel";

export function ExportModal({ open, onClose, groupedTasks }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("excel");
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([
    "NOT_STARTED",
    "IN_PROGRESS",
    "TESTING",
    "COMPLETED",
  ]);
  const [exporting, setExporting] = useState(false);

  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const selectAll = () => {
    setSelectedStatuses(["NOT_STARTED", "IN_PROGRESS", "TESTING", "COMPLETED"]);
  };

  const deselectAll = () => {
    setSelectedStatuses([]);
  };

  const getTasksToExport = (): Task[] => {
    const tasks: Task[] = [];
    selectedStatuses.forEach((status) => {
      tasks.push(...(groupedTasks[status] || []));
    });
    return tasks;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const exportToExcel = async (tasks: Task[]) => {
    const XLSX = await import("xlsx");

    const data = tasks.map((task) => ({
      "Task Name": task.name,
      Description: task.description || "",
      Status: STATUS_CONFIG[task.status].label,
      Priority: PRIORITY_CONFIG[task.priority].label,
      "Payment Status": task.paymentStatus
        ? PAYMENT_CONFIG[task.paymentStatus].label
        : "-",
      "Start Date": formatDate(task.startDate),
      "Due Date": task.dueDate ? formatDate(task.dueDate) : "-",
      Assignees: task.assignees.map((a) => a.name).join(", "),
      Tags: task.tags.join(", "),
      Completed: task.isCompleted ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => String(row[key as keyof typeof row]).length)
      ),
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(
      workbook,
      `tasks_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportToPDF = async (tasks: Task[]) => {
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(18);
    doc.text("Tasks Export", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Table data
    const tableData = tasks.map((task) => [
      task.name,
      task.description?.substring(0, 50) || "-",
      STATUS_CONFIG[task.status].label,
      PRIORITY_CONFIG[task.priority].label,
      task.paymentStatus ? PAYMENT_CONFIG[task.paymentStatus].label : "-",
      formatDate(task.startDate),
      task.assignees
        .map((a) => a.name)
        .join(", ")
        .substring(0, 30) || "-",
      task.tags.join(", ").substring(0, 20) || "-",
      task.isCompleted ? "Yes" : "No",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [
        [
          "Task Name",
          "Description",
          "Status",
          "Priority",
          "Payment",
          "Start Date",
          "Assignees",
          "Tags",
          "Done",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
        7: { cellWidth: 30 },
        8: { cellWidth: 15 },
      },
    });

    doc.save(`tasks_export_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExport = async () => {
    const tasks = getTasksToExport();
    if (tasks.length === 0) {
      alert("No tasks to export. Please select at least one status.");
      return;
    }

    setExporting(true);
    try {
      if (format === "excel") {
        await exportToExcel(tasks);
      } else {
        await exportToPDF(tasks);
      }
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const totalTasks = getTasksToExport().length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Tasks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                  format === "excel"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
              >
                <FileSpreadsheet
                  className={cn(
                    "h-8 w-8",
                    format === "excel"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                  format === "pdf"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
              >
                <FileText
                  className={cn(
                    "h-8 w-8",
                    format === "pdf" ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">PDF (.pdf)</span>
              </button>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Status to Export</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Select All
                </button>
                <span className="text-muted-foreground">|</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {(
                [
                  "NOT_STARTED",
                  "IN_PROGRESS",
                  "TESTING",
                  "COMPLETED",
                ] as TaskStatus[]
              ).map((status) => {
                const config = STATUS_CONFIG[status];
                const count = groupedTasks[status]?.length || 0;
                const isSelected = selectedStatuses.includes(status);

                return (
                  <label
                    key={status}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStatus(status)}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      <span className={cn("font-medium", config.color)}>
                        {config.label}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} task{count !== 1 ? "s" : ""}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Total tasks to export:{" "}
              <span className="font-semibold text-foreground">
                {totalTasks}
              </span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting || totalTasks === 0}
          >
            {exporting ? "Exporting..." : `Export to ${format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

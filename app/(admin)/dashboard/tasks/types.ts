export type TaskStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "TESTING"
  | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type PaymentStatus = "NOT_PAID" | "PARTIALLY_PAID" | "PAID";

export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string | null;
  email?: string | null;
}

export interface Task {
  id: string;
  name: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  paymentStatus?: PaymentStatus | null;
  startDate: string;
  dueDate?: string | null;
  tags: string[];
  attachments: string[];
  isCompleted: boolean;
  sortOrder: number;
  parentId?: string | null;
  subtasks: Task[];
  assignees: TaskAssignee[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupedTasks {
  NOT_STARTED: Task[];
  IN_PROGRESS: Task[];
  TESTING: Task[];
  COMPLETED: Task[];
}

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    icon: "circle",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-600 dark:text-amber-400",
    bgColor:
      "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    icon: "trending-up",
  },
  TESTING: {
    label: "Testing",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor:
      "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    icon: "clipboard-check",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-600 dark:text-green-400",
    bgColor:
      "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    icon: "check-square",
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  LOW: { label: "Low", color: "text-slate-500" },
  MEDIUM: { label: "Medium", color: "text-amber-500" },
  HIGH: { label: "High", color: "text-orange-500" },
  URGENT: { label: "Urgent", color: "text-red-500" },
};

export const PAYMENT_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  NOT_PAID: { label: "Not Paid", color: "text-red-500" },
  PARTIALLY_PAID: { label: "Partially Paid", color: "text-amber-500" },
  PAID: { label: "Paid", color: "text-green-500" },
};

export const TAG_COLORS: Record<string, string> = {
  bug: "border-red-300 text-red-600 dark:border-red-700 dark:text-red-400",
  "follow up":
    "border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400",
  todo: "border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400",
  review:
    "border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400",
  important:
    "border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400",
  tomorrow:
    "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400",
};

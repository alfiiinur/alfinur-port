"use client";

import { Circle, TrendingUp, ClipboardCheck, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GroupedTasks } from "../types";

interface TaskStatsProps {
  groupedTasks: GroupedTasks;
}

const stats = [
  {
    key: "NOT_STARTED" as const,
    label: "Not Started",
    subLabel: "My Tasks",
    icon: Circle,
    borderColor: "border-blue-500",
    iconColor: "text-blue-500",
  },
  {
    key: "IN_PROGRESS" as const,
    label: "In Progress",
    subLabel: "My Tasks",
    icon: TrendingUp,
    borderColor: "border-amber-500",
    iconColor: "text-amber-500",
  },
  {
    key: "TESTING" as const,
    label: "Testing",
    subLabel: "My Tasks",
    icon: ClipboardCheck,
    borderColor: "border-emerald-500",
    iconColor: "text-emerald-500",
  },
  {
    key: "COMPLETED" as const,
    label: "Completed",
    subLabel: "My Tasks",
    icon: CheckSquare,
    borderColor: "border-green-500",
    iconColor: "text-green-500",
  },
];

export function TaskStats({ groupedTasks }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat) => {
        const count = groupedTasks[stat.key]?.length || 0;
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-l-4 bg-card",
              stat.borderColor
            )}
          >
            <div className={cn("p-2 rounded-lg bg-muted", stat.iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {stat.label}: {count}
              </p>
              <p className="text-lg font-semibold">
                {stat.subLabel}: {String(count).padStart(2, "0")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

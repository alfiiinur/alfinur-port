"use client";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewMode } from "../types";
import { MONTHS } from "../utils";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
}

export default function CalendarHeader({
  currentDate,
  viewMode,
  searchQuery,
  onSearchChange,
  onViewModeChange,
  onNavigate,
}: CalendarHeaderProps) {
  const getTitle = () => {
    const month = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Calendar</h1>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("today")}
          >
            Today
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-lg font-medium min-w-[160px]">
            {getTitle()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Search */}
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search event..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full sm:w-48"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors capitalize",
                viewMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

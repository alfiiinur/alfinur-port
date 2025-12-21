"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDaysInMonth, isSameDay, isToday, DAYS, MONTHS } from "../utils";
import { CalendarEvent } from "../types";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  events: CalendarEvent[];
}

export default function MiniCalendar({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  events,
}: MiniCalendarProps) {
  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const hasEvent = (date: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="bg-card rounded-lg p-4 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-medium text-sm">
          {MONTHS[currentDate.getMonth()]}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium"
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const hasEvents = hasEvent(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "relative h-7 w-7 text-xs rounded-full flex items-center justify-center transition-colors",
                !isCurrentMonth && "text-muted-foreground/50",
                isCurrentMonth && "hover:bg-muted",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                isTodayDate && !isSelected && "bg-blue-500 text-white"
              )}
            >
              {date.getDate()}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

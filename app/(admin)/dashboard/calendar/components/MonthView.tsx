"use client";

import { cn } from "@/lib/utils";
import { getDaysInMonth, isSameDay, isToday, DAYS } from "../utils";
import { CalendarEvent } from "../types";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  visibleCalendars: string[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function MonthView({
  currentDate,
  selectedDate,
  events,
  visibleCalendars,
  onDateSelect,
  onEventClick,
}: MonthViewProps) {
  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      // Show event if calendarId is in visibleCalendars OR if calendarId is not in any known calendar (fallback to show)
      const calendarId = event.calendarId || "personal";
      if (
        visibleCalendars.length > 0 &&
        !visibleCalendars.includes(calendarId)
      ) {
        return false;
      }
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Days header */}
      <div className="grid grid-cols-7 border-b">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "min-h-[100px] p-1 border-r border-b cursor-pointer transition-colors",
                "last:border-r-0 nth-[7n]:border-r-0",
                !isCurrentMonth && "bg-muted/30",
                isSelected && "bg-primary/5"
              )}
            >
              <div className="flex justify-center mb-1">
                <span
                  className={cn(
                    "w-7 h-7 flex items-center justify-center text-sm rounded-full",
                    !isCurrentMonth && "text-muted-foreground/50",
                    isTodayDate && "bg-blue-500 text-white font-medium",
                    isSelected &&
                      !isTodayDate &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="w-full text-left px-1.5 py-0.5 text-xs rounded truncate text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MiniCalendar from "./MiniCalendar";
import GoogleCalendarSync from "./GoogleCalendarSync";
import { Calendar, CalendarEvent } from "../types";
import { cn } from "@/lib/utils";

interface CalendarSidebarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  events: CalendarEvent[];
  calendars: Calendar[];
  visibleCalendars: string[];
  onToggleCalendar: (calendarId: string) => void;
  onAddCalendar: () => void;
  onRefresh?: () => void;
}

export default function CalendarSidebar({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  events,
  calendars,
  visibleCalendars,
  onToggleCalendar,
  onAddCalendar,
  onRefresh,
}: CalendarSidebarProps) {
  return (
    <div className="w-full lg:w-64 space-y-4 shrink-0">
      <MiniCalendar
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onMonthChange={onMonthChange}
        events={events}
      />

      {/* My Calendars */}
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-medium text-sm mb-3">My calendars</h3>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <label
              key={calendar.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={visibleCalendars.includes(calendar.id)}
                onChange={() => onToggleCalendar(calendar.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                  visibleCalendars.includes(calendar.id)
                    ? "border-transparent"
                    : "border-muted-foreground/30"
                )}
                style={{
                  backgroundColor: visibleCalendars.includes(calendar.id)
                    ? calendar.color
                    : "transparent",
                }}
              >
                {visibleCalendars.includes(calendar.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {calendar.name}
              </span>
            </label>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={onAddCalendar}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Calendar
        </Button>
      </div>

      {/* Google Calendar Integration */}
      <GoogleCalendarSync onSync={onRefresh} />
    </div>
  );
}

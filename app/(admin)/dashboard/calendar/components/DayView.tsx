"use client";

import { cn } from "@/lib/utils";
import { getHours, isSameDay, formatDate } from "../utils";
import { CalendarEvent } from "../types";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  visibleCalendars: string[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function DayView({
  currentDate,
  events,
  visibleCalendars,
  onEventClick,
}: DayViewProps) {
  const hours = getHours();

  const dayEvents = events.filter((event) => {
    // Show event if calendarId is in visibleCalendars OR if calendarId is not in any known calendar (fallback to show)
    const calendarId = event.calendarId || "personal";
    if (visibleCalendars.length > 0 && !visibleCalendars.includes(calendarId)) {
      return false;
    }
    const eventDate = new Date(event.startDate);
    return isSameDay(eventDate, currentDate);
  });

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.startDate);
    const end = event.endDate
      ? new Date(event.endDate)
      : new Date(start.getTime() + 60 * 60 * 1000);

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`,
    };
  };

  const allDayEvents = dayEvents.filter((e) => e.allDay);
  const timedEvents = dayEvents.filter((e) => !e.allDay);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
      </div>

      {/* All day events */}
      {allDayEvents.length > 0 && (
        <div className="p-2 border-b space-y-1 shrink-0">
          <div className="text-xs text-muted-foreground mb-1">All day</div>
          {allDayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="w-full text-left px-3 py-2 text-sm text-white rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: event.color }}
            >
              {event.title}
            </button>
          ))}
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative">
          {/* Time labels */}
          <div className="w-16 shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] text-xs text-muted-foreground text-right pr-2 -mt-2"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="flex-1 border-l relative">
            {/* Hour lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-dashed border-muted"
              />
            ))}

            {/* Events */}
            {timedEvents.map((event) => {
              const position = getEventPosition(event);

              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "absolute left-2 right-2 px-3 py-2 text-white rounded overflow-hidden text-left",
                    "hover:opacity-90 transition-opacity"
                  )}
                  style={{
                    backgroundColor: event.color,
                    top: position.top,
                    height: position.height,
                  }}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  {event.description && (
                    <div className="text-xs opacity-80 truncate">
                      {event.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

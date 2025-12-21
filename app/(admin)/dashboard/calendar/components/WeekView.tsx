"use client";

import { cn } from "@/lib/utils";
import { getWeekDays, getHours, isSameDay, isToday, DAYS } from "../utils";
import { CalendarEvent } from "../types";

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  visibleCalendars: string[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({
  currentDate,
  selectedDate,
  events,
  visibleCalendars,
  onDateSelect,
  onEventClick,
}: WeekViewProps) {
  const weekDays = getWeekDays(currentDate);
  const hours = getHours();

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex border-b shrink-0">
        <div className="w-16 shrink-0" />
        {weekDays.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className="flex-1 py-2 text-center border-l cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="text-xs text-muted-foreground">
                {DAYS[date.getDay()]}
              </div>
              <div
                className={cn(
                  "w-8 h-8 mx-auto flex items-center justify-center text-lg rounded-full",
                  isTodayDate && "bg-blue-500 text-white",
                  isSelected &&
                    !isTodayDate &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

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

          {/* Day columns */}
          {weekDays.map((date, dayIndex) => {
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={dayIndex}
                className="flex-1 border-l relative"
                onClick={() => onDateSelect(date)}
              >
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-dashed border-muted"
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  if (event.allDay) return null;
                  const position = getEventPosition(event);

                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="absolute left-1 right-1 px-2 py-1 text-xs text-white rounded overflow-hidden text-left hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: event.color,
                        top: position.top,
                        height: position.height,
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

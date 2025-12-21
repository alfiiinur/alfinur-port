"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarHeader from "./CalendarHeader";
import CalendarSidebar from "./CalendarSidebar";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import EventModal from "./EventModal";
import {
  CalendarEvent,
  Calendar,
  ViewMode,
  EventFormData,
  CalendarNote,
  DEFAULT_CALENDARS as CALENDAR_TYPES,
} from "../types";

const DEFAULT_CALENDARS: Calendar[] = CALENDAR_TYPES.map((c, index) => ({
  ...c,
  isVisible: true,
  isDefault: index === 0,
}));

export default function CalendarMain() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>(DEFAULT_CALENDARS);
  const [visibleCalendars, setVisibleCalendars] = useState<string[]>(
    DEFAULT_CALENDARS.map((c) => c.id)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch notes with dates
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        // Filter only notes with noteDate
        const notesWithDate = data.filter((n: CalendarNote) => n.noteDate);
        setNotes(notesWithDate);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }, []);

  // Fetch calendars
  const fetchCalendars = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/calendars");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          // Merge default calendars with fetched calendars
          const mergedCalendars = [...DEFAULT_CALENDARS];
          data.forEach((c: Calendar) => {
            if (!mergedCalendars.find((dc) => dc.id === c.id)) {
              mergedCalendars.push(c);
            }
          });
          setCalendars(mergedCalendars);
          setVisibleCalendars(
            mergedCalendars.filter((c) => c.isVisible).map((c) => c.id)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch calendars:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchCalendars();
    fetchNotes();
  }, [fetchEvents, fetchCalendars, fetchNotes]);

  // Convert notes to calendar events format
  const notesAsEvents: CalendarEvent[] = notes.map((note) => ({
    id: `note-${note.id}`,
    title: `📝 ${note.title}`,
    description: note.content,
    startDate: note.noteDate,
    endDate: null,
    allDay: true,
    color: note.color,
    calendarId: "notes",
    guests: [],
    attachments: note.attachments,
    reminder: null,
    googleEventId: null,
  }));

  // Combine events and notes
  const allEvents = [...events, ...notesAsEvents];

  // Filter events by search
  const filteredEvents = allEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation
  const handleNavigate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);

    if (direction === "today") {
      setCurrentDate(new Date());
      setSelectedDate(new Date());
      return;
    }

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
    }

    setCurrentDate(newDate);
  };

  // Toggle calendar visibility
  const handleToggleCalendar = (calendarId: string) => {
    setVisibleCalendars((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  // Add new calendar
  const handleAddCalendar = async () => {
    const name = prompt("Enter calendar name:");
    if (!name) return;

    try {
      const res = await fetch("/api/calendar/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newCalendar = await res.json();
        setCalendars((prev) => [...prev, newCalendar]);
        setVisibleCalendars((prev) => [...prev, newCalendar.id]);
      }
    } catch (error) {
      console.error("Failed to create calendar:", error);
    }
  };

  // Save event
  const handleSaveEvent = async (formData: EventFormData) => {
    const startDateTime = formData.allDay
      ? new Date(formData.startDate)
      : new Date(`${formData.startDate}T${formData.startTime}`);

    const endDateTime = formData.allDay
      ? null
      : new Date(
          `${formData.endDate || formData.startDate}T${formData.endTime}`
        );

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime?.toISOString() || null,
      allDay: formData.allDay,
      color: formData.color,
      calendarId: formData.calendarId || "personal",
      guests: formData.guests
        ? formData.guests.split(",").map((g) => g.trim())
        : [],
      attachments: formData.attachments || [],
      reminder: formData.reminder,
    };

    try {
      if (selectedEvent) {
        // Update
        const res = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });

        if (res.ok) {
          const updated = await res.json();
          setEvents((prev) =>
            prev.map((e) => (e.id === selectedEvent.id ? updated : e))
          );
        }
      } else {
        // Create
        const res = await fetch("/api/calendar/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });

        if (res.ok) {
          const newEvent = await res.json();
          setEvents((prev) => [...prev, newEvent]);
        }
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }

    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const res = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }

    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Save as Note
  const handleSaveAsNote = async (formData: EventFormData) => {
    const noteData = {
      title: formData.title,
      content: formData.description || "",
      color: formData.color,
      isPinned: false,
      attachments: formData.attachments || [],
      noteDate: formData.startDate,
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      if (res.ok) {
        // Refresh notes
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    }

    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Open modal for new event
  const handleNewEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  // Open modal for editing event
  const handleEventClick = (event: CalendarEvent) => {
    // Check if it's a note (id starts with "note-")
    if (event.id.startsWith("note-")) {
      // Redirect to notes page
      window.location.href = "/dashboard/notes";
      return;
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === "month") {
      setSelectedEvent(null);
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="order-2 lg:order-1">
          <CalendarSidebar
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setCurrentDate(date);
            }}
            onMonthChange={setCurrentDate}
            events={filteredEvents}
            calendars={calendars}
            visibleCalendars={visibleCalendars}
            onToggleCalendar={handleToggleCalendar}
            onAddCalendar={handleAddCalendar}
            onRefresh={() => {
              fetchEvents();
              fetchNotes();
            }}
          />
        </div>

        {/* Main Calendar */}
        <div className="flex-1 order-1 lg:order-2 bg-card rounded-lg border min-h-[600px] flex flex-col overflow-hidden">
          {viewMode === "month" && (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={filteredEvents}
              visibleCalendars={visibleCalendars}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === "week" && (
            <WeekView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={filteredEvents}
              visibleCalendars={visibleCalendars}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === "day" && (
            <DayView
              currentDate={currentDate}
              events={filteredEvents}
              visibleCalendars={visibleCalendars}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={handleNewEvent}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onSaveAsNote={handleSaveAsNote}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}

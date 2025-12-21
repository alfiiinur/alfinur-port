export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  allDay: boolean;
  color: string;
  calendarId: string;
  guests: string[];
  attachments: string[];
  reminder?: number | null;
  googleEventId?: string | null;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isDefault: boolean;
}

export type ViewMode = "day" | "week" | "month";

export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  color: string;
  calendarId: string;
  guests: string;
  attachments: string[];
  reminder: number | null;
}

export const DEFAULT_CALENDARS = [
  { id: "personal", name: "Personal", color: "#3b82f6" },
  { id: "work", name: "Work", color: "#22c55e" },
  { id: "holidays", name: "Holidays in Indonesia", color: "#f97316" },
  { id: "notes", name: "Notes", color: "#fef08a" },
];

export interface CalendarNote {
  id: string;
  title: string;
  content: string;
  color: string;
  noteDate: Date | string;
  attachments: string[];
}

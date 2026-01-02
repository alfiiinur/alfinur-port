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

export type ViewMode = "day" | "3day" | "week" | "month" | "agenda";

export type FirstDayOfWeek = "sunday" | "monday";
export type TimeFormat = "12h" | "24h";

export interface CalendarSettings {
  firstDayOfWeek: FirstDayOfWeek;
  timezone: string;
  timeFormat: TimeFormat;
  defaultView: ViewMode;
  showWeekNumbers: boolean;
  hideDeclinedEvents: boolean;
  highlightShortEvents: boolean;
  showNationalHolidays: boolean;
  showCutiBersama: boolean;
  showHijriCalendar: boolean;
  showJavaneseCalendar: boolean;
}

export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  firstDayOfWeek: "monday",
  timezone: "auto",
  timeFormat: "24h",
  defaultView: "month",
  showWeekNumbers: false,
  hideDeclinedEvents: false,
  highlightShortEvents: true,
  showNationalHolidays: true,
  showCutiBersama: true,
  showHijriCalendar: false,
  showJavaneseCalendar: false,
};

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

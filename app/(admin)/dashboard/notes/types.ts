export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  attachments: string[];
  noteDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NoteFormData {
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  attachments: string[];
  noteDate: string | null;
}

export const NOTE_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Purple", value: "#ddd6fe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Orange", value: "#fed7aa" },
  { name: "Red", value: "#fecaca" },
  { name: "Cyan", value: "#a5f3fc" },
  { name: "Gray", value: "#e5e7eb" },
];

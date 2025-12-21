"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";
import NoteViewModal from "./NoteViewModal";
import { Note, NoteFormData } from "../types";

export default function NotesMain() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filterPinned, setFilterPinned] = useState<boolean | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterPinned === null || note.isPinned === filterPinned;
    return matchesSearch && matchesFilter;
  });

  const handleSaveNote = async (formData: NoteFormData) => {
    try {
      if (selectedNote) {
        const res = await fetch(`/api/notes/${selectedNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setNotes((prev) =>
            prev.map((n) => (n.id === selectedNote.id ? updated : n))
          );
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const newNote = await res.json();
          setNotes((prev) => [newNote, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    }
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedNote(null);
  };

  const handleTogglePin = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterPinned(filterPinned === null ? true : null)}
            className={filterPinned === true ? "bg-primary/10" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery
            ? "No notes found"
            : "No notes yet. Create your first note!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={() => handleViewNote(note)}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note.id)}
              onTogglePin={() => handleTogglePin(note)}
            />
          ))}
        </div>
      )}

      {/* Note Modal (Create/Edit) */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
        onDelete={
          selectedNote ? () => handleDeleteNote(selectedNote.id) : undefined
        }
        note={selectedNote}
      />

      {/* Note View Modal */}
      <NoteViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsModalOpen(true);
        }}
        onDelete={
          selectedNote ? () => handleDeleteNote(selectedNote.id) : undefined
        }
      />
    </div>
  );
}

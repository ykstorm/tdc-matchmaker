"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Note } from "@/types/customer";

export function NotesPanel({ customerId, initial }: { customerId: string; initial: Note[] }) {
  const [notes, setNotes] = useState(initial);
  const [error, setError] = useState("");

  async function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("note"));
    try {
      const note = await api<Note>(`/api/customers/${customerId}/notes`, { method: "POST", body: { text } });
      setNotes((current) => [note, ...current]);
      setError("");
      form.reset();
    } catch (failure) {
      setError((failure as Error).message);
    }
  }

  return (
    <section aria-labelledby="notes-heading" className="grid gap-4">
      <h2 id="notes-heading" className="text-muted-foreground text-xs font-semibold tracking-label uppercase">
        Notes from calls and meetings
      </h2>
      <form onSubmit={addNote} className="grid gap-2">
        <Label htmlFor="note">New note</Label>
        <Textarea id="note" name="note" placeholder="Parents want someone in Pune for the first two years" aria-invalid={!!error} aria-describedby="note-error" />
        <div className="flex items-center justify-between gap-4">
          <p id="note-error" role="status" className="text-destructive text-sm">{error}</p>
          <Button type="submit" variant="secondary" size="sm">Add note</Button>
        </div>
      </form>
      <NoteList notes={notes} />
    </section>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return <p className="text-muted-foreground text-sm">No notes yet. Add one after your first call.</p>;
  return (
    <ul className="grid gap-3">
      {notes.map((note) => (
        <li key={note.id} className="bg-muted/60 rounded-lg px-4 py-3">
          <p className="text-sm leading-normal">{note.text}</p>
          <p className="text-muted-foreground mt-1 text-xs">{note.author}, {formatDate(note.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}

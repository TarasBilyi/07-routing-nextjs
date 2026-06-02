"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";
import { useState } from "react";
import { deleteNote } from "@/lib/api";
import { Note } from "@/types/note";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note successfully deleted");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete note. Please try again.");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={mutation.isPending && deletingId === note.id}
            >
              {mutation.isPending && deletingId === note.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;

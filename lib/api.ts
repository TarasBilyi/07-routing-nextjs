import { NewNoteBody, Note } from "@/types/note";
import axios from "axios";

interface fetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export async function fetchNotes(
  searchQuery: string = "",
  page: number = 1,
  notesTag?: string,
) {
  const { data } = await api.get<fetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: searchQuery || undefined,
      tag: notesTag || undefined,
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NewNoteBody): Promise<Note> {
  const { data } = await api.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

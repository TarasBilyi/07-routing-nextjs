"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import NoteForm from "../../components/NoteForm/NoteForm";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader/Loader";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import { Toaster } from "react-hot-toast";

interface NotesClientProps {
  filterTag?: string;
}

export default function NotesClient({ filterTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", searchQuery, currentPage, filterTag],
    queryFn: () => fetchNotes(searchQuery, currentPage, filterTag),
    placeholderData: (prev) => prev,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const totalPages = data?.totalPages ?? 1;

  const onChangeSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChangeSearch={onChangeSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}

      {isLoading && <Loader />}
      {isError && <p>Помилка завантаження нотаток</p>}
      <Toaster position="top-center" />
    </div>
  );
}

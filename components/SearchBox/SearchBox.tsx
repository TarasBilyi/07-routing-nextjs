"use client";

import type { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChangeSearch: (newSearchValue: string) => void;
}

function SearchBox({ onChangeSearch }: SearchBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    onChangeSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
}

export default SearchBox;

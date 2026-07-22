import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  /** If true, renders the compact variant (in Navbar) */
  compact?: boolean;
  placeholder?: string;
}

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

/**
 * Compact search bar for Navbar.
 * On submit, navigates to /search?q=query.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  compact = false,
  placeholder = 'Search movies…',
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex items-center gap-2 ${
        compact
          ? 'bg-card border border-border-color rounded-lg px-3 py-2'
          : 'bg-card border border-border-color rounded-xl px-4 py-3 w-full'
      }`}
    >
      <label htmlFor="navbar-search" className="sr-only">
        Search movies
      </label>
      <button
        type="submit"
        aria-label="Search"
        className="text-text-secondary hover:text-primary transition-colors flex-shrink-0"
      >
        <SearchIcon />
      </button>
      <input
        id="navbar-search"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`bg-transparent text-text-primary placeholder-text-secondary outline-none flex-1 text-sm min-w-0 ${
          compact ? 'w-36 sm:w-48' : 'w-full'
        }`}
      />
    </form>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieCard } from '../../components/MovieCard';
import { Pagination } from '../../components/Pagination';
import { MovieGridSkeleton } from '../../components/Skeleton';
import { useSearchMovies } from '../../hooks/useMovies';
import { useFavorites } from '../../hooks/useFavorites';
import { useDebounce } from '../../hooks/useDebounce';
import type { Movie, SortOption } from '../../types';

// ─── Sort helpers ──────────────────────────────────────────────────────────────

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const sortMovies = (movies: Movie[], sort: SortOption): Movie[] => {
  return [...movies].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return (b.release_date ?? '').localeCompare(a.release_date ?? '');
      case 'oldest':
        return (a.release_date ?? '').localeCompare(b.release_date ?? '');
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });
};

// ─── Search icon ──────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(urlQuery);
  const [sort, setSort] = useState<SortOption>('popularity');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(inputValue, 500);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Sync URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
    setPage(1);
  }, [debouncedQuery, setSearchParams]);

  // Sync input when URL changes externally (e.g. Navbar search)
  useEffect(() => {
    setInputValue(urlQuery);
    setPage(1);
  }, [urlQuery]);

  const { data, isLoading, isError, error } = useSearchMovies(debouncedQuery, page);

  useEffect(() => {
    document.title = debouncedQuery
      ? `"${debouncedQuery}" — MovieExplorer`
      : 'Search — MovieExplorer';
  }, [debouncedQuery]);

  const sortedResults = data ? sortMovies(data.results, sort) : [];

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Search Movies</h1>

      {/* Input + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Full-width search input */}
        <div className="flex-1 flex items-center gap-3 bg-card border border-border-color rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
          <label htmlFor="search-input" className="sr-only">Search movies</label>
          <span className="text-text-secondary flex-shrink-0"><SearchIcon /></span>
          <input
            id="search-input"
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for any movie…"
            autoFocus
            autoComplete="off"
            className="bg-transparent text-text-primary placeholder-text-secondary outline-none flex-1 text-base"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort results"
          className="bg-card border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results meta */}
      {data && debouncedQuery && (
        <p className="text-text-secondary text-sm mb-6">
          {data.total_results.toLocaleString()} result
          {data.total_results !== 1 ? 's' : ''} for{' '}
          <span className="text-text-primary font-medium">"{debouncedQuery}"</span>
        </p>
      )}

      {/* Loading */}
      {isLoading && <MovieGridSkeleton count={12} />}

      {/* Error */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-400 font-medium mb-2">Something went wrong</p>
          <p className="text-text-secondary text-sm">{(error as Error)?.message}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && debouncedQuery && data?.results.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🎬</p>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No movies found</h2>
          <p className="text-text-secondary">
            Try a different title or check your spelling.
          </p>
        </div>
      )}

      {/* No query yet */}
      {!debouncedQuery && !isLoading && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-text-secondary">Start typing to discover movies.</p>
        </div>
      )}

      {/* Results grid */}
      {sortedResults.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {data && (
            <Pagination
              currentPage={page}
              totalPages={Math.min(data.total_pages, 500)} // TMDB caps at 500
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Search;

import React from 'react';
import type { Genre } from '../../types';

interface GenreBadgeProps {
  genre: Genre;
  small?: boolean;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre, small }) => (
  <span
    className={`badge bg-primary/15 text-primary border border-primary/30 ${
      small ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
    }`}
  >
    {genre.name}
  </span>
);

interface GenreBadgeListProps {
  genreIds?: number[];
  genres?: Genre[];
  allGenres: Genre[];
  max?: number;
  small?: boolean;
}

/**
 * Renders a list of genre badges, resolving ids → names from the allGenres lookup.
 */
export const GenreBadgeList: React.FC<GenreBadgeListProps> = ({
  genreIds,
  genres,
  allGenres,
  max = 3,
  small,
}) => {
  const resolved: Genre[] = genres
    ? genres
    : (genreIds ?? [])
        .map((id) => allGenres.find((g) => g.id === id))
        .filter(Boolean) as Genre[];

  return (
    <div className="flex flex-wrap gap-1.5">
      {resolved.slice(0, max).map((g) => (
        <GenreBadge key={g.id} genre={g} small={small} />
      ))}
    </div>
  );
};

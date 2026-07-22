import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../api/tmdb';
import { formatRating, getReleaseYear, getRatingColor } from '../../utils/format';
import type { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

// Star / rating icon inline SVG
const StarIcon = () => (
  <svg className="w-3.5 h-3.5 fill-star text-star" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Heart icon (outlined = not favorited, filled = favorited)
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // don't navigate to detail when clicking heart
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group card block shadow-lg shadow-black/40 border border-white/5 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:scale-105"
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3] bg-card-hover">
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/342x513/1E293B/64748B?text=No+Image';
          }}
        />

        {/* Rating badge — top-left pill */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm z-10">
          <StarIcon />
          <span className={`text-xs font-semibold ${getRatingColor(movie.vote_average)}`}>
            {formatRating(movie.vote_average)}
          </span>
        </div>

        {/* Favorite button overlay */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 z-10
            ${isFavorite
              ? 'bg-red-500/90 text-white'
              : 'bg-black/50 text-white/70 hover:bg-red-500/80 hover:text-white'
            }`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className="text-sm font-semibold text-text-primary leading-tight mb-1 group-hover:text-accent transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
          title={movie.title}
        >
          {movie.title}
        </h3>
        <p className="text-xs text-text-secondary">
          {getReleaseYear(movie.release_date)}
        </p>
      </div>
    </Link>
  );
};

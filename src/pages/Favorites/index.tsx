import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MovieCard } from '../../components/MovieCard';
import { useFavorites } from '../../hooks/useFavorites';
import type { Movie } from '../../types';

const HeartEmptyIcon = () => (
  <svg className="w-16 h-16 text-text-secondary opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const Favorites: React.FC = () => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    document.title = 'My Favorites — MovieExplorer';
  }, []);

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Favorites</h1>
          <p className="text-text-secondary mt-1">
            {favorites.length > 0
              ? `${favorites.length} movie${favorites.length !== 1 ? 's' : ''} saved`
              : 'Your collection is empty'}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <HeartEmptyIcon />
          <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
            No favorites yet
          </h2>
          <p className="text-text-secondary max-w-sm mb-8">
            Tap the heart icon on any movie to save it here for later.
          </p>
          <Link to="/" className="btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie as Movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

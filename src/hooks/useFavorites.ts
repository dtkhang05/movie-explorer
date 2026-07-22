import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { FavoriteMovie, Movie } from '../types';

const STORAGE_KEY = 'movie_explorer_favorites';

/**
 * Persists favorite movies to LocalStorage.
 * Exposes isFavorite, toggleFavorite, favorites list.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FavoriteMovie[]) : [];
    } catch {
      return [];
    }
  });

  // Keep LocalStorage in sync whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === movie.id)) return prev;
      return [{ ...movie, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
        toast.success('Removed from Favorites', { id: `fav-${movie.id}` });
      } else {
        addFavorite(movie);
        toast.success('Added to Favorites', { id: `fav-${movie.id}` });
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, toggleFavorite, addFavorite, removeFavorite };
}

import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string;

// ─── Axios instance ───────────────────────────────────────────────────────────

/**
 * Pre-configured axios instance for TMDB API v3.
 * Uses Bearer token auth (v4 header) — more secure than api_key query param.
 */
export const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  params: {
    language: 'en-US',
  },
});

// ─── Response interceptor for error handling ──────────────────────────────────

tmdb.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.status_message ?? error.message ?? 'Unknown error';
    console.error('[TMDB API Error]', message);
    return Promise.reject(new Error(message));
  }
);

// ─── Image URL helpers ────────────────────────────────────────────────────────

type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export const getImageUrl = (
  path: string | null | undefined,
  size: ImageSize = 'w500'
): string => {
  if (!path) return '/placeholder-movie.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null | undefined,
  size: BackdropSize = 'w1280'
): string => {
  if (!path) return '/placeholder-backdrop.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (
  path: string | null | undefined,
  size: ProfileSize = 'w185'
): string => {
  if (!path) return '/placeholder-person.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdb;

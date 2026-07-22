import {
  useQuery,
  useInfiniteQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getRecommendations,
  getGenres,
  searchMovies,
  getDiscoverByGenre,
  discoverMovies,
  type DiscoverOptions,
} from '../services/movieService';
import type { Movie, MovieDetail, Genre, Cast, Video, PaginatedResponse } from '../types';

// ─── Query key factory (prevents stale cache collisions) ──────────────────────
export const movieKeys = {
  all: ['movies'] as const,
  trending: (page: number) => ['movies', 'trending', page] as const,
  popular: (page: number) => ['movies', 'popular', page] as const,
  topRated: (page: number) => ['movies', 'topRated', page] as const,
  upcoming: (page: number) => ['movies', 'upcoming', page] as const,
  detail: (id: number) => ['movies', 'detail', id] as const,
  credits: (id: number) => ['movies', 'credits', id] as const,
  videos: (id: number) => ['movies', 'videos', id] as const,
  recommendations: (id: number) => ['movies', 'recommendations', id] as const,
  genres: () => ['movies', 'genres'] as const,
  search: (query: string, page: number) => ['movies', 'search', query, page] as const,
  discover: (options: DiscoverOptions) => ['movies', 'discover', options] as const,
};

// ─── Home page hooks ──────────────────────────────────────────────────────────

export const useTrending = (page = 1, options?: object) =>
  useQuery({
    queryKey: movieKeys.trending(page),
    queryFn: () => getTrending(page),
    staleTime: 5 * 60 * 1000, // 5 min — trending data changes slowly
    ...options,
  });

export const usePopular = (page = 1, options?: object) =>
  useQuery({
    queryKey: movieKeys.popular(page),
    queryFn: () => getPopular(page),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useTopRated = (page = 1, options?: object) =>
  useQuery({
    queryKey: movieKeys.topRated(page),
    queryFn: () => getTopRated(page),
    staleTime: 10 * 60 * 1000, // 10 min — top rated rarely changes
    ...options,
  });

export const useUpcoming = (page = 1, options?: object) =>
  useQuery({
    queryKey: movieKeys.upcoming(page),
    queryFn: () => getUpcoming(page),
    staleTime: 10 * 60 * 1000,
    ...options,
  });

// ─── Detail page hooks ────────────────────────────────────────────────────────

export const useMovieDetail = (id: number): UseQueryResult<MovieDetail> =>
  useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => getMovieDetail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useMovieCredits = (id: number) =>
  useQuery({
    queryKey: movieKeys.credits(id),
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useMovieVideos = (id: number) =>
  useQuery({
    queryKey: movieKeys.videos(id),
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useRecommendations = (id: number) =>
  useQuery({
    queryKey: movieKeys.recommendations(id),
    queryFn: () => getRecommendations(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

// ─── Genres ───────────────────────────────────────────────────────────────────

export const useGenres = () =>
  useQuery({
    queryKey: movieKeys.genres(),
    queryFn: getGenres,
    staleTime: 24 * 60 * 60 * 1000, // 24h — genre list almost never changes
  });

// ─── Discover by Genre ────────────────────────────────────────────────────────

export const useDiscoverByGenre = (genreId: number, page: number) =>
  useQuery({
    queryKey: ['movies', 'discover', genreId, page],
    queryFn: () => getDiscoverByGenre(genreId, page),
    enabled: genreId > 0,
    staleTime: 5 * 60 * 1000,
  });

// ─── Search ───────────────────────────────────────────────────────────────────

export const useSearchMovies = (query: string, page = 1) =>
  useQuery({
    queryKey: movieKeys.search(query, page),
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length >= 2, // don't fire for empty/1-char queries
    staleTime: 2 * 60 * 1000,
  });

export const useDiscoverMovies = (options: DiscoverOptions, queryOptions?: object) =>
  useQuery({
    queryKey: movieKeys.discover(options),
    queryFn: () => discoverMovies(options),
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });

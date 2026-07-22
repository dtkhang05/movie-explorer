import tmdb from '../api/tmdb';
import type {
  Movie,
  MovieDetail,
  Genre,
  Cast,
  Video,
  PaginatedResponse,
  CreditsResponse,
  VideosResponse,
  GenresResponse,
} from '../types';

// ─── Home / Discovery ─────────────────────────────────────────────────────────

/** GET /trending/movie/day */
export const getTrending = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>(
    '/trending/movie/day',
    { params: { page } }
  );
  return data;
};

/** GET /movie/popular */
export const getPopular = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/movie/popular', {
    params: { page },
  });
  return data;
};

/** GET /movie/top_rated */
export const getTopRated = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/movie/top_rated', {
    params: { page },
  });
  return data;
};

/** GET /movie/upcoming */
export const getUpcoming = async (page = 1): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/movie/upcoming', {
    params: { page },
  });
  return data;
};

// ─── Movie Detail ─────────────────────────────────────────────────────────────

/** GET /movie/{id} */
export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  const { data } = await tmdb.get<MovieDetail>(`/movie/${id}`);
  return data;
};

/** GET /movie/{id}/credits */
export const getMovieCredits = async (
  id: number
): Promise<{ cast: Cast[] }> => {
  const { data } = await tmdb.get<CreditsResponse>(`/movie/${id}/credits`);
  return { cast: data.cast.slice(0, 12) }; // max 12 cast members as per spec
};

/** GET /movie/{id}/videos */
export const getMovieVideos = async (id: number): Promise<Video[]> => {
  const { data } = await tmdb.get<VideosResponse>(`/movie/${id}/videos`);
  // Return official YouTube trailers first
  return data.results.filter(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
};

/** GET /movie/{id}/recommendations */
export const getRecommendations = async (
  id: number
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>(
    `/movie/${id}/recommendations`
  );
  return data;
};

// ─── Genres ───────────────────────────────────────────────────────────────────

/** GET /genre/movie/list */
export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await tmdb.get<GenresResponse>('/genre/movie/list');
  return data.genres;
};

// ─── Discover by Genre ────────────────────────────────────────────────────────

/** GET /discover/movie?with_genres= */
export const getDiscoverByGenre = async (
  genreId: number,
  page = 1
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/discover/movie', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  });
  return data;
};

export interface DiscoverOptions {
  with_genres?: string;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  with_original_language?: string;
  'vote_average.gte'?: number;
  'with_runtime.gte'?: number;
  'with_runtime.lte'?: number;
  page?: number;
}

/** GET /discover/movie with full query parameters */
export const discoverMovies = async (
  options: DiscoverOptions
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/discover/movie', {
    params: {
      sort_by: 'popularity.desc',
      include_adult: false,
      ...options,
    },
  });
  return data;
};

// ─── Search ───────────────────────────────────────────────────────────────────

/** GET /search/movie?query= */
export const searchMovies = async (
  query: string,
  page = 1
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};

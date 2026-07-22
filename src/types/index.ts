// ─── Core entities ────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  spoken_languages: { english_name: string; name: string }[];
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;    // YouTube video ID
  site: string;   // "YouTube"
  type: string;   // "Trailer" | "Teaser" | "Clip" | ...
  name: string;
  official: boolean;
  published_at: string;
}

// ─── API Response shapes ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface GenresResponse {
  genres: Genre[];
}

// ─── App-level types ──────────────────────────────────────────────────────────

export type SortOption = 'newest' | 'oldest' | 'rating' | 'popularity';

export interface FavoriteMovie extends Movie {
  addedAt: number; // timestamp
}

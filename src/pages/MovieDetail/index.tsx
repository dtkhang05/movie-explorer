import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useRecommendations,
} from '../../hooks/useMovies';
import { useFavorites } from '../../hooks/useFavorites';
import { MovieCard } from '../../components/MovieCard';
import { GenreBadgeList } from '../../components/GenreBadge';
import { MovieDetailSkeleton } from '../../components/Skeleton';
import { getBackdropUrl, getImageUrl, getProfileUrl } from '../../api/tmdb';
import {
  formatRating,
  getReleaseYear,
  formatRuntime,
  formatCurrency,
  getRatingColor,
} from '../../utils/format';

// ─── Icons ────────────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg className="w-5 h-5 fill-star text-star" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// ─── Stat tile ────────────────────────────────────────────────────────────────

const StatTile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-card rounded-lg p-4 border border-border-color">
    <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">{label}</p>
    <p className="text-text-primary font-semibold">{value}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading, isError, error } = useMovieDetail(movieId);
  const { data: creditsData } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);
  const { data: recommendations } = useRecommendations(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorited = movie ? isFavorite(movie.id) : false;
  const trailer = videos?.[0]; // first YouTube trailer

  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} — MovieExplorer`;
    }
  }, [movie]);

  // Convert MovieDetail → Movie for toggleFavorite (omit extra fields)
  const handleToggleFavorite = () => {
    if (!movie) return;
    const movieBase = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      genre_ids: movie.genres.map((g) => g.id),
    };
    toggleFavorite(movieBase);
  };

  if (isLoading) return <MovieDetailSkeleton />;

  if (isError || !movie) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-red-400 text-lg font-medium mb-2">Failed to load movie</p>
        <p className="text-text-secondary mb-6">{(error as Error)?.message}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Backdrop ── */}
      <div className="relative h-64 md:h-[500px] overflow-hidden bg-card">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'w1280')}
          alt={`${movie.title} backdrop`}
          loading="eager"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 btn-secondary !bg-black/50 backdrop-blur-sm border-white/20"
        >
          <BackIcon /> Back
        </button>
      </div>

      {/* ── Content ── */}
      <div className="container-page -mt-24 md:-mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-40 md:w-64 mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path, 'w342')}
              alt={`${movie.title} poster`}
              className="w-full rounded-lg shadow-card-hover border border-border-color"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/342x513/1E293B/64748B?text=No+Image';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-2 leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-text-secondary italic mb-4">{movie.tagline}</p>
            )}

            {/* Rating + runtime + year */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              <div className="flex items-center gap-1.5">
                <StarIcon />
                <span className={`font-bold text-base ${getRatingColor(movie.vote_average)}`}>
                  {formatRating(movie.vote_average)}
                </span>
                <span className="text-text-secondary">/ 10</span>
                <span className="text-text-secondary text-xs">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
              {movie.runtime > 0 && (
                <span className="text-text-secondary">{formatRuntime(movie.runtime)}</span>
              )}
              <span className="text-text-secondary">{getReleaseYear(movie.release_date)}</span>
              <span className={`badge border ${
                movie.status === 'Released'
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              }`}>
                {movie.status}
              </span>
            </div>

            {/* Genres */}
            <div className="mb-5">
              <GenreBadgeList genres={movie.genres} allGenres={movie.genres} max={8} />
            </div>

            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              className={`btn-${favorited ? 'secondary' : 'primary'} mb-6 ${
                favorited ? '!border-red-500/50 !text-red-400' : ''
              }`}
            >
              <HeartIcon filled={favorited} />
              {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-3">
                Overview
              </h2>
              <p className="text-text-primary leading-relaxed">{movie.overview}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatTile label="Release Date" value={movie.release_date || 'N/A'} />
              <StatTile label="Runtime" value={formatRuntime(movie.runtime)} />
              <StatTile label="Budget" value={formatCurrency(movie.budget)} />
              <StatTile label="Revenue" value={formatCurrency(movie.revenue)} />
            </div>

            {/* Production companies */}
            {movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-3">
                  Production
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.production_companies.slice(0, 5).map((c) => (
                    <span
                      key={c.id}
                      className="text-xs bg-card border border-border-color rounded-full px-3 py-1 text-text-secondary"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Trailer ── */}
        {trailer && (
          <section className="mt-14">
            <h2 className="section-title">Trailer</h2>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-card max-w-3xl mx-auto">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        )}

        {/* ── Cast ── */}
        {creditsData && creditsData.cast.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">Cast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-4">
              {creditsData.cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="aspect-square rounded-full overflow-hidden bg-card mb-2 border-2 border-border-color mx-auto w-16 h-16 sm:w-20 sm:h-20">
                    <img
                      src={getProfileUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/185x185/1E293B/64748B?text=?';
                      }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-2">
                    {actor.name}
                  </p>
                  <p className="text-xs text-text-secondary leading-tight line-clamp-1 mt-0.5">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Similar / Recommendations ── */}
        {recommendations && recommendations.results.length > 0 && (
          <section className="mt-14">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.results.slice(0, 8).map((rec) => (
                <MovieCard
                  key={rec.id}
                  movie={rec}
                  isFavorite={isFavorite(rec.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;

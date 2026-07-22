import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieCard } from '../../components/MovieCard';
import { MovieGridSkeleton } from '../../components/Skeleton';
import { Pagination } from '../../components/Pagination';
import FadeInView from '../../components/FadeInView';
import { useDiscoverByGenre, useGenres } from '../../hooks/useMovies';
import { useFavorites } from '../../hooks/useFavorites';

const MAX_PAGES = 20;

const GenrePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const genreId = Number(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: allGenres } = useGenres();
  const [currentPage, setCurrentPage] = React.useState(1);

  const genreName = allGenres?.find((g) => g.id === genreId)?.name ?? 'Genre';

  const { data, isLoading, isError, refetch } = useDiscoverByGenre(genreId, currentPage);

  const movies = data?.results ?? [];
  const totalPages = data ? Math.min(data.total_pages, 500) : 0;

  useEffect(() => {
    document.title = `${genreName} Movies — MovieExplorer`;
  }, [genreName]);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreId]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!genreId) {
    navigate('/');
    return null;
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-2">{genreName} Movies</h1>
      {data && (
        <p className="text-text-secondary text-sm mb-8">
          {data.total_results.toLocaleString()} movies found
        </p>
      )}

      {isLoading && <MovieGridSkeleton count={12} />}

      {isError && (
        <div className="text-red-400 text-center py-16">
          Failed to load.{' '}
          <button className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && movies.length === 0 && (
        <div className="text-center py-24">
          <p className="text-text-secondary">No movies found for this genre.</p>
        </div>
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, idx) => (
              <FadeInView key={movie.id} delay={(idx % 6) * 0.04}>
                <MovieCard
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </FadeInView>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default GenrePage;
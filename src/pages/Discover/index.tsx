import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDiscoverMovies } from '../../hooks/useMovies';
import { useFavorites } from '../../hooks/useFavorites';
import { MovieCard } from '../../components/MovieCard';
import { Pagination } from '../../components/Pagination';
import { MovieGridSkeleton } from '../../components/Skeleton';

const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));
  const { isFavorite, toggleFavorite } = useFavorites();

  const options = {
    with_genres: searchParams.get('with_genres') ?? '',
    'primary_release_date.gte': searchParams.get('primary_release_date.gte') ?? '',
    'primary_release_date.lte': searchParams.get('primary_release_date.lte') ?? '',
    with_original_language: searchParams.get('with_original_language') ?? '',
    'vote_average.gte': Number(searchParams.get('vote_average.gte') ?? '0'),
    'with_runtime.gte': Number(searchParams.get('with_runtime.gte') ?? '0'),
    'with_runtime.lte': Number(searchParams.get('with_runtime.lte') ?? '300'),
    page,
  };

  const { data: data1, isLoading: loading1, isError: error1, refetch: refetch1 } = useDiscoverMovies({ ...options, page });
  const totalPages = data1 ? Math.min(data1.total_pages, 500) : 1;
  const { data: data2, isLoading: loading2, isError: error2, refetch: refetch2 } = useDiscoverMovies({ ...options, page: page + 1 }, { enabled: page < totalPages });

  const isLoading = loading1 || (page < totalPages && loading2);
  const isError = error1 || (page < totalPages && error2);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(newPage));
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleRetry = () => {
    refetch1();
    refetch2();
  };

  const allMovies = (data1?.results ?? []).concat(data2?.results ?? []);
  const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
  const movies = uniqueMovies.slice(0, 24);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      handlePageChange(totalPages);
    }
  }, [page, totalPages]);

  const hasFilters = Array.from(searchParams.keys()).some(k => k !== 'page');

  return (
    <div className="container-page py-10">
      <h1 className="section-title">
        {hasFilters ? 'Filtered Results' : 'Discover Movies'}
      </h1>

      {isLoading && <MovieGridSkeleton count={20} />}

      {isError && (
        <div className="text-center text-red-500">
          Error loading movies.{' '}
          <button className="underline" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && movies.length === 0 && (
        <div className="text-center text-text-secondary">
          No movies found matching your criteria.
        </div>
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Discover;

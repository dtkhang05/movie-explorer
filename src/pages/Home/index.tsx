import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieCard } from '../../components/MovieCard';
import { MovieGridSkeleton } from '../../components/Skeleton';
import { Pagination } from '../../components/Pagination';
import FadeInView from '../../components/FadeInView';
import { useTrending, usePopular, useTopRated, useUpcoming } from '../../hooks/useMovies';
import { useFavorites } from '../../hooks/useFavorites';
import { getBackdropUrl } from '../../api/tmdb';
import { formatRating } from '../../utils/format';
import type { Movie } from '../../types';

const StarIcon = () => (
  <svg className="w-5 h-5 fill-star text-star" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeroSection: React.FC<{ movies: Movie[] }> = ({ movies }) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const hero = movies[heroIndex];

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % Math.min(movies.length, 5)), 7000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!hero) return <div className="h-[55vh] md:h-[70vh] skeleton" />;

  return (
    <section className="relative h-[55vh] md:h-[70vh] overflow-hidden bg-card">
      <img key={hero.id} src={getBackdropUrl(hero.backdrop_path, 'original')} alt={`${hero.title} backdrop`} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 container-page pb-16 md:pb-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge bg-accent/20 text-accent border border-accent/40 text-xs font-semibold uppercase tracking-wider">
              Trending Today
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-text-primary mb-3 leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {hero.title}
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1"><StarIcon /><span className="text-gold font-bold">{formatRating(hero.vote_average)}</span></div>
            <span className="text-text-secondary text-sm">{hero.release_date?.substring(0, 4)}</span>
          </div>
          <p className="text-text-secondary text-sm md:text-base line-clamp-3 mb-8 max-w-xl">{hero.overview}</p>
          <div className="flex gap-4">
            <Link to={`/movie/${hero.id}`} className="btn-primary px-6 py-3 rounded-xl text-base">View Details</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {movies.slice(0, 5).map((_, i) => (
          <button key={i} onClick={() => setHeroIndex(i)} aria-label={`Show hero ${i + 1}`} className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? 'bg-primary w-5' : 'bg-white/30'}`} />
        ))}
      </div>
    </section>
  );
};

const ENDPOINTS = {
  popular: { title: '🎬 Popular Right Now', hook: usePopular },
  trending: { title: '🔥 Trending Today', hook: useTrending },
  topRated: { title: '⭐ Top Rated', hook: useTopRated },
  upcoming: { title: '📅 Upcoming', hook: useUpcoming },
};
type EndpointKey = keyof typeof ENDPOINTS;

const MainMovieSection: React.FC = () => {
  const [endpoint, setEndpoint] = useState<EndpointKey>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();
  const sectionRef = React.useRef<HTMLElement>(null);

  const useHook = ENDPOINTS[endpoint].hook;
  const { data: data1, isLoading: loading1, isError: error1 } = useHook(currentPage);
  const totalPages = data1 ? Math.min(data1.total_pages, 500) : 0;
  const { data: data2, isLoading: loading2, isError: error2 } = useHook(currentPage + 1, { enabled: currentPage < totalPages });

  const isLoading = loading1 || (currentPage < totalPages && loading2);
  const isError = error1 || (currentPage < totalPages && error2);

  const allMovies = (data1?.results ?? []).concat(data2?.results ?? []);
  const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
  const movies = uniqueMovies.slice(0, 24);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEndpointChange = (newEndpoint: EndpointKey) => {
    setEndpoint(newEndpoint);
    setCurrentPage(1);
  }

  return (
    <section ref={sectionRef} className="py-12">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <h2 className="section-title !text-3xl !font-extrabold tracking-tight">{ENDPOINTS[endpoint].title}</h2>

          <div className="flex items-center gap-2 border border-border rounded-full p-1 mt-4 sm:mt-0">
            {(Object.keys(ENDPOINTS) as EndpointKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleEndpointChange(key)}
                className="relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300"
              >
                <span className={`relative z-10 ${endpoint === key ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'}`}>
                  {ENDPOINTS[key].title.split(' ').slice(1).join(' ')}
                </span>
                {endpoint === key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
                key={endpoint + currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {isLoading && <MovieGridSkeleton count={18} />}
                {isError && <div className="text-red-400 text-center py-8">Failed to load. <button className="underline" onClick={() => handleEndpointChange(endpoint)}>Retry</button></div>}

                {!isLoading && !isError && movies.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie, idx) => (
                        <FadeInView key={movie.id} delay={(idx % 6) * 0.04}>
                        <MovieCard movie={movie} isFavorite={isFavorite(movie.id)} onToggleFavorite={toggleFavorite} />
                        </FadeInView>
                    ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
                )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const Home: React.FC = () => {
  const { data: trending } = useTrending();

  useEffect(() => {
    document.title = 'MovieExplorer — Discover Great Films';
  }, []);

  return (
    <div>
      <HeroSection movies={trending?.results ?? []} />
      <MainMovieSection />
    </div>
  );
};

export default Home;
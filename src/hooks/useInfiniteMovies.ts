import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopular, getTopRated, getUpcoming } from '../services/movieService';
import type { Movie, PaginatedResponse } from '../types';

type Endpoint = 'popular' | 'topRated' | 'upcoming';

const fetchers: Record<Endpoint, (page: number) => Promise<PaginatedResponse<Movie>>> = {
  popular: getPopular,
  topRated: getTopRated,
  upcoming: getUpcoming,
};

const queryKeys: Record<Endpoint, string> = {
  popular: 'popular',
  topRated: 'topRated',
  upcoming: 'upcoming',
};

export function useInfiniteMovies(endpoint: Endpoint) {
  return useInfiniteQuery<PaginatedResponse<Movie>>({
    queryKey: ['movies', queryKeys[endpoint], 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchers[endpoint](pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
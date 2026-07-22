import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base shimmer skeleton block */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

/** Skeleton for a single MovieCard */
export const MovieCardSkeleton: React.FC = () => (
  <div className="card overflow-hidden">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

/** Grid of MovieCard skeletons */
export const MovieGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

/** Skeleton for Movie Detail page */
export const MovieDetailSkeleton: React.FC = () => (
  <div>
    {/* Backdrop */}
    <Skeleton className="h-64 md:h-96 w-full rounded-none" />
    <div className="container-page py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <Skeleton className="w-40 md:w-64 aspect-[2/3] flex-shrink-0" />
        {/* Info */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

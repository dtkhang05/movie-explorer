import React, { useEffect, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  enabled: boolean;
}

/**
 * A thin invisible div at the bottom of a list.
 * When it becomes visible (via IntersectionObserver),
 * it calls `onIntersect` to load more data.
 */
const InfiniteScrollSentinel: React.FC<InfiniteScrollSentinelProps> = ({
  onIntersect,
  enabled,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '300px' } // trigger 300px before reaching the end
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return <div ref={ref} className="h-1 w-full" />;
};

export default InfiniteScrollSentinel;
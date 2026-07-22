/**
 * Format a vote_average (0–10) to one decimal place.
 * e.g. 7.8 → "7.8"
 */
export const formatRating = (rating: number): string =>
  rating.toFixed(1);

/**
 * Extract the year from a release_date string like "2024-03-15".
 */
export const getReleaseYear = (date: string): string =>
  date ? date.substring(0, 4) : 'N/A';

/**
 * Format a runtime in minutes to "Xh Ym".
 * e.g. 145 → "2h 25m"
 */
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/**
 * Format a large number as currency string.
 * e.g. 150000000 → "$150,000,000"
 */
export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Clamp a string to maxLength and append "…" if truncated.
 */
export const truncate = (text: string, maxLength: number): string =>
  text?.length > maxLength ? `${text.slice(0, maxLength)}…` : text;

/**
 * Determine badge color class based on vote_average.
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return 'text-green-400';
  if (rating >= 6) return 'text-yellow-400';
  if (rating >= 4) return 'text-orange-400';
  return 'text-red-400';
};

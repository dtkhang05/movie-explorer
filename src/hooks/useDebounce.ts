import { useEffect, useState } from 'react';

/**
 * Delays updating the value until the user has stopped typing for `delay` ms.
 * Used in Search to avoid hitting the API on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

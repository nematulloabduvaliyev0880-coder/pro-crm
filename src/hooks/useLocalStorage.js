import { useEffect, useState } from 'react';

// Reads once on mount and keeps localStorage in sync afterwards.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch {
      // corrupted storage — fall back to the provided initial value
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — the in-memory state still works
    }
  }, [key, value]);

  return [value, setValue];
}

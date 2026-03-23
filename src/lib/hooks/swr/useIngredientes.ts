'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

/**
 * Hook SWR para obtener la lista de ingredientes.
 * Deduplicado automáticamente: si 4 componentes lo usan, solo hace 1 fetch.
 */
export function useIngredientes() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/ingredientes',
    authFetcher
  );

  return {
    ingredientes: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

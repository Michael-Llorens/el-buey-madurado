'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

/**
 * Hook SWR para obtener la lista de mesas.
 */
export function useMesas() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/mesas',
    authFetcher
  );

  return {
    mesas: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

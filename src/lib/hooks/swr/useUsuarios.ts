'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

/**
 * Hook SWR para obtener la lista de usuarios.
 */
export function useUsuarios() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/usuarios',
    authFetcher
  );

  return {
    usuarios: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

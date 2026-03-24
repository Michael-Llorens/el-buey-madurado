'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

/**
 * Hook SWR para obtener la lista de productos.
 */
export function useProductos() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/productos',
    authFetcher
  );

  return {
    productos: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

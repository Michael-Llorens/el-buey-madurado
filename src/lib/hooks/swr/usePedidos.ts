'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

/**
 * Fetcher específico para pedidos: soporta respuesta paginada y array directo.
 */
async function pedidosFetcher(url: string): Promise<any[]> {
  const data = await authFetcher<any>(url);
  // Soporta { data: [...], total, page } (paginado) o array directo
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/**
 * Hook SWR para obtener la lista de pedidos.
 * Soporta refetch automático cada 30s para mantener el panel actualizado.
 */
export function usePedidos() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/pedidos',
    pedidosFetcher,
    { refreshInterval: 30_000 }
  );

  return {
    pedidos: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

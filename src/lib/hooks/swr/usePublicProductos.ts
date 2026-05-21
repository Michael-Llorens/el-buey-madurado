'use client';

import useSWR from 'swr';

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  permitirExtras: boolean;
  permitirRemover: boolean;
  ingredientes?: Array<{ ingrediente?: { _id: string; nombre: string }; cantidad: number; unidad: string }>;
  ingredientesExtra?: Array<{ nombre: string; precio: number }>;
}

const publicFetcher = (url: string): Promise<Producto[]> =>
  fetch(url)
    .then((r) => r.json())
    .then((d: { data?: Producto[] }) => d.data ?? []);

/**
 * Hook SWR para obtener productos desde el endpoint público (sin autenticación).
 */
export function usePublicProductos() {
  const { data, error, isLoading } = useSWR<Producto[]>(
    '/api/public/productos',
    publicFetcher,
    { refreshInterval: 60_000 }
  );

  return {
    productos: data ?? [],
    error,
    isLoading,
  };
}

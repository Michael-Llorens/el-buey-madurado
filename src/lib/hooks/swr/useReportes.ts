'use client';

import useSWR from 'swr';
import { authFetcher } from './fetcher';

export interface ReportesData {
  resumen: {
    totalPedidos: number;
    ingresosPagados: number;
    pedidosPagados: number;
    pedidosCancelados: number;
    ticketMedio: number;
    descuentosTotales: number;
    impuestosTotales: number;
    pedidosHoy: number;
    ingresosHoy: number;
  };
  porTipo: Array<{ tipo: string; count: number; ingresos: number }>;
  porEstado: Array<{ estado: string; count: number }>;
  topProductos: Array<{
    nombre: string;
    categoria: string;
    cantidadVendida: number;
    ingresos: number;
  }>;
  ingresosDiarios: Array<{
    fecha: string;
    ingresos: number;
    pedidos: number;
  }>;
}

/**
 * Hook SWR para obtener datos de reportes agregados.
 * Refresca cada 60s para mantener los datos actualizados.
 */
export function useReportes() {
  const { data, error, isLoading, mutate } = useSWR<ReportesData>(
    '/api/reportes',
    authFetcher,
    { refreshInterval: 60_000 }
  );

  return {
    reportes: data ?? null,
    error,
    isLoading,
    mutate,
  };
}

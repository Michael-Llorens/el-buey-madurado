import { NextRequest } from 'next/server';

export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * Extrae parámetros de paginación de la URL.
 * Valores por defecto: page=1, limit=50, sort=-createdAt
 */
export function getPaginationParams(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const sort = searchParams.get('sort') || '-createdAt';

  return { page, limit, sort };
}

/**
 * Construye el resultado paginado a partir del total y los datos.
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    data,
    total,
    page: params.page,
    totalPages: Math.ceil(total / params.limit),
    limit: params.limit,
  };
}

import { describe, it, expect } from 'vitest';
import { buildPaginatedResponse } from '../pagination';

describe('buildPaginatedResponse', () => {
  it('calcula totalPages correctamente', () => {
    const result = buildPaginatedResponse(['a', 'b'], 10, {
      page: 1,
      limit: 3,
      sort: '-createdAt',
    });
    expect(result).toEqual({
      data: ['a', 'b'],
      total: 10,
      page: 1,
      totalPages: 4, // ceil(10/3) = 4
      limit: 3,
    });
  });

  it('devuelve totalPages = 1 cuando total <= limit', () => {
    const result = buildPaginatedResponse([1, 2, 3], 3, {
      page: 1,
      limit: 50,
      sort: '-createdAt',
    });
    expect(result.totalPages).toBe(1);
  });

  it('devuelve totalPages = 0 cuando total = 0', () => {
    const result = buildPaginatedResponse([], 0, {
      page: 1,
      limit: 50,
      sort: '-createdAt',
    });
    expect(result.totalPages).toBe(0);
    expect(result.data).toEqual([]);
  });

  it('respeta la página indicada en params', () => {
    const result = buildPaginatedResponse(['x'], 100, {
      page: 5,
      limit: 20,
      sort: 'nombre',
    });
    expect(result.page).toBe(5);
    expect(result.totalPages).toBe(5);
  });
});

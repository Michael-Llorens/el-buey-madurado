// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// ============================================================
// Mocks hoisted
// ============================================================

const {
  mockGet,
  mockMutate,
  mockPedidosData,
  mockAuthFetcher,
} = vi.hoisted(() => ({
  mockGet: vi.fn().mockReturnValue(null),
  mockMutate: vi.fn(),
  mockPedidosData: { current: [] as any[] },
  mockAuthFetcher: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock('@/lib/hooks/swr', () => ({
  usePedidos: () => ({
    pedidos: mockPedidosData.current,
    error: null,
    isLoading: false,
    mutate: mockMutate,
  }),
  authFetcher: (...args: any[]) => mockAuthFetcher(...args),
}));

import { usePedidoPanel } from '../usePedidoPanel';

// Pedidos de ejemplo para tests
const pedidosMock = [
  { _id: '1', estado: 'pendiente', total: 20 },
  { _id: '2', estado: 'preparando', total: 15 },
  { _id: '3', estado: 'listo', total: 30 },
  { _id: '4', estado: 'pagado', total: 50 },
  { _id: '5', estado: 'pagado', total: 25 },
  { _id: '6', estado: 'servido', total: 18 },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockPedidosData.current = [];
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn().mockReturnValue('fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
  window.history.replaceState = vi.fn();
  window.confirm = vi.fn().mockReturnValue(true);
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true, data: {} }),
  }) as any;
});

// ============================================================
// Tests
// ============================================================

describe('usePedidoPanel', () => {
  it('calcula stats correctamente con datos inyectados', () => {
    mockPedidosData.current = pedidosMock;

    const { result } = renderHook(() => usePedidoPanel());

    expect(result.current.pedidos).toHaveLength(6);
    expect(result.current.stats).toEqual({
      total: 6,
      pendientes: 1,
      preparando: 1,
      listos: 1,
      servidos: 1,
      pagados: 2,
      totalRecaudado: 75,
    });
  });

  it('filtra pedidos por estado', async () => {
    mockPedidosData.current = pedidosMock;

    const { result } = renderHook(() => usePedidoPanel());

    act(() => result.current.setFiltroEstado(['pagado']));

    await waitFor(() => {
      expect(result.current.pedidosFiltrados).toHaveLength(2);
      expect(result.current.pedidosFiltrados.every((p: any) => p.estado === 'pagado')).toBe(true);
    });
  });

  it('filtro vacío muestra todos los pedidos', async () => {
    mockPedidosData.current = pedidosMock;

    const { result } = renderHook(() => usePedidoPanel());

    act(() => result.current.setFiltroEstado(['pagado']));
    act(() => result.current.setFiltroEstado([]));

    await waitFor(() => {
      expect(result.current.pedidosFiltrados).toHaveLength(6);
    });
  });

  it('handleCancelar resetea modo a view', () => {
    const { result } = renderHook(() => usePedidoPanel());

    act(() => result.current.setModo('add'));
    expect(result.current.modo).toBe('add');

    act(() => result.current.handleCancelar());
    expect(result.current.modo).toBe('view');
  });

  it('handleEditar cambia a modo edit con el pedido', () => {
    const { result } = renderHook(() => usePedidoPanel());

    const pedido = { _id: '123', estado: 'pendiente' };
    act(() => result.current.handleEditar(pedido));

    expect(result.current.modo).toBe('edit');
    expect(result.current.pedidoEditando).toEqual(pedido);
  });

  it('handleGuardar llama a mutate y vuelve a modo view', async () => {
    mockMutate.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => usePedidoPanel());

    act(() => result.current.setModo('edit'));

    await act(async () => {
      await result.current.handleGuardar();
    });

    expect(mockMutate).toHaveBeenCalled();
    expect(result.current.modo).toBe('view');
  });

  it('loading es false cuando los datos están cargados', () => {
    mockPedidosData.current = pedidosMock;

    const { result } = renderHook(() => usePedidoPanel());

    expect(result.current.loading).toBe(false);
  });
});

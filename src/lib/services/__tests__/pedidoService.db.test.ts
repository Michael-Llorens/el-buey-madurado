import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// Variables hoisted — declaradas antes de que vi.mock se ejecute
// ============================================================

const {
  mockFindByIdAndUpdate,
  mockFindByIdChain,
  mockMesaFindById,
  mockPedidoSave,
  mockPedidoInstance,
  mockProductoFindById,
} = vi.hoisted(() => {
  const mockFindByIdAndUpdate = vi.fn();
  const mockFindByIdChain = {
    select: vi.fn().mockReturnThis(),
    lean: vi.fn(),
  };
  const mockMesaFindById = vi.fn(() => mockFindByIdChain);
  const mockPedidoSave = vi.fn();
  const mockPedidoInstance = {
    _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
    save: mockPedidoSave,
  };
  const mockProductoFindById = vi.fn();

  return {
    mockFindByIdAndUpdate,
    mockFindByIdChain,
    mockMesaFindById,
    mockPedidoSave,
    mockPedidoInstance,
    mockProductoFindById,
  };
});

// ============================================================
// Mocks de modelos Mongoose
// ============================================================

vi.mock('@/lib/models/Mesa', () => ({
  default: {
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findById: mockMesaFindById,
  },
}));

vi.mock('@/lib/models/Pedido', () => {
  function PedidoConstructor() {
    return mockPedidoInstance;
  }
  return { default: PedidoConstructor };
});

vi.mock('@/lib/models/Producto', () => ({
  default: {
    findById: mockProductoFindById,
  },
}));

// Import DESPUÉS de los mocks
import {
  ocuparMesa,
  liberarMesa,
  abrirPedidoParaMesa,
  validarProductosYObtenerPrecios,
} from '../pedidoService';

// ============================================================
// ocuparMesa
// ============================================================

describe('ocuparMesa', () => {
  beforeEach(() => vi.clearAllMocks());

  it('llama a Mesa.findByIdAndUpdate con estado ocupada y pedidoActual', async () => {
    await ocuparMesa('mesa-id-1', 'pedido-id-1');

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('mesa-id-1', {
      estado: 'ocupada',
      pedidoActual: 'pedido-id-1',
    });
  });

  it('se llama exactamente una vez', async () => {
    await ocuparMesa('m', 'p');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// liberarMesa
// ============================================================

describe('liberarMesa', () => {
  beforeEach(() => vi.clearAllMocks());

  it('llama a Mesa.findByIdAndUpdate liberando estado, pedido y comensales', async () => {
    await liberarMesa('mesa-id-2');

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('mesa-id-2', {
      estado: 'libre',
      pedidoActual: null,
      comensalesActuales: 0,
    });
  });
});

// ============================================================
// validarProductosYObtenerPrecios
// ============================================================

describe('validarProductosYObtenerPrecios', () => {
  beforeEach(() => vi.clearAllMocks());

  it('devuelve array vacío si productos es vacío', async () => {
    const result = await validarProductosYObtenerPrecios([]);
    expect(result).toEqual([]);
  });

  it('devuelve array vacío si productos es null/undefined', async () => {
    const result = await validarProductosYObtenerPrecios(null as any);
    expect(result).toEqual([]);
  });

  it('calcula precioUnitario y subtotal desde BD (sin override)', async () => {
    const productoId = '507f1f77bcf86cd799439011';
    mockProductoFindById.mockResolvedValueOnce({
      _id: productoId,
      nombre: 'Chuletón',
      precio: 32.5,
      disponible: true,
    });

    const result = await validarProductosYObtenerPrecios([
      { producto: productoId, cantidad: 2 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].precioUnitario).toBe(32.5);
    expect(result[0].subtotal).toBe(65); // 32.5 * 2
    expect(result[0].cantidad).toBe(2);
    expect(result[0].notas).toBe('');
    expect(result[0].personalizaciones).toEqual({});
  });

  it('preserva notas y personalizaciones del item', async () => {
    const productoId = '507f1f77bcf86cd799439011';
    mockProductoFindById.mockResolvedValueOnce({
      precio: 10,
      disponible: true,
    });

    const result = await validarProductosYObtenerPrecios([
      {
        producto: productoId,
        cantidad: 1,
        notas: 'sin sal',
        personalizaciones: { punto: 'medio' },
      },
    ]);

    expect(result[0].notas).toBe('sin sal');
    expect(result[0].personalizaciones).toEqual({ punto: 'medio' });
  });

  it('lanza error si el producto no existe en BD', async () => {
    mockProductoFindById.mockResolvedValueOnce(null);

    await expect(
      validarProductosYObtenerPrecios([
        { producto: 'id-inexistente', cantidad: 1 },
      ])
    ).rejects.toThrow('Producto id-inexistente no encontrado');
  });

  it('lanza error si el producto no está disponible', async () => {
    mockProductoFindById.mockResolvedValueOnce({
      nombre: 'Ensalada',
      precio: 8,
      disponible: false,
    });

    await expect(
      validarProductosYObtenerPrecios([
        { producto: '507f1f77bcf86cd799439011', cantidad: 1 },
      ])
    ).rejects.toThrow('Producto "Ensalada" no disponible');
  });

  it('valida múltiples productos en paralelo', async () => {
    mockProductoFindById
      .mockResolvedValueOnce({ precio: 10, disponible: true })
      .mockResolvedValueOnce({ precio: 20, disponible: true });

    const result = await validarProductosYObtenerPrecios([
      { producto: '507f1f77bcf86cd799439011', cantidad: 1 },
      { producto: '507f1f77bcf86cd799439022', cantidad: 3 },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].subtotal).toBe(10);
    expect(result[1].subtotal).toBe(60);
  });
});

// ============================================================
// abrirPedidoParaMesa
// ============================================================

describe('abrirPedidoParaMesa', () => {
  beforeEach(() => vi.clearAllMocks());

  it('devuelve null si la mesa no existe', async () => {
    mockFindByIdChain.lean.mockResolvedValueOnce(null);

    const result = await abrirPedidoParaMesa('mesa-inexistente', null);
    expect(result).toBeNull();
  });

  it('devuelve pedido existente sin crear uno nuevo si la mesa ya tiene pedidoActual', async () => {
    mockFindByIdChain.lean.mockResolvedValueOnce({
      _id: 'mesa-1',
      pedidoActual: 'pedido-existente',
      estado: 'ocupada',
    });

    const result = await abrirPedidoParaMesa('mesa-1', 'user-1');

    expect(result).toEqual({ pedidoId: 'pedido-existente', created: false });
    expect(mockPedidoSave).not.toHaveBeenCalled();
  });

  it('crea pedido nuevo y ocupa la mesa si no hay pedidoActual', async () => {
    const mesaId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
    const userId = 'cccccccccccccccccccccccc';

    mockFindByIdChain.lean.mockResolvedValueOnce({
      _id: mesaId,
      pedidoActual: null,
      estado: 'libre',
    });
    mockPedidoSave.mockResolvedValueOnce(undefined);
    mockFindByIdAndUpdate.mockResolvedValueOnce(undefined);

    const result = await abrirPedidoParaMesa(mesaId, userId);

    expect(result).not.toBeNull();
    expect(result!.created).toBe(true);
    expect(result!.pedidoId).toBe(String(mockPedidoInstance._id));
    expect(mockPedidoSave).toHaveBeenCalledTimes(1);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(mesaId, {
      estado: 'ocupada',
      pedidoActual: mockPedidoInstance._id,
    });
  });

  it('crea pedido sin camarero si userId es null', async () => {
    const mesaId = 'dddddddddddddddddddddddd';

    mockFindByIdChain.lean.mockResolvedValueOnce({
      _id: mesaId,
      pedidoActual: null,
      estado: 'libre',
    });
    mockPedidoSave.mockResolvedValueOnce(undefined);
    mockFindByIdAndUpdate.mockResolvedValueOnce(undefined);

    const result = await abrirPedidoParaMesa(mesaId, null);

    expect(result!.created).toBe(true);
    expect(mockPedidoSave).toHaveBeenCalled();
  });
});

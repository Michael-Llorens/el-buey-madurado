// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// ============================================================
// Mocks
// ============================================================

const { mockToast } = vi.hoisted(() => ({
  mockToast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: mockToast }));

vi.mock('@/lib/hooks/swr', () => ({
  useIngredientes: () => ({ ingredientes: [], error: null, isLoading: false, mutate: vi.fn() }),
}));

import { useProductoForm } from '../useProductoForm';

const defaultProps = {
  producto: null,
  onGuardar: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn().mockReturnValue('fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  // Mock fetch para cargar ingredientes
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  }) as any;
});

// ============================================================
// Tests
// ============================================================

describe('useProductoForm', () => {
  describe('estado inicial sin producto', () => {
    it('inicia con campos vacíos y flags en true', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => {
        expect(result.current.formData.nombre).toBe('');
        expect(result.current.formData.precio).toBe('');
        expect(result.current.formData.disponible).toBe(true);
        expect(result.current.formData.permitirPersonalizacion).toBe(true);
        expect(result.current.formData.ingredientes).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('inicialización con producto existente', () => {
    it('precarga datos del producto en modo edición', async () => {
      const producto = {
        _id: 'prod-1',
        nombre: 'Chuletón de buey',
        categoria: 'carnes',
        precio: 32.5,
        descripcion: 'Pieza de 500g',
        imagen: '/img/chuleton.jpg',
        ingredientes: [
          { ingrediente: { _id: 'ing-1', nombre: 'Sal', categoria: 'especias' }, cantidad: 5, unidad: 'gramos' },
        ],
        ingredientesExtra: ['Salsa chimichurri'],
        permitirPersonalizacion: true,
        permitirExtras: false,
        permitirRemover: true,
        disponible: true,
        activo: true,
      };

      const { result } = renderHook(() =>
        useProductoForm({ producto, onGuardar: vi.fn() })
      );

      await waitFor(() => {
        expect(result.current.formData.nombre).toBe('Chuletón de buey');
        expect(result.current.formData.categoria).toBe('carnes');
        expect(result.current.formData.precio).toBe('32.5');
        expect(result.current.formData.descripcion).toBe('Pieza de 500g');
        expect(result.current.formData.ingredientes).toHaveLength(1);
        expect(result.current.formData.ingredientes[0].ingrediente).toBe('ing-1');
        expect(result.current.formData.ingredientesExtra).toEqual(['Salsa chimichurri']);
        expect(result.current.formData.permitirExtras).toBe(false);
        expect(result.current.preview).toBe('/img/chuleton.jpg');
      });
    });
  });

  describe('handleAddIngrediente', () => {
    it('muestra warning si no se selecciona ingrediente', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => result.current.handleAddIngrediente());

      expect(mockToast.warning).toHaveBeenCalledWith('Selecciona un ingrediente y cantidad');
    });

    it('muestra warning si cantidad es 0 o negativa', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setIngredienteSeleccionado('ing-1');
        result.current.setCantidadIngrediente('0');
      });

      act(() => result.current.handleAddIngrediente());

      expect(mockToast.warning).toHaveBeenCalledWith('La cantidad debe ser mayor a 0');
    });

    it('añade ingrediente correctamente con datos válidos', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.setIngredienteSeleccionado('ing-1');
        result.current.setCantidadIngrediente('100');
        result.current.setUnidadIngrediente('gramos');
      });

      act(() => result.current.handleAddIngrediente());

      expect(result.current.formData.ingredientes).toHaveLength(1);
      expect(result.current.formData.ingredientes[0]).toEqual({
        ingrediente: 'ing-1',
        cantidad: 100,
        unidad: 'gramos',
      });
      // Resetea campos después de añadir
      expect(result.current.ingredienteSeleccionado).toBe('');
      expect(result.current.cantidadIngrediente).toBe('');
    });

    it('no permite duplicar ingredientes', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Añadir primero
      act(() => {
        result.current.setIngredienteSeleccionado('ing-1');
        result.current.setCantidadIngrediente('100');
      });
      act(() => result.current.handleAddIngrediente());

      // Intentar duplicar
      act(() => {
        result.current.setIngredienteSeleccionado('ing-1');
        result.current.setCantidadIngrediente('50');
      });
      act(() => result.current.handleAddIngrediente());

      expect(result.current.formData.ingredientes).toHaveLength(1);
      expect(mockToast.warning).toHaveBeenCalledWith('Este ingrediente ya está añadido');
    });
  });

  describe('handleRemoveIngrediente', () => {
    it('elimina ingrediente por índice', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Añadir dos ingredientes
      act(() => {
        result.current.setIngredienteSeleccionado('ing-1');
        result.current.setCantidadIngrediente('100');
      });
      act(() => result.current.handleAddIngrediente());

      act(() => {
        result.current.setIngredienteSeleccionado('ing-2');
        result.current.setCantidadIngrediente('50');
      });
      act(() => result.current.handleAddIngrediente());

      expect(result.current.formData.ingredientes).toHaveLength(2);

      // Eliminar el primero
      act(() => result.current.handleRemoveIngrediente(0));

      expect(result.current.formData.ingredientes).toHaveLength(1);
      expect(result.current.formData.ingredientes[0].ingrediente).toBe('ing-2');
    });
  });

  describe('getNombreIngrediente', () => {
    it('devuelve fallback con ID parcial si no encuentra el ingrediente', async () => {
      const { result } = renderHook(() => useProductoForm(defaultProps));

      await waitFor(() => expect(result.current.loading).toBe(false));

      const nombre = result.current.getNombreIngrediente('abcdef1234567890abcdef12');
      expect(nombre).toBe('ID: abcdef12...');
    });

    it('devuelve nombre del ingrediente populado del producto', async () => {
      const producto = {
        _id: 'prod-1',
        ingredientes: [
          {
            ingrediente: { _id: 'ing-1', nombre: 'Pimienta negra', categoria: 'especias' },
            cantidad: 2,
            unidad: 'gramos',
          },
        ],
      };

      const { result } = renderHook(() =>
        useProductoForm({ producto, onGuardar: vi.fn() })
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.getNombreIngrediente('ing-1')).toBe('Pimienta negra');
    });
  });
});

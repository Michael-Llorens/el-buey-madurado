'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import ProductoForm from '@/components/dashboard/ProductoForm';
import IngredienteForm from '@/components/dashboard/IngredienteForm';
import ProductCardGrid from '@/components/dashboard/ProductCardGrid';
import IngredientCardGrid from '@/components/dashboard/IngredientCardGrid';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { useConfirm } from '@/components/dashboard/hooks/useConfirm';
import { useIngredientes, useProductos } from '@/lib/hooks/swr';

type TabActivo = 'productos' | 'ingredientes';
type Modo = 'view' | 'add-product' | 'add-ingredient' | 'edit-product' | 'edit-ingredient';

export default function StockPanel() {
  const [tabActivo, setTabActivo] = useState<TabActivo>('productos');
  const [modo, setModo] = useState<Modo>('view');

  const { ingredientes, error: errIng, isLoading: loadingIng, mutate: mutateIng } = useIngredientes();
  const { productos, error: errProd, isLoading: loadingProd, mutate: mutateProd } = useProductos();
  const errorIng = errIng?.message ?? null;
  const errorProd = errProd?.message ?? null;

  const { confirmar, confirmProps } = useConfirm();
  const [ingredienteEditar, setIngredienteEditar] = useState<any>(null);
  const [productoEditar, setProductoEditar] = useState<any>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  // ✅ Guardar ingrediente
  const handleGuardarIngrediente = async () => {
    try {
      await mutateIng();
      setIngredienteEditar(null);
      setModo('view');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // ✅ Guardar producto
  const handleGuardarProducto = async () => {
    try {
      await mutateProd();
      setProductoEditar(null);
      setModo('view');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // ✏️ Editar ingrediente
  const handleEditarIngrediente = (ingrediente: any) => {
    setIngredienteEditar(ingrediente);
    setModo('edit-ingredient');
  };

  // ✏️ Editar producto
  const handleEditarProducto = (producto: any) => {
    setProductoEditar(producto);
    setModo('edit-product');
  };

  // 🗑️ Eliminar ingrediente
  const handleEliminarIngrediente = async (id: string) => {
    const ok = await confirmar('¿Seguro que quieres eliminar este ingrediente?', { titulo: 'Eliminar ingrediente', textoConfirmar: 'Eliminar' });
    if (!ok) return;

    if (eliminandoId === id) {
      console.warn('Ya se está eliminando este ingrediente');
      return;
    }

    try {
      setEliminandoId(id);

      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/ingredientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await mutateIng();
        toast.success('Ingrediente eliminado exitosamente');
      } else if (res.status === 404) {
        await mutateIng();
      } else {
        throw new Error(data.error || 'Error al eliminar');
      }
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setEliminandoId(null);
    }
  };

  // 🗑️ Eliminar producto
  const handleEliminarProducto = async (id: string) => {
    const ok = await confirmar('¿Seguro que quieres eliminar este producto?', { titulo: 'Eliminar producto', textoConfirmar: 'Eliminar' });
    if (!ok) return;

    if (eliminandoId === id) {
      console.warn('Ya se está eliminando este producto');
      return;
    }

    try {
      setEliminandoId(id);

      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await mutateProd();
        toast.success('Producto eliminado exitosamente');
      } else if (res.status === 404) {
        await mutateProd();
      } else {
        throw new Error(data.error || 'Error al eliminar');
      }
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setEliminandoId(null);
    }
  };

  // ❌ Cancelar
  const handleCancelar = () => {
    setIngredienteEditar(null);
    setProductoEditar(null);
    setModo('view');
  };

  // 📊 VISTA PRINCIPAL
  return (
    <div className="space-y-6">
      {/* ============ TABS + BOTÓN NUEVO ============ */}
      {modo === 'view' && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center border-b border-gray-700 pb-4">
          {/* 📦 TAB PRODUCTOS */}
          <button
            onClick={() => setTabActivo('productos')}
            className={`px-4 sm:px-6 py-3 font-semibold transition ${
              tabActivo === 'productos'
                ? 'bg-amber-600 text-white rounded-t-lg'
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            📦 Productos
          </button>

          {/* 🥘 TAB INGREDIENTES */}
          <button
            onClick={() => setTabActivo('ingredientes')}
            className={`px-4 sm:px-6 py-3 font-semibold transition ${
              tabActivo === 'ingredientes'
                ? 'bg-amber-600 text-white rounded-t-lg'
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            🥘 Ingredientes
          </button>

          {/* ➕ BOTÓN NUEVO DINÁMICO */}
          <div className="ml-auto">
            <button
              onClick={() => {
                if (tabActivo === 'productos') {
                  setProductoEditar(null);
                  setModo('add-product');
                } else {
                  setIngredienteEditar(null);
                  setModo('add-ingredient');
                }
              }}
              className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
            >
              ➕ Nuevo {tabActivo === 'productos' ? 'Producto' : 'Ingrediente'}
            </button>
          </div>
        </div>
      )}

      {/* ============ FORMULARIO PRODUCTO ============ */}
      {(modo === 'add-product' || modo === 'edit-product') && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">
            {modo === 'add-product' ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
          </h2>
          <ProductoForm
            producto={productoEditar}
            onGuardar={handleGuardarProducto}
            onCancelar={handleCancelar}
          />
        </div>
      )}

      {/* ============ FORMULARIO INGREDIENTE ============ */}
      {(modo === 'add-ingredient' || modo === 'edit-ingredient') && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">
            {modo === 'add-ingredient' ? '➕ Nuevo Ingrediente' : '✏️ Editar Ingrediente'}
          </h2>
          <IngredienteForm
            ingrediente={ingredienteEditar}
            onGuardar={handleGuardarIngrediente}
            onCancelar={handleCancelar}
          />
        </div>
      )}

      {/* ============ LISTA PRODUCTOS ============ */}
      {modo === 'view' && tabActivo === 'productos' && (
        <div>
          {errorProd && (
            <div className="bg-red-600 text-white p-4 rounded mb-4">
              ❌ {errorProd}
            </div>
          )}

          {loadingProd ? (
            <div className="text-center text-gray-400 py-8">⏳ Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No hay productos aún. ¡Crea el primero!</p>
            </div>
          ) : (
            <ProductCardGrid
              productos={productos}
              onEditar={handleEditarProducto}
              onEliminar={handleEliminarProducto}
              eliminandoId={eliminandoId}
            />
          )}
        </div>
      )}

      {/* ============ LISTA INGREDIENTES ============ */}
      {modo === 'view' && tabActivo === 'ingredientes' && (
        <div>
          {errorIng && (
            <div className="bg-red-600 text-white p-4 rounded mb-4">
              ❌ {errorIng}
            </div>
          )}

          {loadingIng ? (
            <div className="text-center text-gray-400 py-8">⏳ Cargando ingredientes...</div>
          ) : ingredientes.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No hay ingredientes aún. ¡Crea el primero!</p>
            </div>
          ) : (
            <IngredientCardGrid
              ingredientes={ingredientes}
              onEditar={handleEditarIngrediente}
              onEliminar={handleEliminarIngrediente}
              eliminandoId={eliminandoId}
            />
          )}
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}

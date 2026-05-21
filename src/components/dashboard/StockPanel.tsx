'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import ProductoForm from '@/components/dashboard/ProductoForm';
import IngredienteForm from '@/components/dashboard/IngredienteForm';
import ProductCardGrid from '@/components/dashboard/ProductCardGrid';
import IngredientCardGrid from '@/components/dashboard/IngredientCardGrid';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { useConfirm } from '@/components/dashboard/hooks/useConfirm';
import { useIngredientes, useProductos } from '@/lib/hooks/swr';
import { getErrorMessage } from '@/lib/utils/errors';

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

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoriaIng, setFiltroCategoriaIng] = useState('todas');
  const [filtroCategoriaProd, setFiltroCategoriaProd] = useState('todas');
  const [filtroDisponible, setFiltroDisponible] = useState<'todos' | 'si' | 'no'>('todos');

  // Categorías dinámicas
  const categoriasIng = useMemo(() => [...new Set(ingredientes.map((i: any) => i.categoria))].sort(), [ingredientes]);
  const categoriasProd = useMemo(() => [...new Set(productos.map((p: any) => p.categoria))].sort(), [productos]);

  // Filtrado ingredientes
  const ingredientesFiltrados = useMemo(() => {
    let result = ingredientes;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter((i: any) => i.nombre.toLowerCase().includes(q) || i.categoria?.toLowerCase().includes(q));
    }
    if (filtroCategoriaIng !== 'todas') result = result.filter((i: any) => i.categoria === filtroCategoriaIng);
    if (filtroDisponible === 'si') result = result.filter((i: any) => i.disponible);
    if (filtroDisponible === 'no') result = result.filter((i: any) => !i.disponible);
    return result;
  }, [ingredientes, busqueda, filtroCategoriaIng, filtroDisponible]);

  // Filtrado productos
  const productosFiltrados = useMemo(() => {
    let result = productos;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter((p: any) => p.nombre.toLowerCase().includes(q) || p.categoria?.toLowerCase().includes(q));
    }
    if (filtroCategoriaProd !== 'todas') result = result.filter((p: any) => p.categoria === filtroCategoriaProd);
    if (filtroDisponible === 'si') result = result.filter((p: any) => p.disponible);
    if (filtroDisponible === 'no') result = result.filter((p: any) => !p.disponible);
    return result;
  }, [productos, busqueda, filtroCategoriaProd, filtroDisponible]);

  // ✅ Guardar ingrediente
  const handleGuardarIngrediente = async () => {
    try {
      await mutateIng();
      setIngredienteEditar(null);
      setModo('view');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(`Error: ${getErrorMessage(error)}`);
    }
  };

  // ✅ Guardar producto
  const handleGuardarProducto = async () => {
    try {
      await mutateProd();
      setProductoEditar(null);
      setModo('view');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(`Error: ${getErrorMessage(error)}`);
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
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error(`Error: ${getErrorMessage(error)}`);
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
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error(`Error: ${getErrorMessage(error)}`);
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
      {/* ============ TABS + BÚSQUEDA + FILTROS + BOTÓN NUEVO ============ */}
      {modo === 'view' && (
        <div className="space-y-3 border-b border-gray-700 pb-4">
          {/* Fila 1: Tabs + Botón nuevo */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setTabActivo('productos')}
                className={`px-4 py-2.5 font-semibold transition text-sm rounded-lg ${
                  tabActivo === 'productos'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                📦 Productos
              </button>
              <button
                onClick={() => setTabActivo('ingredientes')}
                className={`px-4 py-2.5 font-semibold transition text-sm rounded-lg ${
                  tabActivo === 'ingredientes'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                🥘 Ingredientes
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:inline">
                {tabActivo === 'productos' ? productosFiltrados.length : ingredientesFiltrados.length}/{tabActivo === 'productos' ? productos.length : ingredientes.length}
              </span>
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
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition text-sm whitespace-nowrap"
              >
                + Nuevo {tabActivo === 'productos' ? 'Producto' : 'Ingrediente'}
              </button>
            </div>
          </div>

          {/* Fila 2: Búsqueda + Filtros */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">🔍</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar ${tabActivo === 'productos' ? 'producto' : 'ingrediente'}...`}
                aria-label="Buscar en stock"
                className="w-full pl-9 pr-9 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
              />
              {busqueda && (
                <button onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm">✕</button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={tabActivo === 'productos' ? filtroCategoriaProd : filtroCategoriaIng}
                onChange={(e) => tabActivo === 'productos' ? setFiltroCategoriaProd(e.target.value) : setFiltroCategoriaIng(e.target.value)}
                aria-label="Filtrar por categoría"
                className="flex-1 sm:flex-none px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="todas">Categoría: Todas</option>
                {(tabActivo === 'productos' ? categoriasProd : categoriasIng).map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filtroDisponible}
                onChange={(e) => setFiltroDisponible(e.target.value as 'todos' | 'si' | 'no')}
                aria-label="Filtrar por disponibilidad"
                className="flex-1 sm:flex-none px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="todos">Estado: Todos</option>
                <option value="si">Disponibles</option>
                <option value="no">No disponibles</option>
              </select>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-700 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-full mb-4" />
                  <div className="h-5 bg-gray-700 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">{productos.length === 0 ? 'No hay productos aún. ¡Crea el primero!' : 'No se encontraron productos con estos filtros.'}</p>
            </div>
          ) : (
            <ProductCardGrid
              productos={productosFiltrados}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-700 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-full mb-4" />
                  <div className="h-5 bg-gray-700 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : ingredientesFiltrados.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">{ingredientes.length === 0 ? 'No hay ingredientes aún. ¡Crea el primero!' : 'No se encontraron ingredientes con estos filtros.'}</p>
            </div>
          ) : (
            <IngredientCardGrid
              ingredientes={ingredientesFiltrados}
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

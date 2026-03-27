'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { usePublicProductos } from '@/lib/hooks/swr/usePublicProductos';
import ProductoCard from '@/components/public/ProductoCard';
import PersonalizarModal from '@/components/public/PersonalizarModal';
import CartSummaryBar from '@/components/public/CartSummaryBar';
import type { ProductoPublico } from '@/components/public/ProductoCard';

const CATEGORIA_ICON: Record<string, string> = {
  Entrantes: '🍽️',
  Hamburguesas: '🍔',
  Carnes: '🥩',
  Postres: '🍰',
  Bebidas: '🥤',
};

const CATEGORIAS_ORDEN = ['Entrantes', 'Hamburguesas', 'Carnes', 'Postres', 'Bebidas'];

export default function PedirPage() {
  const { productos, isLoading } = usePublicProductos();
  const { addItem, items } = useCart();
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todas');
  const [productoModal, setProductoModal] = useState<ProductoPublico | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const productosTyped = productos as unknown as ProductoPublico[];

  const categorias = useMemo(() => {
    const cats = [...new Set(productosTyped.map((p) => p.categoria))];
    return CATEGORIAS_ORDEN.filter((c) => cats.includes(c));
  }, [productosTyped]);

  const productosFiltrados = useMemo(() => {
    let resultado = productosTyped;
    if (categoriaActiva !== 'todas') {
      resultado = resultado.filter((p) => p.categoria === categoriaActiva);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q)
      );
    }
    return resultado;
  }, [productos, categoriaActiva, busqueda]);

  const cantidadEnCarrito = (productoId: string) =>
    items.filter((i) => i.productoId === productoId).reduce((s, i) => s + i.cantidad, 0);

  const handleAnadir = (producto: ProductoPublico) => {
    if (producto.permitirExtras || producto.permitirRemover) {
      setProductoModal(producto);
    } else {
      addItem({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
      });
    }
  };

  const handleConfirmPersonalizar = (data: {
    ingredientesExtra: string[];
    ingredientesRemovidos: string[];
    precioExtras: number;
    cantidad: number;
    notas: string;
  }) => {
    if (!productoModal) return;
    addItem({
      productoId: productoModal._id,
      nombre: productoModal.nombre,
      precio: productoModal.precio,
      imagen: productoModal.imagen,
      cantidad: data.cantidad,
      personalizaciones: {
        ingredientesExtra: data.ingredientesExtra,
        ingredientesRemovidos: data.ingredientesRemovidos,
        precioExtras: data.precioExtras,
      },
      notas: data.notas,
    });
    setProductoModal(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#160a00] flex items-center justify-center pt-20">
        <div className="text-amber-400 text-lg animate-pulse">Cargando carta...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-28">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-500 mb-1">Pedir Online</h1>
        <p className="text-gray-400 text-sm">Elige tus platos y te los preparamos para recoger o te los llevamos a casa</p>
      </div>

      {/* Buscador + categorías */}
      <div className="sticky top-20 z-30 bg-[#160a00]/95 backdrop-blur-md border-b border-gray-800/50 py-3">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {/* Buscador */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar plato..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Categorías */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setCategoriaActiva('todas')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                categoriaActiva === 'todas'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  categoriaActiva === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {CATEGORIA_ICON[cat] ?? ''} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        {categoriaActiva === 'todas' ? (
          // Agrupados por categoría
          categorias.map((cat) => {
            const prods = productosFiltrados.filter((p) => p.categoria === cat);
            if (prods.length === 0) return null;
            return (
              <div key={cat} className="mb-8">
                <h2 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
                  <span>{CATEGORIA_ICON[cat] ?? ''}</span> {cat}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {prods.map((p) => (
                    <ProductoCard
                      key={p._id}
                      producto={p}
                      onAnadir={handleAnadir}
                      enCarrito={cantidadEnCarrito(p._id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {productosFiltrados.map((p) => (
              <ProductoCard
                key={p._id}
                producto={p}
                onAnadir={handleAnadir}
                enCarrito={cantidadEnCarrito(p._id)}
              />
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 && (
          <p className="text-center text-gray-500 py-12">No se encontraron productos</p>
        )}
      </div>

      {/* Modal personalización */}
      {productoModal && (
        <PersonalizarModal
          producto={productoModal}
          onConfirm={handleConfirmPersonalizar}
          onClose={() => setProductoModal(null)}
        />
      )}

      {/* Barra carrito */}
      <CartSummaryBar />
    </div>
  );
}

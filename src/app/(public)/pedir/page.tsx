'use client';

import { useState, useMemo, useCallback } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { usePublicProductos } from '@/lib/hooks/swr/usePublicProductos';
import ProductoCard from '@/components/public/ProductoCard';
import PersonalizarModal from '@/components/public/PersonalizarModal';
import CartDrawer from '@/components/public/CartDrawer';
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
  const cart = useCart();
  const { addItem, items, total, itemCount, updateQuantity, removeItem } = cart;
  const [localTipo, setLocalTipo] = useState<'recoger' | 'domicilio' | null>(null);
  const tipoPedido = cart.tipoPedido ?? localTipo;
  const setTipoPedido = (tipo: 'recoger' | 'domicilio' | null) => {
    setLocalTipo(tipo);
    if (cart.setTipoPedido) cart.setTipoPedido(tipo);
  };
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todas');
  const [productoModal, setProductoModal] = useState<ProductoPublico | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  }, [productosTyped, categoriaActiva, busqueda]);

  const cantidadEnCarrito = useCallback((productoId: string) =>
    items.filter((i) => i.productoId === productoId).reduce((s, i) => s + i.cantidad, 0),
  [items]);

  const handleAnadir = (producto: ProductoPublico) => {
    // Siempre abrir modal para productos personalizables
    if (producto.permitirExtras || producto.permitirRemover ||
        (producto.ingredientes && producto.ingredientes.length > 0)) {
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

  const handleIncrementar = (productoId: string) => {
    const idx = items.findIndex((i) => i.productoId === productoId);
    if (idx !== -1) updateQuantity(idx, items[idx].cantidad + 1);
  };

  const handleDecrementar = (productoId: string) => {
    const idx = items.findIndex((i) => i.productoId === productoId);
    if (idx !== -1) {
      if (items[idx].cantidad <= 1) removeItem(idx);
      else updateQuantity(idx, items[idx].cantidad - 1);
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-sm">Cargando carta...</p>
        </div>
      </div>
    );
  }

  // Paso 1: Elegir tipo de pedido
  if (!tipoPedido) {
    return (
      <div className="min-h-screen bg-[#160a00] pt-20">
        <div className="max-w-lg mx-auto px-4 pt-8 sm:pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Pedir <span className="text-amber-500">Online</span>
            </h1>
            <p className="text-gray-500 text-sm">Elige cómo quieres recibir tu pedido</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setTipoPedido('recoger')}
              className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-gray-800/80 to-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">🛍️</span>
              <div className="text-left">
                <p className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Recoger en restaurante</p>
                <p className="text-sm text-gray-500">Te avisamos cuando esté listo</p>
              </div>
            </button>

            <button
              onClick={() => setTipoPedido('domicilio')}
              className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-gray-800/80 to-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">🛵</span>
              <div className="text-left">
                <p className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Entrega a domicilio</p>
                <p className="text-sm text-gray-500">Te lo llevamos a casa · +3.50€</p>
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              📍 Carrer de la Reina, 41, Xàtiva · 📞 670 775 786
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Elegir productos
  return (
    <div className="min-h-screen bg-[#160a00] pb-24">
      {/* Header compacto pegado al navbar */}
      <div className="sticky top-[80px] z-30 bg-[#160a00]/95 backdrop-blur-md border-b border-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 py-2">
          {/* Fila 1: Tipo pedido + carrito */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTipoPedido(null)}
                className="text-gray-500 hover:text-white text-sm transition"
              >
                ←
              </button>
              <span className="text-sm font-semibold text-white">
                {tipoPedido === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}
              </span>
              <button
                onClick={() => setTipoPedido(null)}
                className="text-xs text-gray-500 hover:text-amber-400 transition"
              >
                Cambiar
              </button>
            </div>

            {itemCount > 0 && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 rounded-lg transition"
              >
                <span>🛒</span>
                <span className="text-amber-400 font-bold text-sm">{total.toFixed(2)}€</span>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </button>
            )}
          </div>

          {/* Fila 2: Buscador */}
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar plato..."
              className="w-full pl-9 pr-9 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none transition"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm">✕</button>
            )}
          </div>

          {/* Fila 3: Categorías */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setCategoriaActiva('todas')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaActiva === 'todas'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoriaActiva === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                {CATEGORIA_ICON[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="max-w-6xl mx-auto px-4 mt-3">
        {categoriaActiva === 'todas' ? (
          categorias.map((cat) => {
            const prods = productosFiltrados.filter((p) => p.categoria === cat);
            if (prods.length === 0) return null;
            return (
              <div key={cat} className="mb-6">
                <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span>{CATEGORIA_ICON[cat]}</span>
                  <span>{cat}</span>
                  <span className="text-xs text-gray-600 font-normal">({prods.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {prods.map((p) => (
                    <ProductoCard
                      key={p._id}
                      producto={p}
                      onAnadir={handleAnadir}
                      onIncrementar={handleIncrementar}
                      onDecrementar={handleDecrementar}
                      enCarrito={cantidadEnCarrito(p._id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {productosFiltrados.map((p) => (
              <ProductoCard
                key={p._id}
                producto={p}
                onAnadir={handleAnadir}
                onIncrementar={handleIncrementar}
                onDecrementar={handleDecrementar}
                enCarrito={cantidadEnCarrito(p._id)}
              />
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl mb-2 block opacity-30">🔍</span>
            <p className="text-gray-500 text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Barra inferior - ver pedido */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-amber-600/20 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-between w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl px-5 py-3.5 font-bold transition active:scale-[0.99] shadow-lg shadow-amber-600/20"
            >
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
                <span className="text-sm">Ver pedido</span>
              </div>
              <span>{total.toFixed(2)}€</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal personalización */}
      {productoModal && (
        <PersonalizarModal
          producto={productoModal}
          onConfirm={handleConfirmPersonalizar}
          onClose={() => setProductoModal(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useCart } from '@/lib/context/CartContext';
import ProductoCard from '@/components/public/ProductoCard';
import PersonalizarModal from '@/components/public/PersonalizarModal';
import CartDrawer from '@/components/public/CartDrawer';
import type { ProductoPublico } from '@/components/public/ProductoCard';
import productosData from '@/../public/data/productos.json';

const CATEGORIA_ICON: Record<string, string> = {
  Entrantes: '🍽️',
  Hamburguesas: '🍔',
  Carnes: '🥩',
  Postres: '🍰',
  Bebidas: '🥤',
};

const CATEGORIAS_ORDEN = ['Entrantes', 'Hamburguesas', 'Carnes', 'Postres', 'Bebidas'];

export default function PedirPage() {
  const productos = productosData as unknown as ProductoPublico[];
  const isLoading = false;
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

  const productosTyped = productos;

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
    // Siempre abrir modal para personalizar (cantidad, notas, extras)
    setProductoModal(producto);
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
        <div className="max-w-lg mx-auto px-4 pt-8 sm:pt-16 animate-[fadeIn_0.4s_ease-out]">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Pedir <span className="text-amber-500">Online</span>
            </h1>
            <p className="text-gray-500 text-sm">Elige cómo quieres recibir tu pedido</p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => setTipoPedido('recoger')}
              className="w-full max-w-sm inline-flex items-center gap-4 px-6 py-5 bg-gray-800 border-2 border-gray-600 rounded-2xl hover:border-amber-500 hover:bg-gray-800/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group active:scale-[0.98]"
            >
              <span className="text-3xl bg-amber-600/20 rounded-xl p-3 group-hover:bg-amber-600/30 transition-colors">🛍️</span>
              <div className="text-left">
                <p className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Recoger en restaurante</p>
                <p className="text-sm text-gray-400">Te avisamos cuando esté listo</p>
                <p className="text-xs text-green-500/70 mt-0.5">Tiempo estimado: 20–30 min</p>
              </div>
            </button>

            <button
              onClick={() => setTipoPedido('domicilio')}
              className="w-full max-w-sm inline-flex items-center gap-4 px-6 py-5 bg-gray-800 border-2 border-gray-600 rounded-2xl hover:border-amber-500 hover:bg-gray-800/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group active:scale-[0.98]"
            >
              <span className="text-3xl bg-purple-600/20 rounded-xl p-3 group-hover:bg-purple-600/30 transition-colors">🛵</span>
              <div className="text-left">
                <p className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Entrega a domicilio</p>
                <p className="text-sm text-gray-400">Te lo llevamos a casa · <span className="text-amber-500 font-semibold">+3.50€</span></p>
                <p className="text-xs text-green-500/70 mt-0.5">Tiempo estimado: 35–50 min</p>
              </div>
            </button>
          </div>

          <div className="text-center mt-10 space-y-2">
            <p className="text-xs text-gray-600">
              📍 Carrer de la Reina, 41, Xàtiva · 📞 670 775 786
            </p>
            <p className="text-xs text-gray-700">
              Zona de reparto: Xàtiva y alrededores (máx. 5 km)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Elegir productos
  return (
    <div className="min-h-screen bg-[#160a00] pb-12">
      {/* Header compacto pegado al navbar */}
      <div className="sticky top-[80px] z-30 bg-[#160a00]/95 backdrop-blur-md border-b border-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 py-2">
          {/* Fila 1: Tipo pedido + carrito */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {tipoPedido === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}
              </span>
              <button
                onClick={() => setTipoPedido(null)}
                className="text-xs font-semibold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg transition"
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar plato..."
              aria-label="Buscar platos en el menú"
              className="w-full pl-9 pr-9 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none transition"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm transition">✕</button>
            )}
          </div>

          {/* Fila 3: Categorías */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setCategoriaActiva('todas')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaActiva === 'todas'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white border border-gray-700/50'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoriaActiva === cat
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white border border-gray-700/50'
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
              <div key={cat} className="mb-8">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                  <span>{CATEGORIA_ICON[cat]}</span>
                  <span>{cat}</span>
                  <span className="text-xs text-gray-500 font-normal">({prods.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block opacity-30">🔍</span>
            <p className="text-gray-400 text-base font-medium mb-1">
              {busqueda.trim()
                ? `No encontramos resultados para "${busqueda}"`
                : 'No hay productos disponibles en esta categoría'}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              {busqueda.trim()
                ? 'Prueba con otro nombre o revisa la ortografía'
                : 'Prueba seleccionando otra categoría'}
            </p>
            {(busqueda.trim() || categoriaActiva !== 'todas') && (
              <button
                onClick={() => { setBusqueda(''); setCategoriaActiva('todas'); }}
                className="px-5 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-sm font-semibold rounded-xl transition"
              >
                Ver todos los productos
              </button>
            )}
          </div>
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

      {/* Cart Drawer */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

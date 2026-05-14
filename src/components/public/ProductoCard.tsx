'use client';

import { useState } from 'react';

interface ProductoPublico {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  permitirExtras: boolean;
  permitirRemover: boolean;
  ingredientes?: Array<{ ingrediente?: { _id: string; nombre: string; precioExtra?: number; alergenos?: string[] }; cantidad: number; unidad: string }>;
  ingredientesExtra?: Array<{ nombre: string; precio: number }>;
}

interface ProductoCardProps {
  producto: ProductoPublico;
  onAnadir: (producto: ProductoPublico) => void;
  onIncrementar?: (productoId: string) => void;
  onDecrementar?: (productoId: string) => void;
  enCarrito?: number;
}

export type { ProductoPublico };

const CATEGORIA_ICON: Record<string, string> = {
  Entrantes: '🍽️',
  Hamburguesas: '🍔',
  Carnes: '🥩',
  Postres: '🍰',
  Bebidas: '🥤',
};

const CATEGORIA_GRADIENT: Record<string, string> = {
  Entrantes: 'from-emerald-900/40 to-transparent',
  Hamburguesas: 'from-orange-900/40 to-transparent',
  Carnes: 'from-red-900/40 to-transparent',
  Postres: 'from-pink-900/40 to-transparent',
  Bebidas: 'from-cyan-900/40 to-transparent',
};

const CATEGORIA_BADGE_COLOR: Record<string, string> = {
  Entrantes: 'bg-emerald-600/80 text-emerald-100',
  Hamburguesas: 'bg-orange-600/80 text-orange-100',
  Carnes: 'bg-red-600/80 text-red-100',
  Postres: 'bg-pink-600/80 text-pink-100',
  Bebidas: 'bg-cyan-600/80 text-cyan-100',
};

// Categorías que SIEMPRE requieren personalización (punto de la carne)
// Debe coincidir con la constante del PersonalizarModal.
const CATEGORIAS_PUNTO_CARNE = ['carnes', 'hamburguesas'];

export default function ProductoCard({ producto, onAnadir, onIncrementar, onDecrementar, enCarrito }: ProductoCardProps) {
  const necesitaPuntoCarne = CATEGORIAS_PUNTO_CARNE.includes(producto.categoria.toLowerCase());
  const tienePersonalizacion = producto.permitirExtras || producto.permitirRemover || necesitaPuntoCarne;
  const [imgError, setImgError] = useState(false);
  const hasImage = producto.imagen && !imgError;

  return (
    <div
      role="article"
      aria-label={`${producto.nombre} — ${producto.precio.toFixed(2)}€`}
      className={`group relative bg-gray-800/90 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-200 ${
        !producto.disponible
          ? 'opacity-40 pointer-events-none border-gray-700/30'
          : enCarrito && enCarrito > 0
            ? 'border-amber-500 shadow-amber-500/10 shadow-lg'
            : 'border-gray-600/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5'
      }`}
    >
      {!producto.disponible && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl">
          <span className="text-sm font-semibold text-gray-300 bg-gray-800/90 px-4 py-1.5 rounded-full">Agotado</span>
        </div>
      )}

      {/* Imagen del producto */}
      {hasImage ? (
        <div className="relative h-36 sm:h-40 overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          {/* Category badge sobre imagen */}
          <div className="absolute top-2.5 right-2.5 z-[5]">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${CATEGORIA_BADGE_COLOR[producto.categoria] || 'bg-gray-600/80 text-gray-200'}`}>
              {CATEGORIA_ICON[producto.categoria] || '📦'} {producto.categoria}
            </span>
          </div>
          {/* Cantidad en carrito badge */}
          {enCarrito && enCarrito > 0 ? (
            <div className="absolute top-2.5 left-2.5 z-[5]">
              <span className="text-xs font-bold text-white bg-amber-600 px-2 py-0.5 rounded-full shadow-lg">
                {enCarrito} en carrito
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {/* Fondo degradado por categoría cuando no hay imagen */}
          <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORIA_GRADIENT[producto.categoria] || 'from-gray-800/40 to-transparent'} opacity-50`} />
          {/* Category badge sin imagen */}
          <div className="absolute top-2.5 right-2.5 z-[5]">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${CATEGORIA_BADGE_COLOR[producto.categoria] || 'bg-gray-700/80 text-gray-300'}`}>
              {CATEGORIA_ICON[producto.categoria] || '📦'} {producto.categoria}
            </span>
          </div>
        </>
      )}

      <div className={`p-4 relative ${hasImage ? '-mt-4 relative z-[2]' : ''}`}>
        {/* Nombre + descripción */}
        <div className={`mb-3 ${hasImage ? '' : 'pr-20'}`}>
          <h3 className="text-base font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{producto.descripcion}</p>
          )}
        </div>

        {/* Alérgenos */}
        {producto.ingredientes && producto.ingredientes.some((i) => i.ingrediente?.alergenos?.length) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {[...new Set(producto.ingredientes.flatMap((i) => i.ingrediente?.alergenos ?? []))].slice(0, 4).map((a) => (
              <span key={a} className="text-[9px] bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded-full border border-red-800/30" title={a}>
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Precio + acciones */}
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold text-lg">{producto.precio.toFixed(2)}€</span>

          {enCarrito && enCarrito > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecrementar?.(producto._id)}
                aria-label={`Quitar uno de ${producto.nombre}`}
                className="w-8 h-8 bg-gray-700 hover:bg-red-600/80 text-white rounded-full font-bold text-sm transition flex items-center justify-center active:scale-90"
              >
                −
              </button>
              <span className="text-white font-bold text-sm w-5 text-center" aria-label={`${enCarrito} en carrito`}>{enCarrito}</span>
              <button
                onClick={() => {
                  if (tienePersonalizacion) {
                    onAnadir(producto);
                  } else {
                    onIncrementar?.(producto._id);
                  }
                }}
                aria-label={`Añadir otro ${producto.nombre}`}
                className="w-8 h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-sm transition flex items-center justify-center active:scale-90"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAnadir(producto)}
              disabled={!producto.disponible}
              aria-label={`Añadir ${producto.nombre} al carrito`}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white text-sm font-bold rounded-full transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-amber-600/20"
            >
              <span className="text-base leading-none">+</span>
              Añadir
            </button>
          )}
        </div>

        {/* Badge personalizable */}
        {tienePersonalizacion && producto.disponible && (
          <p className="text-xs text-amber-500/70 mt-2.5 flex items-center gap-1 font-medium">
            <span>✨</span> Personalizable
          </p>
        )}
      </div>
    </div>
  );
}

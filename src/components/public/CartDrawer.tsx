'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-gray-900 border-l border-gray-700/50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-bold text-white">Tu pedido</h2>
            {itemCount > 0 && (
              <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
            )}
          </div>
          <button onClick={onClose} aria-label="Cerrar carrito" className="text-gray-400 hover:text-white text-2xl leading-none transition">&times;</button>
        </div>

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <span className="text-5xl mb-4 opacity-30">🛒</span>
            <p className="text-gray-400 text-lg mb-2">Tu carrito está vacío</p>
            <p className="text-gray-600 text-sm mb-6">Añade platos para empezar tu pedido</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition text-sm">
              Explorar carta
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {items.map((item, idx) => {
                const precioItem = (item.precio + (item.personalizaciones?.precioExtras ?? 0)) * item.cantidad;
                return (
                  <div key={idx} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      {item.imagen && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-700">
                          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.nombre}</p>
                        {item.personalizaciones?.ingredientesExtra && item.personalizaciones.ingredientesExtra.length > 0 && (
                          <p className="text-[11px] text-amber-400 mt-0.5 truncate">
                            + {item.personalizaciones.ingredientesExtra.join(', ')}
                          </p>
                        )}
                        {item.personalizaciones?.ingredientesRemovidos && item.personalizaciones.ingredientesRemovidos.length > 0 && (
                          <p className="text-[11px] text-red-400 mt-0.5 truncate">
                            Sin {item.personalizaciones.ingredientesRemovidos.join(', ')}
                          </p>
                        )}
                        {item.notas && (
                          <p className="text-[10px] text-gray-500 mt-0.5 italic truncate">{item.notas}</p>
                        )}
                        <p className="text-amber-400 font-bold text-sm mt-1">{precioItem.toFixed(2)}€</p>
                      </div>

                      {/* Controles cantidad */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => item.cantidad <= 1 ? removeItem(idx) : updateQuantity(idx, item.cantidad - 1)}
                          className="w-7 h-7 bg-gray-700 hover:bg-red-600/80 text-white rounded-lg font-bold text-xs transition flex items-center justify-center"
                        >
                          {item.cantidad <= 1 ? '🗑' : '−'}
                        </button>
                        <span className="text-white font-bold text-sm w-5 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(idx, item.cantidad + 1)}
                          className="w-7 h-7 bg-gray-700 hover:bg-green-600/80 text-white rounded-lg font-bold text-xs transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <button onClick={clearCart} className="text-xs text-gray-500 hover:text-red-400 transition">
                  Vaciar carrito
                </button>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{itemCount} producto{itemCount !== 1 ? 's' : ''}</p>
                  <p className="text-xl font-bold text-amber-400">{total.toFixed(2)}€</p>
                </div>
              </div>

              <Link
                href="/pedir/checkout"
                onClick={onClose}
                className="block w-full py-3.5 bg-green-600 hover:bg-green-700 text-white text-center rounded-xl font-bold transition active:scale-[0.98] text-sm"
              >
                Ir al checkout — {total.toFixed(2)}€
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

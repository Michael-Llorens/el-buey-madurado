'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#160a00] flex flex-col items-center justify-center pt-20 px-4">
        <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
        <Link href="/pedir" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition">
          Ver carta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-500">Tu pedido</h1>
          <button onClick={clearCart} className="text-xs text-gray-500 hover:text-red-400 transition">
            Vaciar carrito
          </button>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {items.map((item, idx) => {
            const precioItem = (item.precio + (item.personalizaciones?.precioExtras ?? 0)) * item.cantidad;
            return (
              <div key={idx} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white">{item.nombre}</h3>
                    {item.personalizaciones?.ingredientesExtra && item.personalizaciones.ingredientesExtra.length > 0 && (
                      <p className="text-[11px] text-amber-400 mt-0.5">
                        + {item.personalizaciones.ingredientesExtra.join(', ')}
                      </p>
                    )}
                    {item.personalizaciones?.ingredientesRemovidos && item.personalizaciones.ingredientesRemovidos.length > 0 && (
                      <p className="text-[11px] text-red-400 mt-0.5">
                        Sin {item.personalizaciones.ingredientesRemovidos.join(', ')}
                      </p>
                    )}
                    {item.notas && (
                      <p className="text-[11px] text-gray-500 mt-0.5 italic">{item.notas}</p>
                    )}
                  </div>
                  <span className="text-amber-400 font-bold text-sm shrink-0">{precioItem.toFixed(2)}€</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => item.cantidad <= 1 ? removeItem(idx) : updateQuantity(idx, item.cantidad - 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition text-sm"
                    >
                      {item.cantidad <= 1 ? '🗑' : '−'}
                    </button>
                    <span className="text-white font-bold w-6 text-center text-sm">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(idx, item.cantidad + 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-xs text-gray-500 hover:text-red-400 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{itemCount} producto{itemCount !== 1 ? 's' : ''}</span>
            <span>{total.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2">
            <span>Total</span>
            <span className="text-amber-400">{total.toFixed(2)}€</span>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <Link
            href="/pedir/checkout"
            className="block w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-xl font-bold transition active:scale-[0.98]"
          >
            Continuar al checkout
          </Link>
          <Link
            href="/pedir"
            className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-center rounded-xl font-semibold transition text-sm"
          >
            Seguir pidiendo
          </Link>
        </div>
      </div>
    </div>
  );
}

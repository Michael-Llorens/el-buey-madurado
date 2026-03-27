'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';

export default function CartSummaryBar() {
  const { items, total, itemCount } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-amber-600/30 px-4 py-3 safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/pedir/carrito"
          className="flex items-center justify-between w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5 py-3.5 font-bold transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="bg-white/20 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
            <span className="text-sm sm:text-base">Ver carrito</span>
          </div>
          <span className="text-base sm:text-lg font-bold">{total.toFixed(2)}€</span>
        </Link>
      </div>
    </div>
  );
}

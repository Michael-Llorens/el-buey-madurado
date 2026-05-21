'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';

export default function CarritoPage() {
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    // El carrito ahora es un drawer en /pedir, redirigir siempre
    if (items.length === 0) {
      router.replace('/pedir');
    } else {
      router.replace('/pedir/checkout');
    }
  }, [items.length, router]);

  return (
    <div className="min-h-screen bg-[#160a00] flex items-center justify-center pt-20">
      <div className="text-amber-400 animate-pulse text-sm">Redirigiendo...</div>
    </div>
  );
}

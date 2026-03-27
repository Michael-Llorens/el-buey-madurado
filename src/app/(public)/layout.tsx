'use client';

import { CartProvider } from '@/lib/context/CartContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="public-layout">
        {children}
      </div>
    </CartProvider>
  );
}

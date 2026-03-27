'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface CartItemPersonalizaciones {
  ingredientesExtra?: string[];
  ingredientesRemovidos?: string[];
  precioExtras?: number;
}

interface CartItem {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  personalizaciones?: CartItemPersonalizaciones;
  notas?: string;
}

type TipoPedido = 'recoger' | 'domicilio' | null;

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  tipoPedido: TipoPedido;
  setTipoPedido: (tipo: TipoPedido) => void;
}

const STORAGE_KEY = 'buey_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

function personalizacionesMatch(
  a?: CartItemPersonalizaciones,
  b?: CartItemPersonalizaciones
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;

  const extraA = [...(a.ingredientesExtra ?? [])].sort();
  const extraB = [...(b.ingredientesExtra ?? [])].sort();
  const removA = [...(a.ingredientesRemovidos ?? [])].sort();
  const removB = [...(b.ingredientesRemovidos ?? [])].sort();

  return (
    JSON.stringify(extraA) === JSON.stringify(extraB) &&
    JSON.stringify(removA) === JSON.stringify(removB)
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tipoPedido, setTipoPedido] = useState<TipoPedido>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (SSR guard)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed as CartItem[]);
        }
      }
    } catch {
      // Ignore parse errors or missing localStorage
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after initial hydration)
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage errors (e.g. quota exceeded)
      }
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => {
      setItems((prev) => {
        const cantidad = item.cantidad ?? 1;
        const existingIndex = prev.findIndex(
          (existing) =>
            existing.productoId === item.productoId &&
            personalizacionesMatch(existing.personalizaciones, item.personalizaciones)
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            cantidad: updated[existingIndex].cantidad + cantidad,
          };
          return updated;
        }

        return [...prev, { ...item, cantidad }];
      });
    },
    []
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, cantidad } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setTipoPedido(null);
  }, []);

  const changeTipoPedido = useCallback((tipo: TipoPedido) => {
    setTipoPedido(tipo);
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum + (item.precio + (item.personalizaciones?.precioExtras ?? 0)) * item.cantidad,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, tipoPedido, setTipoPedido: changeTipoPedido }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

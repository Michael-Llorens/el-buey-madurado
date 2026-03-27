'use client';

import { useState } from 'react';
import type { ProductoPublico } from './ProductoCard';

interface PersonalizarModalProps {
  producto: ProductoPublico;
  onConfirm: (data: {
    ingredientesExtra: string[];
    ingredientesRemovidos: string[];
    precioExtras: number;
    cantidad: number;
    notas: string;
  }) => void;
  onClose: () => void;
}

export default function PersonalizarModal({ producto, onConfirm, onClose }: PersonalizarModalProps) {
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [removidos, setRemovidos] = useState<Set<string>>(new Set());
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');

  const ingredientesRemovibles = producto.permitirRemover
    ? (producto.ingredientes ?? []).filter((i) => i.ingrediente)
    : [];

  const extrasDisponibles = (producto.ingredientesExtra ?? []).filter((e) => e.precio > 0);

  const precioExtras = extrasDisponibles
    .filter((e) => extras.has(e.nombre))
    .reduce((sum, e) => sum + e.precio, 0);

  const precioTotal = (producto.precio + precioExtras) * cantidad;

  const toggleExtra = (nombre: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      next.has(nombre) ? next.delete(nombre) : next.add(nombre);
      return next;
    });
  };

  const toggleRemovido = (nombre: string) => {
    setRemovidos((prev) => {
      const next = new Set(prev);
      next.has(nombre) ? next.delete(nombre) : next.add(nombre);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm({
      ingredientesExtra: Array.from(extras),
      ingredientesRemovidos: Array.from(removidos),
      precioExtras,
      cantidad,
      notas,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-bold text-white">{producto.nombre}</h3>
            <p className="text-sm text-amber-400 font-semibold">{producto.precio.toFixed(2)}€</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Extras */}
          {extrasDisponibles.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Extras disponibles</p>
              <div className="space-y-2">
                {extrasDisponibles.map((extra) => (
                  <button
                    key={extra.nombre}
                    onClick={() => toggleExtra(extra.nombre)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition ${
                      extras.has(extra.nombre)
                        ? 'bg-amber-600/20 border border-amber-500 text-amber-300'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span>{extra.nombre}</span>
                    <span className="font-semibold">+{extra.precio.toFixed(2)}€</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quitar ingredientes */}
          {ingredientesRemovibles.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Quitar ingredientes</p>
              <div className="flex flex-wrap gap-2">
                {ingredientesRemovibles.map((ing) => {
                  const nombre = ing.ingrediente?.nombre ?? '';
                  if (!nombre) return null;
                  return (
                    <button
                      key={nombre}
                      onClick={() => toggleRemovido(nombre)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        removidos.has(nombre)
                          ? 'bg-red-600/20 border border-red-500 text-red-300 line-through'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Notas (opcional)</p>
            <input
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: sin sal, muy hecho..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
              maxLength={200}
            />
          </div>

          {/* Cantidad */}
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-9 h-9 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-lg transition"
              >
                −
              </button>
              <span className="text-white font-bold text-lg w-6 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                className="w-9 h-9 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-lg transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 px-5 py-4">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-base transition active:scale-[0.98]"
          >
            Añadir al carrito — {precioTotal.toFixed(2)}€
          </button>
        </div>
      </div>
    </div>
  );
}

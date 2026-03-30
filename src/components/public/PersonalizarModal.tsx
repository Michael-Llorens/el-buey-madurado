'use client';

import { useState } from 'react';
import type { ProductoPublico } from './ProductoCard';

const CATEGORIAS_PUNTO_CARNE = ['carnes', 'hamburguesas'];
const PUNTOS_CARNE = ['Poco hecho', 'Medio', 'Hecho', 'Muy hecho'] as const;

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
  const [puntoCarne, setPuntoCarne] = useState<string | null>(null);

  const necesitaPunto = CATEGORIAS_PUNTO_CARNE.includes(producto.categoria.toLowerCase());

  // Ingredientes que se pueden quitar (todos los que tiene el producto)
  const ingredientesRemovibles = (producto.ingredientes ?? []).filter((i) => i.ingrediente?.nombre);

  // Extras: ingredientes con precioExtra > 0
  const extrasDisponibles = (producto.ingredientes ?? [])
    .filter((i) => i.ingrediente && (i.ingrediente.precioExtra ?? 0) > 0)
    .map((i) => ({ nombre: i.ingrediente!.nombre, precio: i.ingrediente!.precioExtra! }));

  // También añadir ingredientesExtra del producto si existen
  const extrasDelProducto = (producto.ingredientesExtra ?? []).filter((e) => e.precio > 0);
  const nombresVistos = new Set(extrasDisponibles.map((e) => e.nombre));
  extrasDelProducto.forEach((e) => {
    if (!nombresVistos.has(e.nombre)) {
      extrasDisponibles.push(e);
    }
  });

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
    let notasFinal = '';
    if (puntoCarne) {
      notasFinal = notas.trim() ? `🥩${puntoCarne} | ${notas.trim()}` : `🥩${puntoCarne}`;
    } else {
      notasFinal = notas.trim();
    }

    onConfirm({
      ingredientesExtra: Array.from(extras),
      ingredientesRemovidos: Array.from(removidos),
      precioExtras,
      cantidad,
      notas: notasFinal,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-5 py-4 flex items-start justify-between z-10">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-bold text-white">{producto.nombre}</h3>
            <p className="text-sm text-amber-400 font-semibold">{producto.precio.toFixed(2)}€</p>
            {producto.descripcion && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-3">{producto.descripcion}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none shrink-0 mt-1">&times;</button>
        </div>

        <div className="p-5 space-y-5">

          {/* Punto de carne */}
          {necesitaPunto && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">🥩 Punto de la carne</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PUNTOS_CARNE.map((punto) => (
                  <button
                    key={punto}
                    onClick={() => setPuntoCarne(puntoCarne === punto ? null : punto)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition text-center ${
                      puntoCarne === punto
                        ? 'bg-orange-600 text-white border-2 border-orange-400 shadow-lg shadow-orange-600/20'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-orange-500/50'
                    }`}
                  >
                    {punto}
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
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                        removidos.has(nombre)
                          ? 'bg-red-600/20 border-2 border-red-500 text-red-300 line-through'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-red-500/50'
                      }`}
                    >
                      {removidos.has(nombre) ? '✕ ' : ''}{nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras disponibles */}
          {extrasDisponibles.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Añadir extras</p>
              <div className="space-y-1.5">
                {extrasDisponibles.map((extra) => (
                  <button
                    key={extra.nombre}
                    onClick={() => toggleExtra(extra.nombre)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition ${
                      extras.has(extra.nombre)
                        ? 'bg-amber-600/20 border-2 border-amber-500 text-amber-300'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition ${
                        extras.has(extra.nombre)
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-gray-600'
                      }`}>
                        {extras.has(extra.nombre) && '✓'}
                      </span>
                      <span>{extra.nombre}</span>
                    </div>
                    <span className="font-semibold text-amber-400">+{extra.precio.toFixed(2)}€</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notas para cocina */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Notas para cocina (opcional)</p>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: sin sal, poco aceite, alergia a frutos secos..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Cantidad */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition active:scale-90"
              >
                −
              </button>
              <span className="text-white font-bold text-xl w-8 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(20, cantidad + 1))}
                className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg transition active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer fijo */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 px-5 py-4">
          {/* Resumen de personalizaciones */}
          {(extras.size > 0 || removidos.size > 0 || puntoCarne) && (
            <div className="mb-3 text-xs space-y-0.5 bg-gray-800/50 rounded-lg px-3 py-2">
              {puntoCarne && <p className="text-orange-300">🥩 {puntoCarne}</p>}
              {extras.size > 0 && <p className="text-amber-400">+ {Array.from(extras).join(', ')} (+{precioExtras.toFixed(2)}€)</p>}
              {removidos.size > 0 && <p className="text-red-400">Sin {Array.from(removidos).join(', ')}</p>}
            </div>
          )}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-base transition active:scale-[0.98] shadow-lg shadow-amber-600/20"
          >
            Añadir al carrito — {precioTotal.toFixed(2)}€
          </button>
        </div>
      </div>
    </div>
  );
}

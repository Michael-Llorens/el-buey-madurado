'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ProductoPublico } from './ProductoCard';

const CATEGORIAS_PUNTO_CARNE = ['carnes', 'hamburguesas'];

const PUNTOS_CARNE = [
  {
    id: 'Poco hecho',
    label: 'Poco hecho',
    desc: 'Rojo por dentro',
    bgGradient: 'from-red-700/40 to-red-900/40',
    ringColor: 'ring-red-500',
    textColor: 'text-red-300',
    // Corte transversal: rojo intenso en el centro, fino borde cocido
    cutStyle: { background: 'radial-gradient(circle, #dc2626 0%, #dc2626 55%, #78350f 75%, #57534e 100%)' },
  },
  {
    id: 'Medio',
    label: 'Al punto',
    desc: 'Rosa en el centro',
    bgGradient: 'from-pink-700/40 to-rose-900/40',
    ringColor: 'ring-pink-500',
    textColor: 'text-pink-300',
    cutStyle: { background: 'radial-gradient(circle, #fb7185 0%, #fb7185 35%, #92400e 70%, #44403c 100%)' },
  },
  {
    id: 'Hecho',
    label: 'Hecho',
    desc: 'Marrón uniforme',
    bgGradient: 'from-amber-800/40 to-amber-950/40',
    ringColor: 'ring-amber-600',
    textColor: 'text-amber-300',
    cutStyle: { background: 'radial-gradient(circle, #a16207 0%, #78350f 60%, #451a03 100%)' },
  },
  {
    id: 'Muy hecho',
    label: 'Muy hecho',
    desc: 'Bien cocido',
    bgGradient: 'from-stone-700/40 to-stone-900/40',
    ringColor: 'ring-stone-400',
    textColor: 'text-stone-300',
    cutStyle: { background: 'radial-gradient(circle, #57534e 0%, #292524 60%, #1c1917 100%)' },
  },
] as const;

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
  const [added, setAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const necesitaPunto = CATEGORIAS_PUNTO_CARNE.includes(producto.categoria.toLowerCase());

  // Ingredientes que se pueden quitar
  const ingredientesRemovibles = (producto.ingredientes ?? []).filter((i) => i.ingrediente?.nombre);

  // Extras: ingredientes con precioExtra > 0
  const extrasDisponibles = (producto.ingredientes ?? [])
    .filter((i) => i.ingrediente && (i.ingrediente.precioExtra ?? 0) > 0)
    .map((i) => ({ nombre: i.ingrediente!.nombre, precio: i.ingrediente!.precioExtra! }));

  const extrasDelProducto = (producto.ingredientesExtra ?? []).filter((e) => e.precio > 0);
  const nombresVistos = new Set(extrasDisponibles.map((e) => e.nombre));
  extrasDelProducto.forEach((e) => {
    if (!nombresVistos.has(e.nombre)) extrasDisponibles.push(e);
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

  // Entry animation
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  }, []);

  const faltaPunto = necesitaPunto && !puntoCarne;

  const handleConfirm = () => {
    if (faltaPunto) return; // Bloqueo defensivo (botón ya disabled, pero por si acaso)

    let notasFinal = '';
    if (puntoCarne) {
      notasFinal = notas.trim() ? `🥩${puntoCarne} | ${notas.trim()}` : `🥩${puntoCarne}`;
    } else {
      notasFinal = notas.trim();
    }

    // Visual feedback before closing
    setAdded(true);
    setTimeout(() => {
      onConfirm({
        ingredientesExtra: Array.from(extras),
        ingredientesRemovidos: Array.from(removidos),
        precioExtras,
        cantidad,
        notas: notasFinal,
      });
    }, 400);
  };

  const hasSections = necesitaPunto || ingredientesRemovibles.length > 0 || extrasDisponibles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Personalizar ${producto.nombre}`}>
      <div
        ref={modalRef}
        className="w-full sm:max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 z-10">
          {producto.imagen && (
            <div className="relative h-36 sm:h-44 overflow-hidden">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-lg hover:bg-black/70 transition">&times;</button>
            </div>
          )}
          <div className="px-5 py-3 flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-bold text-white">{producto.nombre}</h3>
              <p className="text-sm text-amber-400 font-semibold">{producto.precio.toFixed(2)}€</p>
              {producto.descripcion && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{producto.descripcion}</p>
              )}
            </div>
            {!producto.imagen && (
              <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-white text-2xl leading-none shrink-0 mt-1">&times;</button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* ═══ Punto de carne — visual con corte transversal ═══ */}
          {necesitaPunto && (
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                <p className="text-sm font-semibold text-white">Punto de la carne</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/15 border border-orange-400/40 px-2 py-0.5 rounded-full">
                  Obligatorio
                </span>
              </div>
              {!puntoCarne && (
                <p className="text-xs text-orange-300/90 mb-3 ml-7 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z" /></svg>
                  Selecciona cómo quieres tu carne para continuar
                </p>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                {PUNTOS_CARNE.map((punto) => {
                  const selected = puntoCarne === punto.id;
                  return (
                    <button
                      key={punto.id}
                      onClick={() => setPuntoCarne(selected ? null : punto.id)}
                      className={`relative overflow-hidden rounded-xl p-3 text-left transition-all duration-200 border ${
                        selected
                          ? `ring-2 ${punto.ringColor} border-transparent shadow-lg`
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${punto.bgGradient} ${selected ? 'opacity-100' : 'opacity-50'} transition-opacity`} />
                      <div className="relative flex items-center gap-3">
                        {/* Círculo con corte transversal real de la carne */}
                        <span
                          className="w-9 h-9 rounded-full shrink-0 ring-2 ring-white/20 shadow-inner"
                          style={punto.cutStyle}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-bold ${selected ? punto.textColor : 'text-gray-100'}`}>{punto.label}</p>
                          <p className="text-[10px] text-gray-400">{punto.desc}</p>
                        </div>
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2 bg-black/40 rounded-full p-0.5">
                          <svg className={`w-3.5 h-3.5 ${punto.textColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ Quitar ingredientes ═══ */}
          {ingredientesRemovibles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6" /></svg>
                <p className="text-sm font-semibold text-white">Quitar ingredientes</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredientesRemovibles.map((ing) => {
                  const nombre = ing.ingrediente?.nombre ?? '';
                  if (!nombre) return null;
                  const isRemoved = removidos.has(nombre);
                  return (
                    <button
                      key={nombre}
                      onClick={() => toggleRemovido(nombre)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        isRemoved
                          ? 'bg-red-600/20 border-2 border-red-500 text-red-300'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-red-500/50'
                      }`}
                    >
                      {isRemoved ? (
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0" />
                      )}
                      <span className={isRemoved ? 'line-through' : ''}>{nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ Extras disponibles ═══ */}
          {extrasDisponibles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                <p className="text-sm font-semibold text-white">Extras</p>
              </div>
              <div className="space-y-1.5">
                {extrasDisponibles.map((extra) => {
                  const selected = extras.has(extra.nombre);
                  return (
                    <button
                      key={extra.nombre}
                      onClick={() => toggleExtra(extra.nombre)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                        selected
                          ? 'bg-amber-600/15 border-2 border-amber-500 text-amber-300'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                          selected ? 'bg-amber-600 text-white' : 'border-2 border-gray-600'
                        }`}>
                          {selected && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        <span className="font-medium">{extra.nombre}</span>
                      </div>
                      <span className="font-semibold text-amber-400 text-xs bg-amber-400/10 px-2 py-0.5 rounded-full">+{extra.precio.toFixed(2)}€</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ Notas para cocina ═══ */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <p className="text-sm font-semibold text-white">Notas para cocina</p>
              <span className="text-[10px] text-gray-600">(opcional)</span>
            </div>
            <div className="relative">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: sin sal, poco aceite, alergia a frutos secos..."
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
                rows={2}
                maxLength={200}
              />
              <span className={`absolute bottom-2 right-3 text-[10px] ${notas.length > 170 ? 'text-amber-400' : 'text-gray-600'}`}>
                {notas.length}/200
              </span>
            </div>
          </div>

          {/* ═══ Cantidad ═══ */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                aria-label="Reducir cantidad"
                disabled={cantidad <= 1}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-xl font-bold text-lg transition active:scale-90"
              >
                −
              </button>
              <span className="text-white font-bold text-xl w-8 text-center" aria-live="polite">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(20, cantidad + 1))}
                aria-label="Aumentar cantidad"
                disabled={cantidad >= 20}
                className="w-10 h-10 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl font-bold text-lg transition active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* Sin personalizaciones — mensaje */}
          {!hasSections && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-xs">Selecciona la cantidad y añade al carrito</p>
            </div>
          )}
        </div>

        {/* ═══ Footer fijo ═══ */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 px-5 py-4">
          {/* Resumen */}
          {(extras.size > 0 || removidos.size > 0 || puntoCarne) && (
            <div className="mb-3 text-xs space-y-1 bg-gray-800/50 rounded-lg px-3 py-2.5">
              {puntoCarne && (
                <div className="flex items-center gap-1.5 text-orange-300">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                  <span>{puntoCarne}</span>
                </div>
              )}
              {extras.size > 0 && (
                <p className="text-amber-400">+ {Array.from(extras).join(', ')} <span className="text-amber-500/70">(+{precioExtras.toFixed(2)}€)</span></p>
              )}
              {removidos.size > 0 && (
                <p className="text-red-400/80">Sin {Array.from(removidos).join(', ')}</p>
              )}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={added || faltaPunto}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
              added
                ? 'bg-green-600 text-white shadow-green-600/20 scale-[0.98]'
                : faltaPunto
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-orange-500/30'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ¡Añadido!
              </>
            ) : faltaPunto ? (
              <>
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z" /></svg>
                Selecciona el punto de la carne
              </>
            ) : (
              `Añadir al carrito — ${precioTotal.toFixed(2)}€`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useIngredientes } from '@/lib/hooks/swr';

interface IngredienteGlobal {
  _id: string;
  nombre: string;
  precioExtra?: number;
}

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  ingredientes?: Array<{
    ingrediente: {
      nombre: string;
    };
  }>;
  permitirExtras?: boolean;
  permitirRemover?: boolean;
}

interface PersonalizarProductoModalProps {
  producto: Producto;
  cantidad: number;
  onConfirmar: (personalizacion: {
    extras: string[];
    removidos: string[];
    notas: string;
    precioTotal: number;
  }) => void;
  onCancelar: () => void;
}

const PRECIO_EXTRA_DEFECTO = 1.5;

export default function PersonalizarProductoModal({
  producto,
  cantidad,
  onConfirmar,
  onCancelar,
}: PersonalizarProductoModalProps) {
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [removidos, setRemovidos] = useState<string[]>([]);

  const { ingredientes: rawIngredientes, error: swrErr, isLoading: loadingIngredientes } = useIngredientes();
  const todosIngredientes = rawIngredientes as IngredienteGlobal[];
  const errorIngredientes = swrErr?.message ?? null;

  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<string>('');

  const extrasDisponibles = useMemo(() => {
    return todosIngredientes
      .filter((i) => i?.nombre)
      .map((i) => ({
        nombre: i.nombre,
        precio: typeof i.precioExtra === 'number' ? i.precioExtra : PRECIO_EXTRA_DEFECTO,
      }));
  }, [todosIngredientes]);

  const toggleExtra = (nombreExtra: string) => {
    setExtrasSeleccionados((prev) =>
      prev.includes(nombreExtra) ? prev.filter((e) => e !== nombreExtra) : [...prev, nombreExtra]
    );
  };

  const añadirExtraDesdeSelect = () => {
    if (!ingredienteSeleccionado) return;
    if (!extrasSeleccionados.includes(ingredienteSeleccionado)) {
      setExtrasSeleccionados((prev) => [...prev, ingredienteSeleccionado]);
    }
    setIngredienteSeleccionado('');
  };

  const toggleRemovido = (nombreIngrediente: string) => {
    setRemovidos((prev) =>
      prev.includes(nombreIngrediente)
        ? prev.filter((i) => i !== nombreIngrediente)
        : [...prev, nombreIngrediente]
    );
  };

  const calcularPrecioTotal = () => {
    const precioExtras = extrasSeleccionados.reduce((sum, nombreExtra) => {
      const extra = extrasDisponibles.find((e) => e.nombre === nombreExtra);
      return sum + (extra?.precio ?? PRECIO_EXTRA_DEFECTO);
    }, 0);
    return (producto.precio + precioExtras) * cantidad;
  };

  const handleConfirmar = () => {
    onConfirmar({
      extras: extrasSeleccionados,
      removidos,
      notas: '',
      precioTotal: calcularPrecioTotal(),
    });
  };

  const precioTotal = calcularPrecioTotal();
  const precioExtras = precioTotal - producto.precio * cantidad;

  const tieneIngredientes = !!(producto.ingredientes && producto.ingredientes.length > 0);
  const permitirExtras = producto.permitirExtras ?? true;
  const permitirRemover = producto.permitirRemover ?? true;
  const hayModificaciones = extrasSeleccionados.length > 0 || removidos.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-5 py-4">
          <h2 className="text-lg font-bold text-amber-400">Personalizar {producto.nombre}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {cantidad}x · {producto.precio.toFixed(2)}€/ud
          </p>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* AÑADIR EXTRAS */}
          {permitirExtras && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">➕ Añadir ingredientes extra</h3>

              {errorIngredientes && (
                <div className="bg-red-600/20 border border-red-500 rounded-lg p-2.5 text-red-200 text-xs mb-2">
                  {errorIngredientes}
                </div>
              )}

              <div className="flex gap-2">
                <select
                  value={ingredienteSeleccionado}
                  onChange={(e) => setIngredienteSeleccionado(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  disabled={loadingIngredientes}
                >
                  <option value="">
                    {loadingIngredientes ? 'Cargando...' : 'Seleccionar ingrediente'}
                  </option>
                  {extrasDisponibles.map((ing) => (
                    <option key={ing.nombre} value={ing.nombre}>
                      {ing.nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={añadirExtraDesdeSelect}
                  disabled={!ingredienteSeleccionado || loadingIngredientes}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition text-sm whitespace-nowrap"
                >
                  Añadir
                </button>
              </div>

              {/* Extras seleccionados */}
              {extrasSeleccionados.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {extrasSeleccionados.map((nombre) => (
                    <span
                      key={nombre}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 rounded-lg text-xs font-medium"
                    >
                      + {nombre}
                      <button
                        type="button"
                        onClick={() => toggleExtra(nombre)}
                        className="text-emerald-400 hover:text-red-400 font-bold ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUITAR INGREDIENTES */}
          {permitirRemover && tieneIngredientes && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">🗑️ Quitar ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {producto.ingredientes!.map((ing, idx) => {
                  const quitado = removidos.includes(ing.ingrediente.nombre);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleRemovido(ing.ingrediente.nombre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        quitado
                          ? 'bg-red-600/20 text-red-300 ring-1 ring-red-500/30 line-through'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {quitado ? '- ' : ''}{ing.ingrediente.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer con total */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-5 py-4">
          {/* Total solo si hay extras */}
          {precioExtras > 0 && (
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Extras ({extrasSeleccionados.length})</span>
              <span className="text-amber-400">+{precioExtras.toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between items-center text-white font-bold mb-4">
            <span>Total</span>
            <span className="text-amber-400 text-lg">{precioTotal.toFixed(2)}€</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition text-sm"
            >
              {hayModificaciones ? 'Confirmar cambios' : 'Sin cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

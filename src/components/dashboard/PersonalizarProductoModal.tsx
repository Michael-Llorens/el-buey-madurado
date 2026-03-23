'use client';

import { useMemo, useState } from 'react';
import { useIngredientes } from '@/lib/hooks/swr';

interface IngredienteGlobal {
  _id: string;
  nombre: string;
  // Si tu modelo Ingrediente NO tiene este campo, se usará el fallback (PRECIO_EXTRA_DEFECTO)
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
  const [notas, setNotas] = useState('');

  const { ingredientes: rawIngredientes, error: swrErr, isLoading: loadingIngredientes } = useIngredientes();
  const todosIngredientes = rawIngredientes as IngredienteGlobal[];
  const errorIngredientes = swrErr?.message ?? null;

  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<string>('');
  // 2) Extras disponibles = TODOS ingredientes (globales)
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
      notas,
      precioTotal: calcularPrecioTotal(),
    });
  };

  const precioTotal = calcularPrecioTotal();
  const precioExtras = precioTotal - producto.precio * cantidad;

  const tieneIngredientes = !!(producto.ingredientes && producto.ingredientes.length > 0);
  const permitirExtras = producto.permitirExtras ?? true;
  const permitirRemover = producto.permitirRemover ?? true;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-amber-400">🍽️ Personalizar {producto.nombre}</h2>
          <p className="text-sm text-gray-400 mt-1">
            Cantidad: {cantidad} • Precio base: {producto.precio.toFixed(2)}€
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* EXTRAS (globales) */}
          {permitirExtras && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">➕ Añadir ingrediente extra</h3>

              {errorIngredientes && (
                <div className="bg-red-600/20 border border-red-500 rounded p-3 text-red-200 text-sm mb-3">
                  ❌ {errorIngredientes}
                </div>
              )}

              <div className="flex gap-3">
                <select
                  value={ingredienteSeleccionado}
                  onChange={(e) => setIngredienteSeleccionado(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
                  disabled={loadingIngredientes}
                >
                  <option value="">
                    {loadingIngredientes ? 'Cargando ingredientes...' : '📋 Selecciona un ingrediente'}
                  </option>

                  {extrasDisponibles.map((ing) => (
                    <option key={ing.nombre} value={ing.nombre}>
                      {ing.nombre} (+{ing.precio.toFixed(2)}€)
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={añadirExtraDesdeSelect}
                  disabled={!ingredienteSeleccionado || loadingIngredientes}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-semibold rounded transition whitespace-nowrap"
                >
                  Añadir
                </button>
              </div>

              {/* Lista extras seleccionados */}
              {extrasSeleccionados.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">
                    Extras seleccionados: {extrasSeleccionados.length}
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {extrasSeleccionados.map((nombre) => {
                      const extra = extrasDisponibles.find((e) => e.nombre === nombre);
                      const precio = extra?.precio ?? PRECIO_EXTRA_DEFECTO;

                      return (
                        <div
                          key={nombre}
                          className="flex items-center justify-between p-3 bg-gray-700 rounded"
                        >
                          <span className="text-white">{nombre}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-semibold">
                              +{precio.toFixed(2)}€
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleExtra(nombre)}
                              className="text-red-400 hover:text-red-300 font-bold"
                              title="Quitar extra"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REMOVER INGREDIENTES */}
          {permitirRemover && tieneIngredientes && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🗑️ Remover ingredientes</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {producto.ingredientes!.map((ing, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition"
                  >
                    <input
                      type="checkbox"
                      checked={removidos.includes(ing.ingrediente.nombre)}
                      onChange={() => toggleRemovido(ing.ingrediente.nombre)}
                      className="w-5 h-5 rounded accent-red-500"
                    />
                    <span className="text-white">{ing.ingrediente.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* NOTAS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">📝 Notas especiales</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Poco hecho, sin sal, punto medio, etc."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* RESUMEN */}
          <div className="bg-gray-700 p-4 rounded space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Precio base ({cantidad}x):</span>
              <span>{(producto.precio * cantidad).toFixed(2)}€</span>
            </div>

            {precioExtras > 0 && (
              <div className="flex justify-between text-sm text-amber-400">
                <span>Extras:</span>
                <span>+{precioExtras.toFixed(2)}€</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
              <span>TOTAL:</span>
              <span className="text-amber-400">{precioTotal.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-4">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition"
          >
            ✅ Confirmar ({precioTotal.toFixed(2)}€)
          </button>
        </div>
      </div>
    </div>
  );
}
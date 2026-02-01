'use client';

import { useState } from 'react';

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  ingredientesExtra?: Array<{
    nombre: string;
    precio: number;
  }>;
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

export default function PersonalizarProductoModal({
  producto,
  cantidad,
  onConfirmar,
  onCancelar,
}: PersonalizarProductoModalProps) {
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [removidos, setRemovidos] = useState<string[]>([]);
  const [notas, setNotas] = useState('');

  const toggleExtra = (nombreExtra: string) => {
    setExtrasSeleccionados(prev =>
      prev.includes(nombreExtra)
        ? prev.filter(e => e !== nombreExtra)
        : [...prev, nombreExtra]
    );
  };

  const toggleRemovido = (nombreIngrediente: string) => {
    setRemovidos(prev =>
      prev.includes(nombreIngrediente)
        ? prev.filter(i => i !== nombreIngrediente)
        : [...prev, nombreIngrediente]
    );
  };

  const calcularPrecioTotal = () => {
    let precioBase = producto.precio;
    
    // Sumar extras
    const precioExtras = extrasSeleccionados.reduce((sum, nombreExtra) => {
      const extra = producto.ingredientesExtra?.find(e => e.nombre === nombreExtra);
      return sum + (extra?.precio || 0);
    }, 0);

    return (precioBase + precioExtras) * cantidad;
  };

  const handleConfirmar = () => {
    onConfirmar({
      extras: extrasSeleccionados,
      removidos: removidos,
      notas: notas,
      precioTotal: calcularPrecioTotal(),
    });
  };

  const precioTotal = calcularPrecioTotal();
  const precioExtras = precioTotal - (producto.precio * cantidad);

  // ✅ Verificar si tiene extras o ingredientes
  const tieneExtras = producto.ingredientesExtra && producto.ingredientesExtra.length > 0;
  const tieneIngredientes = producto.ingredientes && producto.ingredientes.length > 0;
  const tienePersonalizaciones = tieneExtras || tieneIngredientes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-amber-400">
            🍽️ Personalizar {producto.nombre}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Cantidad: {cantidad} • Precio base: {producto.precio.toFixed(2)}€
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* ✅ MENSAJE SI NO HAY EXTRAS CONFIGURADOS */}
          {!tienePersonalizaciones && (
            <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded p-4 text-center">
              <p className="text-blue-300 text-sm">
                ℹ️ Este producto no tiene extras configurados.
              </p>
              <p className="text-blue-400 text-xs mt-2">
                Puedes añadir notas especiales abajo.
              </p>
            </div>
          )}

          {/* EXTRAS */}
          {tieneExtras && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                ➕ Ingredientes Extra
              </h3>
              <div className="space-y-2">
                {producto.ingredientesExtra!.map((extra, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extrasSeleccionados.includes(extra.nombre)}
                        onChange={() => toggleExtra(extra.nombre)}
                        className="w-5 h-5 rounded accent-amber-500"
                      />
                      <span className="text-white font-medium">{extra.nombre}</span>
                    </div>
                    <span className="text-amber-400 font-semibold">
                      +{extra.precio.toFixed(2)}€
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* REMOVER INGREDIENTES */}
          {tieneIngredientes && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                🗑️ Remover Ingredientes
              </h3>
              <div className="space-y-2">
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
            <h3 className="text-lg font-semibold text-white mb-3">
              📝 Notas Especiales
            </h3>
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

        {/* Footer - Botones */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-4">
          <button
            onClick={onCancelar}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition"
          >
            Cancelar
          </button>
          <button
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
'use client';

interface Ingrediente {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
}

interface IngredientCardGridProps {
  ingredientes: Ingrediente[];
  onEditar: (ingrediente: Ingrediente) => void;
  onEliminar: (id: string) => void;
}

export default function IngredientCardGrid({ ingredientes, onEditar, onEliminar }: IngredientCardGridProps) {
  if (ingredientes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400 text-lg">No hay ingredientes. ¡Crea el primero!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ingredientes.map((ingrediente) => {
        const total = ingrediente.cantidad * ingrediente.precio_unitario;

        return (
          <div
            key={ingrediente.id}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-amber-500 transition"
          >
            {/* Header con ícono */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white truncate">
                {ingrediente.nombre}
              </h3>
              <span className="text-2xl">🥘</span>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
              {/* Cantidad */}
              <div className="flex justify-between">
                <span className="text-gray-400">Cantidad:</span>
                <span className="text-white font-semibold">
                  {ingrediente.cantidad} {ingrediente.unidad}
                </span>
              </div>

              {/* Precio unitario */}
              <div className="flex justify-between">
                <span className="text-gray-400">P. Unitario:</span>
                <span className="text-amber-400 font-semibold">
                  ${ingrediente.precio_unitario.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="bg-gray-700 rounded p-2 flex justify-between">
                <span className="text-gray-300 font-semibold">Total:</span>
                <span className="text-green-400 font-bold text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onEditar(ingrediente)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onEliminar(ingrediente.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
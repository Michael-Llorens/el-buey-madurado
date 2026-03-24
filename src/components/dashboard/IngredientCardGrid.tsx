'use client';

interface Ingrediente {
  _id: string;
  nombre: string;
  categoria: string;
  precioBase: number;
  precioExtra: number;
  inventario: {
    cantidad: number;
    unidad: string;
  };
  disponible: boolean;
  activo: boolean;
}

interface IngredientCardGridProps {
  ingredientes: Ingrediente[];
  onEditar: (ingrediente: Ingrediente) => void;
  onEliminar: (id: string) => void;
  eliminandoId?: string | null;
}

export default function IngredientCardGrid({
  ingredientes,
  onEditar,
  onEliminar,
  eliminandoId,
}: IngredientCardGridProps) {
  if (ingredientes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No hay ingredientes para mostrar.</p>
      </div>
    );
  }

  const totalValor = ingredientes.reduce(
    (sum, ing) => sum + ing.inventario.cantidad * ing.precioBase,
    0
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {ingredientes.map((ingrediente) => (
          <div
            key={ingrediente._id}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-amber-600 transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{ingrediente.nombre}</h3>
                <p className="text-gray-400 text-sm">{ingrediente.categoria}</p>
              </div>
              <span className="text-lg sm:text-2xl">{ingrediente.disponible ? '✅' : '❌'}</span>
            </div>

            {/* Información */}
            <div className="bg-gray-900 rounded p-3 mb-3 text-sm space-y-1">
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">Cantidad:</span>{' '}
                {ingrediente.inventario.cantidad} {ingrediente.inventario.unidad}
              </p>
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">Precio Base:</span> $
                {ingrediente.precioBase.toFixed(2)}
              </p>
              <p className="text-gray-300">
                <span className="text-green-400 font-semibold">Precio Extra:</span> $
                {ingrediente.precioExtra.toFixed(2)}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => onEditar(ingrediente)}
                disabled={eliminandoId === ingrediente._id}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onEliminar(ingrediente._id)}
                disabled={eliminandoId === ingrediente._id}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition text-sm"
              >
                {eliminandoId === ingrediente._id ? '⏳ Eliminando...' : '🗑️ Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-300">
          Total de ingredientes: <span className="font-bold text-amber-400">{ingredientes.length}</span>
        </p>
        <p className="text-gray-300">
          Valor total en stock:{' '}
          <span className="font-bold text-green-400">${totalValor.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

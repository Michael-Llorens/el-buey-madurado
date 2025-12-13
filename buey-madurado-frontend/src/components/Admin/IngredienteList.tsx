'use client';

interface Ingrediente {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  createdAt: string;
}

interface IngredienteListProps {
  ingredientes: Ingrediente[];
  onEliminar: (id: string) => void;
}

export default function IngredienteList({ ingredientes, onEliminar }: IngredienteListProps) {
  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro que quieres eliminar este ingrediente?')) {
      onEliminar(id);
      alert('✅ Ingrediente eliminado');
    }
  };

  if (ingredientes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">🥘 Ingredientes</h2>
        <p className="text-gray-400">No hay ingredientes aún. ¡Crea el primero!</p>
      </div>
    );
  }

  const totalValor = ingredientes.reduce((sum, ing) => sum + (ing.cantidad * ing.precio_unitario), 0);

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">🥘 Listado de Ingredientes</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-4 py-2 text-left text-gray-200">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-200">Cantidad</th>
              <th className="px-4 py-2 text-left text-gray-200">Precio Unitario</th>
              <th className="px-4 py-2 text-left text-gray-200">Valor Total</th>
              <th className="px-4 py-2 text-center text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map(ingrediente => (
              <tr key={ingrediente.id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                <td className="px-4 py-3 text-white font-semibold">{ingrediente.nombre}</td>
                <td className="px-4 py-3 text-gray-300">
                  {ingrediente.cantidad} {ingrediente.unidad}
                </td>
                <td className="px-4 py-3 text-amber-400">${ingrediente.precio_unitario.toFixed(2)}</td>
                <td className="px-4 py-3 text-green-400 font-semibold">
                  ${(ingrediente.cantidad * ingrediente.precio_unitario).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => alert('🔄 Editar no implementado aún')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(ingrediente.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-gray-300 text-sm space-y-2">
        <p>Total de ingredientes: <span className="font-bold text-amber-400">{ingredientes.length}</span></p>
        <p>Valor total en stock: <span className="font-bold text-green-400">${totalValor.toFixed(2)}</span></p>
      </div>
    </div>
  );
}

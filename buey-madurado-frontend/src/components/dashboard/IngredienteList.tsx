'use client';

import { useEffect, useState } from 'react';

interface IngredienteFetch {
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

interface IngredienteListProps {
  onEliminar?: (id: string) => void;
}

export default function IngredienteList({ onEliminar }: IngredienteListProps) {
  const [ingredientes, setIngredientes] = useState<IngredienteFetch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar ingredientes desde la API
  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredientes`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Error al cargar ingredientes');
        }

        setIngredientes(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientes();
  }, []);

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro que quieres eliminar este ingrediente?')) {
      if (onEliminar) {
        onEliminar(id);
      }
      alert('✅ Ingrediente eliminado');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Cargando ingredientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (ingredientes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">🥘 Ingredientes</h2>
        <p className="text-gray-400">No hay ingredientes aún. ¡Crea el primero!</p>
      </div>
    );
  }

  // Calcular valor total: cantidad * precioBase
  const totalValor = ingredientes.reduce((sum, ing) => {
    return sum + ing.inventario.cantidad * ing.precioBase;
  }, 0);

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">🥘 Listado de Ingredientes</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-4 py-2 text-left text-gray-200">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-200">Categoría</th>
              <th className="px-4 py-2 text-left text-gray-200">Cantidad</th>
              <th className="px-4 py-2 text-left text-gray-200">Precio Base</th>
              <th className="px-4 py-2 text-left text-gray-200">Precio Extra</th>
              <th className="px-4 py-2 text-center text-gray-200">Disponible</th>
              <th className="px-4 py-2 text-center text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente) => (
              <tr
                key={ingrediente._id}
                className="border-b border-gray-600 hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3 text-white font-semibold">
                  {ingrediente.nombre}
                </td>
                <td className="px-4 py-3 text-gray-300">{ingrediente.categoria}</td>
                <td className="px-4 py-3 text-gray-300">
                  {ingrediente.inventario.cantidad} {ingrediente.inventario.unidad}
                </td>
                <td className="px-4 py-3 text-amber-400">
                  ${ingrediente.precioBase.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-green-400">
                  ${ingrediente.precioExtra.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {ingrediente.disponible ? '✅' : '❌'}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => alert('🔄 Editar no implementado aún')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(ingrediente._id)}
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
        <p>
          Total de ingredientes:{' '}
          <span className="font-bold text-amber-400">{ingredientes.length}</span>
        </p>
        <p>
          Valor total en stock:{' '}
          <span className="font-bold text-green-400">${totalValor.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
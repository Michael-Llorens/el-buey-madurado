'use client';

import { toast } from 'sonner';
import { useIngredientes } from '@/lib/hooks/swr';

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
  const { ingredientes: rawIngredientes, error: swrError, isLoading: loading } = useIngredientes();
  const ingredientes = rawIngredientes as IngredienteFetch[];
  const error = swrError?.message ?? null;

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro que quieres eliminar este ingrediente?')) {
      if (onEliminar) {
        onEliminar(id);
      }
      toast.success('Ingrediente eliminado');
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
    <div className="bg-gray-800 rounded-lg p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">Listado de Ingredientes</h2>

      {/* Desktop: tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-4 py-2 text-left text-gray-200">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-200">Categoria</th>
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
                <td className="px-4 py-3 text-white font-semibold">{ingrediente.nombre}</td>
                <td className="px-4 py-3 text-gray-300">{ingrediente.categoria}</td>
                <td className="px-4 py-3 text-gray-300">{ingrediente.inventario.cantidad} {ingrediente.inventario.unidad}</td>
                <td className="px-4 py-3 text-amber-400">${ingrediente.precioBase.toFixed(2)}</td>
                <td className="px-4 py-3 text-green-400">${ingrediente.precioExtra.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">{ingrediente.disponible ? 'Si' : 'No'}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => toast.info('Editar no implementado aun')} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">Editar</button>
                  <button onClick={() => handleEliminar(ingrediente._id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {ingredientes.map((ingrediente) => (
          <div key={ingrediente._id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-semibold text-sm">{ingrediente.nombre}</span>
              <span className="text-xs text-gray-400">{ingrediente.categoria}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <span>{ingrediente.inventario.cantidad} {ingrediente.inventario.unidad}</span>
              <span className="text-amber-400">${ingrediente.precioBase.toFixed(2)}</span>
              <span className={ingrediente.disponible ? 'text-green-400' : 'text-red-400'}>{ingrediente.disponible ? 'Disponible' : 'No disponible'}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.info('Editar no implementado aun')} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Editar</button>
              <button onClick={() => handleEliminar(ingrediente._id)} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">Eliminar</button>
            </div>
          </div>
        ))}
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
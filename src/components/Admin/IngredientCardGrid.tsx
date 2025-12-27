'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface IngredientCardGridProps {
  onEditar?: (ingrediente: IngredienteFetch) => void;
  onEliminar?: (id: string) => void;
}

export default function IngredientCardGrid({
  onEditar,
  onEliminar,
}: IngredientCardGridProps) {
  const router = useRouter();
  const [ingredientes, setIngredientes] = useState<IngredienteFetch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null); // ← NUEVO

  // Marcar cuando el componente está montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar ingredientes desde la API (SOLO en el cliente)
  useEffect(() => {
    if (!mounted) return;

    const fetchIngredientes = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('No hay token. Por favor, haz login primero.');
          setLoading(false);
          return;
        }

        console.log('Token encontrado:', token.substring(0, 20) + '...');

        const res = await fetch('/api/ingredientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);

        if (!res.ok) {
          throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
        }

        if (!data.success) {
          throw new Error(data.error || 'Error desconocido');
        }

        setIngredientes(data.data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientes();
  }, [mounted]);

  const handleEliminar = async (id: string) => {
    if (confirm('¿Estás seguro que quieres eliminar este ingrediente? Esta acción no se puede deshacer.')) {
      setEliminando(id); // ← NUEVO - Mostrar loading

      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          alert('❌ No hay sesión iniciada');
          setEliminando(null);
          return;
        }

        console.log('🗑️ Enviando DELETE para ID:', id);

        const res = await fetch(`/api/ingredientes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('📦 Respuesta DELETE:', data);

        if (!res.ok || !data.ok) {
          throw new Error(data.error || `Error ${res.status}`);
        }

        console.log('✅ Ingrediente eliminado exitosamente');

        // Eliminar de la lista local
        setIngredientes(ingredientes.filter((ing) => ing._id !== id));

        // Ejecutar callback si existe
        if (onEliminar) {
          onEliminar(id);
        }

        alert('✅ Ingrediente eliminado exitosamente');

        // Refresca la página después de 1 segundo
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } catch (error: any) {
        console.error('❌ Error al eliminar:', error);
        alert(`❌ Error: ${error.message}`);
      } finally {
        setEliminando(null); // ← NUEVO
      }
    }
  };

  const handleEditar = (ingrediente: IngredienteFetch) => {
    if (onEditar) {
      onEditar(ingrediente);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400 text-lg">Cargando ingredientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

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
        const isDeleting = eliminando === ingrediente._id;

        return (
          <div
            key={ingrediente._id}
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
              {/* Categoría */}
              <div className="flex justify-between">
                <span className="text-gray-400">Categoría:</span>
                <span className="text-white font-semibold">
                  {ingrediente.categoria}
                </span>
              </div>

              {/* Cantidad */}
              <div className="flex justify-between">
                <span className="text-gray-400">Cantidad:</span>
                <span className="text-white font-semibold">
                  {ingrediente.inventario.cantidad} {ingrediente.inventario.unidad}
                </span>
              </div>

              {/* Precio Base */}
              <div className="flex justify-between">
                <span className="text-gray-400">P. Base:</span>
                <span className="text-amber-400 font-semibold">
                  ${ingrediente.precioBase.toFixed(2)}
                </span>
              </div>

              {/* Precio Extra */}
              <div className="flex justify-between">
                <span className="text-gray-400">P. Extra:</span>
                <span className="text-green-400 font-semibold">
                  ${ingrediente.precioExtra.toFixed(2)}
                </span>
              </div>

              {/* Disponible */}
              <div className="flex justify-between">
                <span className="text-gray-400">Disponible:</span>
                <span className="text-white font-semibold">
                  {ingrediente.disponible ? '✅ Sí' : '❌ No'}
                </span>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditar(ingrediente)}
                  disabled={isDeleting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded font-semibold transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleEliminar(ingrediente._id)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 rounded font-semibold transition"
                >
                  {isDeleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
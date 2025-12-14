'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Ingrediente = {
  _id: string;
  nombre: string;
  categoria: string;
  precioBase: number;
  precioExtra: number;
  disponible: boolean;
  activo: boolean;
};

export default function IngredientesAdminPage() {
  const router = useRouter();
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="p-4">Cargando ingredientes...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Volver al Panel
        </button>
      </div>

      <table className="min-w-full border border-gray-700 text-sm">
        <thead className="bg-gray-900">
          <tr>
            <th className="border border-gray-700 px-2 py-1 text-left">Nombre</th>
            <th className="border border-gray-700 px-2 py-1 text-left">Categoría</th>
            <th className="border border-gray-700 px-2 py-1 text-right">Precio base</th>
            <th className="border border-gray-700 px-2 py-1 text-right">Precio extra</th>
            <th className="border border-gray-700 px-2 py-1 text-center">Disponible</th>
            <th className="border border-gray-700 px-2 py-1 text-center">Activo</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.length > 0 ? (
            ingredientes.map((ing) => (
              <tr key={ing._id} className="hover:bg-gray-900">
                <td className="border border-gray-800 px-2 py-1">{ing.nombre}</td>
                <td className="border border-gray-800 px-2 py-1">{ing.categoria}</td>
                <td className="border border-gray-800 px-2 py-1 text-right">
                  {ing.precioBase.toFixed(2)} €
                </td>
                <td className="border border-gray-800 px-2 py-1 text-right">
                  {ing.precioExtra.toFixed(2)} €
                </td>
                <td className="border border-gray-800 px-2 py-1 text-center">
                  {ing.disponible ? '✅' : '❌'}
                </td>
                <td className="border border-gray-800 px-2 py-1 text-center">
                  {ing.activo ? '✅' : '❌'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border border-gray-800 px-2 py-1 text-center">
                No hay ingredientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
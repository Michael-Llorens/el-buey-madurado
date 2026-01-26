'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import StockPanel from '@/components/dashboard/StockPanel';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { usuario, logout, isAutenticado, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    );
  }

  if (!isAutenticado) {
    return null; // La redirección la hace ProtectedRoute
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-amber-400">🍽️ Dashboard</h1>
          <p className="text-gray-400 mt-2">Bienvenido, {usuario?.email}</p>
          <p className="text-gray-500 text-sm">Rol: <span className="capitalize text-amber-300">{usuario?.rol}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      <StockPanel />
    </div>
  );
}
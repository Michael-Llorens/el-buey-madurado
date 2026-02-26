'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardShell({
  children,
  showBackToDashboard = false,
}: {
  children: React.ReactNode;
  showBackToDashboard?: boolean;
}) {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">🍔 El Buey Madurado</h1>
            <p className="text-amber-100 mt-2">Panel de Administración</p>
          </div>

          <div className="text-right">
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition text-sm"
            >
              🔓 Logout
            </button>

            <p className="text-xl font-semibold">{usuario?.email || 'Cargando...'}</p>
            <p className="text-xm text-gray-200 mt-1">Rol: {usuario?.rol || '...'}</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="px-6 py-8">
        {showBackToDashboard && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

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
      <div className="bg-gray-900 px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">El Buey Madurado</h1>
            <p className="text-amber-100 text-sm sm:text-base mt-1">Panel de Administracion</p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-sm sm:text-base font-semibold truncate max-w-[180px] sm:max-w-none">{usuario?.email || 'Cargando...'}</p>
              <p className="text-xs text-gray-300">Rol: {usuario?.rol || '...'}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition text-sm shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
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
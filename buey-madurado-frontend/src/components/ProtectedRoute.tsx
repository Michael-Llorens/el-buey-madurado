'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRol?: string[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRol = ['admin', 'camarero', 'cocinero'] 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAutenticado, usuario, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAutenticado) {
        setError('❌ No hay sesión iniciada. Redirigiendo a login...');
        setShowError(true);
        setTimeout(() => {
          router.push('/login');
        }, 2500);
        return;
      }

      if (usuario && !requiredRol.includes(usuario.rol)) {
        setError('❌ No tienes permiso para acceder a esta página.');
        setShowError(true);
        setTimeout(() => {
          router.push('/');
        }, 2500);
        return;
      }
    }
  }, [isAutenticado, usuario, loading, router, requiredRol]);

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // ❌ ERROR - Sin sesión
  if (showError && error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-600 text-center max-w-md shadow-lg">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <p className="text-gray-300 mb-6 text-sm">
            {!isAutenticado 
              ? 'Serás redirigido automáticamente a la página de login en unos segundos...' 
              : 'No tienes los permisos necesarios para acceder aquí.'}
          </p>
          <button
            onClick={() => router.push(isAutenticado ? '/' : '/login')}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
          >
            Ir a {isAutenticado ? 'Inicio' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  // ✅ AUTENTICADO - Mostrar contenido
  if (!isAutenticado) {
    return null;
  }

  if (usuario && !requiredRol.includes(usuario.rol)) {
    return null;
  }

  return <>{children}</>;
}
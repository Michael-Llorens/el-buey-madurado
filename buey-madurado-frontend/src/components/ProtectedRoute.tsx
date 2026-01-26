'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!loading && !isAutenticado) {
      router.push('/admin/login');
    }

    if (!loading && usuario && !requiredRol.includes(usuario.rol)) {
      router.push('/');
    }
  }, [isAutenticado, usuario, loading, router, requiredRol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAutenticado) {
    return null;
  }

  if (usuario && !requiredRol.includes(usuario.rol)) {
    return null;
  }

  return <>{children}</>;
}
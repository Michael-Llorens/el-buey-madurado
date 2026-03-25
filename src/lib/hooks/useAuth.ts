'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  rol: 'admin' | 'camarero' | 'cocinero';
}

export function useAuth() {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Verificar sesión al cargar: si hay token, obtener datos del usuario via /api/auth/me
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('authToken');
    if (!tokenGuardado) {
      setLoading(false);
      return;
    }

    setToken(tokenGuardado);

    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${tokenGuardado}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUsuario(data.data);
        } else {
          // Token inválido o expirado — limpiar
          localStorage.removeItem('authToken');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);

      if (res.success && res.data?.token) {
        localStorage.setItem('authToken', res.data.token);
        setToken(res.data.token);
        setUsuario(res.data.usuario);
        return { success: true, usuario: res.data.usuario };
      }

      return { success: false, error: res.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUsuario(null);
    // Borrar cookie httpOnly via endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  return {
    usuario,
    token,
    loading,
    login,
    logout,
    isAutenticado: !!token,
  };
}
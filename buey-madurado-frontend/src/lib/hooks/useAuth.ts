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

  // Verificar token al cargar
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('authToken');
    if (tokenGuardado) {
      setToken(tokenGuardado);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);

      if (res.success && res.data?.token) {
        localStorage.setItem('authToken', res.data.token);
        setToken(res.data.token);
        setUsuario(res.data.usuario);
        return { success: true };
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
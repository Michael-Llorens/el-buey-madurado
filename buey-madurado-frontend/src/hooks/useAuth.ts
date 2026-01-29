'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useAuth() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        setUsuario(decoded);
      } catch (error) {
        console.error('Token inválido');
      }
    }
  }, []);

  return { usuario };
}
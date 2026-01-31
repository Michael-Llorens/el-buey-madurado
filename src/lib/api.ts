import { connectDB } from '@/lib/db';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  await connectDB();
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  ingredientes: {
    list: () => apiFetch('/api/ingredientes'),
    create: (data: any) => apiFetch('/api/ingredientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/api/ingredientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/api/ingredientes/${id}`, { method: 'DELETE' }),
  },
  productos: {
    list: () => apiFetch('/api/productos'),
    create: (data: any) => apiFetch('/api/productos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/api/productos/${id}`, { method: 'DELETE' }),
  },
};
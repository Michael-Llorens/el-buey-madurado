import { ApiResponse } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils/errors';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// ========== FETCH CON TOKEN ==========
export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') 
    : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  return fetch(url, {
    ...options,
    headers
  });
}

// ========== API REQUEST CON RESPUESTA TIPADA ==========
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithToken(`${API_BASE}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error de red' }));
      return { 
        success: false, 
        error: error.error || getErrorMessage(error) || 'Error desconocido' 
      };
    }

    return response.json();
  } catch (err) {
    return { 
      success: false, 
      error: getErrorMessage(err) || 'Error de conexión' 
    };
  }
}

// ========== API ESPECÍFICAS POR RECURSO ==========
export const ingredientesApi = {
  list: () => apiRequest('/ingredientes'),
  getById: (id: string) => apiRequest(`/ingredientes/${id}`),
  create: (data: any) => 
    apiRequest('/ingredientes', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: any) => 
    apiRequest(`/ingredientes/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    apiRequest(`/ingredientes/${id}`, { method: 'DELETE' }),
};

export const productosApi = {
  list: () => apiRequest('/productos'),
  getById: (id: string) => apiRequest(`/productos/${id}`),
  create: (data: any) => 
    apiRequest('/productos', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: any) => 
    apiRequest(`/productos/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    apiRequest(`/productos/${id}`, { method: 'DELETE' }),
};

export const mesasApi = {
  list: () => apiRequest('/mesas'),
  create: (data: any) => apiRequest('/mesas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/mesas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/mesas/${id}`, { method: 'DELETE' }),
};

export const pedidosApi = {
  list: () => apiRequest('/pedidos'),
  create: (data: any) => apiRequest('/pedidos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/pedidos/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  login: (email: string, password: string) => 
    apiRequest('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    }),
  register: (email: string, password: string, rol: string) => 
    apiRequest('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify({ email, password, rol }) 
    }),
};
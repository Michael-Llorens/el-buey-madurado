'use client';

/**
 * Fetcher genérico para SWR con inyección automática del token JWT.
 * Lee el token de localStorage y lo envía como Authorization header.
 * Lanza un error si la respuesta no es ok o si success === false.
 */
export async function authFetcher<T = any>(url: string): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Error ${res.status}`);
  }

  return json.data;
}

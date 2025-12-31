// Cliente que auto-adjunta Bearer token en todas las requests

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
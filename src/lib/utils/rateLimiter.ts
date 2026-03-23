/**
 * Rate limiter simple basado en Map en memoria.
 * Limita intentos por IP en una ventana de tiempo.
 *
 * Nota: en entornos serverless (Vercel), cada instancia tiene su propio Map.
 * Para rate limiting distribuido se necesitaría Redis/KV.
 * Este enfoque es suficiente para protección básica contra fuerza bruta.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Verifica si una IP ha excedido el límite de intentos.
 * @returns null si está dentro del límite, o un objeto con error si se excedió.
 */
export function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000 // 1 minuto por defecto
): { limited: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(ip);

  // Primera petición o ventana expirada
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  // Dentro de la ventana
  entry.count++;

  if (entry.count > maxAttempts) {
    return {
      limited: true,
      retryAfterMs: entry.resetAt - now,
    };
  }

  return { limited: false };
}

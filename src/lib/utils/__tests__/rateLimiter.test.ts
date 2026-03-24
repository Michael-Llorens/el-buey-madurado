import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mockear timers para evitar el setInterval global del módulo
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
});

describe('checkRateLimit', () => {
  it('permite la primera petición', async () => {
    const { checkRateLimit } = await import('../rateLimiter');
    const result = checkRateLimit('192.168.1.1');
    expect(result.limited).toBe(false);
  });

  it('permite hasta maxAttempts peticiones', async () => {
    const { checkRateLimit } = await import('../rateLimiter');
    const ip = '10.0.0.1';

    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(ip, 5, 60_000).limited).toBe(false);
    }
  });

  it('bloquea la petición que excede maxAttempts', async () => {
    const { checkRateLimit } = await import('../rateLimiter');
    const ip = '10.0.0.2';

    // 5 permitidas
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip, 5, 60_000);
    }

    // La 6ª debe estar limitada
    const result = checkRateLimit(ip, 5, 60_000);
    expect(result.limited).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('resetea el contador después de la ventana de tiempo', async () => {
    const { checkRateLimit } = await import('../rateLimiter');
    const ip = '10.0.0.3';

    // Agotar el límite
    for (let i = 0; i < 6; i++) {
      checkRateLimit(ip, 5, 60_000);
    }
    expect(checkRateLimit(ip, 5, 60_000).limited).toBe(true);

    // Avanzar el tiempo más allá de la ventana
    vi.advanceTimersByTime(61_000);

    // Debe permitir de nuevo
    expect(checkRateLimit(ip, 5, 60_000).limited).toBe(false);
  });

  it('IPs diferentes tienen contadores independientes', async () => {
    const { checkRateLimit } = await import('../rateLimiter');

    // Agotar el límite de una IP
    for (let i = 0; i < 6; i++) {
      checkRateLimit('ip-a', 5, 60_000);
    }
    expect(checkRateLimit('ip-a', 5, 60_000).limited).toBe(true);

    // Otra IP debe estar libre
    expect(checkRateLimit('ip-b', 5, 60_000).limited).toBe(false);
  });
});

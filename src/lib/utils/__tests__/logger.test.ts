import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper para asignar NODE_ENV sin errores de tipos (read-only en @types/node)
function setNodeEnv(value: string) {
  (process.env as Record<string, string>).NODE_ENV = value;
}

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    setNodeEnv(originalEnv ?? 'test');
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('en desarrollo: log y warn escriben en consola', async () => {
    setNodeEnv('development');
    const { logger } = await import('../logger');

    logger.log('test log');
    logger.warn('test warn');

    expect(console.log).toHaveBeenCalledWith('test log');
    expect(console.warn).toHaveBeenCalledWith('test warn');
  });

  it('en producción: log y warn están silenciados', async () => {
    setNodeEnv('production');
    const { logger } = await import('../logger');

    logger.log('should not appear');
    logger.warn('should not appear');

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('error siempre escribe en consola (incluso en producción)', async () => {
    setNodeEnv('production');
    const { logger } = await import('../logger');

    logger.error('critical error');

    expect(console.error).toHaveBeenCalledWith('critical error');
  });
});

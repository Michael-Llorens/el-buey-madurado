/**
 * Extrae un mensaje legible de cualquier valor lanzado.
 * Usar en bloques catch para evitar `error: any`.
 */
export function getErrorMessage(error: unknown, fallback = 'Error inesperado'): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return fallback;
}

/**
 * Extrae un código de error si existe (e.g. errores Mongoose con `.code`).
 */
export function getErrorCode(error: unknown): string | number | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === 'string' || typeof code === 'number') return code;
  }
  return undefined;
}

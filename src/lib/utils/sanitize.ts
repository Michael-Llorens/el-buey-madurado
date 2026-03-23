/**
 * Sanitiza un string escapando caracteres HTML peligrosos.
 * Previene XSS almacenado en campos de texto.
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitiza recursivamente todos los campos string de un objeto.
 * Preserva la estructura, tipos numéricos, booleanos, arrays, etc.
 */
export function sanitizeBody<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
            ? sanitizeBody(item)
            : item
      );
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

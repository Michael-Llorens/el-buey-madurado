import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeBody } from '../sanitize';

// ============================================================
// sanitizeString
// ============================================================

describe('sanitizeString', () => {
  it('escapa los 5 caracteres HTML peligrosos', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('escapa & correctamente (antes que los demás)', () => {
    expect(sanitizeString('A & B')).toBe('A &amp; B');
  });

  it('escapa comillas simples', () => {
    expect(sanitizeString("it's")).toBe('it&#x27;s');
  });

  it('devuelve string vacío sin cambios', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('no modifica texto sin caracteres peligrosos', () => {
    expect(sanitizeString('Hola mundo 123')).toBe('Hola mundo 123');
  });
});

// ============================================================
// sanitizeBody
// ============================================================

describe('sanitizeBody', () => {
  it('sanitiza strings en primer nivel', () => {
    const result = sanitizeBody({ nombre: '<b>test</b>', edad: 25 });
    expect(result.nombre).toBe('&lt;b&gt;test&lt;/b&gt;');
    expect(result.edad).toBe(25);
  });

  it('sanitiza strings anidados en objetos', () => {
    const result = sanitizeBody({
      direccion: { calle: '<script>x</script>', numero: 5 },
    });
    expect(result.direccion.calle).toBe('&lt;script&gt;x&lt;/script&gt;');
    expect(result.direccion.numero).toBe(5);
  });

  it('sanitiza strings dentro de arrays', () => {
    const result = sanitizeBody({ tags: ['<a>', 'normal'] });
    expect(result.tags).toEqual(['&lt;a&gt;', 'normal']);
  });

  it('sanitiza objetos dentro de arrays', () => {
    const result = sanitizeBody({
      items: [{ nota: '<em>bold</em>', qty: 2 }],
    });
    expect(result.items[0].nota).toBe('&lt;em&gt;bold&lt;/em&gt;');
    expect(result.items[0].qty).toBe(2);
  });

  it('preserva booleanos, números y null dentro de arrays', () => {
    const result = sanitizeBody({ mixed: [true, 42, null] });
    expect(result.mixed).toEqual([true, 42, null]);
  });

  it('preserva fechas sin modificarlas', () => {
    const date = new Date('2026-01-01');
    const result = sanitizeBody({ createdAt: date });
    expect(result.createdAt).toBe(date);
  });

  it('devuelve null/undefined sin error', () => {
    expect(sanitizeBody(null as any)).toBeNull();
    expect(sanitizeBody(undefined as any)).toBeUndefined();
  });
});

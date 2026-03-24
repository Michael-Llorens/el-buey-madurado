import { describe, it, expect } from 'vitest';
import { validarObjectId } from '../validateId';

describe('validarObjectId', () => {
  it('devuelve null para un ObjectId válido de 24 hex chars', () => {
    expect(validarObjectId('507f1f77bcf86cd799439011')).toBeNull();
  });

  it('devuelve NextResponse 400 para un ID vacío', () => {
    const result = validarObjectId('');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('devuelve NextResponse 400 para un ID con caracteres no hex', () => {
    const result = validarObjectId('not-a-valid-id-xxxxxx');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('devuelve NextResponse 400 para un ID demasiado corto', () => {
    const result = validarObjectId('abc123');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });
});

import { describe, it, expect } from 'vitest';
import { normalizarPedido } from '../pedidoService';

describe('normalizarPedido', () => {
  it('mapea campo camarero a creadoPor cuando creadoPor no existe', () => {
    const doc = { camarero: { nombre: 'Juan', email: 'j@test.com' } };
    const result = normalizarPedido(doc);
    expect(result.creadoPor).toEqual({ nombre: 'Juan', email: 'j@test.com' });
  });

  it('no sobreescribe creadoPor si ya existe', () => {
    const doc = {
      camarero: { nombre: 'Juan' },
      creadoPor: { nombre: 'María' },
    };
    const result = normalizarPedido(doc);
    expect(result.creadoPor).toEqual({ nombre: 'María' });
  });

  it('llama a toObject() si el documento tiene ese método (Mongoose doc)', () => {
    const mongooseDoc = {
      toObject: () => ({
        _id: '123',
        camarero: { nombre: 'Ana' },
        tipo: 'local',
      }),
    };
    const result = normalizarPedido(mongooseDoc);
    expect(result._id).toBe('123');
    expect(result.creadoPor).toEqual({ nombre: 'Ana' });
    expect(result.tipo).toBe('local');
  });

  it('devuelve null si el documento es null', () => {
    expect(normalizarPedido(null)).toBeNull();
  });

  it('devuelve undefined si el documento es undefined', () => {
    expect(normalizarPedido(undefined)).toBeUndefined();
  });

  it('preserva todos los demás campos del documento', () => {
    const doc = {
      _id: 'abc',
      tipo: 'domicilio',
      productos: [{ nombre: 'Pizza' }],
      camarero: 'user-id',
      total: 25.5,
    };
    const result = normalizarPedido(doc);
    expect(result.tipo).toBe('domicilio');
    expect(result.productos).toEqual([{ nombre: 'Pizza' }]);
    expect(result.total).toBe(25.5);
    expect(result.creadoPor).toBe('user-id');
  });

  it('no añade creadoPor si camarero tampoco existe', () => {
    const doc = { _id: '123', tipo: 'recoger' };
    const result = normalizarPedido(doc);
    expect(result.creadoPor).toBeUndefined();
  });
});

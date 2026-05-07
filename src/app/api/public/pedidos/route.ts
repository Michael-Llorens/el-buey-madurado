import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { validarProductosYObtenerPrecios } from '@/lib/services/pedidoService';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

// ===========================
// Rate limiting en memoria
// ===========================
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function checkPublicRateLimit(ip: string): { limited: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  entry.count++;

  if (entry.count > RATE_LIMIT_MAX) {
    return { limited: true, retryAfterMs: entry.resetAt - now };
  }

  return { limited: false };
}

// ===========================
// POST - Crear pedido público (recoger / domicilio)
// ===========================
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    const rateCheck = checkPublicRateLimit(ip);
    if (rateCheck.limited) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
        },
        { status: 429 }
      );
    }

    await connectDB();

    const body = sanitizeBody(await req.json());

    // Validar tipo (solo recoger o domicilio)
    const tipo = body.tipo;
    if (tipo !== 'recoger' && tipo !== 'domicilio') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Tipo de pedido no válido. Solo se permiten: recoger, domicilio',
        },
        { status: 400 }
      );
    }

    // Validar cliente
    if (!body.cliente || typeof body.cliente !== 'string' || body.cliente.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Nombre del cliente requerido' },
        { status: 400 }
      );
    }

    if (body.cliente.length > 100) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'El nombre del cliente no puede superar los 100 caracteres' },
        { status: 400 }
      );
    }

    // Validar teléfono
    if (!body.telefono || typeof body.telefono !== 'string' || body.telefono.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Teléfono requerido' },
        { status: 400 }
      );
    }

    // Validar productos
    if (!Array.isArray(body.productos) || body.productos.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Debe incluir al menos un producto' },
        { status: 400 }
      );
    }

    // Validar dirección para domicilio
    if (tipo === 'domicilio') {
      if (!body.direccionEntrega) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Dirección de entrega requerida para pedidos a domicilio',
          },
          { status: 400 }
        );
      }

      const { calle, numero, ciudad, codigoPostal, telefono: telEntrega } = body.direccionEntrega;

      if (!calle || !numero || !ciudad || !codigoPostal || !telEntrega) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'La dirección debe incluir: calle, número, ciudad, código postal y teléfono',
          },
          { status: 400 }
        );
      }
    }

    // Validar productos y obtener precios desde BD
    const productosConPrecios = await validarProductosYObtenerPrecios(body.productos);

    const gastoEnvio = tipo === 'domicilio' ? 3.5 : 0;

    // Método de pago: por defecto 'efectivo' (pagar al recoger / contraentrega)
    const metodoPago = body.metodoPago === 'tarjeta' ? 'tarjeta' : 'efectivo';

    const nuevoPedido = new Pedido({
      tipo,
      direccionEntrega: tipo === 'domicilio' ? body.direccionEntrega : undefined,
      productos: productosConPrecios,
      cliente: body.cliente.trim(),
      telefono: body.telefono.trim(),
      notas: body.notas || '',
      descuento: 0,
      gastoEnvio,
      metodoPago,
    });

    nuevoPedido.calcularTotales();
    await nuevoPedido.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          _id: nuevoPedido._id,
          total: nuevoPedido.total,
          estado: nuevoPedido.estado,
          tipo: nuevoPedido.tipo,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('Error en POST /api/public/pedidos:', message);

    // Errores de validación de productos se devuelven como 400
    if (message.includes('no encontrado') || message.includes('no disponible')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

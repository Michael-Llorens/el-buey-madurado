import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import '@/lib/models/Producto';
import '@/lib/models/Ingrediente';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { validarProductosYObtenerPrecios } from '@/lib/services/pedidoService';
import { ApiResponse } from '@/lib/types';

async function getStripe() {
  const Stripe = (await import('stripe')).default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada');
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' as const });
}

// Rate limiting simple
const requestMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestMap.get(ip);
  if (!entry || now > entry.resetAt) {
    requestMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// POST - Crear Payment Intent (NO crea el pedido todavía)
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Demasiadas solicitudes. Intenta en unos minutos.' },
        { status: 429 }
      );
    }

    await connectDB();
    const body = sanitizeBody(await req.json());

    // Validar tipo
    const tipo = body.tipo;
    if (!tipo || !['recoger', 'domicilio'].includes(tipo)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tipo de pedido inválido.' },
        { status: 400 }
      );
    }

    if (!body.cliente || !body.telefono) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Nombre y teléfono son obligatorios.' },
        { status: 400 }
      );
    }

    if (tipo === 'domicilio') {
      const dir = body.direccionEntrega;
      if (!dir?.calle || !dir?.numero || !dir?.ciudad || !dir?.codigoPostal) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Dirección de entrega incompleta.' },
          { status: 400 }
        );
      }
    }

    if (!body.productos || !Array.isArray(body.productos) || body.productos.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'El pedido debe tener al menos un producto.' },
        { status: 400 }
      );
    }

    // Validar productos y calcular precios desde la BD
    const productosConPrecios = await validarProductosYObtenerPrecios(body.productos);

    const gastoEnvio = tipo === 'domicilio' ? 3.5 : 0;

    // Calcular total sin crear pedido
    const subtotal = productosConPrecios.reduce((sum: number, p: { subtotal: number }) => sum + p.subtotal, 0);
    const impuestos = Math.round(subtotal * 0.21 * 100) / 100;
    const totalFinal = Math.round((subtotal + impuestos + gastoEnvio) * 100) / 100;
    const totalCentimos = Math.round(totalFinal * 100);

    // Crear Payment Intent en Stripe (sin crear pedido)
    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCentimos,
      currency: 'eur',
      metadata: {
        cliente: body.cliente,
        tipo,
        // Guardar los datos del pedido para crearlo después del pago
        pedidoData: JSON.stringify({
          tipo,
          productos: body.productos,
          cliente: body.cliente,
          telefono: body.telefono,
          direccionEntrega: tipo === 'domicilio' ? body.direccionEntrega : undefined,
          notas: body.notas || '',
          gastoEnvio,
        }),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        total: totalFinal,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en POST /api/public/checkout:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import '@/lib/models/Producto';
import '@/lib/models/Ingrediente';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

async function getStripe() {
  const Stripe = (await import('stripe')).default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada');
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' as const });
}

// POST - Confirmar pago y activar pedido (cambia estado pendiente_pago → pendiente)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { paymentIntentId } = body;
    if (!paymentIntentId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'paymentIntentId requerido' },
        { status: 400 }
      );
    }

    // 1️⃣ Verificar con Stripe que el pago se completó
    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `El pago no se ha completado. Estado: ${paymentIntent.status}` },
        { status: 400 }
      );
    }

    // 2️⃣ Recuperar el pedidoId del metadata (creado en /api/public/checkout)
    const pedidoId = paymentIntent.metadata.pedidoId;
    if (!pedidoId || !mongoose.Types.ObjectId.isValid(pedidoId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'PaymentIntent sin pedidoId válido en metadata' },
        { status: 400 }
      );
    }

    // 3️⃣ Buscar el pedido (creado previamente con estado pendiente_pago)
    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // 4️⃣ Idempotencia: si el pedido ya está activo (no en pendiente_pago), devolver tal cual
    if (pedido.estado !== 'pendiente_pago') {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          _id: pedido._id,
          estado: pedido.estado,
          total: pedido.total,
          tipo: pedido.tipo,
        },
        message: 'Pedido ya estaba confirmado.',
      });
    }

    // 5️⃣ Activar el pedido: pendiente_pago → pendiente
    pedido.estado = 'pendiente';
    await pedido.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        _id: pedido._id,
        estado: pedido.estado,
        total: pedido.total,
        tipo: pedido.tipo,
      },
      message: 'Pago confirmado. Pedido activado.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('Error en POST /api/public/checkout/confirm:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import '@/lib/models/Producto';
import '@/lib/models/Ingrediente';
import { validarProductosYObtenerPrecios } from '@/lib/services/pedidoService';
import { ApiResponse } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

// POST - Confirmar pago y crear pedido
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

    // Verificar con Stripe que el pago se completó
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `El pago no se ha completado. Estado: ${paymentIntent.status}` },
        { status: 400 }
      );
    }

    // Recuperar datos del pedido de los metadata
    const pedidoData = JSON.parse(paymentIntent.metadata.pedidoData || '{}');

    if (!pedidoData.productos || pedidoData.productos.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Datos del pedido no encontrados en el pago' },
        { status: 400 }
      );
    }

    // Verificar que no se haya creado ya un pedido para este pago
    const pedidoExistente = await Pedido.findOne({ 'notas': { $regex: paymentIntentId } });
    if (pedidoExistente) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          _id: pedidoExistente._id,
          estado: pedidoExistente.estado,
          total: pedidoExistente.total,
          tipo: pedidoExistente.tipo,
        },
        message: 'Pedido ya creado anteriormente.',
      });
    }

    // Validar productos y calcular precios desde la BD
    const productosConPrecios = await validarProductosYObtenerPrecios(pedidoData.productos);

    // Ahora sí crear el pedido (pago confirmado)
    const nuevoPedido = new Pedido({
      tipo: pedidoData.tipo,
      productos: productosConPrecios,
      cliente: pedidoData.cliente?.slice(0, 100) || '',
      telefono: pedidoData.telefono?.slice(0, 20) || '',
      direccionEntrega: pedidoData.tipo === 'domicilio' ? pedidoData.direccionEntrega : undefined,
      notas: pedidoData.notas ? `${pedidoData.notas} | Pago: ${paymentIntentId}` : `Pago: ${paymentIntentId}`,
      gastoEnvio: pedidoData.gastoEnvio || 0,
      estado: 'pendiente',
      metodoPago: 'tarjeta',
    });

    nuevoPedido.calcularTotales();
    await nuevoPedido.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        _id: nuevoPedido._id,
        estado: nuevoPedido.estado,
        total: nuevoPedido.total,
        tipo: nuevoPedido.tipo,
      },
      message: 'Pago confirmado y pedido creado.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en POST /api/public/checkout/confirm:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

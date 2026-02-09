import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import Pedido from '@/lib/models/Pedido';
import { protegerRuta } from '@/lib/middlewareAuth';
import type { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const body = await req.json();
    const mesaId = body?.mesaId;

    if (!mesaId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'mesaId requerido' },
        { status: 400 }
      );
    }

    const mesa = await Mesa.findById(mesaId).select('_id pedidoActual estado').lean();
    if (!mesa) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    // Si ya hay pedido abierto asociado, devolvemos ese
    if (mesa.pedidoActual) {
      return NextResponse.json<ApiResponse>({ success: true, data: { pedidoId: String(mesa.pedidoActual) } });
    }

    const payload = auth?.payload;
    const userId = payload?.userId ?? payload?.id ?? payload?.uid ?? null;

    // Creamos pedido local "vacío" para esa mesa
    const nuevoPedido = new Pedido({
      tipo: 'local',
      mesa: new mongoose.Types.ObjectId(mesaId),
      productos: [],
      camarero: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      descuento: 0,
      gastoEnvio: 0,
    });

    // Por si tu modelo lo requiere
    if (typeof (nuevoPedido as any).calcularTotales === 'function') {
      (nuevoPedido as any).calcularTotales();
    }

    await nuevoPedido.save();

    await Mesa.findByIdAndUpdate(mesaId, {
      estado: 'ocupada',
      pedidoActual: nuevoPedido._id,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { pedidoId: String(nuevoPedido._id) } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/pedidos/abrir:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
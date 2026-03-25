import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { validarObjectId } from '@/lib/utils/validateId';
import { liberarMesa, normalizarPedido } from '@/lib/services/pedidoService';

type Ctx = { params: Promise<{ id: string }> };

// ===========================
// PUT - Cobrar un pedido
// ===========================
export async function PUT(req: NextRequest, context: Ctx) {
  try {
    await connectDB();

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const body = await req.json();
    const { metodoPago, importeRecibido } = body;

    if (!metodoPago || !['efectivo', 'tarjeta', 'mixto'].includes(metodoPago)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Método de pago inválido. Debe ser: efectivo, tarjeta o mixto' },
        { status: 400 }
      );
    }

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    if (pedido.estado === 'cancelado') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No se puede cobrar un pedido cancelado' },
        { status: 400 }
      );
    }

    if (pedido.estado === 'pagado') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Este pedido ya está pagado' },
        { status: 400 }
      );
    }

    // Calcular cambio para pago en efectivo
    let cambio: number | undefined;
    if (metodoPago === 'efectivo' && importeRecibido !== undefined) {
      const recibido = parseFloat(importeRecibido);
      if (isNaN(recibido) || recibido < pedido.total) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'El importe recibido es insuficiente' },
          { status: 400 }
        );
      }
      cambio = Math.round((recibido - pedido.total) * 100) / 100;
    }

    // Actualizar pedido
    pedido.estado = 'pagado';
    pedido.metodoPago = metodoPago;
    await pedido.save();

    // Si es pedido local, liberar la mesa
    if (pedido.tipo === 'local' && pedido.mesa) {
      await liberarMesa(pedido.mesa);
    }

    const pedidoActualizado = await Pedido.findById(id)
      .populate('mesa', 'nombre numero capacidad')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email rol');

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        ...normalizarPedido(pedidoActualizado),
        cambio,
      },
      message: 'Pedido cobrado exitosamente',
    });
  } catch (error: any) {
    console.error('Error en PUT /api/pedidos/[id]/cobrar:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Producto from '@/lib/models/Producto';
import { ApiResponse } from '@/lib/types';
import { validarObjectId } from '@/lib/utils/validateId';
import { logger } from '@/lib/utils/logger';

// Forzar registro del modelo Producto para populate
void Producto;

type Ctx = { params: Promise<{ id: string }> };

// ===========================
// GET - Consultar estado de pedido (público, sin auth)
// ===========================
export async function GET(_req: NextRequest, context: Ctx) {
  try {
    await connectDB();

    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const pedido = await Pedido.findById(id)
      .select('_id estado tipo createdAt total productos')
      .populate('productos.producto', 'nombre precio');

    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Mapear productos para exponer solo nombre y cantidad
    const obj = pedido.toObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productosResumen = obj.productos.map((p: any) => ({
      producto: { nombre: p.producto?.nombre ?? 'Producto eliminado' },
      cantidad: p.cantidad,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        _id: obj._id,
        estado: obj.estado,
        tipo: obj.tipo,
        createdAt: (obj as unknown as Record<string, unknown>).createdAt,
        total: obj.total,
        productos: productosResumen,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('Error en GET /api/public/pedidos/[id]:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

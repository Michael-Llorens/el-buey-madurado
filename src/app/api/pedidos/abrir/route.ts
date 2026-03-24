import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { protegerRuta } from '@/lib/middlewareAuth';
import type { ApiResponse } from '@/lib/types';
import { abrirPedidoParaMesa } from '@/lib/services/pedidoService';

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

    const payload = auth?.payload;
    const userId = payload?.userId ?? payload?.id ?? payload?.uid ?? null;

    const result = await abrirPedidoParaMesa(mesaId, userId);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { pedidoId: result.pedidoId } },
      { status: result.created ? 201 : 200 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/pedidos/abrir:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

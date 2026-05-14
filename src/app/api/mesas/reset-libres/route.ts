import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import { protegerRutaPorRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

/**
 * POST /api/mesas/reset-libres
 *
 * Mantenimiento: para todas las mesas en estado 'libre' con comensalesActuales > 0
 * (incoherencia heredada de versiones anteriores), las pone a 0.
 *
 * Solo admin. Se puede ejecutar las veces que haga falta sin efectos secundarios.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRutaPorRol(req, ['admin']);
    if (!auth.valido) return auth.response!;

    const result = await Mesa.updateMany(
      { estado: 'libre', comensalesActuales: { $gt: 0 } },
      { $set: { comensalesActuales: 0, pedidoActual: null } }
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { modificadas: result.modifiedCount, encontradas: result.matchedCount },
      message: `${result.modifiedCount} mesas corregidas (de ${result.matchedCount} con incoherencia).`,
    });
  } catch (error) {
    logger.error('Error en POST /api/mesas/reset-libres:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

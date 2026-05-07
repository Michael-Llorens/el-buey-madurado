import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Producto from '@/lib/models/Producto';
import '@/lib/models/Ingrediente';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

// ===========================
// GET - Listar productos disponibles (público, sin auth)
// ===========================
export async function GET() {
  try {
    await connectDB();

    const productos = await Producto.find({ disponible: true, activo: true })
      .populate('ingredientes.ingrediente', 'nombre alergenos precioExtra')
      .sort({ categoria: 1, nombre: 1 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: productos,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('Error en GET /api/public/productos:', message);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

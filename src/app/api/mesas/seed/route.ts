import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

// ===========================
// POST - Crear 15 mesas iniciales
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    // Verificar si ya existen mesas
    const mesasExistentes = await Mesa.countDocuments();
    
    if (mesasExistentes > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Ya existen ${mesasExistentes} mesas en el sistema`,
        },
        { status: 400 }
      );
    }

    // Crear 15 mesas de 4 comensales
    const mesas = [];
    for (let i = 1; i <= 15; i++) {
      mesas.push({
        numero: i,
        capacidad: 4,
        estado: 'libre',
        activa: true,
      });
    }

    const mesasCreadas = await Mesa.insertMany(mesas);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: mesasCreadas,
        message: '15 mesas creadas exitosamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/mesas/seed:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

// ===========================
// GET - Listar todas las mesas
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    const mesas = await Mesa.find()
      .sort({ numero: 1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesas,
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/mesas:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===========================
// POST - Crear nueva mesa
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    const body = await req.json();

    console.log('📦 Body recibido:', JSON.stringify(body, null, 2));

    const nuevaMesa = new Mesa(body);
    await nuevaMesa.save();

    console.log('✅ Mesa creada:', nuevaMesa);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: nuevaMesa,
        message: 'Mesa creada exitosamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/mesas:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
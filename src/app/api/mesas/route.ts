import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import Pedido from '@/lib/models/Pedido';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

// ===========================
// GET - Listar todas las mesas
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    void Pedido; // asegurar registro del modelo antes del populate

    const mesas = await Mesa.find()
      .populate('pedidoActual', '_id tipo estado createdAt')
      .sort({ nombre: 1 });

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

    const nuevaMesa = new Mesa(body);
    await nuevaMesa.save();

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
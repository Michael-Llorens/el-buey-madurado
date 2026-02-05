import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

// GET /api/ingredientes  -> lista
export async function GET(request: NextRequest) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();

    const ingredientes = await Ingrediente.find({}).lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingredientes,
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/ingredientes:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/ingredientes -> crear
export async function POST(request: NextRequest) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'No tienes permiso para crear ingredientes' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const ingredienteCreado = await Ingrediente.create(body);

    return NextResponse.json<ApiResponse>(
      { success: true, data: ingredienteCreado },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/ingredientes:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

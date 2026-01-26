import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  // ✅ PROTEGER - Cualquier usuario autenticado
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();
    
    const ingredientes = await Ingrediente.find({ activo: true })
      .sort({ nombre: 1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingredientes,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // ✅ PROTEGER - Solo admin y cocinero
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para crear ingredientes',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    
    const ingrediente = new Ingrediente(body);
    await ingrediente.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingrediente,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
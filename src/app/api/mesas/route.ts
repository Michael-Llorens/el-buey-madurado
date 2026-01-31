import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();
    const mesas = await Mesa.find({ activo: true })
      .sort({ numero: 1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesas,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para crear mesas',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const mesa = new Mesa(body);
    await mesa.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesa,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
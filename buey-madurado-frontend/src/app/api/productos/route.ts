import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Producto from '@/lib/models/Producto';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  // 🆕 SOLO ADMIN VE LISTA
  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Solo administradores ven stock',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const productos = await Producto.find({ activo: true })
      .sort({ nombre: 1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: productos,
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

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para crear productos',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const producto = new Producto(body);
    await producto.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: producto,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
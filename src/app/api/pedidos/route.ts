import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();
    const pedidos = await Pedido.find({ activo: true })
      .populate('mesa')
      .populate('productos.producto')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedidos,
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

  if (!verificarRol(auth.payload!, ['admin', 'camarero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para crear pedidos',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const pedido = new Pedido(body);
    await pedido.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedido,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
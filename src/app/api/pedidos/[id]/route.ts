import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    const { id } = await params;  // Resolver Promise
    await connectDB();
    const pedido = await Pedido.findById(id)
      .populate('mesa')
      .populate('productos.producto')
      .lean();

    if (!pedido) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Pedido no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedido,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'camarero', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar pedidos',
    }, { status: 403 });
  }

  try {
    const { id } = await params;  // Resolver Promise
    await connectDB();
    const body = await request.json();
    const pedido = await Pedido.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!pedido) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Pedido no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedido,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para eliminar pedidos',
    }, { status: 403 });
  }

  try {
    const { id } = await params;  // Resolver Promise
    await connectDB();
    const pedido = await Pedido.findByIdAndDelete(id).lean();

    if (!pedido) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Pedido no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedido,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
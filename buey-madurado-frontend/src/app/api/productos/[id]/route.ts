import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Producto from '@/lib/models/Producto';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();
    const producto = await Producto.findById(params.id).lean();

    if (!producto) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Producto no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: producto,
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
  { params }: { params: { id: string } }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar productos',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const producto = await Producto.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!producto) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Producto no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: producto,
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
  { params }: { params: { id: string } }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para eliminar productos',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const producto = await Producto.findByIdAndDelete(params.id).lean();

    if (!producto) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Producto no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: producto,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
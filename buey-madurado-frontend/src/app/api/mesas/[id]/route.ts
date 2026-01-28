import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Mesa from '@/lib/models/Mesa';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    const resolvedParams = await params;  // Resolver la Promise aquí
    await connectDB();
    const mesa = await Mesa.findById(resolvedParams.id).lean();

    if (!mesa) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Mesa no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesa,
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

  if (!verificarRol(auth.payload!, ['admin', 'camarero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar mesas',
    }, { status: 403 });
  }

  try {
    const resolvedParams = await params;  // Resolver la Promise aquí
    await connectDB();
    const body = await request.json();
    const mesa = await Mesa.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!mesa) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Mesa no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesa,
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
      error: 'No tienes permiso para eliminar mesas',
    }, { status: 403 });
  }

  try {
    const resolvedParams = await params;  // Resolver la Promise aquí
    await connectDB();
    const mesa = await Mesa.findByIdAndDelete(resolvedParams.id).lean();

    if (!mesa) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Mesa no encontrada',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesa,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
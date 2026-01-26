import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  // ✅ PROTEGER
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    await connectDB();
    const ingrediente = await Ingrediente.findById(params.id).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ingrediente no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingrediente,
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
  // ✅ PROTEGER - Solo admin
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar ingredientes',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();
    
    const ingrediente = await Ingrediente.findByIdAndUpdate(
      params.id, 
      body, 
      { new: true, runValidators: true }
    ).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ingrediente no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingrediente,
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
  // ✅ PROTEGER - Solo admin
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para eliminar ingredientes',
    }, { status: 403 });
  }

  try {
    await connectDB();
    
    const ingrediente = await Ingrediente.findByIdAndDelete(params.id).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ingrediente no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ingrediente,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mesa from '@/lib/models/Mesa';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

// ===========================
// PUT - Actualizar mesa
// ===========================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← CAMBIO Next.js 16
) {
  try {
    await connectDB();
    await protegerRuta(req);

    const body = await req.json();
    const { id } = await params;  // ← CAMBIO Next.js 16

    if (!id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'ID de mesa requerido',
        },
        { status: 400 }
      );
    }

    const mesaActualizada = await Mesa.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!mesaActualizada) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Mesa no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesaActualizada,
      message: 'Mesa actualizada exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en PUT /api/mesas:', error);
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
// DELETE - Eliminar mesa
// ===========================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← CAMBIO Next.js 16
) {
  try {
    await connectDB();
    await protegerRuta(req);

    const { id } = await params;  // ← CAMBIO Next.js 16

    if (!id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'ID de mesa requerido',
        },
        { status: 400 }
      );
    }

    const mesaEliminada = await Mesa.findByIdAndDelete(id);

    if (!mesaEliminada) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Mesa no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Mesa eliminada exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en DELETE /api/mesas:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

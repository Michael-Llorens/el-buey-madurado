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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await protegerRuta(req);

    const rawBody = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID de mesa requerido' },
        { status: 400 }
      );
    }

    const update: any = {};

    if (typeof rawBody.nombre === 'string') update.nombre = rawBody.nombre.trim();
    if (rawBody.estado) update.estado = rawBody.estado;
    if (typeof rawBody.activa === 'boolean') update.activa = rawBody.activa;

    const capacidad =
      rawBody.capacidad !== undefined ? Math.trunc(Number(rawBody.capacidad)) : undefined;
    const comensales =
      rawBody.comensalesActuales !== undefined
        ? Math.trunc(Number(rawBody.comensalesActuales))
        : undefined;

    if (capacidad !== undefined) {
      if (!Number.isFinite(capacidad) || capacidad < 1 || capacidad > 20) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Capacidad inválida (1-20)' },
          { status: 400 }
        );
      }
      update.capacidad = capacidad;
    }

    if (comensales !== undefined) {
      if (!Number.isFinite(comensales) || comensales < 0) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Comensales inválidos' },
          { status: 400 }
        );
      }
      update.comensalesActuales = comensales;
    }

    if (capacidad !== undefined && comensales !== undefined && comensales > capacidad) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Comensales no puede superar la capacidad (${capacidad})` },
        { status: 400 }
      );
    }

    if (capacidad === undefined && comensales !== undefined) {
      const mesa = await Mesa.findById(id).select('capacidad').lean();
      if (!mesa) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Mesa no encontrada' },
          { status: 404 }
        );
      }
      if (comensales > mesa.capacidad) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Comensales no puede superar la capacidad (${mesa.capacidad})` },
          { status: 400 }
        );
      }
    }

    const mesaActualizada = await Mesa.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!mesaActualizada) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesaActualizada,
      message: 'Mesa actualizada exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en PUT /api/mesas/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===========================
// DELETE - Eliminar mesa
// ===========================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await protegerRuta(req);

    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID de mesa requerido' },
        { status: 400 }
      );
    }

    const mesaEliminada = await Mesa.findByIdAndDelete(id);

    if (!mesaEliminada) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    // ✅ IMPORTANTE: devolver JSON para que el frontend pueda hacer res.json()
    return NextResponse.json<ApiResponse>({
      success: true,
      data: mesaEliminada,
      message: 'Mesa eliminada exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en DELETE /api/mesas/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
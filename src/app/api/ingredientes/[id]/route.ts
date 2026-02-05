import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

type Ctx = { params: Promise<{ id: string }> }; // Next 15: params es Promise [web:366]

export async function GET(request: NextRequest, { params }: Ctx) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    const { id } = await params; // ✅ obligatorio en Next 15 [web:366]
    await connectDB();

    const ingrediente = await Ingrediente.findById(id).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: ingrediente });
  } catch (error: any) {
    console.error('❌ Error en GET /api/ingredientes/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'No tienes permiso para actualizar ingredientes' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params; // ✅ obligatorio en Next 15 [web:366]
    await connectDB();

    const body = await request.json();

    const ingrediente = await Ingrediente.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: ingrediente });
  } catch (error: any) {
    console.error('❌ Error en PUT /api/ingredientes/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'No tienes permiso para eliminar ingredientes' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params; // ✅ obligatorio en Next 15 [web:366]
    await connectDB();

    const ingrediente = await Ingrediente.findByIdAndDelete(id).lean();

    if (!ingrediente) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: ingrediente });
  } catch (error: any) {
    console.error('❌ Error en DELETE /api/ingredientes/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

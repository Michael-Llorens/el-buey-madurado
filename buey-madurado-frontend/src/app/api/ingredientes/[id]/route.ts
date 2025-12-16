import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Ingrediente from '@/app/api/models/Ingredientes';
import { Types } from 'mongoose';
import { validarToken, extraerTokenDelHeader } from '@/lib/auth';

// ✅ CORRECTO PARA NEXT.JS 16 - Updated: 16/12/2025

// GET - OBTENER UN INGREDIENTE POR ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const ingrediente = await Ingrediente.findById(id);

    if (!ingrediente) {
      return NextResponse.json(
        { ok: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: ingrediente });
  } catch (error: any) {
    console.error('❌ Error en GET:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - EDITAR UN INGREDIENTE
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authHeader = req.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = validarToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!ingredienteActualizado) {
      return NextResponse.json(
        { ok: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Ingrediente actualizado exitosamente',
      data: ingredienteActualizado,
    });
  } catch (error: any) {
    console.error('❌ Error en PUT:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - ELIMINAR INGREDIENTE DE LA BASE DE DATOS
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🗑️ DELETE request recibido para ID:', id);

    const authHeader = req.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = validarToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const ingredienteEliminado = await Ingrediente.findByIdAndDelete(id);

    console.log('📦 Resultado:', ingredienteEliminado ? 'Eliminado' : 'No encontrado');

    if (!ingredienteEliminado) {
      return NextResponse.json(
        { ok: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Ingrediente eliminado exitosamente',
      data: ingredienteEliminado,
    });
  } catch (error: any) {
    console.error('❌ Error en DELETE:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
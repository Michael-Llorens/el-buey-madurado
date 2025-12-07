import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Ingrediente from '@/app/api/models/Ingredientes';
import { Types } from 'mongoose';

// GET - OBTENER UN INGREDIENTE POR ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const ingrediente = await Ingrediente.findById(id);

    if (!ingrediente) {
      return NextResponse.json(
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ingrediente });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
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
    
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
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
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ingrediente actualizado exitosamente',
      data: ingredienteActualizado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - DESACTIVAR INGREDIENTE (SOFT DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const ingredienteDesactivado = await Ingrediente.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!ingredienteDesactivado) {
      return NextResponse.json(
        { success: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ingrediente desactivado exitosamente',
      data: ingredienteDesactivado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
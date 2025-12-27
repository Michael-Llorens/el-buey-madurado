import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Producto from '@/app/api/models/Product';
import { Types } from 'mongoose';

// GET - OBTENER UN PRODUCTO POR ID
export async function GET(
  _req: NextRequest,
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

    const producto = await Producto.findById(id)
      .populate('ingredientes.ingrediente')
      .populate('ingredientesExtra');

    if (!producto) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: producto });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - EDITAR UN PRODUCTO
export async function PUT(
  _req: NextRequest,
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

    const body = await _req.json();
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate('ingredientes.ingrediente')
      .populate('ingredientesExtra');

    if (!productoActualizado) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - DESACTIVAR PRODUCTO (SOFT DELETE)
export async function DELETE(
  _req: NextRequest,
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

    const productoDesactivado = await Producto.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    )
      .populate('ingredientes.ingrediente')
      .populate('ingredientesExtra');

    if (!productoDesactivado) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Producto desactivado exitosamente',
      data: productoDesactivado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
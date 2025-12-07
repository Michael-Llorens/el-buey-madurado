import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Product from '@/app/api/models/Product';
import { Types } from 'mongoose';

// ============================================
// GET - OBTENER UN PRODUCTO POR ID
// ============================================
// Endpoint: GET /api/productos/507f1f77bcf86cd799439020
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Buscar producto y populate todos los ingredientes
    const producto = await Product.findById(params.id)
      .populate('ingredientes.ingrediente')
      .populate('ingredientesExtra');

    if (!producto) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: producto,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - EDITAR UN PRODUCTO
// ============================================
// Endpoint: PUT /api/productos/507f1f77bcf86cd799439020
// Body: (puedes actualizar cualquier campo)
// {
//   "precio": 18.00,
//   "disponible": false
// }
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Actualizar y populate automáticamente
    const productoActualizado = await Product.findByIdAndUpdate(
      params.id,
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

// ============================================
// DELETE - DESACTIVAR UN PRODUCTO (SOFT DELETE)
// ============================================
// Endpoint: DELETE /api/productos/507f1f77bcf86cd799439020
// 
// ⚠️ SOFT DELETE: Marcamos como inactivo, no borramos
// Razón: Conservar histórico de pedidos
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Marcar como inactivo
    const productoDesactivado = await Product.findByIdAndUpdate(
      params.id,
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
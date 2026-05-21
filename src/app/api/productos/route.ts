import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Producto from '@/lib/models/Producto';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta, protegerRutaPorRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

// ===========================
// GET - Listar todos los productos
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRuta(req);
    if (!auth.valido) return auth.response!;

    void Ingrediente;

    const productos = await Producto.find()
      .populate('ingredientes.ingrediente', 'nombre categoria')
      .sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: productos,
    });
  } catch (error) {
    logger.error('❌ Error en GET /api/productos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// ===========================
// POST - Crear nuevo producto
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRutaPorRol(req, ['admin']);
    if (!auth.valido) return auth.response!;

    const body = sanitizeBody(await req.json());

    // ✅ CONVERSIÓN: String → ObjectId
    if (body.ingredientes && Array.isArray(body.ingredientes)) {
      body.ingredientes = body.ingredientes.map((ing: any) => ({
        ingrediente: new mongoose.Types.ObjectId(ing.ingrediente),
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      }));
    }

    const nuevoProducto = new Producto(body);
    await nuevoProducto.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: nuevoProducto,
        message: 'Producto creado exitosamente',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('❌ Error en POST /api/productos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// ===========================
// PUT - Actualizar producto existente
// ===========================
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRutaPorRol(req, ['admin']);
    if (!auth.valido) return auth.response!;

    const body = await req.json();
    const { id, ...datosActualizados } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'ID de producto requerido',
        },
        { status: 400 }
      );
    }

    // ✅ CONVERSIÓN: String → ObjectId (para actualización también)
    if (datosActualizados.ingredientes && Array.isArray(datosActualizados.ingredientes)) {
      datosActualizados.ingredientes = datosActualizados.ingredientes.map((ing: any) => ({
        ingrediente: new mongoose.Types.ObjectId(ing.ingrediente),
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      }));
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: productoActualizado,
      message: 'Producto actualizado exitosamente',
    });
  } catch (error) {
    logger.error('❌ Error en PUT /api/productos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// ===========================
// DELETE - Eliminar producto
// ===========================
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRutaPorRol(req, ['admin']);
    if (!auth.valido) return auth.response!;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'ID de producto requerido',
        },
        { status: 400 }
      );
    }

    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    logger.error('❌ Error en DELETE /api/productos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
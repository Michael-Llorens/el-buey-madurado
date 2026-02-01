import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Producto from '@/lib/models/Producto';
import Ingrediente from '@/lib/models/Ingrediente';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';

// ===========================
// GET - Listar todos los productos
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    // ✅ FORZAR REGISTRO (evita warning de TypeScript)
    void Ingrediente;

    const productos = await Producto.find()
      .populate('ingredientes.ingrediente', 'nombre categoria')
      .sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: productos,
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/productos:', error);
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
// POST - Crear nuevo producto
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    const body = await req.json();

    console.log('📦 Body recibido:', JSON.stringify(body, null, 2));

    // ✅ CONVERSIÓN: String → ObjectId
    if (body.ingredientes && Array.isArray(body.ingredientes)) {
      body.ingredientes = body.ingredientes.map((ing: any) => ({
        ingrediente: new mongoose.Types.ObjectId(ing.ingrediente),
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      }));
      console.log('✅ Ingredientes convertidos:', body.ingredientes);
    }

    const nuevoProducto = new Producto(body);
    await nuevoProducto.save();

    console.log('✅ Producto guardado:', nuevoProducto);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: nuevoProducto,
        message: 'Producto creado exitosamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/productos:', error);
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
// PUT - Actualizar producto existente
// ===========================
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

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
  } catch (error: any) {
    console.error('❌ Error en PUT /api/productos:', error);
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
// DELETE - Eliminar producto
// ===========================
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

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
  } catch (error: any) {
    console.error('❌ Error en DELETE /api/productos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
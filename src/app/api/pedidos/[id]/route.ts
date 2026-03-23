import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Producto from '@/lib/models/Producto';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { validarObjectId } from '@/lib/utils/validateId';
import { sanitizeBody } from '@/lib/utils/sanitize';
import mongoose from 'mongoose';
import { normalizarPedido, liberarMesa } from '@/lib/services/pedidoService';

type Ctx = { params: Promise<{ id: string }> };

// ===========================
// GET - Obtener un pedido específico
// ===========================
export async function GET(req: NextRequest, context: Ctx) {
  try {
    await connectDB();

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const pedido = await Pedido.findById(id)
      .populate('mesa', 'numero capacidad estado')
      .populate('productos.producto', 'nombre precio imagen descripcion')
      .populate('camarero', 'nombre email rol'); // ✅ añade rol

    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: normalizarPedido(pedido),
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/pedidos/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===========================
// PUT - Actualizar pedido
// ===========================
export async function PUT(req: NextRequest, context: Ctx) {
  try {
    await connectDB();

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const body = sanitizeBody(await req.json());
    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    // Si se actualizan productos, recalcular precios
    if (body.productos) {
      const productosConPrecios = await Promise.all(
        body.productos.map(async (item: any) => {
          const producto = await Producto.findById(item.producto);
          if (!producto) throw new Error(`Producto ${item.producto} no encontrado`);

          const precioUnitario = item.precioUnitario || producto.precio;
          const subtotal = precioUnitario * item.cantidad;

          return {
            producto: new mongoose.Types.ObjectId(item.producto),
            cantidad: item.cantidad,
            precioUnitario,
            subtotal,
            notas: item.notas || '',
            personalizaciones: item.personalizaciones || {},
          };
        })
      );

      pedido.productos = productosConPrecios;
    }

    if (body.estado) pedido.estado = body.estado;
    if (body.cliente !== undefined) pedido.cliente = body.cliente;
    if (body.notas !== undefined) pedido.notas = body.notas;
    if (body.descuento !== undefined) pedido.descuento = body.descuento;
    if (body.metodoPago) pedido.metodoPago = body.metodoPago;

    pedido.calcularTotales();
    await pedido.save();

    // ✅ Liberar mesa si aplica (solo local)
    if (
      (body.estado === 'pagado' || body.estado === 'entregado' || body.estado === 'cancelado') &&
      pedido.tipo === 'local' &&
      pedido.mesa
    ) {
      await liberarMesa(pedido.mesa);
    }

    const pedidoActualizado = await Pedido.findById(id)
      .populate('mesa', 'numero capacidad')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email rol'); // ✅ añade rol

    return NextResponse.json<ApiResponse>({
      success: true,
      data: normalizarPedido(pedidoActualizado),
      message: 'Pedido actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en PUT /api/pedidos/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===========================
// DELETE - Cancelar pedido
// ===========================
export async function DELETE(req: NextRequest, context: Ctx) {
  try {
    await connectDB();

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    pedido.estado = 'cancelado';
    await pedido.save();

    if (pedido.tipo === 'local' && pedido.mesa) {
      await liberarMesa(pedido.mesa);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Pedido cancelado exitosamente',
    });
  } catch (error: any) {
    console.error('❌ Error en DELETE /api/pedidos/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

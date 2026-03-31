import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Producto from '@/lib/models/Producto';
import Ingrediente from '@/lib/models/Ingrediente';
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
    void Producto; void Ingrediente; // asegurar registro para populate anidado

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    const { id } = await context.params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    const pedido = await Pedido.findById(id)
      .populate('mesa', 'nombre numero capacidad estado')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio imagen descripcion ingredientes',
        populate: { path: 'ingredientes.ingrediente', select: 'nombre alergenos' },
      })
      .populate('camarero', 'nombre email rol');

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

    // Actualizar estado de un producto individual (solo para pedidos locales)
    if (body.productoIndex !== undefined && body.estadoProducto) {
      const idx = Number(body.productoIndex);
      if (idx >= 0 && idx < pedido.productos.length) {
        (pedido.productos as any)[idx].estadoProducto = body.estadoProducto;
        pedido.markModified('productos');

        // Si el pedido está pendiente, pasarlo a preparando automáticamente
        if (pedido.estado === 'pendiente') {
          pedido.estado = 'preparando';
        }

        // Guardar primero para que el populate funcione con datos actualizados
        await pedido.save();

        // Si todos los productos de cocina (no bebidas) están listos, el pedido pasa a "listo"
        const productosPoblados = await Pedido.findById(id).populate('productos.producto', 'categoria');
        if (productosPoblados) {
          const productosCocina = productosPoblados.productos.filter((p: any) => {
            const cat = (p.producto as any)?.categoria?.toLowerCase() ?? '';
            return cat !== 'bebidas';
          });
          const todosListos = productosCocina.length > 0 && productosCocina.every((p: any) => p.estadoProducto === 'listo');
          if (todosListos) {
            pedido.estado = 'listo';
            await pedido.save();
          }
        }

        // Devolver respuesta aquí (no seguir con el save de abajo)
        const pedidoActualizado = await Pedido.findById(id)
          .populate('mesa', 'nombre numero capacidad')
          .populate({
            path: 'productos.producto',
            select: 'nombre precio imagen categoria ingredientes',
            populate: { path: 'ingredientes.ingrediente', select: 'nombre alergenos' },
          })
          .populate('camarero', 'nombre email rol');

        return NextResponse.json<ApiResponse>({
          success: true,
          data: normalizarPedido(pedidoActualizado),
          message: 'Estado del plato actualizado',
        });
      }
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
      .populate('mesa', 'nombre numero capacidad')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio imagen categoria ingredientes',
        populate: { path: 'ingredientes.ingrediente', select: 'nombre alergenos' },
      })
      .populate('camarero', 'nombre email rol');

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

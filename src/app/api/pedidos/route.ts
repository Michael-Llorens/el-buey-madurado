import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Mesa from '@/lib/models/Mesa';
import Producto from '@/lib/models/Producto';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta, protegerRutaPorRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/utils/pagination';
import { normalizarPedido, ocuparMesa, validarProductosYObtenerPrecios } from '@/lib/services/pedidoService';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

// ===========================
// GET - Listar todos los pedidos
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await protegerRuta(req);
    if (!auth.valido) return auth.response!;

    // Forzar registro de modelos
    void Mesa;
    void Producto;
    void Usuario;

    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const mesaId = searchParams.get('mesa');
    const tipo = searchParams.get('tipo');

    const filtros: any = {};
    if (estado) {
      // Soportar múltiples estados separados por coma: ?estado=pendiente,preparando
      filtros.estado = estado.includes(',') ? { $in: estado.split(',') } : estado;
    } else {
      // Por defecto NO mostrar pedidos en pendiente_pago (aún no confirmados por Stripe)
      filtros.estado = { $ne: 'pendiente_pago' };
    }
    if (mesaId) filtros.mesa = mesaId;
    if (tipo) filtros.tipo = tipo;

    const { page, limit, sort } = getPaginationParams(req);
    const total = await Pedido.countDocuments(filtros);

    // Forzar registro del modelo Ingrediente para el populate anidado
    await import('@/lib/models/Ingrediente');

    const pedidos = await Pedido.find(filtros)
      .populate('mesa', 'nombre numero capacidad estado')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio imagen categoria ingredientes',
        populate: { path: 'ingredientes.ingrediente', select: 'nombre alergenos' },
      })
      .populate('camarero', 'nombre email rol')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: buildPaginatedResponse(pedidos.map(normalizarPedido), total, { page, limit, sort }),
    });
  } catch (error) {
    logger.error('❌ Error en GET /api/pedidos:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// ===========================
// POST - Crear nuevo pedido
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = await protegerRutaPorRol(req, ['admin', 'camarero']);
    if (!auth.valido) return auth.response!;
    const payload = auth.payload!;

    const body = sanitizeBody(await req.json());

    const tipo = body.tipo || 'local';

    // 1️⃣ VALIDAR PEDIDO LOCAL
    if (tipo === 'local') {
      if (!body.mesa) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Mesa requerida para pedidos en local' },
          { status: 400 }
        );
      }

      const mesa = await Mesa.findById(body.mesa);
      if (!mesa) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Mesa no encontrada' },
          { status: 404 }
        );
      }

      if (mesa.estado === 'ocupada') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'La mesa ya está ocupada' },
          { status: 400 }
        );
      }
    }

    // 2️⃣ VALIDAR PEDIDO DOMICILIO
    if (tipo === 'domicilio') {
      if (!body.direccionEntrega) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Dirección de entrega requerida para pedidos a domicilio',
          },
          { status: 400 }
        );
      }

      const { calle, numero, ciudad, codigoPostal, telefono } = body.direccionEntrega;

      if (!calle || !numero || !ciudad || !codigoPostal || !telefono) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error:
              'La dirección debe incluir: calle, número, ciudad, código postal y teléfono',
          },
          { status: 400 }
        );
      }

      if (body.gastoEnvio === undefined || body.gastoEnvio === null) {
        body.gastoEnvio = 3.5;
      }
    }

    // 3️⃣ VALIDAR PEDIDO PARA RECOGER
    if (tipo === 'recoger') {
      if (!body.telefono) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Teléfono requerido para pedidos para recoger' },
          { status: 400 }
        );
      }
    }

    // ✅ VALIDAR PRODUCTOS Y OBTENER PRECIOS
    const productosConPrecios = await validarProductosYObtenerPrecios(body.productos);

    const userId = payload.userId;

    const nuevoPedido = new Pedido({
      tipo,
      mesa: tipo === 'local' && body.mesa ? new mongoose.Types.ObjectId(body.mesa) : undefined,
      direccionEntrega: tipo === 'domicilio' ? body.direccionEntrega : undefined,
      productos: productosConPrecios,

      // ✅ seguimos guardando en "camarero" (BD), pero lo mostraremos como "creadoPor"
      camarero: userId ? new mongoose.Types.ObjectId(userId) : undefined,

      cliente: body.cliente || '',
      telefono: body.telefono || '',
      notas: body.notas || '',
      descuento: body.descuento || 0,
      gastoEnvio: tipo === 'domicilio' ? (body.gastoEnvio ?? 3.5) : 0,
    });

    nuevoPedido.calcularTotales();
    await nuevoPedido.save();

    if (tipo === 'local' && body.mesa) {
      await ocuparMesa(body.mesa, nuevoPedido._id);
    }

    const pedidoCompleto = await Pedido.findById(nuevoPedido._id)
      .populate('mesa', 'nombre numero capacidad')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio imagen categoria ingredientes',
        populate: { path: 'ingredientes.ingrediente', select: 'nombre alergenos' },
      })
      .populate('camarero', 'nombre email rol');

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: normalizarPedido(pedidoCompleto),
        message: `Pedido ${
          tipo === 'local'
            ? 'en local'
            : tipo === 'recoger'
              ? 'para recoger'
              : 'a domicilio'
        } creado exitosamente`,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('❌ Error en POST /api/pedidos:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
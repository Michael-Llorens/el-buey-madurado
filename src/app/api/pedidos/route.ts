import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Mesa from '@/lib/models/Mesa';
import Producto from '@/lib/models/Producto';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';

function normalizarPedido(doc: any) {
  const obj = doc?.toObject ? doc.toObject() : doc;
  if (!obj) return obj;

  // ✅ el front espera creadoPor, pero en BD se llama camarero
  if (!obj.creadoPor && obj.camarero) obj.creadoPor = obj.camarero;

  return obj;
}

// ===========================
// GET - Listar todos los pedidos
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;

    // Forzar registro de modelos
    void Mesa;
    void Producto;
    void Usuario;

    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const mesaId = searchParams.get('mesa');
    const tipo = searchParams.get('tipo');

    const filtros: any = {};
    if (estado) filtros.estado = estado;
    if (mesaId) filtros.mesa = mesaId;
    if (tipo) filtros.tipo = tipo;

    const pedidos = await Pedido.find(filtros)
      .populate('mesa', 'numero capacidad estado')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email rol') // ✅ añade rol
      .sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedidos.map(normalizarPedido),
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/pedidos:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
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

    const auth: any = await protegerRuta(req);
    if (!auth?.valido) return auth?.response!;
    const payload = auth?.payload;

    const body = await req.json();

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
    const productosConPrecios = await Promise.all(
      (body.productos || []).map(async (item: any) => {
        const producto = await Producto.findById(item.producto);
        if (!producto) throw new Error(`Producto ${item.producto} no encontrado`);
        if (!producto.disponible) {
          throw new Error(`Producto "${producto.nombre}" no disponible`);
        }

        const precioUnitario = producto.precio;
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

    const userId =
      payload?.userId || payload?.id || payload?._id || payload?.uid || null;

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
      await Mesa.findByIdAndUpdate(body.mesa, {
        estado: 'ocupada',
        pedidoActual: nuevoPedido._id,
      });
    }

    const pedidoCompleto = await Pedido.findById(nuevoPedido._id)
      .populate('mesa', 'numero capacidad')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email rol'); // ✅ añade rol

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
  } catch (error: any) {
    console.error('❌ Error en POST /api/pedidos:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
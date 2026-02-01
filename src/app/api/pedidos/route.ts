import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Mesa from '@/lib/models/Mesa';
import Producto from '@/lib/models/Producto';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import mongoose from 'mongoose';

// ===========================
// GET - Listar todos los pedidos
// ===========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await protegerRuta(req);

    // Forzar registro de modelos
    void Mesa;
    void Producto;
    void Usuario;

    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');
    const mesaId = searchParams.get('mesa');
    const tipo = searchParams.get('tipo'); // ✅ NUEVO

    // Filtros opcionales
    const filtros: any = {};
    if (estado) filtros.estado = estado;
    if (mesaId) filtros.mesa = mesaId;
    if (tipo) filtros.tipo = tipo; // ✅ NUEVO

    const pedidos = await Pedido.find(filtros)
      .populate('mesa', 'numero capacidad estado')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email')
      .sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: pedidos,
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/pedidos:', error);
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
// POST - Crear nuevo pedido
// ===========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { payload } = await protegerRuta(req);

    const body = await req.json();

    console.log('📦 Body recibido:', JSON.stringify(body, null, 2));

    // ✅ VALIDACIONES SEGÚN TIPO
    const tipo = body.tipo || 'local';

    // 1️⃣ VALIDAR PEDIDO LOCAL
    if (tipo === 'local') {
      if (!body.mesa) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Mesa requerida para pedidos en local',
          },
          { status: 400 }
        );
      }

      const mesa = await Mesa.findById(body.mesa);
      if (!mesa) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Mesa no encontrada',
          },
          { status: 404 }
        );
      }

      if (mesa.estado === 'ocupada') {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'La mesa ya está ocupada',
          },
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
            error: 'La dirección debe incluir: calle, número, ciudad, código postal y teléfono',
          },
          { status: 400 }
        );
      }

      // Establecer gasto de envío si no viene definido
      if (!body.gastoEnvio && body.gastoEnvio !== 0) {
        body.gastoEnvio = 3.50; // Default: 3.50€
      }
    }

    // 3️⃣ VALIDAR PEDIDO PARA RECOGER
    if (tipo === 'recoger') {
      if (!body.telefono) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Teléfono requerido para pedidos para recoger',
          },
          { status: 400 }
        );
      }
    }

    // ✅ VALIDAR PRODUCTOS Y OBTENER PRECIOS
    const productosConPrecios = await Promise.all(
      body.productos.map(async (item: any) => {
        const producto = await Producto.findById(item.producto);
        if (!producto) {
          throw new Error(`Producto ${item.producto} no encontrado`);
        }

        if (!producto.disponible) {
          throw new Error(`Producto "${producto.nombre}" no disponible`);
        }

        const precioUnitario = producto.precio;
        const subtotal = precioUnitario * item.cantidad;

        return {
          producto: new mongoose.Types.ObjectId(item.producto),
          cantidad: item.cantidad,
          precioUnitario: precioUnitario,
          subtotal: subtotal,
          notas: item.notas || '',
          personalizaciones: item.personalizaciones || {}
        };
      })
    );

    // ✅ CREAR PEDIDO
    const nuevoPedido = new Pedido({
      tipo: tipo,
      mesa: tipo === 'local' && body.mesa ? new mongoose.Types.ObjectId(body.mesa) : undefined,
      direccionEntrega: tipo === 'domicilio' ? body.direccionEntrega : undefined,
      productos: productosConPrecios,
      camarero: payload?.userId ? new mongoose.Types.ObjectId(payload.userId) : undefined,
      cliente: body.cliente || '',
      telefono: body.telefono || '',
      notas: body.notas || '',
      descuento: body.descuento || 0,
      gastoEnvio: tipo === 'domicilio' ? (body.gastoEnvio || 3.50) : 0
    });

    // ✅ CALCULAR TOTALES AUTOMÁTICAMENTE
    nuevoPedido.calcularTotales();

    await nuevoPedido.save();

    // ✅ ACTUALIZAR ESTADO DE LA MESA (solo si es pedido local)
    if (tipo === 'local' && body.mesa) {
      await Mesa.findByIdAndUpdate(body.mesa, {
        estado: 'ocupada',
        pedidoActual: nuevoPedido._id
      });
    }

    console.log('✅ Pedido creado:', nuevoPedido);

    // ✅ POPULATE PARA RESPUESTA
    const pedidoCompleto = await Pedido.findById(nuevoPedido._id)
      .populate('mesa', 'numero capacidad')
      .populate('productos.producto', 'nombre precio imagen')
      .populate('camarero', 'nombre email');

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: pedidoCompleto,
        message: `Pedido ${tipo === 'local' ? 'en local' : tipo === 'recoger' ? 'para recoger' : 'a domicilio'} creado exitosamente`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error en POST /api/pedidos:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
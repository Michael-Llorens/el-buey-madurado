import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Pedido from '@/lib/models/Pedido';
import Producto from '@/lib/models/Producto';
import Mesa from '@/lib/models/Mesa';
import { protegerRutaPorRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await protegerRutaPorRol(req, ['admin']);
    if (!auth.valido) return auth.response!;

    // Forzar registro de modelos para populate
    void Producto;
    void Mesa;

    const ahora = new Date();
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    // =============================================
    // 1. Resumen general
    // =============================================
    const [resumen] = await Pedido.aggregate([
      {
        $facet: {
          totales: [
            {
              $group: {
                _id: null,
                totalPedidos: { $sum: 1 },
                ingresosBrutos: { $sum: '$total' },
                descuentosTotales: { $sum: '$descuento' },
                impuestosTotales: { $sum: '$impuestos' },
              },
            },
          ],
          pagados: [
            { $match: { estado: 'pagado' } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                ingresos: { $sum: '$total' },
              },
            },
          ],
          cancelados: [
            { $match: { estado: 'cancelado' } },
            { $count: 'count' },
          ],
          hoy: [
            { $match: { createdAt: { $gte: hoy } } },
            {
              $group: {
                _id: null,
                pedidos: { $sum: 1 },
                ingresos: { $sum: '$total' },
              },
            },
          ],
        },
      },
    ]);

    const totales = resumen.totales[0] ?? { totalPedidos: 0, ingresosBrutos: 0, descuentosTotales: 0, impuestosTotales: 0 };
    const pagados = resumen.pagados[0] ?? { count: 0, ingresos: 0 };
    const cancelados = resumen.cancelados[0]?.count ?? 0;
    const pedidosHoy = resumen.hoy[0] ?? { pedidos: 0, ingresos: 0 };
    const ticketMedio = pagados.count > 0 ? pagados.ingresos / pagados.count : 0;

    // =============================================
    // 2. Pedidos por tipo
    // =============================================
    const porTipo = await Pedido.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          ingresos: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // =============================================
    // 3. Pedidos por estado
    // =============================================
    const porEstado = await Pedido.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // =============================================
    // 4. Top 10 productos más vendidos
    // =============================================
    const topProductos = await Pedido.aggregate([
      { $unwind: '$productos' },
      {
        $group: {
          _id: '$productos.producto',
          cantidadVendida: { $sum: '$productos.cantidad' },
          ingresos: { $sum: '$productos.subtotal' },
        },
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'producto',
        },
      },
      { $unwind: { path: '$producto', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          nombre: { $ifNull: ['$producto.nombre', 'Producto eliminado'] },
          categoria: '$producto.categoria',
          cantidadVendida: 1,
          ingresos: 1,
        },
      },
    ]);

    // =============================================
    // 5. Ingresos últimos 30 días (por día)
    // =============================================
    const ingresosDiarios = await Pedido.aggregate([
      { $match: { createdAt: { $gte: hace30Dias }, estado: 'pagado' } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          ingresos: { $sum: '$total' },
          pedidos: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        resumen: {
          totalPedidos: totales.totalPedidos,
          ingresosPagados: Math.round(pagados.ingresos * 100) / 100,
          pedidosPagados: pagados.count,
          pedidosCancelados: cancelados,
          ticketMedio: Math.round(ticketMedio * 100) / 100,
          descuentosTotales: Math.round(totales.descuentosTotales * 100) / 100,
          impuestosTotales: Math.round(totales.impuestosTotales * 100) / 100,
          pedidosHoy: pedidosHoy.pedidos,
          ingresosHoy: Math.round(pedidosHoy.ingresos * 100) / 100,
        },
        porTipo: porTipo.map((t) => ({
          tipo: t._id,
          count: t.count,
          ingresos: Math.round(t.ingresos * 100) / 100,
        })),
        porEstado: porEstado.map((e) => ({
          estado: e._id,
          count: e.count,
        })),
        topProductos: topProductos.map((p) => ({
          nombre: p.nombre,
          categoria: p.categoria ?? '',
          cantidadVendida: p.cantidadVendida,
          ingresos: Math.round(p.ingresos * 100) / 100,
        })),
        ingresosDiarios: ingresosDiarios.map((d) => ({
          fecha: d._id,
          ingresos: Math.round(d.ingresos * 100) / 100,
          pedidos: d.pedidos,
        })),
      },
    });
  } catch (error) {
    logger.error('Error en GET /api/reportes:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

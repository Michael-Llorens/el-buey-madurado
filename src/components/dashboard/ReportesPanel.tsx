'use client';

import { useReportes } from '@/lib/hooks/swr';

const LABEL_TIPO: Record<string, string> = {
  local: 'En local',
  recoger: 'Para recoger',
  domicilio: 'A domicilio',
};

const LABEL_ESTADO: Record<string, string> = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  listo: 'Listo',
  en_camino: 'En camino',
  servido: 'Servido',
  entregado: 'Entregado',
  pagado: 'Pagado',
  cancelado: 'Cancelado',
};

const COLOR_ESTADO: Record<string, string> = {
  pendiente: 'text-yellow-400',
  preparando: 'text-blue-400',
  listo: 'text-green-400',
  en_camino: 'text-cyan-400',
  servido: 'text-indigo-400',
  entregado: 'text-emerald-400',
  pagado: 'text-green-300',
  cancelado: 'text-red-400',
};

function euro(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

export default function ReportesPanel() {
  const { reportes, error, isLoading } = useReportes();

  if (isLoading) {
    return <div className="text-center text-gray-400 py-12">Cargando reportes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded">
        Error al cargar reportes: {error.message}
      </div>
    );
  }

  if (!reportes) return null;

  const { resumen, porTipo, porEstado, topProductos, ingresosDiarios } = reportes;

  return (
    <div className="space-y-8">
      {/* ============ TARJETAS RESUMEN ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          titulo="Ingresos totales"
          valor={euro(resumen.ingresosPagados)}
          subtitulo={`${resumen.pedidosPagados} pedidos pagados`}
          color="text-green-400"
        />
        <Card
          titulo="Hoy"
          valor={euro(resumen.ingresosHoy)}
          subtitulo={`${resumen.pedidosHoy} pedidos`}
          color="text-amber-400"
        />
        <Card
          titulo="Ticket medio"
          valor={euro(resumen.ticketMedio)}
          subtitulo="por pedido pagado"
          color="text-purple-400"
        />
        <Card
          titulo="Pedidos totales"
          valor={String(resumen.totalPedidos)}
          subtitulo={`${resumen.pedidosCancelados} cancelados`}
          color="text-blue-400"
        />
      </div>

      {/* ============ FILA DOBLE: POR TIPO + POR ESTADO ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por tipo */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Pedidos por tipo</h3>
          {porTipo.length === 0 ? (
            <p className="text-gray-500">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {porTipo.map((t) => (
                <div key={t.tipo} className="flex items-center justify-between">
                  <span className="text-gray-300">{LABEL_TIPO[t.tipo] ?? t.tipo}</span>
                  <div className="text-right">
                    <span className="text-white font-semibold">{t.count}</span>
                    <span className="text-gray-500 text-sm ml-3">{euro(t.ingresos)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Por estado */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Pedidos por estado</h3>
          {porEstado.length === 0 ? (
            <p className="text-gray-500">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {porEstado.map((e) => (
                <div key={e.estado} className="flex items-center justify-between">
                  <span className={COLOR_ESTADO[e.estado] ?? 'text-gray-300'}>
                    {LABEL_ESTADO[e.estado] ?? e.estado}
                  </span>
                  <span className="text-white font-semibold">{e.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ TOP PRODUCTOS ============ */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-4">Top 10 productos</h3>
        {topProductos.length === 0 ? (
          <p className="text-gray-500">Sin datos de ventas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="text-left py-2 pr-4">#</th>
                  <th className="text-left py-2 pr-4">Producto</th>
                  <th className="text-left py-2 pr-4">Categoria</th>
                  <th className="text-right py-2 pr-4">Uds. vendidas</th>
                  <th className="text-right py-2">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProductos.map((p, i) => (
                  <tr key={p.nombre + i} className="border-b border-gray-700/50">
                    <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
                    <td className="py-2 pr-4 text-white font-medium">{p.nombre}</td>
                    <td className="py-2 pr-4 text-gray-400 text-sm">{p.categoria}</td>
                    <td className="py-2 pr-4 text-right text-amber-400 font-semibold">
                      {p.cantidadVendida}
                    </td>
                    <td className="py-2 text-right text-green-400">{euro(p.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ INGRESOS ÚLTIMOS 30 DÍAS ============ */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-4">
          Ingresos - Ultimos 30 dias (pedidos pagados)
        </h3>
        {ingresosDiarios.length === 0 ? (
          <p className="text-gray-500">Sin datos en los ultimos 30 dias</p>
        ) : (
          <div className="space-y-2">
            {/* Barra visual simple */}
            {(() => {
              const maxIngreso = Math.max(...ingresosDiarios.map((d) => d.ingresos), 1);
              return ingresosDiarios.map((d) => (
                <div key={d.fecha} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 w-24 shrink-0">
                    {new Date(d.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${(d.ingresos / maxIngreso) * 100}%` }}
                    />
                  </div>
                  <span className="text-green-400 w-20 text-right shrink-0">
                    {euro(d.ingresos)}
                  </span>
                  <span className="text-gray-500 w-12 text-right shrink-0">
                    {d.pedidos}p
                  </span>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* ============ DETALLE FISCAL ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          titulo="IVA recaudado (21%)"
          valor={euro(resumen.impuestosTotales)}
          subtitulo="sobre todos los pedidos"
          color="text-orange-400"
        />
        <Card
          titulo="Descuentos aplicados"
          valor={euro(resumen.descuentosTotales)}
          subtitulo="total descontado"
          color="text-red-400"
        />
        <Card
          titulo="Envios cobrados"
          valor={euro(
            porTipo.find((t) => t.tipo === 'domicilio')?.ingresos
              ? porTipo.find((t) => t.tipo === 'domicilio')!.ingresos * 0 // placeholder
              : 0
          )}
          subtitulo={`${porTipo.find((t) => t.tipo === 'domicilio')?.count ?? 0} pedidos a domicilio`}
          color="text-cyan-400"
        />
      </div>
    </div>
  );
}

// ============================================================
// Sub-componente Card
// ============================================================

function Card({
  titulo,
  valor,
  subtitulo,
  color,
}: {
  titulo: string;
  valor: string;
  subtitulo: string;
  color: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <p className="text-gray-400 text-xs sm:text-sm mb-1">{titulo}</p>
      <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${color}`}>{valor}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitulo}</p>
    </div>
  );
}

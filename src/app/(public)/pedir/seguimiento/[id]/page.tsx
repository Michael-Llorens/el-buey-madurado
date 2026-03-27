'use client';

import { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

interface PedidoTracking {
  _id: string;
  estado: string;
  tipo: string;
  total: number;
  createdAt: string;
  productos: Array<{ producto: { nombre: string }; cantidad: number }>;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((d) => d.data as PedidoTracking);

const ESTADOS_RECOGER = ['pendiente', 'preparando', 'listo', 'entregado'];
const ESTADOS_DOMICILIO = ['pendiente', 'preparando', 'listo', 'en_camino', 'entregado'];

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Recibido',
  preparando: 'Preparando',
  listo: 'Listo',
  en_camino: 'En camino',
  entregado: 'Entregado',
  pagado: 'Completado',
  cancelado: 'Cancelado',
};

const ESTADO_ICON: Record<string, string> = {
  pendiente: '📋',
  preparando: '👨‍🍳',
  listo: '✅',
  en_camino: '🛵',
  entregado: '🎉',
  pagado: '💳',
  cancelado: '❌',
};

export default function SeguimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pedido, error } = useSWR(`/api/public/pedidos/${id}`, fetcher, {
    refreshInterval: 10_000,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-[#160a00] flex flex-col items-center justify-center pt-20 px-4">
        <p className="text-red-400 text-lg mb-4">Pedido no encontrado</p>
        <Link href="/" className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold">Volver al inicio</Link>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#160a00] flex items-center justify-center pt-20">
        <div className="text-amber-400 animate-pulse">Cargando estado...</div>
      </div>
    );
  }

  const estados = pedido.tipo === 'domicilio' ? ESTADOS_DOMICILIO : ESTADOS_RECOGER;
  const idxActual = estados.indexOf(pedido.estado);
  const esCancelado = pedido.estado === 'cancelado';
  const esCompletado = pedido.estado === 'entregado' || pedido.estado === 'pagado';

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pedido</p>
          <p className="text-3xl font-bold text-amber-400 font-mono mb-2">#{id.slice(-4).toUpperCase()}</p>
          <p className="text-gray-400 text-sm">
            {pedido.tipo === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}
            {' · '}
            {new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Estado actual */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 mb-6 text-center">
          <span className="text-5xl block mb-3">{ESTADO_ICON[pedido.estado] ?? '📋'}</span>
          <p className="text-xl font-bold text-white">{ESTADO_LABEL[pedido.estado] ?? pedido.estado}</p>
          {pedido.estado === 'preparando' && (
            <p className="text-sm text-gray-400 mt-1">Estamos preparando tu pedido</p>
          )}
          {pedido.estado === 'listo' && pedido.tipo === 'recoger' && (
            <p className="text-sm text-green-400 mt-1">Tu pedido está listo para recoger</p>
          )}
          {pedido.estado === 'listo' && pedido.tipo === 'domicilio' && (
            <p className="text-sm text-green-400 mt-1">Tu pedido está listo, pronto saldrá</p>
          )}
          {pedido.estado === 'en_camino' && (
            <p className="text-sm text-cyan-400 mt-1">Tu pedido va de camino</p>
          )}
          {esCompletado && (
            <p className="text-sm text-green-400 mt-1">Gracias por tu pedido</p>
          )}
          {esCancelado && (
            <p className="text-sm text-red-400 mt-1">Este pedido ha sido cancelado</p>
          )}
        </div>

        {/* Progress bar */}
        {!esCancelado && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Línea de fondo */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700" />
              {/* Línea de progreso */}
              <div
                className="absolute top-4 left-0 h-0.5 bg-amber-500 transition-all duration-700"
                style={{ width: `${Math.max(0, (idxActual / (estados.length - 1)) * 100)}%` }}
              />

              {estados.map((estado, idx) => (
                <div key={estado} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / estados.length}%` }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    idx <= idxActual
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-700 text-gray-500'
                  }`}>
                    {idx <= idxActual ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 text-center leading-tight ${
                    idx <= idxActual ? 'text-amber-400 font-semibold' : 'text-gray-600'
                  }`}>
                    {ESTADO_LABEL[estado]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Productos */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Tu pedido</p>
          {pedido.productos.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-300 py-0.5">
              <span className="text-amber-400 font-semibold">{item.cantidad}x</span>{' '}
              {item.producto?.nombre ?? 'Producto'}
            </p>
          ))}
          <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
            <span className="text-white font-bold">Total</span>
            <span className="text-amber-400 font-bold text-lg">{pedido.total.toFixed(2)}€</span>
          </div>
        </div>

        {/* Info */}
        {pedido.tipo === 'recoger' && pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
          <div className="bg-gray-800/40 rounded-xl p-4 text-center text-sm text-gray-400">
            <p className="mb-1">📍 Carrer de la Reina, 41, 46800 Xàtiva</p>
            <p>📞 670 775 786</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-600 animate-pulse">Se actualiza automáticamente cada 10 segundos</p>
        </div>

        <Link href="/" className="block mt-6 text-center text-sm text-gray-500 hover:text-amber-400 transition">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

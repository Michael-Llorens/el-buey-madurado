'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface PedidoData {
  _id: string;
  estado: string;
  tipo: string;
  total: number;
  createdAt: string;
  productos: Array<{ producto: { nombre: string }; cantidad: number }>;
}

export default function ConfirmacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pedido, setPedido] = useState<PedidoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/pedidos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPedido(data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#160a00] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-sm">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        {/* Icono de éxito animado */}
        <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_0.6s_ease-out]">
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">¡Pedido confirmado!</h1>
        <p className="text-gray-400 mb-8">Tu pedido ha sido recibido. Te avisaremos cuando esté listo.</p>

        {/* ID del pedido */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 mb-6 inline-block">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Número de pedido</p>
          <p className="text-4xl font-bold text-amber-400 font-mono">#{id.slice(-4).toUpperCase()}</p>
        </div>

        {/* Tiempo estimado */}
        {pedido && (
          <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl px-5 py-3 mb-6 inline-flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-300">
                Tiempo estimado: {pedido.tipo === 'domicilio' ? '35–50 min' : '20–30 min'}
              </p>
              <p className="text-xs text-gray-500">
                {pedido.tipo === 'recoger'
                  ? 'Te avisaremos cuando esté listo para recoger'
                  : 'Desde la confirmación del pedido'}
              </p>
            </div>
          </div>
        )}

        {/* Detalles */}
        {pedido && (
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 text-left mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-4 pb-3 border-b border-gray-700/50">
              <span className="flex items-center gap-1.5">
                {pedido.tipo === 'recoger' ? '🛍️' : '🛵'}
                <span className="font-medium">{pedido.tipo === 'recoger' ? 'Para recoger' : 'A domicilio'}</span>
              </span>
              <span>{new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="space-y-1.5">
              {pedido.productos.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    <span className="text-amber-400 font-semibold">{item.cantidad}x</span>{' '}
                    {item.producto?.nombre ?? 'Producto'}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-3 flex justify-between items-center">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-400 font-bold text-xl">{pedido.total.toFixed(2)}€</span>
            </div>
          </div>
        )}

        {/* Info recogida */}
        {pedido?.tipo === 'recoger' && (
          <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 mb-6 text-sm text-gray-400">
            <p className="font-semibold text-gray-300 mb-1">📍 Dirección de recogida</p>
            <p>Carrer de la Reina, 41, 46800 Xàtiva</p>
            <p className="mt-1">📞 670 775 786</p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <Link
            href={`/pedir/seguimiento/${id}`}
            className="block w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition text-lg shadow-lg shadow-amber-600/20"
          >
            📍 Seguir estado del pedido
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

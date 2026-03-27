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
        <div className="text-amber-400 animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160a00] pt-20 pb-8">
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Pedido confirmado</h1>
        <p className="text-gray-400 mb-6">Tu pedido ha sido recibido. Te avisaremos cuando esté listo.</p>

        {/* ID del pedido */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 mb-6 inline-block">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Número de pedido</p>
          <p className="text-3xl font-bold text-amber-400 font-mono">#{id.slice(-4).toUpperCase()}</p>
        </div>

        {/* Detalles */}
        {pedido && (
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-left mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-3">
              <span>{pedido.tipo === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}</span>
              <span>{new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {pedido.productos.map((item, idx) => (
              <p key={idx} className="text-sm text-gray-300">
                <span className="text-amber-400 font-semibold">{item.cantidad}x</span> {item.producto?.nombre ?? 'Producto'}
              </p>
            ))}
            <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-400 font-bold text-lg">{pedido.total.toFixed(2)}€</span>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <Link
            href={`/pedir/seguimiento/${id}`}
            className="block w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition"
          >
            Seguir estado del pedido
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

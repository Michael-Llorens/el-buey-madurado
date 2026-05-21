'use client';

import { use, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import gsap from 'gsap';

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

const ESTADO_MSG: Record<string, string> = {
  pendiente: 'Hemos recibido tu pedido y lo estamos procesando',
  preparando: 'Nuestro equipo está preparando tu pedido con todo el cariño',
  listo: 'Tu pedido está listo',
  en_camino: 'Tu pedido va de camino, pronto lo tendrás',
  entregado: '¡Gracias por tu pedido! Esperamos que lo disfrutes',
  pagado: '¡Gracias por tu pedido! Esperamos que lo disfrutes',
  cancelado: 'Este pedido ha sido cancelado. Si tienes dudas, contáctanos',
};

const ESTADO_COLOR: Record<string, string> = {
  pendiente: 'text-blue-400',
  preparando: 'text-orange-400',
  listo: 'text-green-400',
  en_camino: 'text-cyan-400',
  entregado: 'text-green-400',
  pagado: 'text-green-400',
  cancelado: 'text-red-400',
};

const ESTADO_BG: Record<string, string> = {
  pendiente: 'bg-blue-600/10 border-blue-600/20',
  preparando: 'bg-orange-600/10 border-orange-600/20',
  listo: 'bg-green-600/10 border-green-600/20',
  en_camino: 'bg-cyan-600/10 border-cyan-600/20',
  entregado: 'bg-green-600/10 border-green-600/20',
  pagado: 'bg-green-600/10 border-green-600/20',
  cancelado: 'bg-red-600/10 border-red-600/20',
};

export default function SeguimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pedido, error } = useSWR(`/api/public/pedidos/${id}`, fetcher, {
    refreshInterval: (data) => {
      if (!data) return 10_000;
      const estado = (data as PedidoTracking).estado;
      if (estado === 'entregado' || estado === 'pagado' || estado === 'cancelado') return 0;
      return 10_000;
    },
  });

  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const prevEstadoRef = useRef<string | undefined>(undefined);

  // Animate progress bar and dots on state change
  useEffect(() => {
    if (!pedido) return;
    const esCancelado = pedido.estado === 'cancelado';
    if (esCancelado || !progressRef.current || !dotsRef.current) return;

    const estados = pedido.tipo === 'domicilio' ? ESTADOS_DOMICILIO : ESTADOS_RECOGER;
    const idxActual = estados.indexOf(pedido.estado);

    gsap.to(progressRef.current, {
      width: `${Math.max(0, (idxActual / (estados.length - 1)) * 80)}%`,
      duration: 0.8,
      ease: 'power2.out',
    });

    if (prevEstadoRef.current !== pedido.estado) {
      const dots = dotsRef.current.querySelectorAll('.progress-dot');
      const activeDot = dots[idxActual];
      if (activeDot) {
        gsap.fromTo(activeDot, { scale: 0.5 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      }
      prevEstadoRef.current = pedido.estado;
    }
  }, [pedido]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#160a00] flex flex-col items-center justify-center pt-20 px-4 text-center">
        <span className="text-5xl mb-4 block">😕</span>
        <h1 className="text-xl font-bold text-white mb-2">Pedido no encontrado</h1>
        <p className="text-gray-500 text-sm mb-6">No pudimos encontrar este pedido. Verifica el enlace o contacta con nosotros.</p>
        <div className="flex gap-3">
          <a href="tel:670775786" className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition text-sm">
            📞 Llamar
          </a>
          <Link href="/" className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#160a00] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-sm">Cargando estado...</p>
        </div>
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
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seguimiento del pedido</p>
          <p className="text-3xl font-bold text-amber-400 font-mono mb-2">#{id.slice(-4).toUpperCase()}</p>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span>{pedido.tipo === 'recoger' ? '🛍️ Para recoger' : '🛵 A domicilio'}</span>
            <span className="text-gray-600">·</span>
            <span>{new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Estado actual - con colores dinámicos */}
        <div className={`border rounded-2xl p-6 mb-6 text-center ${ESTADO_BG[pedido.estado] || 'bg-gray-800/60 border-gray-700/50'}`}>
          <span className="text-5xl block mb-3">{ESTADO_ICON[pedido.estado] ?? '📋'}</span>
          <p className={`text-xl font-bold ${ESTADO_COLOR[pedido.estado] || 'text-white'}`}>
            {ESTADO_LABEL[pedido.estado] ?? pedido.estado}
          </p>
          <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
            {pedido.estado === 'listo' && pedido.tipo === 'recoger'
              ? '¡Ya puedes pasar a recoger tu pedido!'
              : pedido.estado === 'listo' && pedido.tipo === 'domicilio'
                ? 'Tu pedido está listo, pronto saldrá de camino'
                : ESTADO_MSG[pedido.estado] ?? ''}
          </p>
        </div>

        {/* Progress bar mejorada */}
        {!esCancelado && (
          <div className="mb-8 px-2">
            <div ref={dotsRef} className="flex items-center justify-between relative">
              {/* Línea de fondo */}
              <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-700/80 rounded-full" />
              {/* Línea de progreso — animada con GSAP */}
              <div
                ref={progressRef}
                className="absolute top-5 left-[10%] h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                style={{ width: 0 }}
              />

              {estados.map((estado, idx) => {
                const isActive = idx === idxActual;
                const isCompleted = idx < idxActual;
                return (
                  <div key={estado} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / estados.length}%` }}>
                    <div className={`progress-dot w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      isCompleted
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                        : isActive
                          ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/40 scale-110'
                          : 'bg-gray-800 text-gray-500 border-2 border-gray-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isActive ? (
                        <span className="text-sm">{ESTADO_ICON[estado]}</span>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className={`text-[10px] mt-2 text-center leading-tight font-medium ${
                      isCompleted || isActive ? 'text-amber-400' : 'text-gray-600'
                    }`}>
                      {ESTADO_LABEL[estado]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelado */}
        {esCancelado && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-red-300">
              Si tienes dudas sobre la cancelación, no dudes en contactarnos.
            </p>
            <a href="tel:670775786" className="inline-block mt-3 px-5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm font-semibold transition">
              📞 670 775 786
            </a>
          </div>
        )}

        {/* Productos */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Tu pedido</p>
          <div className="space-y-1.5">
            {pedido.productos.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-300 py-0.5">
                <span>
                  <span className="text-amber-400 font-semibold">{item.cantidad}x</span>{' '}
                  {item.producto?.nombre ?? 'Producto'}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between items-center">
            <span className="text-white font-bold">Total</span>
            <span className="text-amber-400 font-bold text-xl">{pedido.total.toFixed(2)}€</span>
          </div>
        </div>

        {/* Info recogida */}
        {pedido.tipo === 'recoger' && !esCompletado && !esCancelado && (
          <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 text-center text-sm text-gray-400 mb-4">
            <p className="font-semibold text-gray-300 mb-1">📍 Dirección de recogida</p>
            <p>Carrer de la Reina, 41, 46800 Xàtiva</p>
            <a href="tel:670775786" className="text-amber-400 hover:text-amber-300 mt-1 inline-block transition">📞 670 775 786</a>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-6 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-xs text-gray-600">Actualizando en tiempo real</p>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/pedir" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition text-sm">
            Nuevo pedido
          </Link>
          <Link href="/" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

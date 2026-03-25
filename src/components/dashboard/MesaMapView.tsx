'use client';

import { useState, useEffect } from 'react';

interface Mesa {
  _id: string;
  nombre: string;
  capacidad: number;
  comensalesActuales: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  activa: boolean;
  pedidoActual?: { _id: string; tipo?: string; estado?: string; createdAt?: string } | null;
}

interface MesaMapViewProps {
  mesas: Mesa[];
  onHacerPedido: (mesaId: string, pedidoActualId?: string) => void;
  onCambiarEstado: (id: string, nuevoEstado: Mesa['estado']) => void;
}

// Colores suaves para legibilidad
const ESTADO_STYLE = {
  libre: {
    bg: 'bg-green-900/50 hover:bg-green-800/60',
    border: 'border-green-600/40',
    chair: 'bg-green-700/40',
  },
  ocupada: {
    bg: 'bg-red-900/40 hover:bg-red-800/50',
    border: 'border-red-600/40',
    chair: 'bg-red-700/40',
  },
  reservada: {
    bg: 'bg-yellow-900/35 hover:bg-yellow-800/45',
    border: 'border-yellow-600/35',
    chair: 'bg-yellow-700/35',
  },
};

// Semáforo de tiempo: verde < 30min, amarillo 30-60min, rojo > 60min
function getTimeBadge(createdAt?: string): { text: string; color: string } | null {
  if (!createdAt) return null;
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return { text: '<1m', color: 'bg-green-500' };

  const text = mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60}m` : `${mins}m`;

  if (mins < 30) return { text, color: 'bg-green-500' };
  if (mins < 60) return { text, color: 'bg-yellow-500' };
  return { text, color: 'bg-red-500' };
}

// Forma y tamaño según capacidad
function getMesaShape(capacidad: number): { shape: string; size: string } {
  if (capacidad <= 2) return { shape: 'rounded-full', size: 'w-20 h-20 sm:w-24 sm:h-24' };
  if (capacidad <= 4) return { shape: 'rounded-xl', size: 'w-24 h-24 sm:w-28 sm:h-28' };
  if (capacidad <= 6) return { shape: 'rounded-xl', size: 'w-28 h-24 sm:w-32 sm:h-28' };
  if (capacidad <= 8) return { shape: 'rounded-xl', size: 'w-32 h-24 sm:w-36 sm:h-28' };
  return { shape: 'rounded-xl', size: 'w-36 h-26 sm:w-44 sm:h-32' };
}

// Sillas en los 4 lados para mesas grandes
function Sillas({ capacidad, estado }: { capacidad: number; estado: Mesa['estado'] }) {
  const color = ESTADO_STYLE[estado].chair;
  const chairSize = 'w-2 h-2 sm:w-2.5 sm:h-2.5';

  if (capacidad <= 4) {
    const top = Math.ceil(capacidad / 2);
    const bottom = capacidad - top;
    return (
      <>
        <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
          {Array.from({ length: top }).map((_, i) => (
            <div key={`t${i}`} className={`${chairSize} rounded-full ${color}`} />
          ))}
        </div>
        <div className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
          {Array.from({ length: bottom }).map((_, i) => (
            <div key={`b${i}`} className={`${chairSize} rounded-full ${color}`} />
          ))}
        </div>
      </>
    );
  }

  const perSide = Math.ceil(capacidad / 4);
  const top = perSide;
  const bottom = perSide;
  const left = Math.ceil((capacidad - top - bottom) / 2);
  const right = capacidad - top - bottom - left;

  return (
    <>
      <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
        {Array.from({ length: top }).map((_, i) => (
          <div key={`t${i}`} className={`${chairSize} rounded-full ${color}`} />
        ))}
      </div>
      <div className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
        {Array.from({ length: bottom }).map((_, i) => (
          <div key={`b${i}`} className={`${chairSize} rounded-full ${color}`} />
        ))}
      </div>
      {left > 0 && (
        <div className="absolute -left-1.5 sm:-left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 sm:gap-1.5">
          {Array.from({ length: left }).map((_, i) => (
            <div key={`l${i}`} className={`${chairSize} rounded-full ${color}`} />
          ))}
        </div>
      )}
      {right > 0 && (
        <div className="absolute -right-1.5 sm:-right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 sm:gap-1.5">
          {Array.from({ length: right }).map((_, i) => (
            <div key={`r${i}`} className={`${chairSize} rounded-full ${color}`} />
          ))}
        </div>
      )}
    </>
  );
}

export default function MesaMapView({ mesas, onHacerPedido, onCambiarEstado }: MesaMapViewProps) {
  const mesasOrdenadas = [...mesas].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }));

  // Re-render cada minuto para actualizar badges de tiempo
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900/30 rounded-2xl border border-gray-700/40 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-wrap justify-center gap-10 sm:gap-12 lg:gap-14">
        {mesasOrdenadas.map((mesa) => {
          const style = ESTADO_STYLE[mesa.estado];
          const { shape, size } = getMesaShape(mesa.capacidad);
          const timeBadge = mesa.estado === 'ocupada'
            ? getTimeBadge(mesa.pedidoActual?.createdAt)
            : null;

          return (
            <div key={mesa._id} className="relative flex flex-col items-center py-3">
              <div className={`relative ${size}`} style={{ minWidth: 'fit-content', minHeight: 'fit-content' }}>
                <Sillas capacidad={mesa.capacidad} estado={mesa.estado} />

                <button
                  onClick={() => {
                    if (mesa.estado === 'ocupada' && mesa.pedidoActual?._id) {
                      onHacerPedido(mesa._id, mesa.pedidoActual._id);
                    } else if (mesa.estado === 'libre') {
                      onHacerPedido(mesa._id);
                    } else if (mesa.estado === 'reservada') {
                      onCambiarEstado(mesa._id, 'ocupada');
                    }
                  }}
                  className={`
                    w-full h-full ${shape} border ${style.border} ${style.bg}
                    transition-all duration-200 transform hover:scale-105 active:scale-95
                    flex flex-col items-center justify-center gap-0.5
                  `}
                  style={{ minHeight: '48px', minWidth: '48px' }}
                >
                  {/* Nombre */}
                  <span className="text-white font-bold text-sm sm:text-base leading-tight truncate max-w-full px-2">
                    {mesa.nombre}
                  </span>

                  {/* Comensales */}
                  <span className="text-gray-300 text-[10px] sm:text-xs">
                    {mesa.comensalesActuales > 0
                      ? `${mesa.comensalesActuales}/${mesa.capacidad}`
                      : `${mesa.capacidad} plz`}
                  </span>

                  {/* Dot pulsante si ocupada */}
                  {mesa.estado === 'ocupada' && (
                    <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  )}
                </button>

                {/* Badge de tiempo semáforo */}
                {timeBadge && (
                  <span className={`absolute -top-2.5 -right-2.5 ${timeBadge.color} text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg whitespace-nowrap`}>
                    {timeBadge.text}
                  </span>
                )}

                {/* Badge estado pedido */}
                {mesa.estado === 'ocupada' && mesa.pedidoActual?.estado && mesa.pedidoActual.estado !== 'pendiente' && (
                  <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                    mesa.pedidoActual.estado === 'preparando' ? 'bg-blue-500 text-white' :
                    mesa.pedidoActual.estado === 'listo' ? 'bg-emerald-500 text-white' :
                    mesa.pedidoActual.estado === 'servido' ? 'bg-purple-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {mesa.pedidoActual.estado === 'preparando' ? 'Preparando' :
                     mesa.pedidoActual.estado === 'listo' ? 'Listo' :
                     mesa.pedidoActual.estado === 'servido' ? 'Servido' :
                     mesa.pedidoActual.estado}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

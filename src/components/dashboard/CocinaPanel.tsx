'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import useSWR from 'swr';
import { authFetcher } from '@/lib/hooks/swr';
import { toast } from 'sonner';
import {
  ALERGENOS_LABELS,
  ALERGENOS_ICONOS,
  getAlergenosProducto,
  type AlergenoUE,
} from '@/lib/constants/alergenos';

type EstadoCocina = 'pendiente' | 'preparando' | 'listo';

interface ProductoPedido {
  producto: {
    _id: string;
    nombre: string;
    imagen?: string;
    ingredientes?: Array<{ ingrediente?: { alergenos?: string[] } }>;
  } | string;
  cantidad: number;
  notas?: string;
  personalizaciones?: {
    ingredientesExtra?: string[];
    ingredientesRemovidos?: string[];
  };
}

interface PedidoCocina {
  _id: string;
  tipo: 'local' | 'recoger' | 'domicilio';
  estado: EstadoCocina;
  mesa?: { _id: string; nombre?: string; numero?: number } | null;
  productos: ProductoPedido[];
  cliente?: string;
  notas?: string;
  createdAt: string;
  creadoPor?: { nombre?: string; email?: string } | string;
  camarero?: { nombre?: string; email?: string } | string;
}

const LABEL_ESTADO: Record<EstadoCocina, string> = {
  pendiente: 'Pendiente',
  preparando: 'En preparacion',
  listo: 'Listo para servir',
};

const COLOR_COLUMNA: Record<EstadoCocina, { bg: string; border: string; header: string; badge: string }> = {
  pendiente: {
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-700/50',
    header: 'text-yellow-400',
    badge: 'bg-yellow-600',
  },
  preparando: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-700/50',
    header: 'text-blue-400',
    badge: 'bg-blue-600',
  },
  listo: {
    bg: 'bg-green-900/20',
    border: 'border-green-700/50',
    header: 'text-green-400',
    badge: 'bg-green-600',
  },
};

const SIGUIENTE_ESTADO: Record<EstadoCocina, EstadoCocina | null> = {
  pendiente: 'preparando',
  preparando: 'listo',
  listo: null,
};

const LABEL_BOTON: Record<EstadoCocina, string> = {
  pendiente: 'Empezar a preparar',
  preparando: 'Marcar como listo',
  listo: '',
};

// Badge semáforo de tiempo
function TimeBadge({ fecha }: { fecha: string }) {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60_000);

  let bg = 'bg-green-500';
  if (min >= 20) bg = 'bg-red-500';
  else if (min >= 10) bg = 'bg-yellow-500';

  const text = min < 1 ? '<1m' : min >= 60 ? `${Math.floor(min / 60)}h${min % 60}m` : `${min}m`;

  return (
    <span className={`${bg} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
      {text}
    </span>
  );
}

function nombreProducto(p: ProductoPedido): string {
  if (typeof p.producto === 'string') return p.producto;
  return p.producto?.nombre ?? 'Desconocido';
}

function getProductoAlergenos(p: ProductoPedido): AlergenoUE[] {
  if (typeof p.producto === 'string') return [];
  return getAlergenosProducto(p.producto);
}

function nombreCamarero(pedido: PedidoCocina): string {
  const c = pedido.creadoPor ?? pedido.camarero;
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c.nombre ?? c.email ?? '';
}

export default function CocinaPanel() {
  const { data: pedidos, mutate } = useSWR<PedidoCocina[]>(
    '/api/pedidos?estado=pendiente,preparando,listo',
    async () => {
      const [pendientes, preparando, listos] = await Promise.all([
        authFetcher<any>('/api/pedidos?estado=pendiente'),
        authFetcher<any>('/api/pedidos?estado=preparando'),
        authFetcher<any>('/api/pedidos?estado=listo'),
      ]);
      const extract = (d: any) => (Array.isArray(d) ? d : d?.data ?? []);
      return [...extract(pendientes), ...extract(preparando), ...extract(listos)];
    },
    { refreshInterval: 5_000 }
  );

  const [cambiandoId, setCambiandoId] = useState<string | null>(null);
  const prevCountRef = useRef(0);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  // Re-render cada minuto para actualizar badges de tiempo
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Sonido nuevo pedido: beep corto agudo
  const playBeepNuevo = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* navegador sin soporte */ }
  }, []);

  // Sonido urgente (>20min): triple beep grave
  const playBeepUrgente = useCallback(() => {
    try {
      const ctx = new AudioContext();
      [0, 0.25, 0.5].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.4;
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      });
    } catch { /* navegador sin soporte */ }
  }, []);

  const pendientesCount = useMemo(
    () => (pedidos ?? []).filter((p) => p.estado === 'pendiente').length,
    [pedidos]
  );

  // Detectar pedidos urgentes (>20min pendientes)
  const urgentesCount = useMemo(
    () => (pedidos ?? []).filter((p) => {
      if (p.estado !== 'pendiente' && p.estado !== 'preparando') return false;
      return (Date.now() - new Date(p.createdAt).getTime()) > 20 * 60_000;
    }).length,
    [pedidos]
  );
  const prevUrgentesRef = useRef(0);

  useEffect(() => {
    if (prevCountRef.current > 0 && pendientesCount > prevCountRef.current) {
      toast.info(`Nuevo pedido en cocina`, { duration: 5000 });
      if (sonidoActivo) playBeepNuevo();
    }
    prevCountRef.current = pendientesCount;
  }, [pendientesCount, sonidoActivo]);

  // Alerta sonora para pedidos urgentes nuevos
  useEffect(() => {
    if (urgentesCount > prevUrgentesRef.current && prevUrgentesRef.current >= 0) {
      if (sonidoActivo && prevUrgentesRef.current > 0) {
        playBeepUrgente();
        toast.warning(`Pedido urgente (+20 min)`, { duration: 8000 });
      }
    }
    prevUrgentesRef.current = urgentesCount;
  }, [urgentesCount, sonidoActivo]);

  const cambiarEstado = useCallback(
    async (pedidoId: string, nuevoEstado: EstadoCocina) => {
      try {
        setCambiandoId(pedidoId);
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Sin sesion');

        const res = await fetch(`/api/pedidos/${pedidoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Error al cambiar estado');

        await mutate();
        toast.success(`Pedido marcado como "${LABEL_ESTADO[nuevoEstado]}"`);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setCambiandoId(null);
      }
    },
    [mutate]
  );

  const columnas: EstadoCocina[] = ['pendiente', 'preparando', 'listo'];

  const pedidosPorEstado = useMemo(() => {
    const map: Record<EstadoCocina, PedidoCocina[]> = {
      pendiente: [],
      preparando: [],
      listo: [],
    };
    for (const p of pedidos ?? []) {
      if (map[p.estado as EstadoCocina]) {
        map[p.estado as EstadoCocina].push(p);
      }
    }
    for (const estado of columnas) {
      map[estado].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    return map;
  }, [pedidos]);

  return (
    <div className="space-y-4">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            Actualizacion cada 5s
          </span>
          <span className={`inline-block w-2 h-2 rounded-full ${pedidos ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
        <button
          onClick={() => setSonidoActivo(!sonidoActivo)}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            sonidoActivo
              ? 'bg-green-700 text-green-100'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {sonidoActivo ? 'Sonido ON' : 'Sonido OFF'}
        </button>
      </div>

      {/* Kanban de 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columnas.map((estado) => {
          const items = pedidosPorEstado[estado];
          const col = COLOR_COLUMNA[estado];

          return (
            <div
              key={estado}
              className={`${col.bg} rounded-lg border ${col.border} p-3 sm:p-4 min-h-[200px] lg:min-h-[400px]`}
            >
              {/* Header columna */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${col.header}`}>
                  {LABEL_ESTADO[estado]}
                </h3>
                <span className={`${col.badge} text-white text-sm font-bold px-2 py-0.5 rounded-full`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {items.length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-8">
                    Sin pedidos
                  </p>
                )}

                {items.map((pedido) => (
                  <PedidoCard
                    key={pedido._id}
                    pedido={pedido}
                    cambiandoId={cambiandoId}
                    onCambiarEstado={cambiarEstado}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Card de pedido individual con alérgenos e indicadores de tiempo
// ============================================================

function PedidoCard({
  pedido,
  cambiandoId,
  onCambiarEstado,
}: {
  pedido: PedidoCocina;
  cambiandoId: string | null;
  onCambiarEstado: (id: string, estado: EstadoCocina) => void;
}) {
  const siguiente = SIGUIENTE_ESTADO[pedido.estado as EstadoCocina];
  const camarero = nombreCamarero(pedido);

  const tipoLabel =
    pedido.tipo === 'local'
      ? pedido.mesa
        ? `Mesa ${(pedido.mesa as any).nombre ?? (pedido.mesa as any).numero ?? ''}`
        : 'Local'
      : pedido.tipo === 'recoger'
        ? 'Recoger'
        : 'Domicilio';

  // Recoger todos los alérgenos únicos del pedido
  const alergenosPedido = useMemo(() => {
    const set = new Set<AlergenoUE>();
    for (const p of pedido.productos) {
      for (const a of getProductoAlergenos(p)) {
        set.add(a);
      }
    }
    return Array.from(set);
  }, [pedido.productos]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
      {/* Header: tipo + tiempo semáforo */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-semibold text-sm">{tipoLabel}</span>
        <TimeBadge fecha={pedido.createdAt} />
      </div>

      {/* Cliente / camarero */}
      {(pedido.cliente || camarero) && (
        <p className="text-gray-400 text-xs mb-2">
          {pedido.cliente && <span>{pedido.cliente}</span>}
          {pedido.cliente && camarero && <span> · </span>}
          {camarero && <span>por {camarero}</span>}
        </p>
      )}

      {/* Alérgenos del pedido destacados */}
      {alergenosPedido.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 p-2 bg-red-900/30 border border-red-700/50 rounded-lg">
          <span className="text-red-400 text-xs font-bold w-full mb-1">ALERGENOS:</span>
          {alergenosPedido.map((alerg) => (
            <span
              key={alerg}
              className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <span>{ALERGENOS_ICONOS[alerg]}</span>
              <span>{ALERGENOS_LABELS[alerg]}</span>
            </span>
          ))}
        </div>
      )}

      {/* Productos */}
      <ul className="space-y-1.5 mb-3">
        {pedido.productos.map((p, i) => {
          const alergenos = getProductoAlergenos(p);
          return (
            <li key={i} className="text-sm">
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-semibold">{p.cantidad}x</span>
                <div className="flex-1">
                  <span className="text-gray-200">{nombreProducto(p)}</span>
                  {/* Alérgenos por producto */}
                  {alergenos.length > 0 && (
                    <span className="ml-1.5 inline-flex gap-0.5">
                      {alergenos.map((a) => (
                        <span key={a} title={ALERGENOS_LABELS[a]} className="text-sm">
                          {ALERGENOS_ICONOS[a]}
                        </span>
                      ))}
                    </span>
                  )}
                  {p.notas && (
                    <span className="text-gray-500 text-xs ml-1">({p.notas})</span>
                  )}
                  {p.personalizaciones?.ingredientesExtra?.length ? (
                    <span className="text-green-500 text-xs block ml-3">
                      + {p.personalizaciones.ingredientesExtra.join(', ')}
                    </span>
                  ) : null}
                  {p.personalizaciones?.ingredientesRemovidos?.length ? (
                    <span className="text-red-500 text-xs block ml-3">
                      - {p.personalizaciones.ingredientesRemovidos.join(', ')}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Notas del pedido */}
      {pedido.notas && (
        <p className="text-yellow-300 text-xs bg-yellow-900/30 rounded px-2 py-1 mb-3">
          Nota: {pedido.notas}
        </p>
      )}

      {/* Botón siguiente estado */}
      {siguiente && (
        <button
          onClick={() => onCambiarEstado(pedido._id, siguiente)}
          disabled={cambiandoId === pedido._id}
          className={`w-full py-3 rounded font-semibold text-sm transition ${
            pedido.estado === 'pendiente'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50`}
          style={{ minHeight: '48px' }}
        >
          {cambiandoId === pedido._id ? 'Cambiando...' : LABEL_BOTON[pedido.estado as EstadoCocina]}
        </button>
      )}
    </div>
  );
}

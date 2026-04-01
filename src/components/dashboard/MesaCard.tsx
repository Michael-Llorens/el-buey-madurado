'use client';

interface MesaCardProps {
  mesa: {
    _id: string;
    nombre: string;
    capacidad: number;
    comensalesActuales: number;
    estado: 'libre' | 'ocupada' | 'reservada';
    activa: boolean;
    pedidoActual?: { _id: string; tipo?: string; estado?: string } | null;
  };
  onEditar: (mesa: any) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'libre' | 'ocupada' | 'reservada') => void;
  onHacerPedido: (mesaId: string, pedidoActualId?: string) => void;
  eliminandoId: string | null;
  onConfirmEliminar?: (id: string) => void;
}

const ESTADO_CONFIG = {
  libre: {
    color: 'bg-green-600',
    emoji: '🟢',
    label: 'Libre',
    border: 'border-green-700/50',
    bg: 'bg-green-900/10',
  },
  ocupada: {
    color: 'bg-red-600',
    emoji: '🔴',
    label: 'Ocupada',
    border: 'border-red-700/50',
    bg: 'bg-red-900/10',
  },
  reservada: {
    color: 'bg-yellow-600',
    emoji: '🟡',
    label: 'Reservada',
    border: 'border-yellow-700/50',
    bg: 'bg-yellow-900/10',
  },
};

export default function MesaCard({
  mesa,
  onEditar,
  onEliminar,
  onCambiarEstado,
  onHacerPedido,
  eliminandoId,
}: MesaCardProps) {
  const config = ESTADO_CONFIG[mesa.estado];

  return (
    <div
      className={`bg-gray-800 rounded-xl p-5 border-2 transition-all duration-200 ${
        mesa.activa ? `${config.border} hover:border-amber-500` : 'border-gray-600 opacity-50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold text-amber-400">{mesa.nombre}</h3>
        <div className="flex items-center gap-2">
          {!mesa.activa && (
            <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded-full text-gray-400">Inactiva</span>
          )}
          <span className={`${config.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {config.emoji} {config.label}
          </span>
        </div>
      </div>

      {/* Capacidad */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span>👥</span>
          <span>{mesa.comensalesActuales}/{mesa.capacidad}</span>
        </div>
        {mesa.capacidad > 0 && (
          <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                mesa.comensalesActuales >= mesa.capacidad ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (mesa.comensalesActuales / mesa.capacidad) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Acciones contextuales por estado */}
      <div className="space-y-2">
        {/* Pedido - solo cuando está ocupada */}
        {mesa.estado === 'ocupada' && (
          <button
            type="button"
            onClick={() => onHacerPedido(mesa._id, mesa.pedidoActual?._id)}
            className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition text-sm shadow-md"
          >
            {mesa.pedidoActual ? '📋 Continuar Pedido' : '➕ Nuevo Pedido'}
          </button>
        )}

        {/* Transiciones de estado - solo las relevantes */}
        <div className="flex gap-2">
          {mesa.estado === 'libre' && (
            <>
              <button
                type="button"
                onClick={() => onCambiarEstado(mesa._id, 'ocupada')}
                className="flex-1 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Ocupar
              </button>
              <button
                type="button"
                onClick={() => onCambiarEstado(mesa._id, 'reservada')}
                className="flex-1 px-3 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Reservar
              </button>
            </>
          )}
          {mesa.estado === 'ocupada' && (
            <button
              type="button"
              onClick={() => onCambiarEstado(mesa._id, 'libre')}
              className="flex-1 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Liberar mesa
            </button>
          )}
          {mesa.estado === 'reservada' && (
            <>
              <button
                type="button"
                onClick={() => onCambiarEstado(mesa._id, 'ocupada')}
                className="flex-1 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Ocupar
              </button>
              <button
                type="button"
                onClick={() => onCambiarEstado(mesa._id, 'libre')}
                className="flex-1 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Liberar
              </button>
            </>
          )}
        </div>

        {/* Admin actions */}
        <div className="flex gap-2 pt-1 border-t border-gray-700/50 mt-1">
          <button
            type="button"
            onClick={() => onEditar(mesa)}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg font-medium transition text-xs"
          >
            ✏️ Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(mesa._id)}
            disabled={eliminandoId === mesa._id}
            className="px-3 py-2 bg-gray-700 hover:bg-red-600 disabled:bg-gray-600 text-gray-400 hover:text-white rounded-lg font-medium transition text-xs"
          >
            {eliminandoId === mesa._id ? '...' : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
}

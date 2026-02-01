'use client';

interface MesaCardProps {
  mesa: {
    _id: string;
    numero: number;
    capacidad: number;
    estado: 'libre' | 'ocupada' | 'reservada';
    activa: boolean;
  };
  onEditar: (mesa: any) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'libre' | 'ocupada' | 'reservada') => void;
  eliminandoId: string | null;
}

export default function MesaCard({
  mesa,
  onEditar,
  onEliminar,
  onCambiarEstado,
  eliminandoId,
}: MesaCardProps) {
  const getEstadoColor = () => {
    switch (mesa.estado) {
      case 'libre':
        return 'bg-green-600';
      case 'ocupada':
        return 'bg-red-600';
      case 'reservada':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getEstadoTexto = () => {
    switch (mesa.estado) {
      case 'libre':
        return '🟢 Libre';
      case 'ocupada':
        return '🔴 Ocupada';
      case 'reservada':
        return '🟡 Reservada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border-2 ${
        mesa.activa ? 'border-gray-700' : 'border-gray-600 opacity-50'
      } hover:border-amber-500 transition`}
    >
      {/* Número de mesa */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-3xl font-bold text-amber-400">Mesa {mesa.numero}</h3>
        {!mesa.activa && (
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">Inactiva</span>
        )}
      </div>

      {/* Capacidad */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Capacidad</p>
        <p className="text-2xl font-semibold text-white">
          {mesa.capacidad} 👥
        </p>
      </div>

      {/* Estado */}
      <div className="mb-4">
        <span
          className={`${getEstadoColor()} text-white px-4 py-2 rounded-full text-sm font-semibold inline-block`}
        >
          {getEstadoTexto()}
        </span>
      </div>

      {/* Cambiar estado rápido */}
      <div className="mb-4 space-y-2">
        <p className="text-xs text-gray-400">Cambiar estado:</p>
        <div className="flex gap-2">
          <button
            onClick={() => onCambiarEstado(mesa._id, 'libre')}
            disabled={mesa.estado === 'libre'}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition"
          >
            🟢 Libre
          </button>
          <button
            onClick={() => onCambiarEstado(mesa._id, 'ocupada')}
            disabled={mesa.estado === 'ocupada'}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition"
          >
            🔴 Ocupar
          </button>
          <button
            onClick={() => onCambiarEstado(mesa._id, 'reservada')}
            disabled={mesa.estado === 'reservada'}
            className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition"
          >
            🟡 Reservar
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(mesa)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onEliminar(mesa._id)}
          disabled={eliminandoId === mesa._id}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-semibold transition"
        >
          {eliminandoId === mesa._id ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
}
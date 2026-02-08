'use client';

import { useEffect, useState } from 'react';

interface MesaCardProps {
  mesa: {
    _id: string;
    nombre: string;
    capacidad: number;
    comensalesActuales: number;
    estado: 'libre' | 'ocupada' | 'reservada';
    activa: boolean;
  };
  onEditar: (mesa: any) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'libre' | 'ocupada' | 'reservada') => void;
  onHacerPedido: (mesaId: string) => void;
  eliminandoId: string | null;
}

export default function MesaCard({
  mesa,
  onEditar,
  onEliminar,
  onCambiarEstado,
  onHacerPedido,
  eliminandoId,
}: MesaCardProps) {
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreInput, setNombreInput] = useState(mesa.nombre);

  useEffect(() => {
    setNombreInput(mesa.nombre);
  }, [mesa._id, mesa.nombre]);

  const getEstadoColor = () => {
    switch (mesa.estado) {
      case 'libre': return 'bg-green-600';
      case 'ocupada': return 'bg-red-600';
      case 'reservada': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getEstadoTexto = () => {
    switch (mesa.estado) {
      case 'libre': return `🟢 Libre (${mesa.comensalesActuales}/${mesa.capacidad})`;
      case 'ocupada': return `🔴 Ocupada (${mesa.comensalesActuales}/${mesa.capacidad})`;
      case 'reservada': return '🟡 Reservada';
      default: return 'Desconocido';
    }
  };

  const cerrarEdicion = () => {
    setNombreInput(mesa.nombre);
    setEditandoNombre(false);
  };

  const guardarNombre = () => {
    const nuevoNombre = nombreInput.trim();

    // No permitimos vacío
    if (!nuevoNombre) {
      cerrarEdicion();
      return;
    }

    // Si no cambia, solo cerramos
    if (nuevoNombre === mesa.nombre) {
      setEditandoNombre(false);
      return;
    }

    onEditar({ ...mesa, nombre: nuevoNombre });
    setEditandoNombre(false);
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border-2 ${
        mesa.activa ? 'border-gray-700' : 'border-gray-600 opacity-50'
      } hover:border-amber-500 transition`}
    >
      {/* Nombre mesa - EDITABLE */}
      <div className="flex items-center justify-between mb-4">
        {editandoNombre ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') guardarNombre();
                if (e.key === 'Escape') cerrarEdicion();
              }}
              maxLength={40}
              autoFocus
              className="flex-1 px-3 py-2 bg-gray-700 border border-amber-500 rounded text-lg font-bold text-amber-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={guardarNombre}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-sm"
              title="Guardar"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={cerrarEdicion}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
              title="Cancelar"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <h3
              className="text-3xl font-bold text-amber-400 cursor-pointer hover:text-amber-300"
              onClick={() => setEditandoNombre(true)}
              title="Click para editar nombre"
            >
              {mesa.nombre}
            </h3>
            {!mesa.activa && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">Inactiva</span>
            )}
          </>
        )}
      </div>

      {/* Capacidad y Comensales */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-200 text-m">Capacidad</p>
          <p className="text-xl font-semibold text-white">👥 {mesa.capacidad}</p>
        </div>
        <div>
          <p className="text-gray-200 text-m">Comensales</p>
          <p className="text-xl font-semibold text-white">{mesa.comensalesActuales}</p>
        </div>
      </div>

      {/* Estado */}
      <div className="mb-6">
        <span
          className={`${getEstadoColor()} text-white px-4 py-2 rounded-full text-sm font-semibold inline-block`}
        >
          {getEstadoTexto()}
        </span>
      </div>

      {/* Acciones */}
      <div className="space-y-3 mb-4">
        {mesa.estado === 'ocupada' && (
          <button
            type="button"
            onClick={() => onHacerPedido(mesa._id)}
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition shadow-md"
          >
            🍽️ Hacer Pedido para esta Mesa
          </button>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onCambiarEstado(mesa._id, 'libre')}
            disabled={mesa.estado === 'libre'}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded text-xs font-semibold transition"
          >
            🟢 Liberar
          </button>
          <button
            type="button"
            onClick={() => onCambiarEstado(mesa._id, 'ocupada')}
            disabled={mesa.estado === 'ocupada'}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded text-xs font-semibold transition"
          >
            🔴 Ocupar
          </button>
          <button
            type="button"
            onClick={() => onCambiarEstado(mesa._id, 'reservada')}
            disabled={mesa.estado === 'reservada'}
            className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white rounded text-xs font-semibold transition"
          >
            🟡 Reservar
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => onEditar(mesa)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition text-sm"
        >
          ✏️ Modificar
        </button>
        <button
          type="button"
          onClick={() => onEliminar(mesa._id)}
          disabled={eliminandoId === mesa._id}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-semibold transition text-sm"
        >
          {eliminandoId === mesa._id ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
}
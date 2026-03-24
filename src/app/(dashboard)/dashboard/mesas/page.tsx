'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MesaForm from '@/components/dashboard/MesaForm';
import MesaGrid from '@/components/dashboard/MesaGrid';
import MesaMapView from '@/components/dashboard/MesaMapView';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { useConfirm } from '@/components/dashboard/hooks/useConfirm';
import { useMesas } from '@/lib/hooks/swr';

type Modo = 'view' | 'add' | 'edit';
type Vista = 'lista' | 'mapa';

type Mesa = {
  _id: string;
  nombre: string;
  capacidad: number;
  comensalesActuales: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  activa: boolean;
  pedidoActual?: { _id: string; tipo?: string; estado?: string } | null;
};

export default function MesasPanel() {
  const router = useRouter();
  const { mesas, error: swrError, isLoading: loading, mutate } = useMesas();
  const { confirmar, confirmProps } = useConfirm();
  const error = swrError?.message ?? null;

  const [modo, setModo] = useState<Modo>('view');
  const [vista, setVista] = useState<Vista>('lista');
  const [mesaEditar, setMesaEditar] = useState<Mesa | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const crearMesasIniciales = async () => {
    const ok = await confirmar('¿Crear 15 mesas de 4 comensales cada una?', { titulo: 'Crear mesas iniciales', textoConfirmar: 'Crear', variante: 'info' });
    if (!ok) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const res = await fetch('/api/mesas/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('15 mesas creadas exitosamente');
        await mutate();
      } else {
        throw new Error(data.error || 'Error al crear mesas');
      }
    } catch (err: any) {
      console.error('Error al crear mesas:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleGuardar = async () => {
    await mutate();
    setMesaEditar(null);
    setModo('view');
  };

  const handleEditar = (mesa: Mesa) => {
    setMesaEditar(mesa);
    setModo('edit');
  };

  const handleEliminar = async (id: string) => {
    const ok = await confirmar('¿Seguro que quieres eliminar esta mesa?', { titulo: 'Eliminar mesa', textoConfirmar: 'Eliminar' });
    if (!ok) return;
    if (eliminandoId === id) return;

    try {
      setEliminandoId(id);

      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/mesas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await mutate();
        toast.success('Mesa eliminada exitosamente');
      } else {
        throw new Error(data.error || 'Error al eliminar');
      }
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: Mesa['estado']) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/mesas/${id}`, {
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
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleCancelar = () => {
    setMesaEditar(null);
    setModo('view');
  };

  const handleActualizarComensales = async (id: string, comensales: number) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay sesión iniciada');
        return;
      }

      const nuevoEstado: 'libre' | 'ocupada' = comensales > 0 ? 'ocupada' : 'libre';

      const res = await fetch(`/api/mesas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comensalesActuales: comensales, estado: nuevoEstado }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al actualizar comensales');

      await mutate();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  //  Detecta si hay pedido activo y navega con los parámetros correctos
  const handleHacerPedido = async (mesaId: string, pedidoActualId?: string) => {
    try {
      if (pedidoActualId) {
        // ✅ Ya existe un pedido activo, navegar al panel de pedidos en modo edición
        router.push(
          `/dashboard?modulo=pedidos&modo=edit&pedidoId=${encodeURIComponent(pedidoActualId)}`
        );
      } else {
        // ✅ No hay pedido activo, crear uno nuevo
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('No hay sesión iniciada');
          return;
        }

        const res = await fetch('/api/pedidos/abrir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mesaId }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Error al abrir pedido');

        const pedidoId = data?.data?.pedidoId as string | undefined;
        if (!pedidoId) throw new Error('El servidor no devolvió pedidoId');

        router.push(`/dashboard?modulo=pedidos&modo=add&mesaId=${encodeURIComponent(mesaId)}`);
      }
    } catch (err: any) {
      console.error('Error al hacer pedido:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const resumen = {
    total: mesas.length,
    libres: mesas.filter((m) => m.estado === 'libre').length,
    ocupadas: mesas.filter((m) => m.estado === 'ocupada').length,
    reservadas: mesas.filter((m) => m.estado === 'reservada').length,
  };

  return (
    <div className="space-y-6">
      {modo === 'view' && (
        <>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* Toggle vista */}
              <div className="flex rounded-lg overflow-hidden border border-gray-700">
                <button
                  onClick={() => setVista('lista')}
                  className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition ${
                    vista === 'lista' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  📋 Lista
                </button>
                <button
                  onClick={() => setVista('mapa')}
                  className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition ${
                    vista === 'mapa' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  🗺️ Mapa
                </button>
              </div>

              {/* Leyenda inline */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {resumen.libres} libres</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {resumen.ocupadas} ocupadas</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {resumen.reservadas} reservadas</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {mesas.length === 0 && (
                <button
                  onClick={crearMesasIniciales}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition text-sm sm:text-base"
                >
                  🚀 Crear 15 Mesas Iniciales
                </button>
              )}
              <button
                onClick={() => {
                  setMesaEditar(null);
                  setModo('add');
                }}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition text-sm sm:text-base"
              >
                ➕ Nueva Mesa
              </button>
            </div>
          </div>

        </>
      )}

      {(modo === 'add' || modo === 'edit') && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-amber-400">
            {modo === 'add' ? '➕ Nueva Mesa' : '✏️ Editar Mesa'}
          </h2>
          <MesaForm mesa={mesaEditar} onGuardar={handleGuardar} onCancelar={handleCancelar} />
        </div>
      )}

      {modo === 'view' && (
        <div>
          {error && <div className="bg-red-600 text-white p-4 rounded mb-4">❌ {error}</div>}

          {loading ? (
            <div className="text-center text-gray-400 py-8">⏳ Cargando mesas...</div>
          ) : mesas.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">No hay mesas creadas. ¡Crea las primeras!</p>
            </div>
          ) : vista === 'mapa' ? (
            <MesaMapView
              mesas={mesas}
              onHacerPedido={handleHacerPedido}
              onCambiarEstado={handleCambiarEstado}
            />
          ) : (
            <MesaGrid
              mesas={mesas}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onCambiarEstado={handleCambiarEstado}
              onActualizarComensales={handleActualizarComensales}
              onHacerPedido={handleHacerPedido}
              eliminandoId={eliminandoId}
            />
          )}
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
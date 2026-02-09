'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MesaForm from '@/components/dashboard/MesaForm';
import MesaGrid from '@/components/dashboard/MesaGrid';

type Modo = 'view' | 'add' | 'edit';

type Mesa = {
  _id: string;
  nombre: string;
  capacidad: number;
  comensalesActuales: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  activa: boolean;
};

export default function MesasPanel() {
  const router = useRouter();

  const [modo, setModo] = useState<Modo>('view');
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [mesaEditar, setMesaEditar] = useState<Mesa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const cargarMesas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No hay sesión iniciada');
        return;
      }

      const res = await fetch('/api/mesas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al cargar mesas');

      setMesas(data.data || []);
    } catch (err: any) {
      console.error('Error cargando mesas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMesas();
  }, []);

  const crearMesasIniciales = async () => {
    if (!confirm('¿Crear 15 mesas de 4 comensales cada una?')) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
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
        alert('✅ 15 mesas creadas exitosamente');
        await cargarMesas();
      } else {
        throw new Error(data.error || 'Error al crear mesas');
      }
    } catch (err: any) {
      console.error('Error al crear mesas:', err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleGuardar = async () => {
    await cargarMesas();
    setMesaEditar(null);
    setModo('view');
  };

  const handleEditar = (mesa: Mesa) => {
    setMesaEditar(mesa);
    setModo('edit');
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mesa?')) return;
    if (eliminandoId === id) return;

    try {
      setEliminandoId(id);

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
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
        await cargarMesas();
        alert('✅ Mesa eliminada exitosamente');
      } else {
        throw new Error(data.error || 'Error al eliminar');
      }
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: Mesa['estado']) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
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

      await cargarMesas();
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
      alert(`❌ Error: ${err.message}`);
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
        alert('❌ No hay sesión iniciada');
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

      await cargarMesas();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  // ✅ NUEVO: abre (o reutiliza) un pedido para la mesa y navega al panel de pedidos
  const handleHacerPedido = async (mesaId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
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
    } catch (err: any) {
      console.error('Error al hacer pedido:', err);
      alert(`❌ Error: ${err.message}`);
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
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div />
            <div className="flex gap-4">
              {mesas.length === 0 && (
                <button
                  onClick={crearMesasIniciales}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                >
                  🚀 Crear 15 Mesas Iniciales
                </button>
              )}
              <button
                onClick={() => {
                  setMesaEditar(null);
                  setModo('add');
                }}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition"
              >
                ➕ Nueva Mesa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Total Mesas</p>
              <p className="text-3xl font-bold text-white">{resumen.total}</p>
            </div>
            <div className="bg-green-900/30 rounded-lg p-6 border border-green-700">
              <p className="text-green-400 text-sm mb-2">🟢 Libres</p>
              <p className="text-3xl font-bold text-green-400">{resumen.libres}</p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-6 border border-red-700">
              <p className="text-red-400 text-sm mb-2">🔴 Ocupadas</p>
              <p className="text-3xl font-bold text-red-400">{resumen.ocupadas}</p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-6 border border-yellow-700">
              <p className="text-yellow-400 text-sm mb-2">🟡 Reservadas</p>
              <p className="text-3xl font-bold text-yellow-400">{resumen.reservadas}</p>
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
    </div>
  );
}
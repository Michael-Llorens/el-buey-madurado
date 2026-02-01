'use client';

import { useState, useEffect } from 'react';
import PedidoForm from '@/components/dashboard/PedidoForm';
import PedidoCard from '@/components/dashboard/PedidoCard';

type Modo = 'view' | 'add';

export default function PedidosPanel() {
  const [modo, setModo] = useState<Modo>('view');
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar pedidos
  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No hay sesión iniciada');
        return;
      }

      const res = await fetch('/api/pedidos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al cargar pedidos');
      }

      setPedidos(data.data || []);
      setPedidosFiltrados(data.data || []);
    } catch (error: any) {
      console.error('Error cargando pedidos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Filtrar por estado
  useEffect(() => {
    if (filtroEstado === 'todos') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter(p => p.estado === filtroEstado));
    }
  }, [filtroEstado, pedidos]);

  // Cambiar estado
  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await cargarPedidos();
        
        if (nuevoEstado === 'pagado') {
          alert('✅ Pedido pagado y mesa liberada');
        }
      } else {
        throw new Error(data.error || 'Error al cambiar estado');
      }
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Cancelar pedido
  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ No hay sesión iniciada');
        return;
      }

      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await cargarPedidos();
        alert('✅ Pedido cancelado exitosamente');
      } else {
        throw new Error(data.error || 'Error al cancelar');
      }
    } catch (error: any) {
      console.error('Error al cancelar:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Guardar
  const handleGuardar = async () => {
    try {
      await cargarPedidos();
      setModo('view');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Cancelar
  const handleCancelar = () => {
    setModo('view');
  };

  // Estadísticas
  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    preparando: pedidos.filter(p => p.estado === 'preparando').length,
    listos: pedidos.filter(p => p.estado === 'listo').length,
    servidos: pedidos.filter(p => p.estado === 'servido').length,
    pagados: pedidos.filter(p => p.estado === 'pagado').length,
    totalRecaudado: pedidos
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + p.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* HEADER + BOTONES */}
      {modo === 'view' && (
        <>
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <button
              onClick={() => setModo('add')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition"
            >
              ➕ Nuevo Pedido
            </button>
          </div>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700">
              <p className="text-yellow-400 text-xs mb-1">🟡 Pendientes</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendientes}</p>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
              <p className="text-blue-400 text-xs mb-1">🔵 Preparando</p>
              <p className="text-2xl font-bold text-blue-400">{stats.preparando}</p>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
              <p className="text-purple-400 text-xs mb-1">🟣 Listos</p>
              <p className="text-2xl font-bold text-purple-400">{stats.listos}</p>
            </div>
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
              <p className="text-green-400 text-xs mb-1">🟢 Servidos</p>
              <p className="text-2xl font-bold text-green-400">{stats.servidos}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">💰 Recaudado</p>
              <p className="text-xl font-bold text-amber-400">
                {stats.totalRecaudado.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* FILTROS */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'todos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Todos ({pedidos.length})
            </button>
            <button
              onClick={() => setFiltroEstado('pendiente')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'pendiente'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🟡 Pendientes ({stats.pendientes})
            </button>
            <button
              onClick={() => setFiltroEstado('preparando')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'preparando'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔵 Preparando ({stats.preparando})
            </button>
            <button
              onClick={() => setFiltroEstado('listo')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'listo'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🟣 Listos ({stats.listos})
            </button>
            <button
              onClick={() => setFiltroEstado('servido')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'servido'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🟢 Servidos ({stats.servidos})
            </button>
            <button
              onClick={() => setFiltroEstado('pagado')}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === 'pagado'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✅ Pagados ({stats.pagados})
            </button>
          </div>
        </>
      )}

      {/* FORMULARIO */}
      {modo === 'add' && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-amber-400">
            ➕ Nuevo Pedido
          </h2>
          <PedidoForm onGuardar={handleGuardar} onCancelar={handleCancelar} />
        </div>
      )}

      {/* LISTA DE PEDIDOS */}
      {modo === 'view' && (
        <div>
          {error && (
            <div className="bg-red-600 text-white p-4 rounded mb-4">
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">⏳ Cargando pedidos...</div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">
                {filtroEstado === 'todos'
                  ? 'No hay pedidos registrados. ¡Crea el primero!'
                  : `No hay pedidos con estado "${filtroEstado}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pedidosFiltrados.map(pedido => (
                <PedidoCard
                  key={pedido._id}
                  pedido={pedido}
                  onCambiarEstado={handleCambiarEstado}
                  onEliminar={handleEliminar}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
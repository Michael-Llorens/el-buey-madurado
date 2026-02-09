'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PedidoForm from '@/components/dashboard/PedidoForm';
import PedidoCard from '@/components/dashboard/PedidoCard';

type Modo = 'view' | 'add' | 'edit' | 'detail';

export default function PedidosPanel() {
    const searchParams = useSearchParams();

    const [modo, setModo] = useState<Modo>('view');
    const [pedidoEditando, setPedidoEditando] = useState<any | null>(null);

    const [pedidoDetalle, setPedidoDetalle] = useState<any | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    const [pedidos, setPedidos] = useState<any[]>([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState<any[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<string>('todos');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            if (!res.ok || !data.success) throw new Error(data.error || 'Error al cargar pedidos');

            setPedidos(data.data || []);
            setPedidosFiltrados(data.data || []);
        } catch (e: any) {
            console.error('Error cargando pedidos:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const cargarPedidoPorId = async (id: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No hay sesión iniciada');

        const res = await fetch(`/api/pedidos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Error al cargar el detalle del pedido');

        return data.data;
    };

    // Autoabrir pedido en EDIT si viene ?pedidoId=...
    useEffect(() => {
        const pedidoIdFromUrl = searchParams.get('pedidoId');
        if (!pedidoIdFromUrl) return;

        let cancelled = false;

        (async () => {
            try {
                setError(null);
                setLoadingDetalle(true);

                const detalle = await cargarPedidoPorId(pedidoIdFromUrl);
                if (cancelled) return;

                setPedidoEditando(detalle);
                setPedidoDetalle(null);
                setModo('edit');

                // Limpia la URL (sin /dashboard/pedidos)
                window.history.replaceState(null, '', '/dashboard');
            } catch (e: any) {
                if (cancelled) return;
                setError(e.message);
                setModo('view');
            } finally {
                if (cancelled) return;
                setLoadingDetalle(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    useEffect(() => {
        const modulo = searchParams.get('modulo');
        const modoFromUrl = searchParams.get('modo');

        if (modulo === 'pedidos' && modoFromUrl === 'add') {
            setError(null);
            setPedidoEditando(null);
            setPedidoDetalle(null);
            setModo('add');

            window.history.replaceState(null, '', '/dashboard');
        }
    }, [searchParams]);


    useEffect(() => {
        cargarPedidos();
    }, []);

    useEffect(() => {
        if (filtroEstado === 'todos') setPedidosFiltrados(pedidos);
        else setPedidosFiltrados(pedidos.filter((p) => p.estado === filtroEstado));
    }, [filtroEstado, pedidos]);

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
                if (modo === 'detail' && pedidoDetalle?._id === id) setPedidoDetalle(data.data);
                if (nuevoEstado === 'pagado') alert('✅ Pedido pagado y mesa liberada');
            } else {
                throw new Error(data.error || 'Error al cambiar estado');
            }
        } catch (e: any) {
            console.error('Error al cambiar estado:', e);
            alert(`❌ Error: ${e.message}`);
        }
    };

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
                if (modo === 'detail' && pedidoDetalle?._id === id) {
                    setPedidoDetalle(null);
                    setModo('view');
                }
                alert('✅ Pedido cancelado exitosamente');
            } else {
                throw new Error(data.error || 'Error al cancelar');
            }
        } catch (e: any) {
            console.error('Error al cancelar:', e);
            alert(`❌ Error: ${e.message}`);
        }
    };

    const handleGuardar = async () => {
        await cargarPedidos();
        setPedidoEditando(null);
        setModo('view');
    };

    const handleCancelar = () => {
        setPedidoEditando(null);
        setPedidoDetalle(null);
        setModo('view');
    };

    const handleEditar = (pedido: any) => {
        setPedidoEditando(pedido);
        setModo('edit');
    };

    const handleVerDetalle = async (pedido: any) => {
        try {
            setError(null);
            setLoadingDetalle(true);
            setModo('detail');
            setPedidoDetalle(null);

            const detalle = await cargarPedidoPorId(pedido._id);
            setPedidoDetalle(detalle);
        } catch (e: any) {
            console.error('Error cargando detalle:', e);
            setPedidoDetalle(pedido); // fallback
            setError(e.message);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const cerrarDetalle = () => {
        setPedidoDetalle(null);
        setModo('view');
    };

    const stats = {
        total: pedidos.length,
        pendientes: pedidos.filter((p) => p.estado === 'pendiente').length,
        preparando: pedidos.filter((p) => p.estado === 'preparando').length,
        listos: pedidos.filter((p) => p.estado === 'listo').length,
        servidos: pedidos.filter((p) => p.estado === 'servido').length,
        pagados: pedidos.filter((p) => p.estado === 'pagado').length,
        totalRecaudado: pedidos.filter((p) => p.estado === 'pagado').reduce((sum, p) => sum + p.total, 0),
    };

    return (
        <div className="w-full space-y-6">
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
                            <p className="text-xl font-bold text-amber-400">{stats.totalRecaudado.toFixed(2)}€</p>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFiltroEstado('todos')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'todos'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Todos ({pedidos.length})
                        </button>

                        <button
                            onClick={() => setFiltroEstado('pendiente')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'pendiente'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            🟡 Pendientes ({stats.pendientes})
                        </button>

                        <button
                            onClick={() => setFiltroEstado('preparando')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'preparando'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            🔵 Preparando ({stats.preparando})
                        </button>

                        <button
                            onClick={() => setFiltroEstado('listo')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'listo'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            🟣 Listos ({stats.listos})
                        </button>

                        <button
                            onClick={() => setFiltroEstado('servido')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'servido'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            🟢 Servidos ({stats.servidos})
                        </button>

                        <button
                            onClick={() => setFiltroEstado('pagado')}
                            className={`px-4 py-2 rounded font-semibold transition ${filtroEstado === 'pagado'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            ✅ Pagados ({stats.pagados})
                        </button>
                    </div>
                </>
            )}

            {modo === 'add' && (
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-amber-400">➕ Nuevo Pedido</h2>
                        <button
                            type="button"
                            onClick={handleCancelar}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition"
                        >
                            ← Volver
                        </button>
                    </div>

                    <PedidoForm
                        modo="add"
                        mesaIdPreseleccionada={searchParams.get('mesaId') ?? undefined}
                        onGuardar={handleGuardar}
                        onCancelar={handleCancelar}
                    />
                </div>
            )}

            {modo === 'edit' && pedidoEditando && (
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-amber-400">✏️ Editar Pedido</h2>
                        <button
                            type="button"
                            onClick={handleCancelar}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition"
                        >
                            ← Volver
                        </button>
                    </div>

                    <PedidoForm
                        modo="edit"
                        pedidoId={pedidoEditando._id}
                        pedidoInicial={pedidoEditando}
                        onGuardar={handleGuardar}
                        onCancelar={handleCancelar}
                    />
                </div>
            )}

            {modo === 'detail' && (
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-amber-400">📄 Detalle del pedido</h2>

                        <div className="flex gap-2">
                            {pedidoDetalle && (
                                <button
                                    type="button"
                                    onClick={() => handleEditar(pedidoDetalle)}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition"
                                    title="Editar (si procede)"
                                >
                                    ✏️ Editar
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={cerrarDetalle}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition"
                            >
                                ← Volver
                            </button>
                        </div>
                    </div>

                    {error && <div className="bg-red-600 text-white p-4 rounded mb-4">❌ {error}</div>}

                    {loadingDetalle ? (
                        <div className="text-center text-gray-400 py-8">⏳ Cargando detalle...</div>
                    ) : !pedidoDetalle ? (
                        <div className="text-center text-gray-400 py-8">No se pudo cargar el pedido.</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                    <p className="text-gray-400">ID</p>
                                    <p className="text-white break-all">{pedidoDetalle._id}</p>
                                </div>

                                <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                    <p className="text-gray-400">Estado</p>
                                    <p className="text-white font-semibold">{pedidoDetalle.estado}</p>
                                </div>

                                <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                    <p className="text-gray-400">Tipo</p>
                                    <p className="text-white font-semibold">{pedidoDetalle.tipo}</p>
                                </div>

                                <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                    <p className="text-gray-400">Fecha</p>
                                    <p className="text-white">
                                        {pedidoDetalle.createdAt ? new Date(pedidoDetalle.createdAt).toLocaleString('es-ES') : '-'}
                                    </p>
                                </div>

                                {pedidoDetalle.mesa?.numero && (
                                    <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                        <p className="text-gray-400">Mesa</p>
                                        <p className="text-white font-semibold">Mesa {pedidoDetalle.mesa.numero}</p>
                                    </div>
                                )}

                                {pedidoDetalle.creadoPor?.email && (
                                    <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                        <p className="text-gray-400">Creado por</p>
                                        <p className="text-white">
                                            {pedidoDetalle.creadoPor.email}
                                            {pedidoDetalle.creadoPor.rol ? ` (${pedidoDetalle.creadoPor.rol})` : ''}
                                            {pedidoDetalle.creadoPor.nombre ? ` - ${pedidoDetalle.creadoPor.nombre}` : ''}
                                        </p>
                                    </div>
                                )}

                                {(pedidoDetalle.cliente || pedidoDetalle.telefono) && (
                                    <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                        <p className="text-gray-400">Cliente</p>
                                        <p className="text-white">
                                            {pedidoDetalle.cliente || '-'}
                                            {pedidoDetalle.telefono ? ` · 📞 ${pedidoDetalle.telefono}` : ''}
                                        </p>
                                    </div>
                                )}

                                {pedidoDetalle.direccionEntrega && (
                                    <div className="bg-gray-900/40 rounded p-4 border border-gray-700 md:col-span-2">
                                        <p className="text-gray-400">Dirección entrega</p>
                                        <p className="text-white">
                                            📍 {pedidoDetalle.direccionEntrega.calle} {pedidoDetalle.direccionEntrega.numero}
                                            {pedidoDetalle.direccionEntrega.piso ? `, ${pedidoDetalle.direccionEntrega.piso}` : ''}
                                            {pedidoDetalle.direccionEntrega.ciudad ? ` · ${pedidoDetalle.direccionEntrega.ciudad}` : ''}
                                            {pedidoDetalle.direccionEntrega.codigoPostal
                                                ? ` (${pedidoDetalle.direccionEntrega.codigoPostal})`
                                                : ''}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                <p className="text-gray-300 font-semibold mb-3">Productos</p>

                                <div className="space-y-2">
                                    {(pedidoDetalle.productos || []).map((item: any, idx: number) => {
                                        const extras: string[] = item?.personalizaciones?.ingredientesExtra || [];
                                        const removidos: string[] = item?.personalizaciones?.ingredientesRemovidos || [];

                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-start justify-between gap-4 bg-gray-700/50 px-3 py-2 rounded"
                                            >
                                                <div className="text-white">
                                                    <p className="font-semibold">
                                                        {item.cantidad}x {item.producto?.nombre ?? 'Producto'}
                                                    </p>

                                                    {item.notas && <p className="text-xs text-gray-300 mt-1">📝 {item.notas}</p>}

                                                    {item.precioUnitario !== undefined && (
                                                        <p className="text-xs text-gray-300">
                                                            Precio ud: {Number(item.precioUnitario).toFixed(2)}€
                                                        </p>
                                                    )}

                                                    {extras.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-emerald-300 font-semibold mb-1">
                                                                ➕ Ingredientes extra
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {extras.map((ing, i) => (
                                                                    <span
                                                                        key={`extra-${idx}-${i}`}
                                                                        className="text-xs bg-emerald-900/40 border border-emerald-700 text-emerald-200 px-2 py-1 rounded"
                                                                    >
                                                                        {ing}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {removidos.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-red-300 font-semibold mb-1">
                                                                ➖ Ingredientes quitados
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {removidos.map((ing, i) => (
                                                                    <span
                                                                        key={`rem-${idx}-${i}`}
                                                                        className="text-xs bg-red-900/30 border border-red-700 text-red-200 px-2 py-1 rounded"
                                                                    >
                                                                        {ing}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-amber-400 font-bold">
                                                        {Number(item.subtotal || 0).toFixed(2)}€
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-gray-900/40 rounded p-4 border border-gray-700">
                                <p className="text-gray-300 font-semibold mb-3">Totales</p>

                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>{Number(pedidoDetalle.subtotal || 0).toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>IVA</span>
                                        <span>{Number(pedidoDetalle.impuestos || 0).toFixed(2)}€</span>
                                    </div>
                                    {Number(pedidoDetalle.gastoEnvio || 0) > 0 && (
                                        <div className="flex justify-between text-blue-300">
                                            <span>Envío</span>
                                            <span>{Number(pedidoDetalle.gastoEnvio || 0).toFixed(2)}€</span>
                                        </div>
                                    )}
                                    {Number(pedidoDetalle.descuento || 0) > 0 && (
                                        <div className="flex justify-between text-red-300">
                                            <span>Descuento</span>
                                            <span>-{Number(pedidoDetalle.descuento || 0).toFixed(2)}€</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-700">
                                        <span>TOTAL</span>
                                        <span className="text-amber-400">{Number(pedidoDetalle.total || 0).toFixed(2)}€</span>
                                    </div>
                                </div>

                                {pedidoDetalle.metodoPago && (
                                    <p className="text-xs text-gray-400 mt-3">💳 Método pago: {pedidoDetalle.metodoPago}</p>
                                )}
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={cerrarDetalle}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition"
                                >
                                    ← Volver a la lista
                                </button>

                                {pedidoDetalle?.estado !== 'pagado' &&
                                    pedidoDetalle?.estado !== 'entregado' &&
                                    pedidoDetalle?.estado !== 'cancelado' && (
                                        <button
                                            type="button"
                                            onClick={() => void handleEliminar(pedidoDetalle._id)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
                                        >
                                            ❌ Cancelar pedido
                                        </button>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* LISTA */}
            {modo === 'view' && (
                <div>
                    {error && <div className="bg-red-600 text-white p-4 rounded mb-4">❌ {error}</div>}

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
                            {pedidosFiltrados.map((pedido) => (
                                <PedidoCard
                                    key={pedido._id}
                                    pedido={pedido}
                                    onCambiarEstado={handleCambiarEstado}
                                    onEliminar={handleEliminar}
                                    onEditar={handleEditar}
                                    onVerDetalle={handleVerDetalle}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
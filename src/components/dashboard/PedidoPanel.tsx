'use client';

import { useState, useRef, useEffect } from 'react';
import PedidoForm from '@/components/dashboard/PedidoForm';
import PedidoCard from '@/components/dashboard/PedidoCard';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { usePedidoPanel } from './hooks/usePedidoPanel';

export default function PedidosPanel() {
    const {
        searchParams,
        modo,
        setModo,
        pedidoEditando,
        pedidoDetalle,
        loadingDetalle,
        pedidos,
        pedidosFiltrados,
        filtroEstado,
        setFiltroEstado,
        toggleFiltroEstado,
        filtroTipo,
        setFiltroTipo,
        toggleFiltroTipo,
        busqueda,
        setBusqueda,
        ordenar,
        setOrdenar,
        loading,
        error,
        stats,
        handleCambiarEstado,
        handleEliminar,
        handleGuardar,
        handleCancelar,
        handleEditar,
        handleVerDetalle,
        cerrarDetalle,
        confirmProps,
    } = usePedidoPanel();

    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
    const filtrosRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (filtrosRef.current && !filtrosRef.current.contains(e.target as Node)) {
                setFiltrosAbiertos(false);
            }
        }
        if (filtrosAbiertos) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [filtrosAbiertos]);

    const filtrosActivos = filtroEstado.length > 0 || filtroTipo.length > 0;
    const numFiltrosActivos =
        (filtroEstado.length > 0 ? 1 : 0) +
        (filtroTipo.length > 0 ? 1 : 0);

    return (
        <div className="w-full min-w-0 space-y-4 sm:space-y-6">
            {modo === 'view' && (
                <>
                    {/* ── Barra superior: Nuevo + Búsqueda + Filtros ── */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                        <button
                            onClick={() => setModo('add')}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition text-sm whitespace-nowrap shrink-0"
                        >
                            + Nuevo Pedido
                        </button>

                        <div className="relative flex-1 min-w-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Mesa, cliente, teléfono, producto..."
                                className="w-full pl-9 pr-9 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                            />
                            {busqueda && (
                                <button
                                    onClick={() => setBusqueda('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Botón Filtros con dropdown */}
                        <div className="relative shrink-0" ref={filtrosRef}>
                            <button
                                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                                    filtrosActivos
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                }`}
                            >
                                <span>⚙</span>
                                Filtros
                                {numFiltrosActivos > 0 && (
                                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {numFiltrosActivos}
                                    </span>
                                )}
                                <span className={`text-xs transition-transform ${filtrosAbiertos ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {filtrosAbiertos && (
                                <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] bg-gray-950 border border-gray-600 rounded-xl shadow-2xl z-50 p-4 space-y-4">
                                    {/* Por estado — multi-selección */}
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Estado <span className="normal-case text-gray-600">(puedes seleccionar varios)</span></p>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {[
                                                { key: 'pendiente', label: `Pend. (${stats.pendientes})`, active: 'bg-yellow-600' },
                                                { key: 'preparando', label: `Prep. (${stats.preparando})`, active: 'bg-blue-600' },
                                                { key: 'listo', label: `Listos (${stats.listos})`, active: 'bg-purple-600' },
                                                { key: 'servido', label: `Serv. (${stats.servidos})`, active: 'bg-green-600' },
                                                { key: 'pagado', label: `Pag. (${stats.pagados})`, active: 'bg-emerald-700' },
                                            ].map((f) => (
                                                <button
                                                    key={f.key}
                                                    onClick={() => toggleFiltroEstado(f.key)}
                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                                                        filtroEstado.includes(f.key)
                                                            ? `${f.active} text-white ring-2 ring-white/30`
                                                            : filtroEstado.length === 0
                                                              ? 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                                                              : 'bg-gray-700 text-gray-500 hover:text-white hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Por tipo — multi-selección */}
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Tipo <span className="normal-case text-gray-600">(puedes seleccionar varios)</span></p>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {[
                                                { key: 'local', label: '🍽️ Local' },
                                                { key: 'recoger', label: '🛍️ Recoger' },
                                                { key: 'domicilio', label: '🛵 Domicilio' },
                                            ].map((f) => (
                                                <button
                                                    key={f.key}
                                                    onClick={() => toggleFiltroTipo(f.key)}
                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                                                        filtroTipo.includes(f.key)
                                                            ? 'bg-amber-600 text-white ring-2 ring-white/30'
                                                            : filtroTipo.length === 0
                                                              ? 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                                                              : 'bg-gray-700 text-gray-500 hover:text-white hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ordenar */}
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Ordenar por</p>
                                        <div className="flex gap-1.5">
                                            {[
                                                { key: 'recientes' as const, label: 'Más recientes' },
                                                { key: 'urgencia' as const, label: 'Urgencia' },
                                            ].map((o) => (
                                                <button
                                                    key={o.key}
                                                    onClick={() => setOrdenar(o.key)}
                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                                                        ordenar === o.key
                                                            ? 'bg-cyan-600 text-white'
                                                            : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {o.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Limpiar filtros */}
                                    {filtrosActivos && (
                                        <button
                                            onClick={() => {
                                                setFiltroEstado([]);
                                                setFiltroTipo([]);
                                            }}
                                            className="w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1.5 border-t border-gray-700 mt-1"
                                        >
                                            Limpiar todos los filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Indicador de filtros activos ── */}
                    {(busqueda || filtrosActivos) && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>
                                Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
                            </span>
                            <button
                                onClick={() => {
                                    setBusqueda('');
                                    setFiltroEstado([]);
                                    setFiltroTipo([]);
                                }}
                                className="text-amber-400 hover:text-amber-300 underline"
                            >
                                Limpiar todo
                            </button>
                        </div>
                    )}
                </>
            )}

            {modo === 'add' && (
                <div className="bg-gray-800 rounded-lg p-4 sm:p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">Nuevo Pedido</h2>
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
                <div className="bg-gray-800 rounded-lg p-4 sm:p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">Editar Pedido</h2>
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
                <div className="bg-gray-800 rounded-lg p-4 sm:p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">Detalle del pedido</h2>

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
                                <DetailField label="Estado" value={pedidoDetalle.estado} bold />
                                <DetailField label="Tipo" value={pedidoDetalle.tipo === 'local' ? '🍽️ Local' : pedidoDetalle.tipo === 'recoger' ? '🛍️ Recoger' : '🛵 Domicilio'} />
                                <DetailField label="Fecha" value={pedidoDetalle.createdAt ? new Date(pedidoDetalle.createdAt).toLocaleString('es-ES') : '-'} />

                                {(pedidoDetalle.mesa?.nombre || pedidoDetalle.mesa?.numero) && (
                                    <DetailField label="Mesa" value={`Mesa ${pedidoDetalle.mesa.nombre ?? pedidoDetalle.mesa.numero}`} bold />
                                )}

                                {pedidoDetalle.creadoPor?.email && (
                                    <DetailField label="Creado por" value={`${pedidoDetalle.creadoPor.nombre ?? pedidoDetalle.creadoPor.email.split('@')[0]} (${pedidoDetalle.creadoPor.rol ?? 'usuario'})`} />
                                )}

                                {(pedidoDetalle.cliente || pedidoDetalle.telefono) && (
                                    <DetailField label="Cliente" value={`${pedidoDetalle.cliente || '-'}${pedidoDetalle.telefono ? ` · ${pedidoDetalle.telefono}` : ''}`} />
                                )}

                                {pedidoDetalle.direccionEntrega && (
                                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 md:col-span-2">
                                        <p className="text-gray-500 text-xs mb-1">Direccion de entrega</p>
                                        <p className="text-white">
                                            {pedidoDetalle.direccionEntrega.calle} {pedidoDetalle.direccionEntrega.numero}
                                            {pedidoDetalle.direccionEntrega.piso ? `, ${pedidoDetalle.direccionEntrega.piso}` : ''}
                                            {' · '}{pedidoDetalle.direccionEntrega.ciudad}
                                            {pedidoDetalle.direccionEntrega.codigoPostal ? ` (${pedidoDetalle.direccionEntrega.codigoPostal})` : ''}
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
                                                className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 bg-gray-700/50 px-3 py-2 rounded"
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
                        <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
                            <p className="text-gray-500 text-lg mb-4">
                                {filtroEstado.length === 0 && filtroTipo.length === 0 && !busqueda
                                    ? 'No hay pedidos registrados'
                                    : busqueda
                                      ? `Sin resultados para "${busqueda}"`
                                      : 'No hay pedidos con estos filtros'}
                            </p>
                            <button
                                onClick={() => setModo('add')}
                                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                            >
                                + Crear pedido
                            </button>
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

            <ConfirmModal {...confirmProps} />
        </div>
    );
}

function DetailField({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`text-white ${bold ? 'font-semibold' : ''}`}>{value}</p>
        </div>
    );
}


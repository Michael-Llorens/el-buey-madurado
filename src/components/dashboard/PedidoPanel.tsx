'use client';

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
        filtroTipo,
        setFiltroTipo,
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

    return (
        <div className="w-full min-w-0 space-y-4 sm:space-y-6">
            {modo === 'view' && (
                <>
                    {/* Boton nuevo pedido — prominente y fijo */}
                    <button
                        onClick={() => setModo('add')}
                        className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition text-base"
                    >
                        + Nuevo Pedido
                    </button>

                    {/* Stats compactas */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <MiniStat label="Pendientes" value={stats.pendientes} color="text-yellow-400" />
                        <MiniStat label="Preparando" value={stats.preparando} color="text-blue-400" />
                        <MiniStat label="Listos" value={stats.listos} color="text-purple-400" />
                        <MiniStat label="Servidos" value={stats.servidos} color="text-green-400" />
                        <MiniStat label="Recaudado" value={`${stats.totalRecaudado.toFixed(0)}€`} color="text-amber-400" />
                    </div>

                    {/* Filtros: estado + tipo */}
                    <div className="space-y-2">
                        {/* Por estado */}
                        <div className="flex gap-1.5 flex-wrap">
                            {[
                                { key: 'todos', label: `Todos (${pedidos.length})`, active: 'bg-gray-600' },
                                { key: 'pendiente', label: `Pendientes (${stats.pendientes})`, active: 'bg-yellow-600' },
                                { key: 'preparando', label: `Preparando (${stats.preparando})`, active: 'bg-blue-600' },
                                { key: 'listo', label: `Listos (${stats.listos})`, active: 'bg-purple-600' },
                                { key: 'servido', label: `Servidos (${stats.servidos})`, active: 'bg-green-600' },
                                { key: 'pagado', label: `Pagados (${stats.pagados})`, active: 'bg-gray-500' },
                            ].map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFiltroEstado(f.key)}
                                    className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                                        filtroEstado === f.key
                                            ? `${f.active} text-white`
                                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Por tipo */}
                        <div className="flex gap-1.5 flex-wrap">
                            {[
                                { key: 'todos', label: 'Todos', icon: '' },
                                { key: 'local', label: 'Local', icon: '🍽️' },
                                { key: 'recoger', label: 'Recoger', icon: '🛍️' },
                                { key: 'domicilio', label: 'Domicilio', icon: '🛵' },
                            ].map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFiltroTipo(f.key)}
                                    className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                                        filtroTipo === f.key
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {f.icon} {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
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
                                {filtroEstado === 'todos' && filtroTipo === 'todos'
                                    ? 'No hay pedidos registrados'
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

function MiniStat({ label, value, color }: { label: string; value: number | string; color: string }) {
    return (
        <div className="bg-gray-800 rounded-lg px-2 sm:px-4 py-2 border border-gray-700">
            <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wide truncate">{label}</p>
            <p className={`text-base sm:text-xl font-bold ${color}`}>{value}</p>
        </div>
    );
}

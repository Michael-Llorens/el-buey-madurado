'use client';

import { useState, useRef, useEffect } from 'react';
import PedidoForm from '@/components/dashboard/PedidoForm';
import PedidoCard from '@/components/dashboard/PedidoCard';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { usePedidoPanel } from './hooks/usePedidoPanel';

// ── Generador de ticket PDF (formato 80mm TPV) ──
async function generarTicketPDF(pedido: any) {
    const { jsPDF } = await import('jspdf');
    const w = 80; // 80mm de ancho (formato ticket TPV)
    const pdf = new jsPDF({ unit: 'mm', format: [w, 250] }); // alto inicial, se recorta
    const m = 4; // margen
    let y = m;

    const centro = (text: string, size: number) => {
        pdf.setFontSize(size);
        const tw = pdf.getTextWidth(text);
        pdf.text(text, (w - tw) / 2, y);
    };

    const linea = () => {
        pdf.setDrawColor(180); pdf.setLineWidth(0.2);
        pdf.line(m, y, w - m, y); y += 2;
    };

    // ── Cabecera ──
    pdf.setTextColor(40, 40, 40);
    centro('EL BUEY MADURADO', 12); y += 5;
    centro('Carne Madurada Premium', 7); y += 3;
    centro('CIF: B12345678', 6); y += 3; // placeholder
    linea();

    // ── Info pedido ──
    pdf.setFontSize(7); pdf.setTextColor(60, 60, 60);
    const numPedido = '#' + (pedido._id?.slice(-4)?.toUpperCase() || '----');
    const fecha = pedido.createdAt ? new Date(pedido.createdAt).toLocaleString('es-ES') : '-';
    centro(`Pedido ${numPedido}`, 9); y += 4;
    pdf.text(`Fecha: ${fecha}`, m, y); y += 3.5;

    const tipoLabel = pedido.tipo === 'local' ? 'En local' : pedido.tipo === 'recoger' ? 'Para recoger' : 'A domicilio';
    pdf.text(`Tipo: ${tipoLabel}`, m, y); y += 3.5;

    if (pedido.tipo === 'local' && pedido.mesa) {
        pdf.text(`Mesa: ${pedido.mesa.nombre ?? pedido.mesa.numero ?? '-'}`, m, y); y += 3.5;
    }
    if (pedido.cliente) { pdf.text(`Cliente: ${pedido.cliente}`, m, y); y += 3.5; }
    if (pedido.telefono) { pdf.text(`Tel: ${pedido.telefono}`, m, y); y += 3.5; }
    if (pedido.direccionEntrega) {
        const dir = pedido.direccionEntrega;
        pdf.text(`Dir: ${dir.calle} ${dir.numero}${dir.piso ? ', ' + dir.piso : ''}`, m, y); y += 3.5;
        pdf.text(`     ${dir.ciudad} ${dir.codigoPostal || ''}`, m, y); y += 3.5;
    }
    if (pedido.creadoPor) {
        const cam = pedido.creadoPor.nombre ?? pedido.creadoPor.email?.split('@')[0] ?? '';
        if (cam) { pdf.text(`Atendido por: ${cam}`, m, y); y += 3.5; }
    }
    y += 1; linea();

    // ── Productos ──
    pdf.setFontSize(7); pdf.setTextColor(40, 40, 40);
    pdf.text('Ud.  Producto', m, y);
    pdf.text('Importe', w - m - pdf.getTextWidth('Importe'), y); y += 4;

    (pedido.productos || []).forEach((item: any) => {
        const nombre = item.producto?.nombre ?? 'Producto';
        const cant = item.cantidad;
        const sub = Number(item.subtotal || 0).toFixed(2) + '€';
        const precioUd = Number(item.precioUnitario || 0).toFixed(2) + '€';

        pdf.setFontSize(7); pdf.setTextColor(30, 30, 30);
        pdf.text(`${cant}x  ${nombre.slice(0, 28)}`, m, y);
        pdf.text(sub, w - m - pdf.getTextWidth(sub), y); y += 3.2;

        // Precio unitario si cantidad > 1
        if (cant > 1) {
            pdf.setFontSize(5.5); pdf.setTextColor(120, 120, 120);
            pdf.text(`     ${precioUd}/ud`, m, y); y += 2.8;
        }

        // Notas
        if (item.notas) {
            pdf.setFontSize(5.5); pdf.setTextColor(100, 100, 100);
            pdf.text(`     Nota: ${item.notas.slice(0, 40)}`, m, y); y += 2.8;
        }

        // Personalizaciones
        const extras: string[] = item?.personalizaciones?.ingredientesExtra || [];
        const removidos: string[] = item?.personalizaciones?.ingredientesRemovidos || [];
        if (extras.length > 0) {
            pdf.setFontSize(5.5); pdf.setTextColor(0, 130, 0);
            pdf.text(`     + ${extras.join(', ').slice(0, 40)}`, m, y); y += 2.8;
        }
        if (removidos.length > 0) {
            pdf.setFontSize(5.5); pdf.setTextColor(180, 0, 0);
            pdf.text(`     - ${removidos.join(', ').slice(0, 40)}`, m, y); y += 2.8;
        }
    });

    y += 1; linea();

    // ── Totales ──
    pdf.setFontSize(7); pdf.setTextColor(60, 60, 60);
    const subtotalTxt = Number(pedido.subtotal || 0).toFixed(2) + '€';
    pdf.text('Subtotal:', m, y);
    pdf.text(subtotalTxt, w - m - pdf.getTextWidth(subtotalTxt), y); y += 3.5;

    const ivaTxt = Number(pedido.impuestos || 0).toFixed(2) + '€';
    pdf.text('IVA (21%):', m, y);
    pdf.text(ivaTxt, w - m - pdf.getTextWidth(ivaTxt), y); y += 3.5;

    if (Number(pedido.gastoEnvio || 0) > 0) {
        const envioTxt = Number(pedido.gastoEnvio).toFixed(2) + '€';
        pdf.text('Envío:', m, y);
        pdf.text(envioTxt, w - m - pdf.getTextWidth(envioTxt), y); y += 3.5;
    }
    if (Number(pedido.descuento || 0) > 0) {
        const descTxt = '-' + Number(pedido.descuento).toFixed(2) + '€';
        pdf.text('Descuento:', m, y);
        pdf.text(descTxt, w - m - pdf.getTextWidth(descTxt), y); y += 3.5;
    }

    y += 1;
    pdf.setFontSize(10); pdf.setTextColor(0, 0, 0);
    const totalTxt = Number(pedido.total || 0).toFixed(2) + '€';
    pdf.text('TOTAL:', m, y);
    pdf.text(totalTxt, w - m - pdf.getTextWidth(totalTxt), y); y += 5;

    if (pedido.metodoPago) {
        pdf.setFontSize(6.5); pdf.setTextColor(80, 80, 80);
        centro(`Método de pago: ${pedido.metodoPago}`, 6.5); y += 4;
    }

    linea();
    pdf.setFontSize(6); pdf.setTextColor(120, 120, 120);
    centro('Gracias por su visita', 7); y += 3.5;
    centro('www.restauranteelbueymadurado.com', 5.5); y += 3;

    // Nombre del archivo
    const numCorto = pedido._id?.slice(-4)?.toUpperCase() || 'XXXX';
    pdf.save(`ticket-${numCorto}-elbuey.pdf`);
}

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
                <div className="max-w-2xl mx-auto">
                    {error && <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>}

                    {loadingDetalle ? (
                        <div className="text-center text-gray-400 py-12">Cargando detalle...</div>
                    ) : !pedidoDetalle ? (
                        <div className="text-center text-gray-400 py-12">No se pudo cargar el pedido.</div>
                    ) : (
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                            {/* ── Cabecera con estado ── */}
                            <div className={`px-5 sm:px-6 py-4 ${
                                pedidoDetalle.estado === 'pagado' ? 'bg-green-900/30' :
                                pedidoDetalle.estado === 'cancelado' ? 'bg-red-900/30' :
                                'bg-gray-900/50'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-amber-400 font-bold text-lg sm:text-xl">
                                                Pedido #{pedidoDetalle._id?.slice(-4)?.toUpperCase()}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                pedidoDetalle.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                                                pedidoDetalle.estado === 'preparando' ? 'bg-blue-500/20 text-blue-300' :
                                                pedidoDetalle.estado === 'listo' ? 'bg-purple-500/20 text-purple-300' :
                                                pedidoDetalle.estado === 'servido' ? 'bg-green-500/20 text-green-300' :
                                                pedidoDetalle.estado === 'pagado' ? 'bg-green-500/20 text-green-200' :
                                                pedidoDetalle.estado === 'cancelado' ? 'bg-red-500/20 text-red-300' :
                                                'bg-gray-500/20 text-gray-300'
                                            }`}>
                                                {pedidoDetalle.estado?.charAt(0).toUpperCase() + pedidoDetalle.estado?.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {pedidoDetalle.createdAt ? new Date(pedidoDetalle.createdAt).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => void generarTicketPDF(pedidoDetalle)} className="p-2 bg-gray-700/60 hover:bg-gray-600 rounded-lg transition text-sm" title="Ticket">🧾</button>
                                        <button onClick={() => handleEditar(pedidoDetalle)} className="p-2 bg-gray-700/60 hover:bg-gray-600 rounded-lg transition text-sm" title="Editar">✏️</button>
                                        <button onClick={cerrarDetalle} className="p-2 bg-gray-700/60 hover:bg-gray-600 rounded-lg transition text-sm" title="Volver">✕</button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Info del pedido ── */}
                            <div className="px-5 sm:px-6 py-4 border-b border-gray-700/50">
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                    {/* Tipo */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-lg">{pedidoDetalle.tipo === 'local' ? '🍽️' : pedidoDetalle.tipo === 'recoger' ? '🛍️' : '🛵'}</span>
                                        <span className="text-white font-medium">
                                            {pedidoDetalle.tipo === 'local' ? 'En local' : pedidoDetalle.tipo === 'recoger' ? 'Para recoger' : 'A domicilio'}
                                        </span>
                                    </div>

                                    {/* Mesa */}
                                    {(pedidoDetalle.mesa?.nombre || pedidoDetalle.mesa?.numero) && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-500">Mesa:</span>
                                            <span className="text-white font-medium">{pedidoDetalle.mesa.nombre ?? pedidoDetalle.mesa.numero}</span>
                                        </div>
                                    )}

                                    {/* Camarero */}
                                    {pedidoDetalle.creadoPor?.email && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-500">Atendido por:</span>
                                            <span className="text-white">{pedidoDetalle.creadoPor.nombre ?? pedidoDetalle.creadoPor.email.split('@')[0]}</span>
                                        </div>
                                    )}

                                    {/* Cliente */}
                                    {pedidoDetalle.cliente && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-500">Cliente:</span>
                                            <span className="text-white">{pedidoDetalle.cliente}</span>
                                        </div>
                                    )}

                                    {/* Teléfono */}
                                    {pedidoDetalle.telefono && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-500">Tel:</span>
                                            <span className="text-white">{pedidoDetalle.telefono}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dirección */}
                                {pedidoDetalle.direccionEntrega && (
                                    <div className="mt-3 pt-3 border-t border-gray-700/40">
                                        <p className="text-gray-500 text-xs mb-1">Dirección de entrega</p>
                                        <p className="text-white text-sm">
                                            {pedidoDetalle.direccionEntrega.calle} {pedidoDetalle.direccionEntrega.numero}
                                            {pedidoDetalle.direccionEntrega.piso ? `, ${pedidoDetalle.direccionEntrega.piso}` : ''}
                                            {' · '}{pedidoDetalle.direccionEntrega.ciudad}
                                            {pedidoDetalle.direccionEntrega.codigoPostal ? ` (${pedidoDetalle.direccionEntrega.codigoPostal})` : ''}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ── Productos ── */}
                            <div className="px-5 sm:px-6 py-4 border-b border-gray-700/50">
                                <div className="space-y-3">
                                    {(pedidoDetalle.productos || []).map((item: any, idx: number) => {
                                        const extras: string[] = item?.personalizaciones?.ingredientesExtra || [];
                                        const removidos: string[] = item?.personalizaciones?.ingredientesRemovidos || [];

                                        return (
                                            <div key={idx} className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-amber-400 font-bold text-sm">{item.cantidad}x</span>
                                                        <span className="text-white font-medium text-sm">{item.producto?.nombre ?? 'Producto'}</span>
                                                        {item.precioUnitario !== undefined && item.cantidad > 1 && (
                                                            <span className="text-gray-500 text-xs">({Number(item.precioUnitario).toFixed(2)}€/ud)</span>
                                                        )}
                                                    </div>

                                                    {item.notas && (
                                                        <p className="text-xs text-gray-400 mt-0.5 pl-6">📝 {item.notas}</p>
                                                    )}

                                                    {extras.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1 pl-6">
                                                            {extras.map((ing, i) => (
                                                                <span key={`e${idx}-${i}`} className="text-[10px] text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded">+ {ing}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {removidos.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1 pl-6">
                                                            {removidos.map((ing, i) => (
                                                                <span key={`r${idx}-${i}`} className="text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">- {ing}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="text-white font-semibold text-sm whitespace-nowrap">
                                                    {Number(item.subtotal || 0).toFixed(2)}€
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Totales ── */}
                            <div className="px-5 sm:px-6 py-4 bg-gray-900/30">
                                <div className="space-y-1.5 text-sm max-w-xs ml-auto">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{Number(pedidoDetalle.subtotal || 0).toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>IVA (21%)</span>
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
                                    <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-gray-600">
                                        <span>TOTAL</span>
                                        <span className="text-amber-400 text-lg">{Number(pedidoDetalle.total || 0).toFixed(2)}€</span>
                                    </div>
                                    {pedidoDetalle.metodoPago && (
                                        <p className="text-xs text-gray-500 text-right pt-1">Pago: {pedidoDetalle.metodoPago}</p>
                                    )}
                                </div>
                            </div>

                            {/* ── Acciones ── */}
                            <div className="px-5 sm:px-6 py-4 flex gap-2 flex-wrap">
                                <button onClick={cerrarDetalle} className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition text-sm">
                                    ← Volver
                                </button>
                                {pedidoDetalle?.estado !== 'pagado' && pedidoDetalle?.estado !== 'entregado' && pedidoDetalle?.estado !== 'cancelado' && (
                                    <button onClick={() => void handleEliminar(pedidoDetalle._id)} className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-medium transition text-sm">
                                        Cancelar pedido
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



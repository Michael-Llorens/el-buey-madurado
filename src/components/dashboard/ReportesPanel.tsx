'use client';

import { useRef, useState, useEffect } from 'react';
import { useReportes, authFetcher } from '@/lib/hooks/swr';

const LABEL_TIPO: Record<string, string> = {
  local: 'En local',
  recoger: 'Para recoger',
  domicilio: 'A domicilio',
};

const LABEL_ESTADO: Record<string, string> = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  listo: 'Listo',
  en_camino: 'En camino',
  servido: 'Servido',
  entregado: 'Entregado',
  pagado: 'Pagado',
  cancelado: 'Cancelado',
};

const COLOR_ESTADO: Record<string, string> = {
  pendiente: 'text-yellow-400',
  preparando: 'text-blue-400',
  listo: 'text-green-400',
  en_camino: 'text-cyan-400',
  servido: 'text-indigo-400',
  entregado: 'text-emerald-400',
  pagado: 'text-green-300',
  cancelado: 'text-red-400',
};

function euro(n: number) {
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

export default function ReportesPanel() {
  const { reportes, error, isLoading } = useReportes();
  const reporteRef = useRef<HTMLDivElement>(null);
  const [exportando, setExportando] = useState(false);
  const [menuExportar, setMenuExportar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuExportar(false);
    }
    if (menuExportar) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuExportar]);

  // ── Helper: cargar todos los pedidos ──
  const cargarPedidos = async (): Promise<any[]> => {
    const res = await authFetcher('/api/pedidos?limit=10000');
    return Array.isArray(res) ? res : res?.data ?? [];
  };

  // ── Helper: extraer datos de un pedido ──
  const extraerDatos = (p: any) => {
    const fecha = p.createdAt ? new Date(p.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
    const tipo = LABEL_TIPO[p.tipo] || p.tipo || '-';
    let mesaCliente = '-';
    if (p.tipo === 'local' && p.mesa) mesaCliente = `Mesa ${p.mesa.nombre ?? p.mesa.numero ?? ''}`;
    else if (p.cliente) mesaCliente = p.cliente;
    const telefono = p.telefono || '';
    const direccion = p.direccionEntrega ? `${p.direccionEntrega.calle} ${p.direccionEntrega.numero}${p.direccionEntrega.piso ? `, ${p.direccionEntrega.piso}` : ''} · ${p.direccionEntrega.ciudad}` : '';
    const productos = (p.productos || []).map((i: any) => `${i.cantidad}x ${i.producto?.nombre || '?'}`).join(', ');
    const camarero = p.creadoPor?.nombre ?? p.creadoPor?.email?.split('@')[0] ?? '-';
    const metodoPago = p.metodoPago || '-';
    const estado = LABEL_ESTADO[p.estado] || p.estado || '-';
    return { id: p._id?.slice(-4)?.toUpperCase() || '-', fecha, tipo, mesaCliente, telefono, direccion, productos, subtotal: Number(p.subtotal || 0), iva: Number(p.impuestos || 0), total: Number(p.total || 0), camarero, metodoPago, estado };
  };

  // ══════════════════════════════════════════
  // EXPORTAR PDF
  // ══════════════════════════════════════════
  const exportarPDF = async () => {
    if (!reportes) return;
    setExportando(true);
    setMenuExportar(false);
    try {
      const { jsPDF } = await import('jspdf');
      const pedidos = await cargarPedidos();

      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageW = 287;
      const pageH = 200;
      const margin = 10;
      let y = margin;

      const checkPage = (needed: number) => {
        if (y + needed > pageH - margin) { pdf.addPage(); y = margin; }
      };

      // Cabecera
      pdf.setFontSize(20); pdf.setTextColor(217, 119, 6);
      pdf.text('El Buey Madurado', margin, y + 6);
      pdf.setFontSize(12); pdf.setTextColor(100, 100, 100);
      pdf.text('Informe completo de pedidos', margin + 80, y + 6);
      pdf.setFontSize(9);
      pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageW - margin - 55, y + 6);
      y += 14;

      // Resumen
      pdf.setFontSize(13); pdf.setTextColor(40, 40, 40); pdf.text('Resumen general', margin, y); y += 6;
      pdf.setFontSize(9); pdf.setTextColor(60, 60, 60);
      [
        `Total pedidos: ${reportes.resumen.totalPedidos}  |  Pagados: ${reportes.resumen.pedidosPagados}  |  Ingresos: ${euro(reportes.resumen.ingresosPagados)}  |  Ticket medio: ${euro(reportes.resumen.ticketMedio)}`,
        `Hoy: ${reportes.resumen.pedidosHoy} pedidos, ${euro(reportes.resumen.ingresosHoy)}  |  IVA: ${euro(reportes.resumen.impuestosTotales)}  |  Descuentos: ${euro(reportes.resumen.descuentosTotales)}`,
      ].forEach((l) => { pdf.text(l, margin, y); y += 4.5; });
      y += 4;

      // Desglose por tipo
      if (reportes.porTipo?.length > 0) {
        pdf.setFontSize(11); pdf.setTextColor(40, 40, 40); pdf.text('Desglose por tipo', margin, y); y += 5;
        pdf.setFontSize(8); pdf.setTextColor(80, 80, 80);
        reportes.porTipo.forEach((t: any) => { pdf.text(`${LABEL_TIPO[t.tipo] || t.tipo}: ${t.count} pedidos — ${euro(t.ingresos)}`, margin + 4, y); y += 4; });
        y += 4;
      }

      // Top productos
      if (reportes.topProductos?.length > 0) {
        checkPage(30);
        pdf.setFontSize(11); pdf.setTextColor(40, 40, 40); pdf.text('Top 10 productos', margin, y); y += 5;
        pdf.setFontSize(8); pdf.setTextColor(80, 80, 80);
        reportes.topProductos.slice(0, 10).forEach((p: any, i: number) => { pdf.text(`${i + 1}. ${p.nombre} — ${p.totalVendido} uds — ${euro(p.ingresos)}`, margin + 4, y); y += 4; });
        y += 6;
      }

      // Tabla de pedidos
      pdf.addPage(); y = margin;
      pdf.setFontSize(14); pdf.setTextColor(217, 119, 6);
      pdf.text(`Listado completo de pedidos (${pedidos.length})`, margin, y + 5); y += 12;

      const cols = [
        { label: '#', x: margin, w: 10 },
        { label: 'Fecha', x: margin + 10, w: 28 },
        { label: 'Tipo', x: margin + 38, w: 18 },
        { label: 'Mesa/Cliente', x: margin + 56, w: 28 },
        { label: 'Teléfono', x: margin + 84, w: 22 },
        { label: 'Productos', x: margin + 106, w: 60 },
        { label: 'Subtotal', x: margin + 166, w: 18 },
        { label: 'IVA', x: margin + 184, w: 15 },
        { label: 'Total', x: margin + 199, w: 18 },
        { label: 'Camarero', x: margin + 217, w: 22 },
        { label: 'Pago', x: margin + 239, w: 16 },
        { label: 'Estado', x: margin + 255, w: 18 },
      ];

      const drawHeader = () => {
        pdf.setFillColor(40, 40, 40);
        pdf.rect(margin, y - 3.5, pageW - margin * 2, 5.5, 'F');
        pdf.setFontSize(6.5); pdf.setTextColor(255, 255, 255);
        cols.forEach((c) => pdf.text(c.label, c.x + 1, y));
        y += 4;
      };
      drawHeader();

      pdf.setFontSize(6.5);
      pedidos.forEach((p: any, idx: number) => {
        checkPage(5);
        if (y === margin) drawHeader();

        if (idx % 2 === 0) { pdf.setFillColor(245, 245, 245); pdf.rect(margin, y - 3, pageW - margin * 2, 4.2, 'F'); }

        const d = extraerDatos(p);
        pdf.setTextColor(50, 50, 50);
        pdf.text(d.id, cols[0].x + 1, y);
        pdf.text(d.fecha, cols[1].x + 1, y);
        pdf.text(d.tipo, cols[2].x + 1, y);
        pdf.text(d.mesaCliente.slice(0, 22), cols[3].x + 1, y);
        pdf.text(d.telefono.slice(0, 15), cols[4].x + 1, y);
        pdf.text(d.productos.slice(0, 48) + (d.productos.length > 48 ? '...' : ''), cols[5].x + 1, y);
        pdf.text(d.subtotal.toFixed(2) + '€', cols[6].x + 1, y);
        pdf.text(d.iva.toFixed(2) + '€', cols[7].x + 1, y);
        pdf.setTextColor(0, 120, 0);
        pdf.text(d.total.toFixed(2) + '€', cols[8].x + 1, y);
        pdf.setTextColor(50, 50, 50);
        pdf.text(d.camarero.slice(0, 16), cols[9].x + 1, y);
        pdf.text(d.metodoPago.slice(0, 12), cols[10].x + 1, y);
        pdf.text(d.estado, cols[11].x + 1, y);
        y += 4.2;
      });

      checkPage(10); y += 4;
      pdf.setFontSize(8); pdf.setTextColor(150, 150, 150);
      pdf.text(`Total: ${pedidos.length} pedidos | Generado por El Buey Madurado PDA`, margin, y);

      pdf.save(`informe-pedidos-elbuey-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Error generando PDF:', e);
    } finally {
      setExportando(false);
    }
  };

  // ══════════════════════════════════════════
  // CIERRE DE CAJA DIARIO
  // ══════════════════════════════════════════
  const exportarCierreCaja = async () => {
    if (!reportes) return;
    setExportando(true);
    setMenuExportar(false);
    try {
      const { jsPDF } = await import('jspdf');
      const pedidos = await cargarPedidos();

      // Filtrar solo pedidos de hoy
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const pedidosHoy = pedidos.filter((p: any) => new Date(p.createdAt).getTime() >= hoy.getTime());
      const pagadosHoy = pedidosHoy.filter((p: any) => p.estado === 'pagado');

      const totalCobrado = pagadosHoy.reduce((s: number, p: any) => s + Number(p.total || 0), 0);
      const totalIVA = pagadosHoy.reduce((s: number, p: any) => s + Number(p.impuestos || 0), 0);
      const totalDescuentos = pagadosHoy.reduce((s: number, p: any) => s + Number(p.descuento || 0), 0);
      const totalEnvio = pagadosHoy.reduce((s: number, p: any) => s + Number(p.gastoEnvio || 0), 0);

      // Desglose por tipo
      const porTipo: Record<string, { count: number; total: number }> = {};
      pagadosHoy.forEach((p: any) => {
        if (!porTipo[p.tipo]) porTipo[p.tipo] = { count: 0, total: 0 };
        porTipo[p.tipo].count++;
        porTipo[p.tipo].total += Number(p.total || 0);
      });

      // Desglose por método de pago
      const porPago: Record<string, { count: number; total: number }> = {};
      pagadosHoy.forEach((p: any) => {
        const metodo = p.metodoPago || 'Sin especificar';
        if (!porPago[metodo]) porPago[metodo] = { count: 0, total: 0 };
        porPago[metodo].count++;
        porPago[metodo].total += Number(p.total || 0);
      });

      // Desglose por camarero
      const porCamarero: Record<string, { count: number; total: number }> = {};
      pagadosHoy.forEach((p: any) => {
        const cam = p.creadoPor?.nombre ?? p.creadoPor?.email?.split('@')[0] ?? 'Desconocido';
        if (!porCamarero[cam]) porCamarero[cam] = { count: 0, total: 0 };
        porCamarero[cam].count++;
        porCamarero[cam].total += Number(p.total || 0);
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const m = 15;
      const pw = 180;
      let y = m;

      // Cabecera
      pdf.setFontSize(20); pdf.setTextColor(217, 119, 6);
      pdf.text('El Buey Madurado', m, y + 6);
      pdf.setFontSize(14); pdf.setTextColor(40, 40, 40);
      pdf.text('Cierre de caja diario', m + 80, y + 6);
      y += 12;
      pdf.setFontSize(10); pdf.setTextColor(80, 80, 80);
      pdf.text(`Fecha: ${hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, m, y);
      y += 5;
      pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, m, y);
      y += 10;

      // Línea separadora
      const drawLine = () => { pdf.setDrawColor(200); pdf.setLineWidth(0.3); pdf.line(m, y, m + pw, y); y += 4; };

      // ── RESUMEN GENERAL ──
      pdf.setFontSize(13); pdf.setTextColor(40, 40, 40);
      pdf.text('Resumen del día', m, y); y += 8;

      const addRow = (label: string, value: string, bold = false) => {
        pdf.setFontSize(10);
        pdf.setTextColor(bold ? 0 : 60, bold ? 0 : 60, bold ? 0 : 60);
        pdf.text(label, m + 4, y);
        pdf.text(value, m + pw - pdf.getTextWidth(value), y);
        y += 5.5;
      };

      addRow('Total pedidos hoy', String(pedidosHoy.length));
      addRow('Pedidos pagados', String(pagadosHoy.length));
      addRow('Pedidos pendientes/en curso', String(pedidosHoy.filter((p: any) => !['pagado', 'cancelado', 'entregado'].includes(p.estado)).length));
      addRow('Pedidos cancelados', String(pedidosHoy.filter((p: any) => p.estado === 'cancelado').length));
      y += 2; drawLine();

      addRow('Total cobrado', euro(totalCobrado), true);
      addRow('IVA recaudado', euro(totalIVA));
      addRow('Descuentos aplicados', euro(totalDescuentos));
      if (totalEnvio > 0) addRow('Gastos de envío', euro(totalEnvio));
      addRow('Ticket medio', pagadosHoy.length > 0 ? euro(totalCobrado / pagadosHoy.length) : '0,00 €');
      y += 2; drawLine();

      // ── POR TIPO ──
      pdf.setFontSize(12); pdf.setTextColor(40, 40, 40);
      pdf.text('Desglose por tipo', m, y); y += 7;
      Object.entries(porTipo).forEach(([tipo, data]) => {
        addRow(`${LABEL_TIPO[tipo] || tipo}`, `${data.count} pedidos — ${euro(data.total)}`);
      });
      if (Object.keys(porTipo).length === 0) { addRow('Sin pedidos pagados', '-'); }
      y += 2; drawLine();

      // ── POR MÉTODO DE PAGO ──
      pdf.setFontSize(12); pdf.setTextColor(40, 40, 40);
      pdf.text('Desglose por método de pago', m, y); y += 7;
      Object.entries(porPago).forEach(([metodo, data]) => {
        addRow(metodo, `${data.count} pedidos — ${euro(data.total)}`);
      });
      if (Object.keys(porPago).length === 0) { addRow('Sin datos de pago', '-'); }
      y += 2; drawLine();

      // ── POR CAMARERO ──
      pdf.setFontSize(12); pdf.setTextColor(40, 40, 40);
      pdf.text('Desglose por camarero', m, y); y += 7;
      Object.entries(porCamarero).sort((a, b) => b[1].total - a[1].total).forEach(([cam, data]) => {
        addRow(cam, `${data.count} pedidos — ${euro(data.total)}`);
      });
      y += 6;

      // Firma
      drawLine();
      pdf.setFontSize(9); pdf.setTextColor(120, 120, 120);
      pdf.text('Firma del encargado: _________________________', m, y); y += 8;
      pdf.text('Observaciones: ________________________________', m, y);

      pdf.save(`cierre-caja-elbuey-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Error generando cierre de caja:', e);
    } finally {
      setExportando(false);
    }
  };

  // ══════════════════════════════════════════
  // EXPORTAR CSV (Excel)
  // ══════════════════════════════════════════
  const exportarCSV = async () => {
    setExportando(true);
    setMenuExportar(false);
    try {
      const pedidos = await cargarPedidos();
      const sep = ';'; // punto y coma para que Excel en español lo abra directamente
      const headers = ['#', 'Fecha', 'Tipo', 'Mesa/Cliente', 'Teléfono', 'Dirección', 'Productos', 'Subtotal', 'IVA', 'Total', 'Camarero', 'Método pago', 'Estado'];
      const rows = pedidos.map((p: any) => {
        const d = extraerDatos(p);
        return [d.id, d.fecha, d.tipo, d.mesaCliente, d.telefono, d.direccion, `"${d.productos}"`, d.subtotal.toFixed(2), d.iva.toFixed(2), d.total.toFixed(2), d.camarero, d.metodoPago, d.estado];
      });

      const csv = '\uFEFF' + [headers.join(sep), ...rows.map((r) => r.join(sep))].join('\n'); // BOM para UTF-8 en Excel
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedidos-elbuey-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generando CSV:', e);
    } finally {
      setExportando(false);
    }
  };

  // ══════════════════════════════════════════
  // CIERRE DE CAJA CSV
  // ══════════════════════════════════════════
  const exportarCierreCajaCSV = async () => {
    setExportando(true);
    setMenuExportar(false);
    try {
      const pedidos = await cargarPedidos();
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const pedidosHoy = pedidos.filter((p: any) => new Date(p.createdAt).getTime() >= hoy.getTime());

      const sep = ';';
      const bom = '\uFEFF';
      const fechaStr = hoy.toLocaleDateString('es-ES');

      // Resumen
      const pagados = pedidosHoy.filter((p: any) => p.estado === 'pagado');
      const totalCobrado = pagados.reduce((s: number, p: any) => s + Number(p.total || 0), 0);
      const totalIVA = pagados.reduce((s: number, p: any) => s + Number(p.impuestos || 0), 0);

      const lines: string[] = [
        `CIERRE DE CAJA - EL BUEY MADURADO`,
        `Fecha${sep}${fechaStr}`,
        `Generado${sep}${new Date().toLocaleString('es-ES')}`,
        '',
        `RESUMEN`,
        `Total pedidos hoy${sep}${pedidosHoy.length}`,
        `Pedidos pagados${sep}${pagados.length}`,
        `Total cobrado${sep}${totalCobrado.toFixed(2)}€`,
        `IVA recaudado${sep}${totalIVA.toFixed(2)}€`,
        `Ticket medio${sep}${pagados.length > 0 ? (totalCobrado / pagados.length).toFixed(2) : '0.00'}€`,
        '',
        `DETALLE PEDIDOS DEL DÍA`,
        ['#', 'Hora', 'Tipo', 'Mesa/Cliente', 'Teléfono', 'Productos', 'Subtotal', 'IVA', 'Total', 'Camarero', 'Pago', 'Estado'].join(sep),
      ];

      pedidosHoy.forEach((p: any) => {
        const d = extraerDatos(p);
        lines.push([d.id, d.fecha, d.tipo, d.mesaCliente, d.telefono, `"${d.productos}"`, d.subtotal.toFixed(2), d.iva.toFixed(2), d.total.toFixed(2), d.camarero, d.metodoPago, d.estado].join(sep));
      });

      const csv = bom + lines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cierre-caja-elbuey-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generando CSV cierre:', e);
    } finally {
      setExportando(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-400 py-12">Cargando reportes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded">
        Error al cargar reportes: {error.message}
      </div>
    );
  }

  if (!reportes) return null;

  const { resumen, porTipo, porEstado, topProductos, ingresosDiarios } = reportes;

  return (
    <div className="space-y-6">
      {/* Botón exportar con dropdown de formato */}
      <div className="flex justify-end relative" ref={menuRef}>
        <button
          onClick={() => !exportando && setMenuExportar(!menuExportar)}
          disabled={exportando}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white rounded-lg font-medium text-sm transition flex items-center gap-2"
        >
          {exportando ? 'Exportando...' : '📥 Exportar ▼'}
        </button>

        {menuExportar && (
          <div className="absolute right-0 top-full mt-1 bg-gray-950 border border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden min-w-[240px]">
            <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Informe de pedidos</p>
            <button
              onClick={() => void exportarPDF()}
              className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition"
            >
              📄 PDF — Informe completo
            </button>
            <button
              onClick={() => void exportarCSV()}
              className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition"
            >
              📊 CSV — Excel / Hoja de cálculo
            </button>
            <div className="border-t border-gray-700 mt-1 pt-1">
              <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Cierre de caja (hoy)</p>
              <button
                onClick={() => void exportarCierreCaja()}
                className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition"
              >
                📄 PDF — Cierre de caja
              </button>
              <button
                onClick={() => void exportarCierreCajaCSV()}
                className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition"
              >
                📊 CSV — Cierre de caja
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={reporteRef} className="space-y-8">
      {/* ============ TARJETAS RESUMEN ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          titulo="Ingresos totales"
          valor={euro(resumen.ingresosPagados)}
          subtitulo={`${resumen.pedidosPagados} pedidos pagados`}
          color="text-green-400"
        />
        <Card
          titulo="Hoy"
          valor={euro(resumen.ingresosHoy)}
          subtitulo={`${resumen.pedidosHoy} pedidos`}
          color="text-amber-400"
        />
        <Card
          titulo="Ticket medio"
          valor={euro(resumen.ticketMedio)}
          subtitulo="por pedido pagado"
          color="text-purple-400"
        />
        <Card
          titulo="Pedidos totales"
          valor={String(resumen.totalPedidos)}
          subtitulo={`${resumen.pedidosCancelados} cancelados`}
          color="text-blue-400"
        />
      </div>

      {/* ============ FILA DOBLE: POR TIPO + POR ESTADO ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por tipo */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Pedidos por tipo</h3>
          {porTipo.length === 0 ? (
            <p className="text-gray-500">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {porTipo.map((t) => (
                <div key={t.tipo} className="flex items-center justify-between">
                  <span className="text-gray-300">{LABEL_TIPO[t.tipo] ?? t.tipo}</span>
                  <div className="text-right">
                    <span className="text-white font-semibold">{t.count}</span>
                    <span className="text-gray-500 text-sm ml-3">{euro(t.ingresos)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Por estado */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Pedidos por estado</h3>
          {porEstado.length === 0 ? (
            <p className="text-gray-500">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {porEstado.map((e) => (
                <div key={e.estado} className="flex items-center justify-between">
                  <span className={COLOR_ESTADO[e.estado] ?? 'text-gray-300'}>
                    {LABEL_ESTADO[e.estado] ?? e.estado}
                  </span>
                  <span className="text-white font-semibold">{e.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ TOP PRODUCTOS ============ */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-4">Top 10 productos</h3>
        {topProductos.length === 0 ? (
          <p className="text-gray-500">Sin datos de ventas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="text-left py-2 pr-4">#</th>
                  <th className="text-left py-2 pr-4">Producto</th>
                  <th className="text-left py-2 pr-4">Categoria</th>
                  <th className="text-right py-2 pr-4">Uds. vendidas</th>
                  <th className="text-right py-2">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProductos.map((p, i) => (
                  <tr key={p.nombre + i} className="border-b border-gray-700/50">
                    <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
                    <td className="py-2 pr-4 text-white font-medium">{p.nombre}</td>
                    <td className="py-2 pr-4 text-gray-400 text-sm">{p.categoria}</td>
                    <td className="py-2 pr-4 text-right text-amber-400 font-semibold">
                      {p.cantidadVendida}
                    </td>
                    <td className="py-2 text-right text-green-400">{euro(p.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ INGRESOS ÚLTIMOS 30 DÍAS ============ */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-4">
          Ingresos - Ultimos 30 dias (pedidos pagados)
        </h3>
        {ingresosDiarios.length === 0 ? (
          <p className="text-gray-500">Sin datos en los ultimos 30 dias</p>
        ) : (
          <div className="space-y-2">
            {/* Barra visual simple */}
            {(() => {
              const maxIngreso = Math.max(...ingresosDiarios.map((d) => d.ingresos), 1);
              return ingresosDiarios.map((d) => (
                <div key={d.fecha} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 w-24 shrink-0">
                    {new Date(d.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${(d.ingresos / maxIngreso) * 100}%` }}
                    />
                  </div>
                  <span className="text-green-400 w-20 text-right shrink-0">
                    {euro(d.ingresos)}
                  </span>
                  <span className="text-gray-500 w-12 text-right shrink-0">
                    {d.pedidos}p
                  </span>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* ============ DETALLE FISCAL ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          titulo="IVA recaudado (21%)"
          valor={euro(resumen.impuestosTotales)}
          subtitulo="sobre todos los pedidos"
          color="text-orange-400"
        />
        <Card
          titulo="Descuentos aplicados"
          valor={euro(resumen.descuentosTotales)}
          subtitulo="total descontado"
          color="text-red-400"
        />
        <Card
          titulo="Envios cobrados"
          valor={euro(
            porTipo.find((t) => t.tipo === 'domicilio')?.ingresos
              ? porTipo.find((t) => t.tipo === 'domicilio')!.ingresos * 0 // placeholder
              : 0
          )}
          subtitulo={`${porTipo.find((t) => t.tipo === 'domicilio')?.count ?? 0} pedidos a domicilio`}
          color="text-cyan-400"
        />
      </div>
      </div>{/* cierre ref={reporteRef} */}
    </div>
  );
}

// ============================================================
// Sub-componente Card
// ============================================================

function Card({
  titulo,
  valor,
  subtitulo,
  color,
}: {
  titulo: string;
  valor: string;
  subtitulo: string;
  color: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <p className="text-gray-400 text-xs sm:text-sm mb-1">{titulo}</p>
      <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${color}`}>{valor}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitulo}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface Pedido {
  _id: string;
  subtotal: number;
  impuestos: number;
  descuento: number;
  total: number;
  productos: Array<{
    producto: { nombre: string } | string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  mesa?: { nombre?: string } | null;
  tipo: 'local' | 'recoger' | 'domicilio';
}

interface CobrarModalProps {
  pedido: Pedido;
  onClose: () => void;
  onCobrado: () => void;
}

type MetodoPago = 'efectivo' | 'tarjeta' | 'mixto';
type ModoCobro = 'normal' | 'dividir_igual';

export default function CobrarModal({ pedido, onClose, onCobrado }: CobrarModalProps) {
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');
  const [importeRecibido, setImporteRecibido] = useState('');
  const [loading, setLoading] = useState(false);
  const [modoCobro, setModoCobro] = useState<ModoCobro>('normal');
  const [numComensales, setNumComensales] = useState(2);
  const [subcuentasCobradas, setSubcuentasCobradas] = useState<number[]>([]);

  const totalPorPersona = modoCobro === 'dividir_igual'
    ? Math.round((pedido.total / numComensales) * 100) / 100
    : pedido.total;

  const todasCobradas = modoCobro === 'dividir_igual' && subcuentasCobradas.length === numComensales;

  const importeACobrar = modoCobro === 'dividir_igual' ? totalPorPersona : pedido.total;

  const cambio = metodoPago === 'efectivo' && importeRecibido
    ? Math.max(0, Math.round((parseFloat(importeRecibido) - importeACobrar) * 100) / 100)
    : 0;

  const importeSuficiente = metodoPago !== 'efectivo' || (
    importeRecibido && parseFloat(importeRecibido) >= importeACobrar
  );

  const handleCobrar = async () => {
    if (!importeSuficiente) return;

    // Si estamos dividiendo, marcar subcuenta como cobrada
    if (modoCobro === 'dividir_igual' && !todasCobradas) {
      const nextIdx = subcuentasCobradas.length;
      setSubcuentasCobradas([...subcuentasCobradas, nextIdx]);
      setImporteRecibido('');

      if (nextIdx + 1 < numComensales) {
        toast.success(`Subcuenta ${nextIdx + 1}/${numComensales} cobrada (${totalPorPersona.toFixed(2)} EUR)`);
        return; // Aún quedan subcuentas
      }
      // Era la última, proceder a cobrar el pedido completo
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No hay sesion iniciada');

      const res = await fetch(`/api/pedidos/${pedido._id}/cobrar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metodoPago,
          ...(metodoPago === 'efectivo' && importeRecibido
            ? { importeRecibido: parseFloat(importeRecibido) }
            : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al cobrar');

      if (data.data?.cambio > 0) {
        toast.success(`Cobrado. Cambio: ${data.data.cambio.toFixed(2)} EUR`, { duration: 8000 });
      } else {
        toast.success('Pedido cobrado exitosamente');
      }

      onCobrado();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nombreProducto = (p: any) =>
    typeof p.producto === 'string' ? p.producto : p.producto?.nombre ?? 'Desconocido';

  const mesaLabel = pedido.tipo === 'local'
    ? (pedido.mesa ? `Mesa ${(pedido.mesa as any).nombre ?? ''}` : 'En local')
    : pedido.tipo === 'recoger' ? 'Para recoger' : 'Domicilio';

  const botonesRapidos = [5, 10, 20, 50].filter(v => v >= importeACobrar);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Cobrar pedido</h2>
            <p className="text-gray-400 text-sm">{mesaLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none px-2"
          >
            &times;
          </button>
        </div>

        {/* Resumen de productos */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">RESUMEN</h3>
          <ul className="space-y-1.5 mb-4">
            {pedido.productos.map((p, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  <span className="text-amber-400 font-semibold">{p.cantidad}x</span>{' '}
                  {nombreProducto(p)}
                </span>
                <span className="text-gray-300 font-mono">{p.subtotal.toFixed(2)} EUR</span>
              </li>
            ))}
          </ul>

          <div className="space-y-1 pt-3 border-t border-gray-700">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span className="font-mono">{pedido.subtotal.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>IVA (21%)</span>
              <span className="font-mono">{pedido.impuestos.toFixed(2)} EUR</span>
            </div>
            {pedido.descuento > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Descuento</span>
                <span className="font-mono">-{pedido.descuento.toFixed(2)} EUR</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
              <span>TOTAL</span>
              <span className="text-amber-400 font-mono">{pedido.total.toFixed(2)} EUR</span>
            </div>
          </div>
        </div>

        {/* Modo cobro: normal o dividir */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">MODO DE COBRO</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setModoCobro('normal'); setSubcuentasCobradas([]); }}
              className={`py-3 rounded-lg font-semibold text-sm transition border-2 ${
                modoCobro === 'normal'
                  ? 'bg-amber-600 border-amber-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
              }`}
              style={{ minHeight: '48px' }}
            >
              Cuenta completa
            </button>
            <button
              type="button"
              onClick={() => { setModoCobro('dividir_igual'); setSubcuentasCobradas([]); }}
              className={`py-3 rounded-lg font-semibold text-sm transition border-2 ${
                modoCobro === 'dividir_igual'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
              }`}
              style={{ minHeight: '48px' }}
            >
              Dividir a partes iguales
            </button>
          </div>

          {/* Selector de comensales */}
          {modoCobro === 'dividir_igual' && (
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-blue-300 font-medium">Comensales</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNumComensales(Math.max(2, numComensales - 1))}
                    className="w-9 h-9 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-lg font-bold transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{numComensales}</span>
                  <button
                    type="button"
                    onClick={() => setNumComensales(Math.min(20, numComensales + 1))}
                    className="w-9 h-9 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-lg font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">Por persona:</span>
                <span className="text-white font-bold font-mono">{totalPorPersona.toFixed(2)} EUR</span>
              </div>

              {/* Indicador de subcuentas cobradas */}
              {subcuentasCobradas.length > 0 && (
                <div className="mt-3 flex gap-1.5 flex-wrap">
                  {Array.from({ length: numComensales }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        subcuentasCobradas.includes(i)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 self-center ml-2">
                    {subcuentasCobradas.length}/{numComensales} cobradas
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Método de pago */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">METODO DE PAGO</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['tarjeta', 'efectivo', 'mixto'] as MetodoPago[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetodoPago(m)}
                className={`py-3 rounded-lg font-semibold text-sm transition border-2 ${
                  metodoPago === m
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
                style={{ minHeight: '48px' }}
              >
                {m === 'tarjeta' ? 'Tarjeta' : m === 'efectivo' ? 'Efectivo' : 'Mixto'}
              </button>
            ))}
          </div>
        </div>

        {/* Importe recibido (solo efectivo) */}
        {metodoPago === 'efectivo' && (
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">IMPORTE RECIBIDO</h3>
            <input
              type="number"
              value={importeRecibido}
              onChange={(e) => setImporteRecibido(e.target.value)}
              placeholder={`Min. ${importeACobrar.toFixed(2)} EUR`}
              step="0.01"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg font-mono focus:border-amber-500 focus:outline-none"
              autoFocus
            />

            {botonesRapidos.length > 0 && (
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setImporteRecibido(importeACobrar.toFixed(2))}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-medium transition"
                >
                  Exacto
                </button>
                {botonesRapidos.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setImporteRecibido(v.toString())}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-medium transition"
                  >
                    {v} EUR
                  </button>
                ))}
              </div>
            )}

            {importeRecibido && parseFloat(importeRecibido) >= importeACobrar && (
              <div className="mt-3 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-center">
                <span className="text-green-400 text-sm">Cambio:</span>
                <span className="text-green-300 text-2xl font-bold font-mono ml-2">
                  {cambio.toFixed(2)} EUR
                </span>
              </div>
            )}
          </div>
        )}

        {/* Botón cobrar */}
        <div className="p-5">
          <button
            onClick={handleCobrar}
            disabled={loading || !importeSuficiente || todasCobradas}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition"
            style={{ minHeight: '56px' }}
          >
            {loading
              ? 'Procesando...'
              : todasCobradas
                ? 'Todas las subcuentas cobradas'
                : modoCobro === 'dividir_igual'
                  ? `Cobrar subcuenta ${subcuentasCobradas.length + 1} (${importeACobrar.toFixed(2)} EUR)`
                  : `Cobrar ${pedido.total.toFixed(2)} EUR`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

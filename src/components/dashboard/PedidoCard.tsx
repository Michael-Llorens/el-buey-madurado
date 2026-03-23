'use client';

type TipoPedido = 'local' | 'recoger' | 'domicilio';

type EstadoPedido =
  | 'pendiente'
  | 'preparando'
  | 'listo'
  | 'en_camino'
  | 'servido'
  | 'entregado'
  | 'pagado'
  | 'cancelado';

type Pedido = {
  _id: string;
  tipo: TipoPedido;
  mesa?: { _id: string; numero: number; nombre?: string };
  productos: Array<{
    producto: { _id: string; nombre: string; precio: number; imagen?: string };
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas?: string;
    personalizaciones?: {
      ingredientesExtra?: string[];
      ingredientesRemovidos?: string[];
    };
  }>;
  subtotal: number;
  impuestos: number;
  descuento: number;
  gastoEnvio?: number;
  total: number;
  estado: EstadoPedido;
  creadoPor?: { nombre?: string; email: string; rol?: string };
  cliente?: string;
  telefono?: string;
  direccionEntrega?: {
    calle: string;
    numero: string;
    piso?: string;
    ciudad: string;
    codigoPostal: string;
  };
  metodoPago?: string;
  createdAt: string;
};

interface PedidoCardProps {
  pedido: Pedido;
  onCambiarEstado: (id: string, nuevoEstado: EstadoPedido) => void | Promise<void>;
  onEliminar: (id: string) => void | Promise<void>;
  onVerDetalle?: (pedido: Pedido) => void | Promise<void>;
  onEditar?: (pedido: Pedido) => void | Promise<void>;
}

// ============================================================
// Helpers
// ============================================================

const ESTADO_CONFIG: Record<EstadoPedido, { label: string; dot: string; bg: string }> = {
  pendiente:  { label: 'Pendiente',  dot: 'bg-yellow-400', bg: 'border-l-yellow-500' },
  preparando: { label: 'Preparando', dot: 'bg-blue-400',   bg: 'border-l-blue-500' },
  listo:      { label: 'Listo',      dot: 'bg-purple-400', bg: 'border-l-purple-500' },
  en_camino:  { label: 'En camino',  dot: 'bg-cyan-400',   bg: 'border-l-cyan-500' },
  servido:    { label: 'Servido',    dot: 'bg-green-400',  bg: 'border-l-green-500' },
  entregado:  { label: 'Entregado',  dot: 'bg-green-400',  bg: 'border-l-green-500' },
  pagado:     { label: 'Pagado',     dot: 'bg-gray-400',   bg: 'border-l-gray-500' },
  cancelado:  { label: 'Cancelado',  dot: 'bg-red-400',    bg: 'border-l-red-500' },
};

const TIPO_LABEL: Record<TipoPedido, string> = {
  local: 'Local',
  recoger: 'Recoger',
  domicilio: 'Domicilio',
};

const TIPO_BADGE: Record<TipoPedido, string> = {
  local: 'bg-blue-500/20 text-blue-300',
  recoger: 'bg-amber-500/20 text-amber-300',
  domicilio: 'bg-purple-500/20 text-purple-300',
};

function tiempoDesde(fecha: string): { texto: string; urgencia: 'ok' | 'warn' | 'danger' } {
  const min = Math.floor((Date.now() - new Date(fecha).getTime()) / 60_000);
  if (min < 1) return { texto: 'ahora', urgencia: 'ok' };
  if (min < 10) return { texto: `${min} min`, urgencia: 'ok' };
  if (min < 25) return { texto: `${min} min`, urgencia: 'warn' };
  if (min < 60) return { texto: `${min} min`, urgencia: 'danger' };
  return { texto: `${Math.floor(min / 60)}h ${min % 60}m`, urgencia: 'danger' };
}

const URGENCIA_COLOR = { ok: 'text-gray-500', warn: 'text-orange-400', danger: 'text-red-400 font-semibold' };

function getSiguienteEstado(tipo: TipoPedido, estado: EstadoPedido): { next: EstadoPedido; label: string } | null {
  const flujos: Record<TipoPedido, Partial<Record<EstadoPedido, { next: EstadoPedido; label: string }>>> = {
    local: {
      pendiente:  { next: 'preparando', label: 'Preparar' },
      preparando: { next: 'listo',      label: 'Listo' },
      listo:      { next: 'servido',    label: 'Servir' },
      servido:    { next: 'pagado',     label: 'Cobrar' },
    },
    recoger: {
      pendiente:  { next: 'preparando', label: 'Preparar' },
      preparando: { next: 'listo',      label: 'Listo' },
      listo:      { next: 'entregado',  label: 'Entregado' },
    },
    domicilio: {
      pendiente:  { next: 'preparando', label: 'Preparar' },
      preparando: { next: 'listo',      label: 'Listo' },
      listo:      { next: 'en_camino',  label: 'Enviar' },
      en_camino:  { next: 'entregado',  label: 'Entregado' },
    },
  };
  return flujos[tipo]?.[estado] ?? null;
}

function nombreCamarero(p: Pedido): string {
  if (!p.creadoPor) return '';
  return p.creadoPor.nombre ?? p.creadoPor.email?.split('@')[0] ?? '';
}

const TIPO_ICON: Record<TipoPedido, string> = {
  local: '🍽️',
  recoger: '🛍️',
  domicilio: '🛵',
};

// ============================================================
// Componente
// ============================================================

export default function PedidoCard({
  pedido,
  onCambiarEstado,
  onEliminar,
  onVerDetalle,
  onEditar,
}: PedidoCardProps) {
  const estadoCfg = ESTADO_CONFIG[pedido.estado];
  const tiempo = tiempoDesde(pedido.createdAt);
  const siguiente = getSiguienteEstado(pedido.tipo, pedido.estado);
  const puedeEditar = pedido.estado === 'pendiente' || pedido.estado === 'preparando';
  const puedeCancelar = !['pagado', 'entregado', 'cancelado'].includes(pedido.estado);

  return (
    <div
      className={`
        bg-gray-800 rounded-lg border-l-4 ${estadoCfg.bg} border border-gray-700
        hover:border-gray-600 transition-all
        ${onVerDetalle ? 'cursor-pointer' : ''}
      `}
      onClick={() => onVerDetalle?.(pedido)}
      role={onVerDetalle ? 'button' : undefined}
      tabIndex={onVerDetalle ? 0 : undefined}
      onKeyDown={(e) => {
        if (onVerDetalle && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onVerDetalle(pedido);
        }
      }}
    >
      {/* ── Header: estado + tiempo ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${estadoCfg.dot}`} />
          <span className="text-sm font-semibold text-gray-200">{estadoCfg.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-700 ${URGENCIA_COLOR[tiempo.urgencia]}`}>{tiempo.texto}</span>
        </div>
      </div>

      {/* ── Tipo + Info contextual ── */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{TIPO_ICON[pedido.tipo]}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${TIPO_BADGE[pedido.tipo]}`}>
            {TIPO_LABEL[pedido.tipo]}
          </span>
        </div>

        {/* Local → Mesa */}
        {pedido.tipo === 'local' && pedido.mesa && (
          <p className="text-base font-bold text-white">
            Mesa {(pedido.mesa as any).nombre ?? pedido.mesa.numero}
          </p>
        )}

        {/* Recoger → Nombre + Teléfono */}
        {pedido.tipo === 'recoger' && (
          <div>
            {pedido.cliente && <p className="text-base font-bold text-white">{pedido.cliente}</p>}
            {pedido.telefono && <p className="text-xs text-gray-400">{pedido.telefono}</p>}
          </div>
        )}

        {/* Domicilio → Dirección */}
        {pedido.tipo === 'domicilio' && (
          <div>
            {pedido.cliente && <p className="text-sm font-semibold text-white">{pedido.cliente}</p>}
            {pedido.direccionEntrega && (
              <p className="text-xs text-gray-400">
                {pedido.direccionEntrega.calle} {pedido.direccionEntrega.numero}
                {pedido.direccionEntrega.piso ? `, ${pedido.direccionEntrega.piso}` : ''}
                {' · '}{pedido.direccionEntrega.ciudad}
              </p>
            )}
            {pedido.telefono && <p className="text-xs text-gray-500">{pedido.telefono}</p>}
          </div>
        )}
      </div>

      {/* ── Productos ── */}
      <div className="px-4 pb-3 space-y-0.5">
        {pedido.productos.slice(0, 5).map((item, i) => (
          <p key={i} className="text-sm text-gray-300">
            <span className="text-amber-400 font-semibold">{item.cantidad}x</span>{' '}
            {item.producto.nombre}
          </p>
        ))}
        {pedido.productos.length > 5 && (
          <p className="text-xs text-gray-500">+{pedido.productos.length - 5} mas...</p>
        )}
      </div>

      {/* ── Footer: total + camarero ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-700/60">
        <span className="text-lg font-bold text-amber-400">{pedido.total.toFixed(2)}€</span>
        {nombreCamarero(pedido) && (
          <span className="text-xs text-gray-500">por {nombreCamarero(pedido)}</span>
        )}
      </div>

      {/* ── Acciones ── */}
      <div className="flex gap-1.5 px-3 pb-3" onClick={(e) => e.stopPropagation()}>
        {siguiente && (
          <button
            type="button"
            onClick={() => void onCambiarEstado(pedido._id, siguiente.next)}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition text-sm"
          >
            {siguiente.label}
          </button>
        )}

        {puedeEditar && onEditar && (
          <button
            type="button"
            onClick={() => void onEditar(pedido)}
            className="px-3 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition text-sm"
            title="Editar"
          >
            ✏️
          </button>
        )}

        {onVerDetalle && (
          <button
            type="button"
            onClick={() => void onVerDetalle(pedido)}
            className="px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm"
            title="Ver detalle"
          >
            👁
          </button>
        )}

        {puedeCancelar && (
          <button
            type="button"
            onClick={() => void onEliminar(pedido._id)}
            className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-sm"
            title="Cancelar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

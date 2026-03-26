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
    telefono?: string;
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
  onCobrar?: (pedido: Pedido) => void;
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

function buildWhatsAppUrl(pedido: Pedido): string | null {
  const tel = pedido.telefono ?? pedido.direccionEntrega?.telefono;
  if (!tel) return null;
  // Limpiar teléfono: quitar espacios, guiones, paréntesis
  const clean = tel.replace(/[\s\-()]/g, '');
  // Si empieza por 6/7/9 sin prefijo, asumir España (+34)
  const numero = /^[679]\d{8}$/.test(clean) ? `34${clean}` : clean.replace(/^\+/, '');

  const nombre = pedido.cliente || 'cliente';
  const id = pedido._id.slice(-4).toUpperCase();

  let mensaje: string;
  if (pedido.tipo === 'recoger') {
    mensaje = encodeURIComponent(
      `¡Hola ${nombre}! 👋\n\n` +
      `Desde *El Buey Madurado* 🥩 le informamos de que su pedido *#${id}* ya está *listo para recoger*.\n\n` +
      `Puede pasar a recogerlo cuando desee. Estaremos encantados de atenderle.\n\n` +
      `📍 Carrer de la Reina, 41, 46800 Xàtiva, Valencia\n` +
      `📞 670 775 786\n\n` +
      `¡Gracias por confiar en nosotros! 🙏`
    );
  } else {
    mensaje = encodeURIComponent(
      `¡Hola ${nombre}! 👋\n\n` +
      `Desde *El Buey Madurado* 🥩 le informamos de que su pedido *#${id}* ya está *preparado* y *en camino* a su domicilio.\n\n` +
      `Si tiene cualquier consulta, no dude en contactarnos al 📞 670 775 786.\n\n` +
      `¡Gracias por confiar en nosotros! 🙏`
    );
  }
  return `https://wa.me/${numero}?text=${mensaje}`;
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
  onCobrar,
}: PedidoCardProps) {
  const estadoCfg = ESTADO_CONFIG[pedido.estado];
  const tiempo = tiempoDesde(pedido.createdAt);
  const siguiente = getSiguienteEstado(pedido.tipo, pedido.estado);
  const puedeEditar = pedido.estado === 'pendiente' || pedido.estado === 'preparando';
  const puedeCancelar = !['pagado', 'entregado', 'cancelado'].includes(pedido.estado);
  const whatsappUrl = (pedido.tipo !== 'local' && pedido.estado === 'listo') ? buildWhatsAppUrl(pedido) : null;

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
      {/* ── Header ── */}
      <div className="px-3 pt-3 pb-1 space-y-1">
        {/* Fila 1: Estado + ID */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${estadoCfg.dot}`} />
          <span className="text-xs font-semibold text-gray-200 whitespace-nowrap">{estadoCfg.label}</span>
          <span className="text-[10px] text-gray-500 font-mono">#{pedido._id.slice(-4).toUpperCase()}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap ml-auto ${
            tiempo.urgencia === 'ok' ? 'bg-green-600/20 text-green-400' :
            tiempo.urgencia === 'warn' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-red-600/20 text-red-400'
          }`}>{tiempo.texto}</span>
        </div>
        {/* Fila 2: Tipo + Hora */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${TIPO_BADGE[pedido.tipo]}`}>
            {TIPO_ICON[pedido.tipo]} {TIPO_LABEL[pedido.tipo]}
          </span>
          <span className="text-[10px] text-gray-500 ml-auto">{new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {/* Fila 3: Mesa / Cliente */}
        <p className="text-sm font-bold text-white truncate">
          {pedido.tipo === 'local' && pedido.mesa
            ? `Mesa ${(pedido.mesa as any).nombre ?? pedido.mesa.numero}`
            : pedido.cliente || 'Cliente'}
        </p>
        {/* Fila 4 (opcional): Teléfono o dirección */}
        {pedido.tipo === 'recoger' && pedido.telefono && (
          <p className="text-[11px] text-gray-400 truncate">{pedido.telefono}</p>
        )}
        {pedido.tipo === 'domicilio' && pedido.direccionEntrega && (
          <p className="text-[11px] text-gray-400 truncate">{pedido.direccionEntrega.calle} {pedido.direccionEntrega.numero}</p>
        )}
      </div>

      {/* ── Productos (max 3) ── */}
      <div className="px-3 pb-2 space-y-0.5">
        {pedido.productos.slice(0, 3).map((item, i) => (
          <p key={i} className="text-xs text-gray-300 truncate">
            <span className="text-amber-400 font-semibold">{item.cantidad}x</span>{' '}
            {item.producto.nombre}
          </p>
        ))}
        {pedido.productos.length > 3 && (
          <p className="text-[10px] text-gray-500 mt-0.5">+{pedido.productos.length - 3} más...</p>
        )}
      </div>

      {/* ── Footer: total + camarero ── */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700/60">
        <span className="text-base font-bold text-amber-400">{pedido.total.toFixed(2)}€</span>
        {nombreCamarero(pedido) && (
          <span className="text-[10px] text-gray-500">por {nombreCamarero(pedido)}</span>
        )}
      </div>

      {/* ── Acciones ── */}
      <div className="px-3 pb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
        {/* Fila 1: botón principal + WhatsApp */}
        {(siguiente || whatsappUrl) && (
          <div className="flex gap-1.5">
            {siguiente && (
              <button
                type="button"
                onClick={() => {
                  if (siguiente.label === 'Cobrar' && onCobrar) {
                    onCobrar(pedido);
                  } else {
                    void onCambiarEstado(pedido._id, siguiente.next);
                  }
                }}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition text-xs active:scale-95 min-h-[34px]"
              >
                {siguiente.label}
              </button>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-2 bg-[#25D366] hover:bg-[#1da851] text-white rounded transition text-xs flex items-center justify-center active:scale-95 min-h-[34px]"
                title="Avisar por WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
          </div>
        )}
        {/* Fila 2: botones secundarios (editar, ver, cancelar) */}
        {(puedeEditar || onVerDetalle || puedeCancelar) && (
          <div className="flex gap-1.5">
            {puedeEditar && onEditar && (
              <button
                type="button"
                onClick={() => void onEditar(pedido)}
                className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded transition text-[11px] min-h-[30px]"
                title="Editar"
              >
                ✏️ Editar
              </button>
            )}
            {onVerDetalle && (
              <button
                type="button"
                onClick={() => void onVerDetalle(pedido)}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-[11px] min-h-[30px]"
                title="Ver detalle"
              >
                👁 Ver
              </button>
            )}
            {puedeCancelar && (
              <button
                type="button"
                onClick={() => void onEliminar(pedido._id)}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition text-[11px] min-h-[30px]"
                title="Cancelar"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  mesa?: { _id: string; numero: number };
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

export default function PedidoCard({
  pedido,
  onCambiarEstado,
  onEliminar,
  onVerDetalle,
  onEditar,
}: PedidoCardProps) {
  const getEstadoColor = () => {
    switch (pedido.estado) {
      case 'pendiente':
        return 'bg-yellow-600';
      case 'preparando':
        return 'bg-blue-600';
      case 'listo':
        return 'bg-purple-600';
      case 'en_camino':
        return 'bg-cyan-600';
      case 'servido':
        return 'bg-green-600';
      case 'entregado':
        return 'bg-green-600';
      case 'pagado':
        return 'bg-gray-600';
      case 'cancelado':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getEstadoTexto = () => {
    switch (pedido.estado) {
      case 'pendiente':
        return '🟡 Pendiente';
      case 'preparando':
        return '🔵 Preparando';
      case 'listo':
        return '🟣 Listo';
      case 'en_camino':
        return '🚗 En camino';
      case 'servido':
        return '🟢 Servido';
      case 'entregado':
        return '✅ Entregado';
      case 'pagado':
        return '💰 Pagado';
      case 'cancelado':
        return '❌ Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getSiguienteEstado = (): EstadoPedido | null => {
    if (pedido.tipo === 'local') {
      switch (pedido.estado) {
        case 'pendiente':
          return 'preparando';
        case 'preparando':
          return 'listo';
        case 'listo':
          return 'servido';
        case 'servido':
          return 'pagado';
        default:
          return null;
      }
    }

    if (pedido.tipo === 'recoger') {
      switch (pedido.estado) {
        case 'pendiente':
          return 'preparando';
        case 'preparando':
          return 'listo';
        case 'listo':
          return 'entregado';
        default:
          return null;
      }
    }

    if (pedido.tipo === 'domicilio') {
      switch (pedido.estado) {
        case 'pendiente':
          return 'preparando';
        case 'preparando':
          return 'listo';
        case 'listo':
          return 'en_camino';
        case 'en_camino':
          return 'entregado';
        default:
          return null;
      }
    }

    return null;
  };

  const getSiguienteEstadoTexto = () => {
    if (pedido.tipo === 'local') {
      switch (pedido.estado) {
        case 'pendiente':
          return '→ Preparar';
        case 'preparando':
          return '→ Listo';
        case 'listo':
          return '→ Servir';
        case 'servido':
          return '→ Cobrar';
        default:
          return null;
      }
    }

    if (pedido.tipo === 'recoger') {
      switch (pedido.estado) {
        case 'pendiente':
          return '→ Preparar';
        case 'preparando':
          return '→ Listo';
        case 'listo':
          return '→ Entregado';
        default:
          return null;
      }
    }

    if (pedido.tipo === 'domicilio') {
      switch (pedido.estado) {
        case 'pendiente':
          return '→ Preparar';
        case 'preparando':
          return '→ Listo';
        case 'listo':
          return '→ En camino';
        case 'en_camino':
          return '→ Entregado';
        default:
          return null;
      }
    }

    return null;
  };

  const getTipoIcono = () => {
    switch (pedido.tipo) {
      case 'local':
        return '🍽️';
      case 'recoger':
        return '🛍️';
      case 'domicilio':
        return '🚗';
      default:
        return '📦';
    }
  };

  const getTipoTexto = () => {
    switch (pedido.tipo) {
      case 'local':
        return 'Local';
      case 'recoger':
        return 'Recoger';
      case 'domicilio':
        return 'Domicilio';
      default:
        return 'Desconocido';
    }
  };

  const rolLabel = (rol?: string) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'camarero':
        return 'Camarero';
      case 'cocinero':
        return 'Cocinero';
      default:
        return 'Usuario';
    }
  };

  const siguienteEstado = getSiguienteEstado();
  const puedeEditar = pedido.estado === 'pendiente' || pedido.estado === 'preparando';

  const clickable = Boolean(onVerDetalle);
  const handleCardClick = () => {
    if (!onVerDetalle) return;
    void onVerDetalle(pedido);
  };

  return (
    <div
      className={[
        'bg-gray-800 rounded-lg p-6 border-2 border-gray-700 hover:border-amber-500 transition',
        clickable ? 'cursor-pointer' : '',
      ].join(' ')}
      onClick={handleCardClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getTipoIcono()}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
              {getTipoTexto()}
            </span>
          </div>

          {pedido.mesa && (
            <h3 className="text-2xl font-bold text-amber-400">Mesa {pedido.mesa.numero}</h3>
          )}

          {pedido.cliente && <p className="text-sm text-gray-300 font-semibold">{pedido.cliente}</p>}
          {pedido.telefono && <p className="text-xs text-gray-400">📞 {pedido.telefono}</p>}

          {pedido.direccionEntrega && (
            <p className="text-xs text-gray-400 mt-1">
              📍 {pedido.direccionEntrega.calle} {pedido.direccionEntrega.numero},{' '}
              {pedido.direccionEntrega.ciudad}
            </p>
          )}
        </div>

        <span className={`${getEstadoColor()} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
          {getEstadoTexto()}
        </span>
      </div>

      {/* Productos */}
      <div className="mb-4 space-y-2">
        <p className="text-xs text-gray-400 font-semibold">Productos:</p>
        {pedido.productos.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm bg-gray-700 px-3 py-2 rounded">
            <span className="text-white">
              {item.cantidad}x {item.producto.nombre}
              {item.notas && <span className="text-xs text-gray-400 ml-2">({item.notas})</span>}
            </span>
            <span className="text-amber-400 font-semibold">{item.subtotal.toFixed(2)}€</span>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="mb-4 pt-4 border-t border-gray-700 space-y-1">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal:</span>
          <span>{pedido.subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>IVA (21%):</span>
          <span>{pedido.impuestos.toFixed(2)}€</span>
        </div>
        {pedido.gastoEnvio && pedido.gastoEnvio > 0 && (
          <div className="flex justify-between text-sm text-blue-400">
            <span>🚗 Envío:</span>
            <span>{pedido.gastoEnvio.toFixed(2)}€</span>
          </div>
        )}
        {pedido.descuento > 0 && (
          <div className="flex justify-between text-sm text-red-400">
            <span>Descuento:</span>
            <span>-{pedido.descuento.toFixed(2)}€</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
          <span>TOTAL:</span>
          <span className="text-amber-400">{pedido.total.toFixed(2)}€</span>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mb-4 text-xs text-gray-400 space-y-1">
        {pedido.creadoPor && (
          <p>
            👤 {rolLabel(pedido.creadoPor.rol)}: {pedido.creadoPor.email}
            {pedido.creadoPor.nombre ? ` (${pedido.creadoPor.nombre})` : ''}
          </p>
        )}
        {pedido.metodoPago && <p>💳 Método pago: {pedido.metodoPago}</p>}
        <p>🕒 {new Date(pedido.createdAt).toLocaleString('es-ES')}</p>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        {siguienteEstado && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onCambiarEstado(pedido._id, siguienteEstado);
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition text-sm"
          >
            {getSiguienteEstadoTexto()}
          </button>
        )}

        {puedeEditar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onEditar?.(pedido);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition text-sm"
            title="Editar pedido"
          >
            ✏️
          </button>
        )}

        {onVerDetalle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onVerDetalle(pedido);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition text-sm"
          >
            👁️
          </button>
        )}

        {pedido.estado !== 'pagado' && pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onEliminar(pedido._id);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition text-sm"
          >
            ❌
          </button>
        )}
      </div>
    </div>
  );
}
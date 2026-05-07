import Mesa from '@/lib/models/Mesa';
import Pedido from '@/lib/models/Pedido';
import Producto from '@/lib/models/Producto';
import mongoose from 'mongoose';

/**
 * Normaliza un documento de Pedido para compatibilidad con el frontend.
 * El campo 'camarero' en BD se expone como 'creadoPor' al cliente.
 */
export function normalizarPedido(doc: any) {
  const obj = doc?.toObject ? doc.toObject() : doc;
  if (!obj) return obj;

  if (!obj.creadoPor && obj.camarero) obj.creadoPor = obj.camarero;

  return obj;
}

/**
 * Marca una mesa como ocupada y la asocia al pedido activo.
 */
export async function ocuparMesa(mesaId: any, pedidoId: any): Promise<void> {
  await Mesa.findByIdAndUpdate(mesaId, {
    estado: 'ocupada',
    pedidoActual: pedidoId,
  });
}

/**
 * Libera una mesa (estado libre, pedidoActual null, comensales = 0).
 */
export async function liberarMesa(mesaId: any): Promise<void> {
  await Mesa.findByIdAndUpdate(mesaId, {
    estado: 'libre',
    pedidoActual: null,
    comensalesActuales: 0,
  });
}

/**
 * Abre o recupera el pedido activo de una mesa.
 * Devuelve null si la mesa no existe.
 * Devuelve { pedidoId, created: false } si ya había un pedido activo.
 * Devuelve { pedidoId, created: true } si se creó un pedido nuevo.
 */
export async function abrirPedidoParaMesa(
  mesaId: string,
  userId: string | null
): Promise<{ pedidoId: string; created: boolean } | null> {
  const mesa = await Mesa.findById(mesaId).select('_id pedidoActual estado').lean();
  if (!mesa) return null;

  if (mesa.pedidoActual) {
    return { pedidoId: String(mesa.pedidoActual), created: false };
  }

  const nuevoPedido = new Pedido({
    tipo: 'local',
    mesa: new mongoose.Types.ObjectId(mesaId),
    productos: [],
    camarero: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    descuento: 0,
    gastoEnvio: 0,
  });

  if (typeof (nuevoPedido as any).calcularTotales === 'function') {
    (nuevoPedido as any).calcularTotales();
  }

  await nuevoPedido.save();
  await ocuparMesa(mesaId, nuevoPedido._id);

  return { pedidoId: String(nuevoPedido._id), created: true };
}

/**
 * Valida los productos de un pedido y calcula los precios desde BD.
 * Lanza un error si algún producto no existe o no está disponible.
 * Solo para creación de pedidos (POST) — no usar en actualizaciones (PUT).
 */
export async function validarProductosYObtenerPrecios(
  productos: any[]
): Promise<
  Array<{
    producto: mongoose.Types.ObjectId;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas: string;
    personalizaciones: Record<string, any>;
  }>
> {
  return Promise.all(
    (productos || []).map(async (item: any) => {
      const prod = await Producto.findById(item.producto);
      if (!prod) throw new Error(`Producto ${item.producto} no encontrado`);
      if (!prod.disponible) throw new Error(`Producto "${prod.nombre}" no disponible`);

      const precioUnitario = prod.precio;
      const subtotal = precioUnitario * item.cantidad;

      return {
        producto: new mongoose.Types.ObjectId(item.producto),
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
        notas: item.notas || '',
        personalizaciones: item.personalizaciones || {},
      };
    })
  );
}

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
      // findById + populate de los ingredientes para leer su precioExtra.
      // Hacemos el populate condicional para no romper en entornos de test
      // donde findById está mockeado y no devuelve un Query con .populate().
      const query: any = Producto.findById(item.producto);
      const prod =
        query && typeof query.populate === 'function'
          ? await query.populate('ingredientes.ingrediente')
          : await query;
      if (!prod) throw new Error(`Producto ${item.producto} no encontrado`);
      if (!prod.disponible) throw new Error(`Producto "${prod.nombre}" no disponible`);

      // Construir la lista oficial de extras disponibles (igual lógica que el
      // frontend en PersonalizarModal.tsx). Dos fuentes:
      // (1) ingredientes del producto con precioExtra > 0
      // (2) producto.ingredientesExtra (extras definidos explícitamente).
      // Validamos server-side para evitar manipulación del JSON del cliente.
      const extrasOficiales: Array<{ nombre: string; precio: number }> = [];
      for (const ing of prod.ingredientes || []) {
        const ingDoc: any = ing.ingrediente;
        if (ingDoc?.nombre && (ingDoc.precioExtra ?? 0) > 0) {
          extrasOficiales.push({ nombre: ingDoc.nombre, precio: ingDoc.precioExtra });
        }
      }
      const nombresVistos = new Set(extrasOficiales.map((e) => e.nombre));
      for (const e of prod.ingredientesExtra || []) {
        if (!nombresVistos.has(e.nombre)) {
          extrasOficiales.push({ nombre: e.nombre, precio: e.precio });
        }
      }

      const extrasSeleccionados: string[] = item.personalizaciones?.ingredientesExtra ?? [];
      const precioExtras = extrasOficiales
        .filter((e) => extrasSeleccionados.includes(e.nombre))
        .reduce((sum, e) => sum + (e.precio || 0), 0);

      const precioUnitario = prod.precio + precioExtras;
      const subtotal = precioUnitario * item.cantidad;

      return {
        producto: new mongoose.Types.ObjectId(item.producto),
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
        notas: item.notas || '',
        personalizaciones: {
          ...(item.personalizaciones || {}),
          precioExtras, // guardado para trazabilidad en reportes/factura
        },
      };
    })
  );
}

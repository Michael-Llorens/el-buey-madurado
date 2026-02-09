'use client';

import { useState, useEffect } from 'react';
import PersonalizarProductoModal from './PersonalizarProductoModal';

interface Mesa {
  _id: string;
  numero: number;
  capacidad: number;
  estado: string;
}

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  ingredientesExtra?: Array<{ nombre: string; precio: number }>;
  ingredientes?: Array<{ ingrediente: { nombre: string } }>;
  permitirExtras?: boolean;
  permitirRemover?: boolean;
  permitirPersonalizacion?: boolean;
}

type TipoPedido = 'local' | 'recoger' | 'domicilio';

type PedidoInicial = {
  _id: string;
  tipo: TipoPedido;
  mesa?: { _id: string; numero: number };
  cliente?: string;
  telefono?: string;
  notas?: string;
  descuento?: number;
  gastoEnvio?: number;
  direccionEntrega?: {
    calle: string;
    numero: string;
    piso?: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    notas?: string;
  };
  productos: Array<{
    producto: { _id: string; nombre: string; precio: number; imagen?: string } | string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas?: string;
    personalizaciones?: {
      ingredientesExtra?: string[];
      ingredientesRemovidos?: string[];
    };
  }>;
};

interface PedidoFormProps {
  onGuardar: () => void | Promise<void>;
  onCancelar: () => void;

  modo?: 'add' | 'edit';
  pedidoId?: string;
  pedidoInicial?: PedidoInicial | null;
  mesaIdPreseleccionada?: string;
}

export default function PedidoForm({
  onGuardar,
  onCancelar,
  modo = 'add',
  pedidoId,
  pedidoInicial = null,
  mesaIdPreseleccionada,
}: PedidoFormProps) {
  const [formData, setFormData] = useState({
    tipo: 'local' as TipoPedido,
    mesa: '',
    cliente: '',
    telefono: '',
    notas: '',
    descuento: 0,
    gastoEnvio: 3.5,
    direccionEntrega: {
      calle: '',
      numero: '',
      piso: '',
      ciudad: 'Xàtiva',
      codigoPostal: '46800',
      telefono: '',
      notas: '',
    },
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState<
    Array<{
      producto: string;
      cantidad: number;
      notas: string;
      personalizaciones?: {
        ingredientesExtra?: string[];
        ingredientesRemovidos?: string[];
      };
      // para mantener precio al editar
      precioPersonalizado?: number; // total línea
      precioUnitario?: number; // por unidad (para el PUT del backend)
    }>
  >([]);

  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('1');
  const [notasProducto, setNotasProducto] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAPersonalizar, setProductoAPersonalizar] = useState<Producto | null>(null);
  const [cantidadTemp, setCantidadTemp] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Precargar si edit
  useEffect(() => {
    if (modo !== 'add') return;

    if (mesaIdPreseleccionada) {
      setFormData((prev) => ({
        ...prev,
        tipo: 'local',
        mesa: mesaIdPreseleccionada,
      }));
      return;
    }

  }, [modo, mesaIdPreseleccionada]);

  useEffect(() => {
    if (modo !== 'edit' || !pedidoInicial) return;

    setFormData((prev) => ({
      ...prev,
      tipo: pedidoInicial.tipo || 'local',
      mesa: pedidoInicial.mesa?._id || '',
      cliente: pedidoInicial.cliente || '',
      telefono: pedidoInicial.telefono || '',
      notas: pedidoInicial.notas || '',
      descuento: typeof pedidoInicial.descuento === 'number' ? pedidoInicial.descuento : 0,
      gastoEnvio: typeof pedidoInicial.gastoEnvio === 'number' ? pedidoInicial.gastoEnvio : 3.5,
      direccionEntrega: pedidoInicial.direccionEntrega
        ? {
          calle: pedidoInicial.direccionEntrega.calle || '',
          numero: pedidoInicial.direccionEntrega.numero || '',
          piso: pedidoInicial.direccionEntrega.piso || '',
          ciudad: pedidoInicial.direccionEntrega.ciudad || 'Xàtiva',
          codigoPostal: pedidoInicial.direccionEntrega.codigoPostal || '46800',
          telefono: pedidoInicial.direccionEntrega.telefono || '',
          notas: pedidoInicial.direccionEntrega.notas || '',
        }
        : prev.direccionEntrega,
    }));

    const productos = (pedidoInicial.productos || []).map((item) => {
      const prodId = typeof item.producto === 'string' ? item.producto : item.producto._id;

      return {
        producto: prodId,
        cantidad: item.cantidad,
        notas: item.notas || '',
        personalizaciones: item.personalizaciones || {},
        precioPersonalizado: typeof item.subtotal === 'number' ? item.subtotal : undefined,
        precioUnitario: typeof item.precioUnitario === 'number' ? item.precioUnitario : undefined,
      };
    });

    setProductosSeleccionados(productos);
  }, [modo, pedidoInicial]);

  // Cargar mesas (si tipo === 'local')
  useEffect(() => {
    if (formData.tipo !== 'local') {
      setMesasDisponibles([]);
      setFormData((prev) => ({ ...prev, mesa: '' }));
      return;
    }

    const cargarMesas = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('/api/mesas', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          // ✅ en edición: deja la mesa actual aunque esté ocupada
          const mesasOcupables = (data.data as Mesa[]).filter(
            (m) => m.estado === 'libre' || m.estado === 'reservada' || m._id === formData.mesa
          );

          setMesasDisponibles(mesasOcupables);
        }
      } catch (e) {
        console.error('Error cargando mesas:', e);
      }
    };

    cargarMesas();
  }, [formData.tipo, formData.mesa]);

  // Cargar productos disponibles
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('/api/productos', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          const productosActivos = (data.data as Producto[]).filter((p) => p.disponible);
          setProductosDisponibles(productosActivos);
        }
      } catch (e) {
        console.error('Error cargando productos:', e);
      }
    };

    cargarProductos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      direccionEntrega: { ...prev.direccionEntrega, [name]: value },
    }));
  };

  const handleAbrirPersonalizacion = () => {
    if (!productoSeleccionado || !cantidadProducto) {
      alert('⚠️ Selecciona un producto y cantidad');
      return;
    }

    const cantidad = parseInt(cantidadProducto);
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      alert('⚠️ La cantidad debe ser mayor a 0');
      return;
    }

    const producto = (productosDisponibles as Producto[]).find((p) => p._id === productoSeleccionado);
    if (!producto) return;

    setProductoAPersonalizar(producto);
    setCantidadTemp(cantidad);
    setModalAbierto(true);
  };

  const handleConfirmarPersonalizacion = (personalizacion: {
    extras: string[];
    removidos: string[];
    notas: string;
    precioTotal: number; // total línea
  }) => {
    if (!productoAPersonalizar) return;

    const unit = cantidadTemp > 0 ? personalizacion.precioTotal / cantidadTemp : undefined;

    setProductosSeleccionados((prev) => [
      ...prev,
      {
        producto: productoAPersonalizar._id,
        cantidad: cantidadTemp,
        notas: personalizacion.notas || notasProducto,
        personalizaciones: {
          ingredientesExtra: personalizacion.extras,
          ingredientesRemovidos: personalizacion.removidos,
        },
        precioPersonalizado: personalizacion.precioTotal,
        precioUnitario: unit,
      },
    ]);

    setModalAbierto(false);
    setProductoAPersonalizar(null);
    setProductoSeleccionado('');
    setCantidadProducto('1');
    setNotasProducto('');
  };

  const handleRemoveProducto = (index: number) => {
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));
  };

  const getNombreProducto = (id: string) => {
    const prod = productosDisponibles.find((p) => p._id === id);
    return prod?.nombre || 'Desconocido';
  };

  const getPrecioProducto = (id: string) => {
    const prod = productosDisponibles.find((p) => p._id === id);
    return prod?.precio || 0;
  };

  const calcularTotal = () => {
    const subtotal = productosSeleccionados.reduce((sum, item) => {
      if (typeof item.precioPersonalizado === 'number') return sum + item.precioPersonalizado;
      const precio = getPrecioProducto(item.producto);
      return sum + precio * item.cantidad;
    }, 0);

    const impuestos = subtotal * 0.21;
    const gastoEnvio = formData.tipo === 'domicilio' ? Number(formData.gastoEnvio) || 0 : 0;
    const descuento = Number(formData.descuento) || 0;
    const total = subtotal + impuestos + gastoEnvio - descuento;

    return {
      subtotal: subtotal.toFixed(2),
      impuestos: impuestos.toFixed(2),
      gastoEnvio: gastoEnvio.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (productosSeleccionados.length === 0) {
      setError('⚠️ Debes añadir al menos un producto');
      setLoading(false);
      return;
    }

    if (formData.tipo === 'local' && !formData.mesa) {
      setError('⚠️ Debes seleccionar una mesa para pedidos en local');
      setLoading(false);
      return;
    }

    if (formData.tipo === 'recoger' && !formData.telefono) {
      setError('⚠️ El teléfono es obligatorio para pedidos para recoger');
      setLoading(false);
      return;
    }

    if (formData.tipo === 'domicilio') {
      const { calle, numero, ciudad, codigoPostal, telefono } = formData.direccionEntrega;
      if (!calle || !numero || !ciudad || !codigoPostal || !telefono) {
        setError('⚠️ Completa todos los campos obligatorios de la dirección');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No hay sesión iniciada');

      // ✅ Si estás editando, intentamos preservar precioUnitario si existe
      const productosPayload = productosSeleccionados.map((p) => ({
        producto: p.producto,
        cantidad: p.cantidad,
        notas: p.notas,
        personalizaciones: p.personalizaciones || {},
        ...(typeof p.precioUnitario === 'number' ? { precioUnitario: p.precioUnitario } : {}),
      }));

      const payload: any = {
        tipo: formData.tipo,
        productos: productosPayload,
        cliente: formData.cliente,
        telefono: formData.telefono,
        notas: formData.notas,
        descuento: parseFloat(formData.descuento.toString()) || 0,
      };

      if (formData.tipo === 'local') payload.mesa = formData.mesa;

      if (formData.tipo === 'domicilio') {
        payload.direccionEntrega = formData.direccionEntrega;
        payload.gastoEnvio = parseFloat(formData.gastoEnvio.toString()) || 3.5;
      }

      const url = modo === 'edit' ? `/api/pedidos/${pedidoId}` : '/api/pedidos';
      const method = modo === 'edit' ? 'PUT' : 'POST';

      if (modo === 'edit' && !pedidoId) throw new Error('Falta pedidoId para editar');

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || 'Error al guardar pedido');

      alert(modo === 'edit' ? '✅ Pedido actualizado' : '✅ Pedido creado exitosamente');
      await onGuardar();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-4 rounded">
          ❌ {error}
        </div>
      )}

      {/* SELECTOR DE TIPO */}
      <div>
        <label className="block text-sm font-medium mb-2">Tipo de Pedido *</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="local">🍽️ Local (comer aquí)</option>
          <option value="recoger">🛍️ Para recoger</option>
          <option value="domicilio">🚗 Domicilio</option>
        </select>
      </div>

      {/* MESA */}
      {formData.tipo === 'local' && (
        <div>
          <label className="block text-sm font-medium mb-2">Mesa *</label>
          <select
            name="mesa"
            value={formData.mesa}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">-- Selecciona una mesa --</option>
            {mesasDisponibles.map((mesa: Mesa) => (
              <option key={mesa._id} value={mesa._id}>
                Mesa {mesa.numero} ({mesa.capacidad} personas) - {mesa.estado}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CLIENTE Y TELÉFONO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cliente {(formData.tipo === 'domicilio' || formData.tipo === 'recoger') && '*'}
          </label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required={formData.tipo !== 'local'}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Teléfono {formData.tipo !== 'local' && '*'}
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required={formData.tipo !== 'local'}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* DIRECCIÓN */}
      {formData.tipo === 'domicilio' && (
        <div className="bg-gray-700 p-4 rounded space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">📍 Dirección de Entrega</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                name="calle"
                value={formData.direccionEntrega.calle}
                onChange={handleDireccionChange}
                required
                placeholder="Calle *"
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                name="numero"
                value={formData.direccionEntrega.numero}
                onChange={handleDireccionChange}
                required
                placeholder="Nº *"
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                name="piso"
                value={formData.direccionEntrega.piso}
                onChange={handleDireccionChange}
                placeholder="Piso/Puerta"
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                name="ciudad"
                value={formData.direccionEntrega.ciudad}
                onChange={handleDireccionChange}
                required
                placeholder="Ciudad *"
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                name="codigoPostal"
                value={formData.direccionEntrega.codigoPostal}
                onChange={handleDireccionChange}
                required
                placeholder="CP *"
                maxLength={5}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <input
              type="tel"
              name="telefono"
              value={formData.direccionEntrega.telefono}
              onChange={handleDireccionChange}
              required
              placeholder="Teléfono de contacto *"
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <textarea
              name="notas"
              value={formData.direccionEntrega.notas}
              onChange={handleDireccionChange}
              placeholder="Instrucciones de entrega"
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-amber-500 focus:outline-none"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* PRODUCTOS */}
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-3">🍽️ Productos del Pedido</h3>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="">-- Seleccionar producto --</option>
              {productosDisponibles.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.nombre} - {prod.precio.toFixed(2)}€
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <input
              type="number"
              value={cantidadProducto}
              onChange={(e) => setCantidadProducto(e.target.value)}
              placeholder="Cant."
              min="1"
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="col-span-3">
            <input
              type="text"
              value={notasProducto}
              onChange={(e) => setNotasProducto(e.target.value)}
              placeholder="Notas rápidas..."
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <button
              type="button"
              onClick={handleAbrirPersonalizacion}
              className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-sm flex items-center justify-center gap-1"
              title="Personalizar producto"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Añadir</span>
            </button>
          </div>
        </div>

        {productosSeleccionados.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-400">Productos añadidos:</p>
            {productosSeleccionados.map((item, idx) => {
              const precioFinal =
                typeof item.precioPersonalizado === 'number'
                  ? item.precioPersonalizado
                  : getPrecioProducto(item.producto) * item.cantidad;

              return (
                <div
                  key={idx}
                  className="flex items-start justify-between bg-gray-600 px-3 py-2 rounded text-sm"
                >
                  <div className="flex-1">
                    <span className="text-white font-semibold">
                      {item.cantidad}x {getNombreProducto(item.producto)}
                    </span>

                    {item.personalizaciones?.ingredientesExtra?.length ? (
                      <p className="text-xs text-green-400 mt-1">
                        ➕ {item.personalizaciones.ingredientesExtra.join(', ')}
                      </p>
                    ) : null}

                    {item.personalizaciones?.ingredientesRemovidos?.length ? (
                      <p className="text-xs text-red-400 mt-1">
                        ➖ Sin: {item.personalizaciones.ingredientesRemovidos.join(', ')}
                      </p>
                    ) : null}

                    {item.notas ? <p className="text-xs text-gray-400 mt-1">📝 {item.notas}</p> : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-semibold">{precioFinal.toFixed(2)}€</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProducto(idx)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DESCUENTO + ENVÍO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Descuento (€)</label>
          <input
            type="number"
            name="descuento"
            value={formData.descuento}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        {formData.tipo === 'domicilio' && (
          <div>
            <label className="block text-sm font-medium mb-2">Gasto de envío (€)</label>
            <input
              type="number"
              name="gastoEnvio"
              value={formData.gastoEnvio}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* NOTAS */}
      <div>
        <label className="block text-sm font-medium mb-2">Notas del pedido</label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          rows={3}
        />
      </div>

      {/* RESUMEN */}
      {productosSeleccionados.length > 0 && (
        <div className="bg-gray-700 p-4 rounded space-y-2">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">💰 Resumen del Pedido</h3>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Subtotal:</span>
            <span>{totales.subtotal}€</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>IVA (21%):</span>
            <span>{totales.impuestos}€</span>
          </div>
          {formData.tipo === 'domicilio' && parseFloat(totales.gastoEnvio) > 0 && (
            <div className="flex justify-between text-sm text-blue-400">
              <span>🚗 Gasto de envío:</span>
              <span>{totales.gastoEnvio}€</span>
            </div>
          )}
          {formData.descuento > 0 && (
            <div className="flex justify-between text-sm text-red-400">
              <span>Descuento:</span>
              <span>-{Number(formData.descuento).toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
            <span>TOTAL:</span>
            <span className="text-amber-400">{totales.total}€</span>
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading || productosSeleccionados.length === 0}
          className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-semibold rounded transition"
        >
          {loading ? (modo === 'edit' ? 'Actualizando...' : 'Creando...') : modo === 'edit' ? '✅ Actualizar Pedido' : '✅ Crear Pedido'}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition"
        >
          ❌ Cancelar
        </button>
      </div>

      {/* MODAL */}
      {modalAbierto && productoAPersonalizar && (
        <PersonalizarProductoModal
          producto={productoAPersonalizar}
          cantidad={cantidadTemp}
          onConfirmar={handleConfirmarPersonalizacion}
          onCancelar={() => {
            setModalAbierto(false);
            setProductoAPersonalizar(null);
          }}
        />
      )}
    </form>
  );
}
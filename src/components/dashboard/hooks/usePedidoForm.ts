'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useMesas as useMesasSWR, useProductos as useProductosSWR } from '@/lib/hooks/swr';

interface Mesa {
  _id: string;
  nombre: string;
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

interface UsePedidoFormProps {
  modo: 'add' | 'edit';
  pedidoId?: string;
  pedidoInicial?: PedidoInicial | null;
  mesaIdPreseleccionada?: string;
  onGuardar: () => void | Promise<void>;
  onCancelar: () => void;
}

export function usePedidoForm({
  modo,
  pedidoId,
  pedidoInicial = null,
  mesaIdPreseleccionada,
  onGuardar,
  onCancelar,
}: UsePedidoFormProps) {
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
      precioPersonalizado?: number; // total linea
      precioUnitario?: number; // por unidad (para el PUT del backend)
    }>
  >([]);

  const { mesas: todasMesas } = useMesasSWR();
  const { productos: todosProductos } = useProductosSWR();

  // Filtrar mesas ocupables (libre, reservada, o la mesa actual en edición)
  const mesasDisponibles: Mesa[] = formData.tipo === 'local'
    ? (todasMesas as Mesa[]).filter(
        (m) => m.estado === 'libre' || m.estado === 'reservada' || m._id === formData.mesa
      )
    : [];

  // Filtrar solo productos disponibles
  const productosDisponibles: Producto[] = (todosProductos as Producto[]).filter((p) => p.disponible);

  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('1');
  const [notasProducto, setNotasProducto] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAPersonalizar, setProductoAPersonalizar] = useState<Producto | null>(null);
  const [cantidadTemp, setCantidadTemp] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Precargar si edit
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

  // Limpiar mesa si se cambia de tipo local a otro
  useEffect(() => {
    if (formData.tipo !== 'local') {
      setFormData((prev) => ({ ...prev, mesa: '' }));
    }
  }, [formData.tipo]);

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
      toast.warning('Selecciona un producto y cantidad');
      return;
    }

    const cantidad = parseInt(cantidadProducto);
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      toast.warning('La cantidad debe ser mayor a 0');
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
    precioTotal: number; // total linea
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

      // Si estas editando, intentamos preservar precioUnitario si existe
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

      toast.success(modo === 'edit' ? 'Pedido actualizado' : 'Pedido creado exitosamente');
      await onGuardar();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotal();

  return {
    // state
    formData,
    productosSeleccionados,
    mesasDisponibles,
    productosDisponibles,
    productoSeleccionado,
    cantidadProducto,
    notasProducto,
    modalAbierto,
    productoAPersonalizar,
    cantidadTemp,
    loading,
    error,
    totales,

    // setters
    setProductoSeleccionado,
    setCantidadProducto,
    setNotasProducto,
    setModalAbierto,
    setProductoAPersonalizar,

    // handlers
    handleChange,
    handleDireccionChange,
    handleAbrirPersonalizacion,
    handleConfirmarPersonalizacion,
    handleRemoveProducto,
    handleSubmit,
    getNombreProducto,
    getPrecioProducto,

    // props pass-through
    onCancelar,
    modo,
  };
}

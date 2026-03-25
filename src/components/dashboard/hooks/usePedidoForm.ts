'use client';

import { useState, useEffect, useMemo } from 'react';
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

  // ── Nuevo: búsqueda, categorías, secciones colapsables ──
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [mostrarNotas, setMostrarNotas] = useState(false);
  const [mostrarDescuento, setMostrarDescuento] = useState(false);
  const [mostrarEnvio, setMostrarEnvio] = useState(false);

  // Categorías únicas de los productos disponibles
  const categorias = useMemo(() => {
    const cats = new Set<string>();
    productosDisponibles.forEach((p) => {
      if (p.categoria) cats.add(p.categoria);
    });
    return Array.from(cats).sort();
  }, [productosDisponibles]);

  // Productos filtrados por búsqueda + categoría
  const productosFiltrados = useMemo(() => {
    let resultado = productosDisponibles;
    // En modo búsqueda (_busqueda) o "todas", no filtrar por categoría
    if (categoriaSeleccionada !== 'todas' && categoriaSeleccionada !== '_busqueda') {
      resultado = resultado.filter((p) => p.categoria === categoriaSeleccionada);
    }
    if (busquedaProducto.trim()) {
      const q = busquedaProducto.toLowerCase().trim();
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    return resultado;
  }, [productosDisponibles, categoriaSeleccionada, busquedaProducto]);

  // Añadir producto rápido (1 tap): si ya existe, incrementa cantidad
  const handleAddProductoRapido = (productoId: string) => {
    const existente = productosSeleccionados.findIndex((p) => p.producto === productoId && !p.personalizaciones?.ingredientesExtra?.length && !p.personalizaciones?.ingredientesRemovidos?.length);
    if (existente >= 0) {
      setProductosSeleccionados((prev) =>
        prev.map((p, i) => (i === existente ? { ...p, cantidad: p.cantidad + 1 } : p))
      );
    } else {
      setProductosSeleccionados((prev) => [
        ...prev,
        { producto: productoId, cantidad: 1, notas: '' },
      ]);
    }
  };

  // +/- cantidad en producto ya añadido
  const handleIncrementarCantidad = (index: number) => {
    setProductosSeleccionados((prev) =>
      prev.map((p, i) => (i === index ? { ...p, cantidad: p.cantidad + 1 } : p))
    );
  };

  const handleDecrementarCantidad = (index: number) => {
    setProductosSeleccionados((prev) => {
      const item = prev[index];
      if (item.cantidad <= 1) return prev.filter((_, i) => i !== index);
      return prev.map((p, i) => (i === index ? { ...p, cantidad: p.cantidad - 1 } : p));
    });
  };

  // Cambiar tipo directamente (para tabs)
  const setTipo = (tipo: TipoPedido) => {
    setFormData((prev) => ({ ...prev, tipo }));
  };

  // Categorías que necesitan punto de carne
  const CATEGORIAS_PUNTO_CARNE = ['carnes', 'carne', 'hamburguesas', 'hamburguesa', 'burger', 'burgers', 'parrilla', 'grill'];
  const PUNTOS_CARNE = ['Poco hecho', 'Medio', 'Hecho', 'Muy hecho'] as const;

  // Comprobar si un producto necesita punto de carne por su categoría
  const necesitaPuntoCarne = (productoId: string): boolean => {
    const prod = productosDisponibles.find((p) => p._id === productoId);
    if (!prod?.categoria) return false;
    return CATEGORIAS_PUNTO_CARNE.includes(prod.categoria.toLowerCase());
  };

  // Extraer punto de carne de las notas (formato: "🥩Medio | resto de notas")
  const getPuntoCarne = (notas: string): string | null => {
    const match = notas.match(/^🥩(Poco hecho|Medio|Hecho|Muy hecho)/);
    return match ? match[1] : null;
  };

  // Establecer punto de carne en un producto del carrito
  const handleSetPuntoCarne = (index: number, punto: string | null) => {
    setProductosSeleccionados((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        // Quitar punto anterior de las notas
        let notas = p.notas.replace(/^🥩(Poco hecho|Medio|Hecho|Muy hecho)(\s*\|\s*)?/, '').trim();
        // Añadir nuevo punto
        if (punto) {
          notas = notas ? `🥩${punto} | ${notas}` : `🥩${punto}`;
        }
        return { ...p, notas };
      })
    );
  };

  // Nota rápida inline (sin punto de carne)
  const getNotaSinPunto = (notas: string): string => {
    return notas.replace(/^🥩(Poco hecho|Medio|Hecho|Muy hecho)(\s*\|\s*)?/, '').trim();
  };

  const handleSetNotaRapida = (index: number, nota: string) => {
    setProductosSeleccionados((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        const punto = getPuntoCarne(p.notas);
        const nuevaNota = punto
          ? (nota ? `🥩${punto} | ${nota}` : `🥩${punto}`)
          : nota;
        return { ...p, notas: nuevaNota };
      })
    );
  };

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

    // Expandir secciones si ya tienen datos
    if (pedidoInicial.notas) setMostrarNotas(true);
    if (pedidoInicial.descuento && pedidoInicial.descuento > 0) setMostrarDescuento(true);
    if (pedidoInicial.gastoEnvio && pedidoInicial.gastoEnvio > 0) setMostrarEnvio(true);
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

    // nuevo: búsqueda + categorías + secciones
    busquedaProducto,
    setBusquedaProducto,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    productosFiltrados,
    mostrarNotas,
    setMostrarNotas,
    mostrarDescuento,
    setMostrarDescuento,
    mostrarEnvio,
    setMostrarEnvio,

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
    handleAddProductoRapido,
    handleIncrementarCantidad,
    handleDecrementarCantidad,
    setTipo,
    // punto de carne + nota rápida
    necesitaPuntoCarne,
    getPuntoCarne,
    handleSetPuntoCarne,
    getNotaSinPunto,
    handleSetNotaRapida,
    PUNTOS_CARNE,
    handleSubmit,
    getNombreProducto,
    getPrecioProducto,

    // props pass-through
    onCancelar,
    modo,
  };
}

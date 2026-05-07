'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useIngredientes as useIngredientesSWR } from '@/lib/hooks/swr';
import { getErrorMessage } from '@/lib/utils/errors';

interface Ingrediente {
  _id: string;
  nombre: string;
  categoria: string;
  inventario: {
    cantidad: number;
    unidad: string;
  };
  disponible: boolean;
}

interface ProductoIngrediente {
  ingrediente: string | { _id: string; nombre: string; categoria: string };
  cantidad: number;
  unidad: string;
}

interface Producto {
  _id?: string;
  nombre?: string;
  categoria?: string;
  precio?: string | number;
  descripcion?: string;
  imagen?: string;
  ingredientes?: ProductoIngrediente[];
  ingredientesExtra?: string[];
  permitirPersonalizacion?: boolean;
  permitirExtras?: boolean;
  permitirRemover?: boolean;
  disponible?: boolean;
  activo?: boolean;
}

interface UseProductoFormProps {
  producto?: Producto | null;
  onGuardar: (producto: any) => void;
}

export function useProductoForm({ producto, onGuardar }: UseProductoFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
    imagen: '',
    ingredientes: [] as { ingrediente: string; cantidad: number; unidad: string }[],
    ingredientesExtra: [] as string[],
    permitirPersonalizacion: true,
    permitirExtras: true,
    permitirRemover: true,
    disponible: true,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState('');

  // Ingredientes vía SWR (compartido con otros componentes)
  const { ingredientes: rawIngredientes } = useIngredientesSWR();
  const ingredientesDisponibles = rawIngredientes as Ingrediente[];

  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState('');
  const [cantidadIngrediente, setCantidadIngrediente] = useState('');
  const [unidadIngrediente, setUnidadIngrediente] = useState('gramos');

  // Al montar o cambiar producto, precargar datos
  useEffect(() => {
    if (producto && producto._id) {
      setFormData({
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        precio: producto.precio?.toString() || '',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || '',
        // CONVERTIR ObjectId populado a string
        ingredientes: Array.isArray(producto.ingredientes)
          ? producto.ingredientes.map((ing: any) => ({
              ingrediente: typeof ing.ingrediente === 'object'
                ? ing.ingrediente._id
                : ing.ingrediente,
              cantidad: ing.cantidad,
              unidad: ing.unidad,
            }))
          : [],
        ingredientesExtra: Array.isArray(producto.ingredientesExtra) ? [...producto.ingredientesExtra] : [],
        permitirPersonalizacion: producto.permitirPersonalizacion ?? true,
        permitirExtras: producto.permitirExtras ?? true,
        permitirRemover: producto.permitirRemover ?? true,
        disponible: producto.disponible ?? true,
        activo: producto.activo ?? true,
      });
      setPreview(producto.imagen || '');
    } else {
      setFormData({
        nombre: '',
        categoria: '',
        precio: '',
        descripcion: '',
        imagen: '',
        ingredientes: [],
        ingredientesExtra: [],
        permitirPersonalizacion: true,
        permitirExtras: true,
        permitirRemover: true,
        disponible: true,
        activo: true,
      });
      setPreview('');
    }
  }, [producto]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Añadir ingrediente al producto
  const handleAddIngrediente = () => {
    if (!ingredienteSeleccionado || !cantidadIngrediente) {
      toast.warning('Selecciona un ingrediente y cantidad');
      return;
    }

    const cantidad = parseFloat(cantidadIngrediente);
    if (cantidad <= 0) {
      toast.warning('La cantidad debe ser mayor a 0');
      return;
    }

    // Verificar que no esté ya añadido
    const yaExiste = formData.ingredientes.some(
      ing => ing.ingrediente === ingredienteSeleccionado
    );

    if (yaExiste) {
      toast.warning('Este ingrediente ya está añadido');
      return;
    }

    setFormData(prev => ({
      ...prev,
      ingredientes: [
        ...prev.ingredientes,
        {
          ingrediente: ingredienteSeleccionado,
          cantidad: cantidad,
          unidad: unidadIngrediente,
        },
      ],
    }));

    // Reset
    setIngredienteSeleccionado('');
    setCantidadIngrediente('');
    setUnidadIngrediente('gramos');
  };

  // Remover ingrediente del producto
  const handleRemoveIngrediente = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({
          ...prev,
          imagen: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No hay sesión iniciada');
      }

      // Enviar strings tal cual (backend hace la conversión)
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio) || 0,
      };

      const url =
        producto && producto._id
          ? `/api/productos/${producto._id}`
          : '/api/productos';

      const method = producto && producto._id ? 'PUT' : 'POST';

      console.log('📤 Enviando payload:', JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar producto');
      }

      toast.success(
        producto && producto._id
          ? 'Producto actualizado exitosamente'
          : 'Producto creado exitosamente'
      );

      onGuardar(data.data);
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre de ingrediente (soporta populate y lista local)
  const getNombreIngrediente = (id: string) => {
    // 1. Buscar en ingredientesDisponibles (cuando se añade nuevo)
    const ingDisponible = ingredientesDisponibles.find(i => i._id === id);
    if (ingDisponible) {
      return ingDisponible.nombre;
    }

    // 2. Buscar en el producto cargado (cuando viene populado del backend)
    if (producto?.ingredientes) {
      const ingProducto = producto.ingredientes.find((pi: any) => {
        const piId = typeof pi.ingrediente === 'object'
          ? pi.ingrediente._id
          : pi.ingrediente;
        return piId === id;
      });

      if (ingProducto && typeof ingProducto.ingrediente === 'object') {
        return ingProducto.ingrediente.nombre;
      }
    }

    // 3. Fallback: mostrar ID parcial
    return `ID: ${id.substring(0, 8)}...`;
  };

  return {
    formData,
    loading,
    error,
    preview,
    ingredientesDisponibles,
    ingredienteSeleccionado,
    setIngredienteSeleccionado,
    cantidadIngrediente,
    setCantidadIngrediente,
    unidadIngrediente,
    setUnidadIngrediente,
    handleChange,
    handleAddIngrediente,
    handleRemoveIngrediente,
    handleImageChange,
    handleSubmit,
    getNombreIngrediente,
  };
}

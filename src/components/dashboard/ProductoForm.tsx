'use client';

import { useState, useEffect } from 'react';

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
  ingrediente: string | { _id: string; nombre: string; categoria: string }; // ✅ Puede venir populado
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

interface ProductoFormProps {
  producto?: Producto | null;
  onGuardar: (producto: any) => void;
  onCancelar: () => void;
}

export default function ProductoForm({
  producto,
  onGuardar,
  onCancelar,
}: ProductoFormProps) {
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
  
  // Estados para ingredientes
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState('');
  const [cantidadIngrediente, setCantidadIngrediente] = useState('');
  const [unidadIngrediente, setUnidadIngrediente] = useState('gramos');

  // ✅ Cargar ingredientes CON TOKEN
  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.warn('⚠️ No hay token de autenticación');
          return;
        }

        console.log('🔄 Cargando ingredientes...');
        
        const res = await fetch('/api/ingredientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
          console.error('❌ Error HTTP:', res.status);
          return;
        }

        const data = await res.json();
        console.log('📦 Ingredientes recibidos:', data.data?.length || 0);

        if (data.success && Array.isArray(data.data)) {
          setIngredientesDisponibles(data.data);
        } else {
          console.error('❌ Error en respuesta:', data.error);
        }
      } catch (error) {
        console.error('❌ Error cargando ingredientes:', error);
      }
    };

    cargarIngredientes();
  }, []);

  // Al montar o cambiar producto, precargar datos
  useEffect(() => {
    if (producto && producto._id) {
      setFormData({
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        precio: producto.precio?.toString() || '',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || '',
        // ✅ CONVERTIR ObjectId populado a string
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
      alert('⚠️ Selecciona un ingrediente y cantidad');
      return;
    }

    const cantidad = parseFloat(cantidadIngrediente);
    if (cantidad <= 0) {
      alert('⚠️ La cantidad debe ser mayor a 0');
      return;
    }

    // Verificar que no esté ya añadido
    const yaExiste = formData.ingredientes.some(
      ing => ing.ingrediente === ingredienteSeleccionado
    );

    if (yaExiste) {
      alert('⚠️ Este ingrediente ya está añadido');
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

      // ✅ Enviar strings tal cual (backend hace la conversión)
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

      alert(
        producto && producto._id
          ? '✅ Producto actualizado exitosamente'
          : '✅ Producto creado exitosamente'
      );

      onGuardar(data.data);
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Obtener nombre de ingrediente (soporta populate y lista local)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-4 rounded">
          ❌ {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="Ej: Carne a la Parrilla"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium mb-2">Categoría *</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="">-- Selecciona una categoría --</option>
          <option value="Carnes">Carnes</option>
          <option value="Pescados">Pescados</option>
          <option value="Ensaladas">Ensaladas</option>
          <option value="Acompañamientos">Acompañamientos</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium mb-2">Precio (€) *</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          required
          step="0.01"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="0.00"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          rows={3}
          placeholder="Describe el producto"
        />
      </div>

      {/* ✅ Selector de Ingredientes */}
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-3">
          🥩 Ingredientes del Producto
        </h3>

        {ingredientesDisponibles.length === 0 ? (
          <p className="text-sm text-gray-400">
            ⚠️ No hay ingredientes disponibles. Crea ingredientes primero.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-2">
              {/* Selector de ingrediente */}
              <div className="col-span-5">
                <select
                  value={ingredienteSeleccionado}
                  onChange={e => setIngredienteSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Seleccionar ingrediente --</option>
                  {ingredientesDisponibles
                    .filter(ing => ing.disponible)
                    .map(ing => (
                      <option key={ing._id} value={ing._id}>
                        {ing.nombre} ({ing.inventario.cantidad} {ing.inventario.unidad})
                      </option>
                    ))}
                </select>
              </div>

              {/* Cantidad */}
              <div className="col-span-3">
                <input
                  type="number"
                  value={cantidadIngrediente}
                  onChange={e => setCantidadIngrediente(e.target.value)}
                  placeholder="Cantidad"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Unidad */}
              <div className="col-span-2">
                <select
                  value={unidadIngrediente}
                  onChange={e => setUnidadIngrediente(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="gramos">g</option>
                  <option value="kilogramos">kg</option>
                  <option value="unidad">ud</option>
                  <option value="litros">L</option>
                  <option value="mililitros">mL</option>
                </select>
              </div>

              {/* Botón añadir */}
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddIngrediente}
                  className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lista de ingredientes añadidos */}
            {formData.ingredientes.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400">Ingredientes añadidos:</p>
                {formData.ingredientes.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-600 px-3 py-2 rounded text-sm"
                  >
                    <span className="text-white">
                      {getNombreIngrediente(ing.ingrediente)} - {ing.cantidad} {ing.unidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngrediente(idx)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium mb-2">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Opciones de Personalización */}
      <div className="space-y-3 bg-gray-700 p-4 rounded">
        <h3 className="text-sm font-semibold text-amber-400">
          Opciones de Personalización
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="permitirPersonalizacion"
            checked={formData.permitirPersonalizacion}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Permitir personalización</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="permitirExtras"
            checked={formData.permitirExtras}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Permitir extras</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="permitirRemover"
            checked={formData.permitirRemover}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Permitir remover ingredientes</span>
        </label>
      </div>

      {/* Disponible y Activo */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Disponible</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Activo</span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-semibold rounded"
        >
          {loading
            ? 'Guardando...'
            : producto && producto._id
              ? 'Actualizar'
              : 'Crear'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
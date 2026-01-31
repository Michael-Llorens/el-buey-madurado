'use client';

import { useState, useEffect } from 'react';

interface Producto {
  _id?: string;
  nombre?: string;
  categoria?: string;
  precio?: string | number;
  descripcion?: string;
  imagen?: string;
  ingredientes?: any[];
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
    ingredientes: [] as any[],
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
  const [ingredienteExtra, setIngredienteExtra] = useState('');

  // ✅ Al montar o cambiar producto, precargar datos
  useEffect(() => {
    if (producto && producto._id) {
      setFormData({
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        precio: producto.precio?.toString() || '',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || '',
        ingredientes: Array.isArray(producto.ingredientes) ? [...producto.ingredientes] : [], // ✅ Garantizar array
        ingredientesExtra: Array.isArray(producto.ingredientesExtra) ? [...producto.ingredientesExtra] : [], // ✅ Garantizar array
        permitirPersonalizacion: producto.permitirPersonalizacion ?? true,
        permitirExtras: producto.permitirExtras ?? true,
        permitirRemover: producto.permitirRemover ?? true,
        disponible: producto.disponible ?? true,
        activo: producto.activo ?? true,
      });
      setPreview(producto.imagen || '');
    } else {
      // Reset si no hay producto
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

  const handleAddIngredienteExtra = () => {
    if (
      ingredienteExtra.trim() &&
      !formData.ingredientesExtra.includes(ingredienteExtra.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        ingredientesExtra: [...prev.ingredientesExtra, ingredienteExtra.trim()],
      }));
      setIngredienteExtra('');
    }
  };

  const handleRemoveIngredienteExtra = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredientesExtra: prev.ingredientesExtra.filter((_, i) => i !== index),
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

      // Preparar datos
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio) || 0,
      };

      // Si es edición, usar PUT; si es creación, usar POST
      const url =
        producto && producto._id
          ? `/api/productos/${producto._id}`
          : '/api/productos';

      const method = producto && producto._id ? 'PUT' : 'POST';

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

      {/* Ingredientes Extra */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ingredientes Extra Disponibles
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredienteExtra}
            onChange={e => setIngredienteExtra(e.target.value)}
            placeholder="Ej: Queso extra"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddIngredienteExtra}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold"
          >
            Añadir
          </button>
        </div>
        {formData.ingredientesExtra.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.ingredientesExtra.map((ing, idx) => (
              <div
                key={idx}
                className="bg-amber-600 px-3 py-1 rounded text-sm flex items-center gap-2"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredienteExtra(idx)}
                  className="text-white hover:text-red-200 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
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
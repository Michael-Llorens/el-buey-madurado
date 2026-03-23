'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface IngredienteFormProps {
  ingrediente?: any | null;
  onGuardar: (ingrediente: any) => void;
  onCancelar: () => void;
}

export default function IngredienteForm({
  ingrediente,
  onGuardar,
  onCancelar,
}: IngredienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precioBase: '',
    precioExtra: '',
    imagen: '',
    inventario: {
      cantidad: '',
      unidad: 'kg',
    },
    alergenos: [] as string[],
    disponible: true,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState('');
  const [alergeno, setAlergeno] = useState('');

  // ✅ Al montar o cambiar ingrediente, precargar datos
  useEffect(() => {
    if (ingrediente) {
      setFormData({
        nombre: ingrediente.nombre || '',
        categoria: ingrediente.categoria || '',
        descripcion: ingrediente.descripcion || '',
        precioBase: ingrediente.precioBase || '',
        precioExtra: ingrediente.precioExtra || '',
        imagen: ingrediente.imagen || '',
        inventario: {
          cantidad: ingrediente.inventario?.cantidad || '',
          unidad: ingrediente.inventario?.unidad || 'kg',
        },
        alergenos: Array.isArray(ingrediente.alergenos) ? [...ingrediente.alergenos] : [], // ✅ Garantizar array
        disponible: ingrediente.disponible ?? true,
        activo: ingrediente.activo ?? true,
      });
      setPreview(ingrediente.imagen || '');
    }
  }, [ingrediente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('inventario.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        inventario: {
          ...prev.inventario,
          [field]: value,
        },
      }));
    } else if (type === 'checkbox') {
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

  const handleAddAlergeno = () => {
    if (alergeno.trim() && !formData.alergenos.includes(alergeno.trim())) {
      setFormData(prev => ({
        ...prev,
        alergenos: [...prev.alergenos, alergeno.trim()],
      }));
      setAlergeno('');
    }
  };

  const handleRemoveAlergeno = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.filter((_, i) => i !== index),
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
        precioBase: parseFloat(formData.precioBase) || 0,
        precioExtra: parseFloat(formData.precioExtra) || 0,
        inventario: {
          cantidad: parseFloat(String(formData.inventario.cantidad)) || 0,
          unidad: formData.inventario.unidad,
        },
      };

      // Si es edición, usar PUT; si es creación, usar POST
      const url = ingrediente && ingrediente._id
        ? `/api/ingredientes/${ingrediente._id}`
        : '/api/ingredientes';

      const method = ingrediente && ingrediente._id ? 'PUT' : 'POST';

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
        throw new Error(data.error || 'Error al guardar ingrediente');
      }

      toast.success(
        ingrediente && ingrediente._id
          ? 'Ingrediente actualizado exitosamente'
          : 'Ingrediente creado exitosamente'
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
          placeholder="Ej: Carne de res"
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
          <option value="Verduras">Verduras</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Condimentos">Condimentos</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Otros">Otros</option>
        </select>
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
          placeholder="Describe el ingrediente"
        />
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Precio Base (€) *</label>
          <input
            type="number"
            name="precioBase"
            value={formData.precioBase}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio Extra (€)</label>
          <input
            type="number"
            name="precioExtra"
            value={formData.precioExtra}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Inventario */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Cantidad *</label>
          <input
            type="number"
            name="inventario.cantidad"
            value={formData.inventario.cantidad}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Unidad *</label>
          <select
            name="inventario.unidad"
            value={formData.inventario.unidad}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
            <option value="unidades">unidades</option>
          </select>
        </div>
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
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Alergenos */}
      <div>
        <label className="block text-sm font-medium mb-2">Alergenos</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={alergeno}
            onChange={(e) => setAlergeno(e.target.value)}
            placeholder="Ej: Gluten"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddAlergeno}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold"
          >
            Añadir
          </button>
        </div>
        {formData.alergenos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.alergenos.map((alerg, idx) => (
              <div key={idx} className="bg-amber-600 px-3 py-1 rounded text-sm flex items-center gap-2">
                {alerg}
                <button
                  type="button"
                  onClick={() => handleRemoveAlergeno(idx)}
                  className="text-white hover:text-red-200 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
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
          {loading ? 'Guardando...' : ingrediente && ingrediente._id ? 'Actualizar' : 'Crear'}
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
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ALERGENOS_UE,
  ALERGENOS_LABELS,
  ALERGENOS_ICONOS,
  ALERGENOS_COLORES,
  type AlergenoUE,
} from '@/lib/constants/alergenos';
import { getErrorMessage } from '@/lib/utils/errors';

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

  const handleToggleAlergeno = (alergeno: AlergenoUE) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.includes(alergeno)
        ? prev.alergenos.filter(a => a !== alergeno)
        : [...prev.alergenos, alergeno],
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
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(getErrorMessage(err));
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
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
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
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
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
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
          rows={3}
          placeholder="Describe el ingrediente"
        />
      </div>

      {/* Precios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Precio Base *</label>
          <div className="relative">
            <input
              type="number"
              name="precioBase"
              value={formData.precioBase}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 pr-10 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio Extra</label>
          <div className="relative">
            <input
              type="number"
              name="precioExtra"
              value={formData.precioExtra}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 pr-10 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Precio cuando se añade como extra</p>
        </div>
      </div>

      {/* Inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Cantidad *</label>
          <input
            type="number"
            name="inventario.cantidad"
            value={formData.inventario.cantidad}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Unidad *</label>
          <select
            name="inventario.unidad"
            value={formData.inventario.unidad}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
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
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 5 * 1024 * 1024) {
              alert('La imagen no puede superar 5MB');
              e.target.value = '';
              return;
            }
            handleImageChange(e);
          }}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-700 rounded text-white"
        />
        <p className="text-xs text-gray-500 mt-1">JPG, PNG o WebP. Máximo 5MB.</p>
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Alérgenos UE (14 regulados) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Alérgenos <span className="text-gray-400 text-xs">(14 regulados UE)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ALERGENOS_UE.map((alerg) => {
            const isSelected = formData.alergenos.includes(alerg);
            return (
              <button
                key={alerg}
                type="button"
                onClick={() => handleToggleAlergeno(alerg)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left text-sm ${
                  isSelected
                    ? `${ALERGENOS_COLORES[alerg]} border-white text-white font-semibold`
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-lg">{ALERGENOS_ICONOS[alerg]}</span>
                <span>{ALERGENOS_LABELS[alerg]}</span>
              </button>
            );
          })}
        </div>
        {formData.alergenos.length > 0 && (
          <p className="mt-2 text-xs text-amber-400">
            {formData.alergenos.length} alérgeno{formData.alergenos.length !== 1 ? 's' : ''} seleccionado{formData.alergenos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Disponible y Activo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
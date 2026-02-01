'use client';

import { useState, useEffect } from 'react';

interface Mesa {
  _id?: string;
  numero?: number;
  capacidad?: number;
  estado?: 'libre' | 'ocupada' | 'reservada';
  activa?: boolean;
}

interface MesaFormProps {
  mesa?: Mesa | null;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function MesaForm({
  mesa,
  onGuardar,
  onCancelar,
}: MesaFormProps) {
  const [formData, setFormData] = useState({
    numero: '',
    capacidad: '',
    estado: 'libre' as 'libre' | 'ocupada' | 'reservada',
    activa: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mesa && mesa._id) {
      setFormData({
        numero: mesa.numero?.toString() || '',
        capacidad: mesa.capacidad?.toString() || '',
        estado: mesa.estado || 'libre',
        activa: mesa.activa ?? true,
      });
    } else {
      setFormData({
        numero: '',
        capacidad: '4',
        estado: 'libre',
        activa: true,
      });
    }
  }, [mesa]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No hay sesión iniciada');
      }

      const payload = {
        numero: parseInt(formData.numero),
        capacidad: parseInt(formData.capacidad),
        estado: formData.estado,
        activa: formData.activa,
      };

      const url =
        mesa && mesa._id
          ? `/api/mesas/${mesa._id}`
          : '/api/mesas';

      const method = mesa && mesa._id ? 'PUT' : 'POST';

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
        throw new Error(data.error || 'Error al guardar mesa');
      }

      alert(
        mesa && mesa._id
          ? '✅ Mesa actualizada exitosamente'
          : '✅ Mesa creada exitosamente'
      );

      onGuardar();
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

      {/* Número */}
      <div>
        <label className="block text-sm font-medium mb-2">Número de Mesa *</label>
        <input
          type="number"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          required
          min="1"
          disabled={mesa && mesa._id ? true : false}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
          placeholder="Ej: 1"
        />
        {mesa && mesa._id && (
          <p className="text-xs text-gray-400 mt-1">
            El número de mesa no se puede cambiar una vez creada
          </p>
        )}
      </div>

      {/* Capacidad */}
      <div>
        <label className="block text-sm font-medium mb-2">Capacidad (comensales) *</label>
        <input
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          required
          min="1"
          max="20"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="Ej: 4"
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium mb-2">Estado *</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="libre">🟢 Libre</option>
          <option value="ocupada">🔴 Ocupada</option>
          <option value="reservada">🟡 Reservada</option>
        </select>
      </div>

      {/* Activa */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="activa"
            checked={formData.activa}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Mesa activa</span>
        </label>
        <p className="text-xs text-gray-400 mt-1">
          Desactiva la mesa si está en mantenimiento o no disponible
        </p>
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
            : mesa && mesa._id
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
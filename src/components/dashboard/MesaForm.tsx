'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MesaFormData {
  nombre: string; 
  capacidad: string;
  comensalesActuales: string;
  estado: 'libre' | 'ocupada' | 'reservada';
  activa: boolean;
}

interface Mesa {
  _id?: string;
  nombre?: string; 
  capacidad?: number;
  comensalesActuales?: number;
  estado?: 'libre' | 'ocupada' | 'reservada';
  activa?: boolean;
}

interface MesaFormProps {
  mesa?: Mesa | null;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function MesaForm({ mesa, onGuardar, onCancelar }: MesaFormProps) {
  const [formData, setFormData] = useState<MesaFormData>({
    nombre: '',
    capacidad: '4',
    comensalesActuales: '0',
    estado: 'libre',
    activa: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mesa && mesa._id) {
      setFormData({
        nombre: (mesa.nombre ?? '').toString(),
        capacidad: (mesa.capacidad ?? 4).toString(),
        comensalesActuales: (mesa.comensalesActuales ?? 0).toString(),
        estado: mesa.estado || 'libre',
        activa: mesa.activa ?? true,
      });
    } else {
      setFormData({
        nombre: '',
        capacidad: '4',
        comensalesActuales: '0',
        estado: 'libre',
        activa: true,
      });
    }
  }, [mesa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      } as MesaFormData;

      // ✅ Si cambias capacidad y ahora es menor que comensales, ajustamos comensales al máximo permitido
      if (name === 'capacidad') {
        const cap = Math.max(1, Math.trunc(Number(next.capacidad || '1')));
        const com = Math.max(0, Math.trunc(Number(next.comensalesActuales || '0')));
        if (com > cap) next.comensalesActuales = String(cap);
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No hay sesión iniciada');

      const nombre = formData.nombre.trim();
      const capacidad = Math.trunc(Number(formData.capacidad));
      const comensales = Math.trunc(Number(formData.comensalesActuales || '0'));

      if (!nombre) throw new Error('Nombre de mesa inválido');
      if (!Number.isFinite(capacidad) || capacidad < 1 || capacidad > 20)
        throw new Error('Capacidad inválida (1-20)');
      if (!Number.isFinite(comensales) || comensales < 0)
        throw new Error('Comensales inválidos');
      if (comensales > capacidad)
        throw new Error(`Comensales no puede superar la capacidad (${capacidad})`);

      const payload = {
        nombre, 
        capacidad,
        comensalesActuales: comensales,
        estado: formData.estado,
        activa: formData.activa,
      };

      const url = mesa && mesa._id ? `/api/mesas/${mesa._id}` : '/api/mesas';
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
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al guardar mesa');

      toast.success(mesa && mesa._id ? 'Mesa actualizada exitosamente' : 'Mesa creada exitosamente');
      onGuardar();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const capacidadNum = Math.max(1, Math.trunc(Number(formData.capacidad || '1')));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-600 text-white p-4 rounded">❌ {error}</div>}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">Nombre de mesa *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          maxLength={40}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="Ej: Terraza 1"
        />
      </div>

      {/* Capacidad */}
      <div>
        <label className="block text-sm font-medium mb-2">Capacidad (máx.) *</label>
        <input
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          required
          min={1}
          max={20}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="Ej: 4"
        />
      </div>

      {/* Comensales actuales */}
      <div>
        <label className="block text-sm font-medium mb-2">Comensales actuales</label>
        <input
          type="number"
          name="comensalesActuales"
          value={formData.comensalesActuales}
          onChange={handleChange}
          min={0}
          max={capacidadNum} 
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-amber-500 focus:outline-none"
          placeholder="0"
        />
        <p className="text-xs text-gray-400 mt-1">Máximo permitido ahora: {capacidadNum}.</p>
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
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-semibold rounded"
        >
          {loading ? 'Guardando...' : mesa && mesa._id ? 'Actualizar' : 'Crear'}
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

'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Ingrediente {
  _id?: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precioBase: number;
  precioExtra: number;
  imagen: string;
  inventario: {
    cantidad: number;
    unidad: string;
  };
  alergenicos: string[];
  disponible: boolean;
  activo: boolean;
}

interface IngredienteFormProps {
  ingrediente?: Ingrediente | null;
  onGuardar: (ingrediente: Ingrediente) => void;
  onCancelar: () => void;
}

export default function IngredienteForm({
  ingrediente,
  onGuardar,
  onCancelar,
}: IngredienteFormProps) {

  const [form, setForm] = useState<Ingrediente>({
    nombre: '',
    categoria: 'carne',
    descripcion: '',
    precioBase: 0,
    precioExtra: 0,
    imagen: '',
    inventario: {
      cantidad: 100,
      unidad: 'g',
    },
    alergenicos: [],
    disponible: true,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categorias = [
    'carne',
    'queso',
    'salsa',
    'vegetal',
    'topping',
    'pan',
    'otros',
  ];
  const unidades = ['g', 'ml', 'unidad', 'porcion'];
  const alergenos = [
    'gluten',
    'lácteos',
    'frutos secos',
    'maní',
    'huevo',
    'pescado',
    'marisco',
    'soja',
  ];

  useEffect(() => {
    if (ingrediente) {
      setForm(ingrediente);
    }
  }, [ingrediente]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Ingrediente] as Record<string, any>),
          [child]:
            type === 'number' ? Number(value) : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'number'
              ? Number(value)
              : value,
      }));
    }
  };

  const handleAlergenos = (alergen: string) => {
    setForm((prev) => ({
      ...prev,
      alergenicos: prev.alergenicos.includes(alergen)
        ? prev.alergenicos.filter((a) => a !== alergen)
        : [...prev.alergenicos, alergen],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.nombre || form.precioBase === undefined || form.precioExtra === undefined) {
        throw new Error('Por favor llena los campos obligatorios');
      }

      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay sesión iniciada');
      }

      const datosIngrediente = {
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        precioBase: Number(form.precioBase),
        precioExtra: Number(form.precioExtra),
        imagen: form.imagen,
        inventario: {
          cantidad: Number(form.inventario.cantidad),
          unidad: form.inventario.unidad,
        },
        alergenicos: form.alergenicos,
        disponible: form.disponible,
        activo: form.activo,
      };

      const metodo = ingrediente ? 'PUT' : 'POST';
      const url = ingrediente
        ? `/api/ingredientes/${ingrediente._id}`
        : '/api/ingredientes';

      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosIngrediente),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Error ${res.status}: ${res.statusText}`
        );
      }

      console.log('✅ Ingrediente guardado:', data.data);
      onGuardar(data.data);

      // ✅ Si es EDICIÓN, refresca los datos
      if (ingrediente) {
        window.location.reload();
      }

      // Limpiar formulario si es nuevo ingrediente
      if (!ingrediente) {
        setForm({
          nombre: '',
          categoria: 'carne',
          descripcion: '',
          precioBase: 0,
          precioExtra: 0,
          imagen: '',
          inventario: { cantidad: 100, unidad: 'g' },
          alergenicos: [],
          disponible: true,
          activo: true,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">
        {ingrediente ? '✏️ Editar Ingrediente' : '➕ Agregar Ingrediente'}
      </h2>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 border border-red-500 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NOMBRE Y CATEGORÍA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Queso Cheddar"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRECIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio Base (€) *
            </label>
            <input
              type="number"
              name="precioBase"
              value={form.precioBase}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Costo interno</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio Extra (€) *
            </label>
            <input
              type="number"
              name="precioExtra"
              value={form.precioExtra}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Precio al cliente</p>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Información del ingrediente..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* IMAGEN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL Imagen (Cloudinary)
          </label>
          <input
            type="url"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* INVENTARIO */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">
            📦 Inventario
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                name="inventario.cantidad"
                value={form.inventario.cantidad}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unidad
              </label>
              <select
                name="inventario.unidad"
                value={form.inventario.unidad}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-amber-400"
              >
                {unidades.map((u) => (
                  <option key={u} value={u}>
                    {u === 'unidad'
                      ? 'Unidades'
                      : u === 'ml'
                        ? 'Mililitros (ml)'
                        : u === 'g'
                          ? 'Gramos (g)'
                          : 'Porciones'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ALÉRGENOS */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">
            ⚠️ Alérgenos
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {alergenos.map((alergen) => (
              <label
                key={alergen}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.alergenicos.includes(alergen)}
                  onChange={() => handleAlergenos(alergen)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-300 capitalize">
                  {alergen}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* DISPONIBILIDAD */}
        <div className="bg-gray-700 p-4 rounded space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-300">Disponible hoy</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-300">Activo en sistema</span>
          </label>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 rounded transition"
          >
            ✅ {loading ? 'Guardando...' : ingrediente ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded transition"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
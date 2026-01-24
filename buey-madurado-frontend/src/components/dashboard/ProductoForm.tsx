'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Ingrediente {
  _id: string;
  nombre: string;
}

interface IngredienteBase {
  _id: number | string;
  ingrediente: string;
  nombre: string;
  cantidad: string | number;
  unidad: string;
  esOpcional: boolean;
}

interface Producto {
  _id?: string;
  nombre: string;
  categoria: string;
  precio: string;
  descripcion: string;
  imagen: string;
  ingredientes: IngredienteBase[];
  ingredientesExtra: string[];
  permitirPersonalizacion: boolean;
  permitirExtras: boolean;
  permitirRemover: boolean;
  disponible: boolean;
  activo: boolean;
}

interface ProductoFormProps {
  producto?: Producto | null;
  onGuardar: (producto: any) => void;
  onCancelar: () => void;
}

export default function ProductoForm({ producto, onGuardar, onCancelar }: ProductoFormProps) {
  const [form, setForm] = useState<Producto>({
    nombre: '',
    categoria: 'Carnes',
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [ingredientesBase, setIngredientesBase] = useState<IngredienteBase[]>([]);

  const categorias = ['Entrantes', 'Carnes', 'Sándwich y hamburguesas', 'Postres'];

  useEffect(() => {
    // Cargar ingredientes disponibles
    const fetchIngredientes = async () => {
      try {
        const response = await fetch('/api/ingredientes');
        if (response.ok) {
          const data = await response.json();
          setIngredientesDisponibles(data);
        }
      } catch (err) {
        console.error('Error cargando ingredientes:', err);
      }
    };

    fetchIngredientes();
  }, []);

  useEffect(() => {
    if (producto) {
      setForm(producto);
      setIngredientesBase(producto.ingredientes || []);
    }
  }, [producto]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const agregarIngredienteBase = () => {
    setIngredientesBase(prev => [
      ...prev,
      { _id: Date.now(), ingrediente: '', nombre: '', cantidad: '', unidad: 'g', esOpcional: false }
    ]);
  };

  const actualizarIngrediente = (index: number, field: string, value: any) => {
    const nuevo = [...ingredientesBase];
    if (field === 'ingrediente') {
      const ing = ingredientesDisponibles.find(i => i._id === value);
      nuevo[index] = {
        ...nuevo[index],
        ingrediente: value,
        nombre: ing?.nombre || ''
      };
    } else {
      nuevo[index] = { ...nuevo[index], [field]: value };
    }
    setIngredientesBase(nuevo);
  };

  const eliminarIngrediente = (index: number) => {
    setIngredientesBase(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientesExtra = (ingId: string) => {
    setForm(prev => ({
      ...prev,
      ingredientesExtra: prev.ingredientesExtra.includes(ingId)
        ? prev.ingredientesExtra.filter(id => id !== ingId)
        : [...prev.ingredientesExtra, ingId]
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.nombre || !form.precio || !form.descripcion) {
        throw new Error('Por favor llena los campos obligatorios');
      }

      const nuevoProducto = {
        _id: producto?._id || Date.now().toString(),
        ...form,
        precio: parseFloat(form.precio),
        ingredientes: ingredientesBase.map(ing => ({
          ingrediente: ing.ingrediente,
          nombre: ing.nombre,
          cantidad: Number(ing.cantidad),
          unidad: ing.unidad,
          esOpcional: ing.esOpcional
        }))
      };

      onGuardar(nuevoProducto);
      if (!producto) {
        setForm({
          nombre: '',
          categoria: 'Carnes',
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
        setIngredientesBase([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">
        {producto ? '✏️ Editar Producto' : '➕ Agregar Producto'}
      </h2>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 border border-red-500 text-sm">
          {error}
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
              placeholder="Ej: Hamburguesa El Buey"
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
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PRECIO E IMAGEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio (€) *
            </label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 25.50"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

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
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        {/* INGREDIENTES BASE */}
        <div className="bg-gray-700 p-4 rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-amber-400">🥘 Ingredientes Base</h3>
            <button
              type="button"
              onClick={agregarIngredienteBase}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded"
            >
              + Agregar
            </button>
          </div>

          {ingredientesBase.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-2">No hay ingredientes</p>
          ) : (
            ingredientesBase.map((ing, index) => (
              <div key={ing._id} className="bg-gray-600 p-3 rounded mb-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={ing.ingrediente}
                    onChange={(e) => actualizarIngrediente(index, 'ingrediente', e.target.value)}
                    className="text-xs bg-gray-500 border border-gray-400 rounded text-white p-2"
                  >
                    <option value="">Seleccionar...</option>
                    {ingredientesDisponibles.map(i => (
                      <option key={i._id} value={i._id}>{i.nombre}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={ing.cantidad}
                    onChange={(e) => actualizarIngrediente(index, 'cantidad', e.target.value)}
                    placeholder="Cantidad"
                    className="text-xs bg-gray-500 border border-gray-400 rounded text-white p-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={ing.unidad}
                    onChange={(e) => actualizarIngrediente(index, 'unidad', e.target.value)}
                    className="text-xs bg-gray-500 border border-gray-400 rounded text-white p-2"
                  >
                    <option value="g">Gramos</option>
                    <option value="ml">Mililitros</option>
                    <option value="unidad">Unidades</option>
                    <option value="porcion">Porciones</option>
                  </select>

                  <label className="flex items-center gap-1 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={ing.esOpcional}
                      onChange={(e) => actualizarIngrediente(index, 'esOpcional', e.target.checked)}
                      className="w-3 h-3"
                    />
                    Opcional
                  </label>

                  <button
                    type="button"
                    onClick={() => eliminarIngrediente(index)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INGREDIENTES EXTRA */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">➕ Ingredientes Extra</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ingredientesDisponibles.map(ing => (
              <label key={ing._id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.ingredientesExtra.includes(ing._id)}
                  onChange={() => handleIngredientesExtra(ing._id)}
                  className="w-4 h-4"
                />
                <span className="text-gray-300">{ing.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PERSONALIZACIÓN */}
        <div className="bg-gray-700 p-4 rounded space-y-2">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">⚙️ Personalización</h3>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="permitirPersonalizacion"
              checked={form.permitirPersonalizacion}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Permitir personalización</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="permitirExtras"
              checked={form.permitirExtras}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Permitir extras</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="permitirRemover"
              checked={form.permitirRemover}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Permitir remover</span>
          </label>
        </div>

        {/* DISPONIBILIDAD */}
        <div className="bg-gray-700 p-4 rounded space-y-2">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">📌 Disponibilidad</h3>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Disponible hoy</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-300">Activo</span>
          </label>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 rounded transition"
          >
            ✅ {loading ? 'Guardando...' : producto ? 'Actualizar' : 'Guardar'}
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

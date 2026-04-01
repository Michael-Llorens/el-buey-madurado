'use client';

import { useProductoForm } from './hooks/useProductoForm';

interface ProductoIngrediente {
  ingrediente: string | { _id: string; nombre: string; categoria: string }; // Puede venir populado
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
  const {
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
  } = useProductoForm({ producto, onGuardar });

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
          className="w-full px-4 py-2 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
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
          className="w-full px-4 py-2 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
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
        <label className="block text-sm font-medium mb-2">Precio *</label>
        <div className="relative">
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            max="9999"
            className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
            placeholder="0.00"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-700 rounded text-white focus:border-amber-500 focus:outline-none"
          rows={3}
          placeholder="Describe el producto"
        />
      </div>

      {/* Selector de Ingredientes */}
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
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              {/* Selector de ingrediente */}
              <div className="sm:col-span-5">
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
              <div className="sm:col-span-3">
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
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddIngrediente}
                  className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-sm"
                >
                  + Añadir
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
            <img
              src={preview}
              alt="Vista previa"
              className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded border border-gray-600"
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

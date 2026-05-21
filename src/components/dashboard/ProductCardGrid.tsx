'use client';

const CATEGORIA_ICON: Record<string, string> = {
  Entrantes: '🍽️',
  Hamburguesas: '🍔',
  Carnes: '🥩',
  Postres: '🍰',
  Bebidas: '🥤',
};

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  categoria?: string;
  disponible?: boolean;
  stock: number;
  descripcion: string;
  imagen?: string;
  createdAt?: string;
}

interface ProductCardGridProps {
  productos: Producto[];
  onEditar: (producto: Producto) => void;
  onEliminar: (id: string) => void;
  eliminandoId?: string | null;
}

export default function ProductCardGrid({
  productos,
  onEditar,
  onEliminar,
  eliminandoId,
}: ProductCardGridProps) {
  if (productos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No hay productos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {productos.map((producto) => (
        <div
          key={producto._id}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-amber-600 transition"
        >
          {/* Imagen */}
          {producto.imagen && (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-40 object-cover"
            />
          )}

          {/* Contenido */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white truncate flex-1 min-w-0">{producto.nombre}</h3>
              {producto.disponible === false && (
                <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2">No disponible</span>
              )}
            </div>

            <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
              <span>{CATEGORIA_ICON[producto.categoria ?? ''] ?? '📦'}</span>
              {producto.categoria ?? 'Sin categoría'}
            </p>

            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{producto.descripcion || 'Sin descripción'}</p>

            {/* Precio */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-amber-400 font-bold text-lg">{producto.precio.toFixed(2)}€</span>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => onEditar(producto)}
                disabled={eliminandoId === producto._id}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onEliminar(producto._id)}
                disabled={eliminandoId === producto._id}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition"
              >
                {eliminandoId === producto._id ? '⏳ Eliminando...' : '🗑️ Eliminar'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

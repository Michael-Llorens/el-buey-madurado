'use client';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  imagen?: string;
}

interface ProductCardGridProps {
  productos: Producto[];
  onEditar: (producto: Producto) => void;
  onEliminar: (id: string) => void;
}

export default function ProductCardGrid({ productos, onEditar, onEliminar }: ProductCardGridProps) {
  if (productos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400 text-lg">No hay productos. ¡Crea el primero!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-amber-500 transition"
        >
          {/* Imagen */}
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-40 object-cover bg-gray-700"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {/* Contenido */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-2 truncate">
              {producto.nombre}
            </h3>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {producto.descripcion || 'Sin descripción'}
            </p>

            {/* Precio y Stock */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-amber-400">
                ${producto.precio.toFixed(2)}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                producto.stock > 10 
                  ? 'bg-green-600 text-white' 
                  : producto.stock > 0 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {producto.stock} u.
              </span>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => onEditar(producto)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onEliminar(producto.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
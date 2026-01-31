'use client';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  createdAt: string;
}

interface ProductoListProps {
  productos: Producto[];
  onEliminar: (id: string) => void;
}

export default function ProductoList({ productos, onEliminar }: ProductoListProps) {
  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro que quieres eliminar este producto?')) {
      onEliminar(id);
      alert('✅ Producto eliminado');
    }
  };

  if (productos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">📦 Productos</h2>
        <p className="text-gray-400">No hay productos aún. ¡Crea el primero!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-400">📦 Listado de Productos</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="px-4 py-2 text-left text-gray-200">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-200">Precio</th>
              <th className="px-4 py-2 text-left text-gray-200">Stock</th>
              <th className="px-4 py-2 text-left text-gray-200">Descripción</th>
              <th className="px-4 py-2 text-center text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                <td className="px-4 py-3 text-white font-semibold">{producto.nombre}</td>
                <td className="px-4 py-3 text-amber-400">${producto.precio.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded ${producto.stock > 10 ? 'bg-green-600' : 'bg-red-600'}`}>
                    {producto.stock} u.
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">{producto.descripcion || '-'}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => alert('🔄 Editar no implementado aún')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        Total de productos: <span className="font-bold text-amber-400">{productos.length}</span>
      </div>
    </div>
  );
}
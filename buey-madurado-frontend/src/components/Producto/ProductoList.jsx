import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductoList({ categoria }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
        setProductos(response.data);
      } catch {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (productos.length === 0) return <p className="text-center text-gray-600 mt-10">No hay productos disponibles.</p>;

  // 🔹 Filtrar según la categoría
  const productosFiltrados = categoria === "todos" 
    ? productos 
    : productos.filter(p => p.type.toLowerCase() === categoria);

  // 🔹 Colores según tipo de producto
  const getCategoriaColor = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "hamburguesa":
        return "from-amber-200 to-amber-400 border-amber-500";
      case "entrante":
        return "from-green-200 to-green-400 border-green-500";
      case "postre":
        return "from-pink-200 to-pink-400 border-pink-500";
      case "sandwich":
        return "from-yellow-200 to-yellow-400 border-yellow-500";
      case "bebida":
        return "from-blue-200 to-blue-400 border-blue-500";
      case "carne":
        return "from-red-200 to-red-400 border-red-500";
      default:
        return "from-gray-200 to-gray-400 border-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productosFiltrados.map((producto) => (
        <div
          key={producto._id}
          className={`bg-gradient-to-br ${getCategoriaColor(producto.type)} border-2 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1`}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">{producto.name}</h2>

          {/* 🔹 Lista de ingredientes */}
          {producto.ingredients && producto.ingredients.length > 0 && (
            <ul className="text-gray-600 mb-3">
              {producto.ingredients.map((ing) => (
                <li key={ing._id}>
                  {ing.name} ({ing.category})
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">
              {producto.price.toFixed(2)} €
            </span>
            <span className="text-sm font-medium uppercase bg-white/60 px-3 py-1 rounded-full border">
              {producto.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Carga de productos desde el backend
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

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (productos.length === 0) {
    return <p className="text-center text-gray-600 mt-10">No hay productos disponibles.</p>;
  }

  // 🔹 Colores según categoría
  const getCategoriaColor = (categoria) => {
    switch (categoria.toLowerCase()) {
      case "hamburguesa":
        return "from-amber-200 to-amber-400 border-amber-500";
      case "entrante":
        return "from-green-200 to-green-400 border-green-500";
      case "postre":
        return "from-pink-200 to-pink-400 border-pink-500";
      default:
        return "from-gray-200 to-gray-400 border-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <div
          key={producto._id}
          className={`bg-gradient-to-br ${getCategoriaColor(
            producto.categoria
          )} border-2 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1`}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {producto.nombre}
          </h2>
          <p className="text-gray-700 mb-3">{producto.descripcion}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">
              {producto.precio.toFixed(2)} €
            </span>
            <span className="text-sm font-medium uppercase bg-white/60 px-3 py-1 rounded-full border">
              {producto.categoria}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

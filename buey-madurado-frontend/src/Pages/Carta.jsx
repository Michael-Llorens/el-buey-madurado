import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";

export default function Carta() {
  const [categoria, setCategoria] = useState("entrante");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoActual, setProductoActual] = useState({
    _id: null,
    nombre: "",
    tipo: "",
    precio: "",
    descripcion: "",
  });

  const categorias = [
    { label: "Entrantes", value: "entrante" },
    { label: "Hamburguesas", value: "hamburguesa" },
    { label: "Postres", value: "postre" },
  ];

  const tiposProducto = [
    "hamburguesa",
    "sandwich",
    "postre",
    "bebida",
    "entrante",
    "carne",
  ];

  // 🔹 Cargar productos del backend
  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Guardar producto (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: productoActual.nombre,
      type: productoActual.tipo,
      price: parseFloat(productoActual.precio),
      description: productoActual.descripcion,
    };

    try {
      if (productoActual._id) {
        // Editar producto existente
        await axios.put(`${import.meta.env.VITE_API_URL}/productos/${productoActual._id}`, payload);
        alert("Producto modificado correctamente");
      } else {
        // Crear nuevo producto
        await axios.post(`${import.meta.env.VITE_API_URL}/productos`, payload);
        alert("Producto creado correctamente");
      }

      // Limpiar formulario y refrescar lista
      setProductoActual({ _id: null, nombre: "", tipo: "", precio: "", descripcion: "" });
      setMostrarFormulario(false);
      fetchProductos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    }
  };

  // 🔹 Editar producto: cargar datos en el formulario
  const handleEditar = (producto) => {
    setProductoActual({
      _id: producto._id,
      nombre: producto.name,
      tipo: producto.type,
      precio: producto.price,
      descripcion: producto.description || "",
    });
    setMostrarFormulario(true);
  };

  // 🔹 Eliminar producto
  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/productos/${id}`);
      alert("Producto eliminado correctamente");
      fetchProductos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    }
  };

  // 🔹 Filtrar productos por categoría
  const productosFiltrados = categoria === "todos"
    ? productos
    : productos.filter(p => p.type.toLowerCase() === categoria);

  // 🔹 Colores según tipo de producto
  const getCategoriaColor = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "hamburguesa": return "from-amber-200 to-amber-400 border-amber-500";
      case "entrante": return "from-green-200 to-green-400 border-green-500";
      case "postre": return "from-pink-200 to-pink-400 border-pink-500";
      case "sandwich": return "from-yellow-200 to-yellow-400 border-yellow-500";
      case "bebida": return "from-blue-200 to-blue-400 border-blue-500";
      case "carne": return "from-red-200 to-red-400 border-red-500";
      default: return "from-gray-200 to-gray-400 border-gray-500";
    }
  };

  return (
    <section className="min-h-screen pt-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-300 mb-2">Nuestra Carta</h1>
        <p className="text-white">
          Descubre nuestras especialidades elaboradas con carne madurada y productos de proximidad.
        </p>
      </div>

      {/* 🔹 Botones de filtro */}
      <div className="flex justify-center gap-4 my-6 flex-wrap">
        {categorias.map((cat) => (
          <Button
            key={cat.value}
            variant={categoria === cat.value ? "primary_carta" : "secondary_carta"}
            className="px-6 py-3 text-base md:text-lg"
            onClick={() => setCategoria(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* 🔹 Botón añadir producto */}
      <div className="flex justify-center my-6">
        <Button
          onClick={() => {
            setProductoActual({ _id: null, nombre: "", tipo: "", precio: "", descripcion: "" });
            setMostrarFormulario(!mostrarFormulario);
          }}
        >
          Añadir
        </Button>
      </div>

      {/* 🔹 Formulario */}
      {mostrarFormulario && (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-black/40 p-6 rounded-2xl shadow-lg border border-amber-300/20 mb-10"
        >
          <h3 className="text-2xl text-amber-300 font-semibold mb-4 text-center">
            {productoActual._id ? "Modificar Producto" : "Nuevo Producto"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-medium block mb-1">Nombre</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-black/60 text-white border border-white/20"
                value={productoActual.nombre}
                onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-white font-medium block mb-1">Tipo</label>
              <select
                className="w-full p-3 rounded-lg bg-black/60 text-white border border-white/20"
                value={productoActual.tipo}
                onChange={(e) => setProductoActual({ ...productoActual, tipo: e.target.value })}
                required
              >
                <option value="">Selecciona un tipo</option>
                {tiposProducto.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white font-medium block mb-1">Precio (€)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-3 rounded-lg bg-black/60 text-white border border-white/20"
                value={productoActual.precio}
                onChange={(e) => setProductoActual({ ...productoActual, precio: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-white font-medium block mb-1">Descripción</label>
            <textarea
              className="w-full p-3 h-32 rounded-lg bg-black/60 text-white border border-white/20"
              value={productoActual.descripcion}
              onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="primary_carta" type="submit">
              Guardar Producto
            </Button>
          </div>
        </form>
      )}

      {/* 🔹 Lista de productos */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => (
          <div
            key={producto._id}
            className={`bg-gradient-to-br ${getCategoriaColor(producto.type)} border-2 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1`}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">{producto.name}</h2>
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
              <span className="text-lg font-semibold text-gray-900">{producto.price.toFixed(2)} €</span>
              <span className="text-sm font-medium uppercase bg-white/60 px-3 py-1 rounded-full border">{producto.type}</span>
            </div>

            {/* 🔹 Botones editar/eliminar */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg"
                onClick={() => handleEditar(producto)}
              >
                ✏️
              </Button>
              <Button
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
                onClick={() => handleEliminar(producto._id)}
              >
                ❌
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

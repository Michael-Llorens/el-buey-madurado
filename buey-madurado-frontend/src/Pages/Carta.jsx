import { useState } from "react";
import ProductoList from "../components/Producto/ProductoList";
import Button from "../components/Button";

export default function Carta() {
  const [categoria, setCategoria] = useState("entrante"); // Estado del filtro

  const categorias = [
    { label: "Entrantes", value: "entrante" },
    { label: "Hamburguesas", value: "hamburguesa" },
    { label: "Postres", value: "postre" },
  ];

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
            variant={categoria === cat.value ? "primary" : "secondary"}
            className="px-6 py-3 text-base md:text-lg"
            onClick={() => setCategoria(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* 🔹 Lista de productos filtrados */}
      <ProductoList categoria={categoria} />
    </section>
  );
}

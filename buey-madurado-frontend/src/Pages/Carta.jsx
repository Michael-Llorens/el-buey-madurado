import ProductoList from "../components/Producto/ProductoList";

export default function Carta() {
  return (
    <section className="min-h-screen bg-amber-950 pt-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-300 mb-2">Nuestra Carta</h1>
        <p className="text-white">
          Descubre nuestras especialidades elaboradas con carne madurada y productos de proximidad.
        </p>
      </div>

      {/* 🔹 Lista de productos */}
      <ProductoList />
    </section>
  );
}
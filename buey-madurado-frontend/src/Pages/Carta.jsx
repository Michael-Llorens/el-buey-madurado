// src/pages/Carta.jsx
import { useState } from "react";
import { menuItems } from "../data/menu";
import { menuImages } from "../assets/menu";

const slides = [
  { key: "Entrantes", titulo: "Entrantes" },
  { key: "Carnes", titulo: "Carnes" },
  { key: "Sándwich y hamburguesas", titulo: "Sándwich y hamburguesas" },
  { key: "Postres", titulo: "Postres" },
];

export default function Carta() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(null);

  const handlePrev = () => {
    setAnimationDirection("right");
    setTimeout(() => {
      setCurrentSlide((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      );
      setAnimationDirection(null);
    }, 300);
  };

  const handleNext = () => {
    setAnimationDirection("left");
    setTimeout(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
      setAnimationDirection(null);
    }, 300);
  };

  const activeCategoria = slides[currentSlide].key;
  const activoTitulo = slides[currentSlide].titulo;

  const productosFiltrados = menuItems.filter(
    (item) => item.categoria === activeCategoria
  );

  const handleAbrirProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarProducto = () => {
    setProductoSeleccionado(null);
  };

  // Clases de animación
  const getAnimationClass = () => {
    if (animationDirection === "left") {
      return "animate-slide-out-left";
    }
    if (animationDirection === "right") {
      return "animate-slide-out-right";
    }
    return "animate-slide-in";
  };

  return (
    <section className="min-h-screen pt-24 px-4 md:px-6 pb-16 bg-gradient-to-b from-black via-gray-950 to-black">
      <style>{`
        @keyframes slideOutLeft {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        @keyframes slideOutRight {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-in-out;
        }

        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-in-out;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-3 drop-shadow-lg">
            Nuestra Carta
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Descubre nuestras especialidades elaboradas con carne madurada
            y productos de proximidad.
          </p>
        </div>

        {/* Contenedor principal tipo "hoja de carta" */}
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Botón izquierda */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 hover:shadow-amber-400/50"
            aria-label="Categoría anterior"
            title="Página anterior"
          >
            <span className="text-2xl">&#x2190;</span>
          </button>

          {/* Contenedor de carta tipo "página" */}
          <div className="flex-1">
            {/* Efecto de sombra de carta */}
            <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-amber-200">
              {/* Decoración esquinas tipo carta antigua */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-amber-400 opacity-50"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-400 opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-amber-400 opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-amber-400 opacity-50"></div>

              {/* Contenedor animado */}
              <div className={`${getAnimationClass()}`}>
                {/* Título de categoría con línea decorativa */}
                <div className="mb-10 text-center">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                    <h2 className="text-4xl md:text-5xl font-bold text-amber-900">
                      {activoTitulo}
                    </h2>
                    <div className="h-1 w-12 bg-gradient-to-l from-amber-600 to-amber-400 rounded-full"></div>
                  </div>
                  <p className="text-amber-700 text-sm italic">El Buey Madurado</p>
                </div>

                {/* Grid de productos */}
                {productosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {productosFiltrados.map((producto, index) => (
                      <div
                        key={producto.id}
                        className="border-b-2 border-dashed border-amber-400/40 pb-6 last:border-b-0 last:pb-0 group"
                      >
                        {/* Nombre y precio */}
                        <div
                          onClick={() => handleAbrirProducto(producto)}
                          className="cursor-pointer mb-3 transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-amber-900 flex-1">
                              {producto.nombre}
                            </h3>
                            <span className="text-xl md:text-2xl font-bold text-amber-700 whitespace-nowrap">
                              {producto.precio.toFixed(2)} €
                            </span>
                          </div>

                          {/* Descripción */}
                          <p className="text-sm md:text-base text-amber-800 leading-relaxed italic">
                            {producto.descripcion}
                          </p>

                          {/* Detalles adicionales */}
                          <div className="space-y-1 mt-2 text-xs md:text-sm text-amber-700">
                            {producto.detalle && (
                              <p className="font-semibold">• {producto.detalle}</p>
                            )}
                            {producto.incluye && (
                              <p className="font-semibold">• {producto.incluye}</p>
                            )}
                          </div>
                        </div>

                        {/* Imagen pequeña en la carta */}
                        {menuImages[producto.id] && (
                          <div className="mt-3 rounded-lg overflow-hidden h-32 md:h-40 border border-amber-400/30 hover:border-amber-400 transition">
                            <img
                              src={menuImages[producto.id]}
                              alt={producto.nombre}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                              onClick={() => handleAbrirProducto(producto)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-amber-700 text-lg">
                      No hay productos en esta categoría
                    </p>
                  </div>
                )}
              </div>

              {/* Pie de página tipo carta */}
              <div className="mt-10 pt-6 border-t border-amber-400/40 text-center">
                <p className="text-xs md:text-sm text-amber-700 italic">
                  Av. de Selgas, 5 - 46800 Xàtiva, Valencia • +34 600 000 000
                </p>
              </div>
            </div>
          </div>

          {/* Botón derecha */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 hover:shadow-amber-400/50"
            aria-label="Categoría siguiente"
            title="Página siguiente"
          >
            <span className="text-2xl">&#x2192;</span>
          </button>
        </div>

        {/* Indicador de posición del carrusel */}
        <div className="flex justify-center gap-3 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-10 bg-amber-400 shadow-lg shadow-amber-400/50"
                  : "w-3 bg-amber-700 hover:bg-amber-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MODAL/POPUP */}
      {productoSeleccionado && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCerrarProducto}
        >
          <div
            className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-400 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCerrarProducto}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <div className="p-8 md:p-12">
              {/* Imagen grande */}
              <div className="mb-8 rounded-2xl overflow-hidden h-96 bg-black border-4 border-amber-400">
                {menuImages[productoSeleccionado.id] ? (
                  <img
                    src={menuImages[productoSeleccionado.id]}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen disponible</span>
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <h2 className="text-4xl font-bold text-amber-900 mb-3">
                    {productoSeleccionado.nombre}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                </div>

                {/* Precio */}
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 text-lg font-semibold">Precio:</span>
                  <span className="text-3xl font-bold text-amber-600">
                    {productoSeleccionado.precio.toFixed(2)} €
                  </span>
                </div>

                {/* Categoría */}
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 text-lg font-semibold">Categoría:</span>
                  <span className="px-4 py-2 bg-amber-400 text-amber-900 rounded-full text-sm font-bold border-2 border-amber-600">
                    {productoSeleccionado.categoria}
                  </span>
                </div>

                {/* Descripción completa */}
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">
                    Descripción
                  </h3>
                  <p className="text-amber-800 text-lg leading-relaxed italic">
                    {productoSeleccionado.descripcion}
                  </p>
                </div>

                {/* Detalles adicionales */}
                {(productoSeleccionado.detalle || productoSeleccionado.incluye || productoSeleccionado.tipo) && (
                  <div className="bg-amber-200/50 border-2 border-amber-400 rounded-2xl p-6 space-y-3">
                    {productoSeleccionado.detalle && (
                      <div>
                        <span className="text-amber-900 text-sm font-bold">INFORMACIÓN:</span>
                        <p className="text-amber-800 text-base mt-1 font-semibold">
                          {productoSeleccionado.detalle}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.incluye && (
                      <div>
                        <span className="text-amber-900 text-sm font-bold">INCLUYE:</span>
                        <p className="text-amber-800 text-base mt-1 font-semibold">
                          {productoSeleccionado.incluye}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.tipo && (
                      <div>
                        <span className="text-amber-900 text-sm font-bold">TIPO:</span>
                        <p className="text-amber-800 text-base mt-1 font-semibold">
                          {productoSeleccionado.tipo}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón acción */}
              <div className="mt-10 flex gap-4">
                <button
                  onClick={handleCerrarProducto}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold py-4 rounded-xl transition transform hover:scale-105 active:scale-95 text-lg shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

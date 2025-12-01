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
    document.body.style.overflow = "hidden";
  };

  const handleCerrarProducto = () => {
    setProductoSeleccionado(null);
    document.body.style.overflow = "auto";
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
    <section className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-2 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16 bg-gradient-to-b from-black via-gray-950 to-black">
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

      <div className="max-w-7xl mx-auto w-full">
        {/* Encabezado */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-300 mb-2 sm:mb-3 drop-shadow-lg">
            Nuestra Carta
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-lg px-2">
            Descubre nuestras especialidades elaboradas con carne madurada
            y productos de proximidad.
          </p>
        </div>

        {/* Contenedor principal tipo "hoja de carta" */}
        <div className="flex items-stretch justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Botón izquierda */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 hover:shadow-amber-400/50"
            aria-label="Categoría anterior"
            title="Página anterior"
          >
            <span className="text-lg sm:text-xl md:text-2xl">&#x2190;</span>
          </button>

          {/* Contenedor de carta tipo "página" */}
          <div className="flex-1 min-w-0">
            {/* Efecto de sombra de carta */}
            <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-sm:border-2 border-amber-200">
              {/* Decoración esquinas tipo carta antigua - visible solo en desktop */}
              <div className="hidden sm:block absolute top-3 sm:top-4 left-3 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-t-2 border-amber-400 opacity-50"></div>
              <div className="hidden sm:block absolute top-3 sm:top-4 right-3 sm:right-4 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-t-2 border-amber-400 opacity-50"></div>
              <div className="hidden sm:block absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-b-2 border-amber-400 opacity-50"></div>
              <div className="hidden sm:block absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-b-2 border-amber-400 opacity-50"></div>

              {/* Contenedor animado */}
              <div className={`${getAnimationClass()}`}>
                {/* Título de categoría con línea decorativa */}
                <div className="mb-4 sm:mb-6 md:mb-10 text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                    <div className="h-0.5 sm:h-1 w-6 sm:w-12 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900">
                      {activoTitulo}
                    </h2>
                    <div className="h-0.5 sm:h-1 w-6 sm:w-12 bg-gradient-to-l from-amber-600 to-amber-400 rounded-full"></div>
                  </div>
                  <p className="text-amber-700 text-xs sm:text-sm italic">El Buey Madurado</p>
                </div>

                {/* Grid de productos */}
                {productosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {productosFiltrados.map((producto) => (
                      <div
                        key={producto.id}
                        className="border-b-2 sm:border-b-2 border-dashed border-amber-400/40 pb-3 sm:pb-4 md:pb-6 last:border-b-0 last:pb-0 group"
                      >
                        {/* Nombre y precio */}
                        <div
                          onClick={() => handleAbrirProducto(producto)}
                          className="cursor-pointer mb-2 sm:mb-3 transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-900 flex-1 line-clamp-2">
                              {producto.nombre}
                            </h3>
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-amber-700 whitespace-nowrap flex-shrink-0">
                              {producto.precio.toFixed(2)} €
                            </span>
                          </div>

                          {/* Descripción */}
                          <p className="text-xs sm:text-sm md:text-base text-amber-800 leading-relaxed italic line-clamp-2 sm:line-clamp-3">
                            {producto.descripcion}
                          </p>

                          {/* Detalles adicionales */}
                          <div className="space-y-0.5 sm:space-y-1 mt-1 sm:mt-2 text-xs text-amber-700">
                            {producto.detalle && (
                              <p className="font-semibold truncate">• {producto.detalle}</p>
                            )}
                            {producto.incluye && (
                              <p className="font-semibold truncate">• {producto.incluye}</p>
                            )}
                          </div>
                        </div>

                        {/* Imagen pequeña en la carta */}
                        {menuImages[producto.id] && (
                          <div className="mt-2 sm:mt-3 rounded-lg overflow-hidden h-24 sm:h-32 md:h-40 border border-amber-400/30 hover:border-amber-400 transition">
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
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-amber-700 text-sm sm:text-lg">
                      No hay productos en esta categoría
                    </p>
                  </div>
                )}
              </div>

              {/* Pie de página tipo carta */}
              <div className="mt-4 sm:mt-6 md:mt-10 pt-3 sm:pt-4 md:pt-6 border-t border-amber-400/40 text-center">
                <p className="text-xs text-amber-700 italic">
                  Av. de Selgas, 5 - 46800 Xàtiva, Valencia • +34 600 000 000
                </p>
              </div>
            </div>
          </div>

          {/* Botón derecha */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 hover:shadow-amber-400/50"
            aria-label="Categoría siguiente"
            title="Página siguiente"
          >
            <span className="text-lg sm:text-xl md:text-2xl">&#x2192;</span>
          </button>
        </div>

        {/* Indicador de posición del carrusel */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-6 sm:w-8 md:w-10 bg-amber-400 shadow-lg shadow-amber-400/50"
                  : "w-2 sm:w-3 bg-amber-700 hover:bg-amber-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MODAL/POPUP */}
      {productoSeleccionado && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={handleCerrarProducto}
        >
          <div
            className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 sm:border-4 border-amber-400 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCerrarProducto}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg text-lg sm:text-xl"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Imagen grande */}
              <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden h-48 sm:h-64 md:h-96 bg-black border-2 sm:border-4 border-amber-400">
                {menuImages[productoSeleccionado.id] ? (
                  <img
                    src={menuImages[productoSeleccionado.id]}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sin imagen disponible</span>
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Nombre */}
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-2 sm:mb-3">
                    {productoSeleccionado.nombre}
                  </h2>
                  <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                </div>

                {/* Precio */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-amber-700 text-base sm:text-lg font-semibold">Precio:</span>
                  <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                    {productoSeleccionado.precio.toFixed(2)} €
                  </span>
                </div>

                {/* Categoría */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-amber-700 text-base sm:text-lg font-semibold">Categoría:</span>
                  <span className="px-3 sm:px-4 py-1 sm:py-2 bg-amber-400 text-amber-900 rounded-full text-xs sm:text-sm font-bold border-2 border-amber-600">
                    {productoSeleccionado.categoria}
                  </span>
                </div>

                {/* Descripción completa */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900 mb-2 sm:mb-3">
                    Descripción
                  </h3>
                  <p className="text-amber-800 text-sm sm:text-base md:text-lg leading-relaxed italic">
                    {productoSeleccionado.descripcion}
                  </p>
                </div>

                {/* Detalles adicionales */}
                {(productoSeleccionado.detalle || productoSeleccionado.incluye || productoSeleccionado.tipo) && (
                  <div className="bg-amber-200/50 border-2 border-amber-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                    {productoSeleccionado.detalle && (
                      <div>
                        <span className="text-amber-900 text-xs sm:text-sm font-bold">INFORMACIÓN:</span>
                        <p className="text-amber-800 text-xs sm:text-base mt-0.5 sm:mt-1 font-semibold">
                          {productoSeleccionado.detalle}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.incluye && (
                      <div>
                        <span className="text-amber-900 text-xs sm:text-sm font-bold">INCLUYE:</span>
                        <p className="text-amber-800 text-xs sm:text-base mt-0.5 sm:mt-1 font-semibold">
                          {productoSeleccionado.incluye}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.tipo && (
                      <div>
                        <span className="text-amber-900 text-xs sm:text-sm font-bold">TIPO:</span>
                        <p className="text-amber-800 text-xs sm:text-base mt-0.5 sm:mt-1 font-semibold">
                          {productoSeleccionado.tipo}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón acción */}
              <div className="mt-6 sm:mt-8 md:mt-10 flex gap-3">
                <button
                  onClick={handleCerrarProducto}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl transition transform hover:scale-105 active:scale-95 text-sm sm:text-base md:text-lg shadow-lg"
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

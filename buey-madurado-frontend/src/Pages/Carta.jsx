import { useState } from "react";
import { menuItems } from "../data/menu";
import { menuImages } from "../assets/menu";
import "./Carta.css";

const slides = [
  { key: "Entrantes", titulo: "Entrantes" },
  { key: "Carnes", titulo: "Carnes" },
  { key: "Sándwich y hamburguesas", titulo: "Sándwich y hamburguesas" },
  { key: "Postres", titulo: "Postres" },
];

export default function Carta() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Calcular el siguiente slide
    const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    
    setAnimationDirection("right");
    setNextSlide(newSlide);
    
    // Cambiar slide después de 1s (cuando la vieja está a mitad)
    setTimeout(() => {
      setCurrentSlide(newSlide);
    }, 1000);
    
    // Limpiar y finalizar después de 2s
    setTimeout(() => {
      setNextSlide(null);
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 2000);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Calcular el siguiente slide
    const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    
    setAnimationDirection("left");
    setNextSlide(newSlide);
    
    // Cambiar slide después de 1s (cuando la vieja está a mitad)
    setTimeout(() => {
      setCurrentSlide(newSlide);
    }, 1000);
    
    // Limpiar y finalizar después de 2s
    setTimeout(() => {
      setNextSlide(null);
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 2000);
  };

  const activeCategoria = slides[currentSlide].key;
  const activoTitulo = slides[currentSlide].titulo;
  const nextCategoria = nextSlide !== null ? slides[nextSlide].key : null;
  const nextTitulo = nextSlide !== null ? slides[nextSlide].titulo : null;

  const productosFiltrados = menuItems.filter(
    (item) => item.categoria === activeCategoria
  );

  const nextProductosFiltrados = nextSlide !== null
    ? menuItems.filter((item) => item.categoria === nextCategoria)
    : [];

  const handleAbrirProducto = (producto) => {
    setProductoSeleccionado(producto);
    document.body.style.overflow = "hidden";
  };

  const handleCerrarProducto = () => {
    setProductoSeleccionado(null);
    document.body.style.overflow = "auto";
  };

  // Función para renderizar el contenido de la carta
  const renderCartaContent = (categoria, titulo, productos) => (
    <>
      {/* Decoración esquinas */}
      <div className="carta-corner carta-corner-top-left"></div>
      <div className="carta-corner carta-corner-top-right"></div>
      <div className="carta-corner carta-corner-bottom-left"></div>
      <div className="carta-corner carta-corner-bottom-right"></div>

      {/* Contenido */}
      <div className="carta-content">
        {/* Título de categoría */}
        <div className="carta-category-header">
          <div className="carta-decorative-line"></div>
          <h2 className="carta-category-title">{titulo}</h2>
          <div className="carta-decorative-line"></div>
        </div>

        {/* Grid de productos */}
        {productos.length > 0 ? (
          <div className="carta-products-grid">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="carta-product-item"
                onClick={() => handleAbrirProducto(producto)}
              >
                {/* Imagen del producto */}
                {menuImages[producto.id] && (
                  <div className="carta-product-image-wrapper">
                    <img
                      src={menuImages[producto.id]}
                      alt={producto.nombre}
                      loading="lazy"
                      className="carta-product-image"
                    />
                  </div>
                )}

                {/* Info del producto */}
                <div className="carta-product-info">
                  <div className="carta-product-header">
                    <h3 className="carta-product-name">
                      {producto.nombre}
                    </h3>
                    <span className="carta-product-price">
                      {producto.precio.toFixed(2)} €
                    </span>
                  </div>

                  <p className="carta-product-description">
                    {producto.descripcion}
                  </p>

                  {/* Detalles */}
                  <div className="carta-product-details">
                    {producto.detalle && (
                      <p className="carta-detail-item">
                        • {producto.detalle}
                      </p>
                    )}
                    {producto.incluye && (
                      <p className="carta-detail-item">
                        • {producto.incluye}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="carta-empty">
            <p>No hay productos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Pie de página */}
      <div className="carta-footer">
        <p className="carta-footer-text">
          Av. de Selgas, 5 - 46800 Xàtiva, Valencia • +34 600 000 000
        </p>
      </div>
    </>
  );

  return (
    <section className="carta-section">
      <div className="carta-container">
        {/* Encabezado */}
        {/* <div className="carta-header">
          <h1 className="carta-title">Nuestra Carta</h1>
          <p className="carta-subtitle">
            Descubre nuestras especialidades elaboradas con carne madurada
            y productos de proximidad.
          </p>
        </div> */}

        {/* Contenedor principal */}
        <div className="carta-wrapper">
          {/* Botón izquierda */}
          <button
            onClick={handlePrev}
            className="carta-button carta-button-prev"
            aria-label="Categoría anterior"
            title="Página anterior"
            disabled={isAnimating}
          >
            <span className="carta-button-icon">&#x2190;</span>
          </button>

          {/* Contenedor de carta tipo "página" */}
          <div className="carta-page-wrapper">
            {/* Página actual (saliente) */}
            <div 
              className={`carta-page ${
                isAnimating && animationDirection === "left" 
                  ? "carta-page-out-left" 
                  : isAnimating && animationDirection === "right"
                  ? "carta-page-out-right"
                  : ""
              }`}
            >
              {renderCartaContent(activeCategoria, activoTitulo, productosFiltrados)}
            </div>

            {/* Página siguiente (entrante) */}
            {nextSlide !== null && (
              <div 
                className={`carta-page carta-page-incoming ${
                  animationDirection === "left" 
                    ? "carta-page-in-from-right" 
                    : "carta-page-in-from-left"
                }`}
                style={{
                  visibility: isAnimating ? 'visible' : 'hidden'
                }}
              >
                {renderCartaContent(nextCategoria, nextTitulo, nextProductosFiltrados)}
              </div>
            )}
          </div>

          {/* Botón derecha */}
          <button
            onClick={handleNext}
            className="carta-button carta-button-next"
            aria-label="Categoría siguiente"
            title="Página siguiente"
            disabled={isAnimating}
          >
            <span className="carta-button-icon">&#x2192;</span>
          </button>
        </div>

        {/* Indicadores */}
        <div className="carta-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) setCurrentSlide(index);
              }}
              className={`carta-indicator ${
                index === currentSlide ? "carta-indicator-active" : ""
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>

      {/* MODAL/POPUP */}
      {productoSeleccionado && (
        <div
          className="carta-modal-overlay"
          onClick={handleCerrarProducto}
        >
          <div
            className="carta-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCerrarProducto}
              className="carta-modal-close"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <div className="carta-modal-content">
              {/* Imagen grande */}
              <div className="carta-modal-image-wrapper">
                {menuImages[productoSeleccionado.id] ? (
                  <img
                    src={menuImages[productoSeleccionado.id]}
                    alt={productoSeleccionado.nombre}
                    className="carta-modal-image"
                  />
                ) : (
                  <div className="carta-modal-image-placeholder">
                    <span>Sin imagen disponible</span>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="carta-modal-info">
                {/* Nombre */}
                <div>
                  <h2 className="carta-modal-title">
                    {productoSeleccionado.nombre}
                  </h2>
                  <div className="carta-modal-divider"></div>
                </div>

                {/* Precio */}
                <div className="carta-modal-price-group">
                  <span className="carta-modal-label">Precio:</span>
                  <span className="carta-modal-price">
                    {productoSeleccionado.precio.toFixed(2)} €
                  </span>
                </div>

                {/* Categoría */}
                <div className="carta-modal-category-group">
                  <span className="carta-modal-label">Categoría:</span>
                  <span className="carta-modal-badge">
                    {productoSeleccionado.categoria}
                  </span>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="carta-modal-subtitle">Descripción</h3>
                  <p className="carta-modal-description">
                    {productoSeleccionado.descripcion}
                  </p>
                </div>

                {/* Detalles adicionales */}
                {(productoSeleccionado.detalle ||
                  productoSeleccionado.incluye ||
                  productoSeleccionado.tipo) && (
                  <div className="carta-modal-details-box">
                    {productoSeleccionado.detalle && (
                      <div>
                        <span className="carta-modal-details-label">
                          INFORMACIÓN:
                        </span>
                        <p className="carta-modal-details-text">
                          {productoSeleccionado.detalle}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.incluye && (
                      <div>
                        <span className="carta-modal-details-label">
                          INCLUYE:
                        </span>
                        <p className="carta-modal-details-text">
                          {productoSeleccionado.incluye}
                        </p>
                      </div>
                    )}
                    {productoSeleccionado.tipo && (
                      <div>
                        <span className="carta-modal-details-label">
                          TIPO:
                        </span>
                        <p className="carta-modal-details-text">
                          {productoSeleccionado.tipo}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Botón cerrar */}
                <button
                  onClick={handleCerrarProducto}
                  className="carta-modal-button"
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
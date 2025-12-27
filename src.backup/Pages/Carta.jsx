import { useState, useMemo, useEffect, useRef } from "react";
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
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const cartaSectionRef = useRef(null);
  const buttonContainerRef = useRef(null);

  // Precargar imágenes
  useEffect(() => {
    const preloadImages = (productos) => {
      productos.forEach((producto) => {
        if (menuImages[producto.id] && !imagesLoaded[producto.id]) {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded((prev) => ({
              ...prev,
              [producto.id]: true,
            }));
          };
          img.src = menuImages[producto.id];
        }
      });
    };

    slides.forEach((slide) => {
      const productos = menuItems.filter(
        (item) => item.categoria === slide.key
      );
      preloadImages(productos);
    });
  }, [imagesLoaded]);

  // Intersection Observer para visibilidad de botones
  useEffect(() => {
    if (!cartaSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setButtonsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(cartaSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("right");

    setTimeout(() => {
      setCurrentSlide((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      );
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 1000);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("left");

    setTimeout(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 1000);
  };

  const activeCategoria = slides[currentSlide].key;
  const activoTitulo = slides[currentSlide].titulo;

  let nextSlideIndex;
  if (animationDirection === "left") {
    nextSlideIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  } else if (animationDirection === "right") {
    nextSlideIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  } else {
    nextSlideIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  }

  const nextCategoria = slides[nextSlideIndex].key;
  const nextTitulo = slides[nextSlideIndex].titulo;

  const productosFiltrados = useMemo(() =>
    menuItems.filter((item) => item.categoria === activeCategoria),
    [activeCategoria]
  );

  const nextProductosFiltrados = useMemo(() =>
    menuItems.filter((item) => item.categoria === nextCategoria),
    [nextCategoria]
  );

  const handleAbrirProducto = (producto) => {
    setProductoSeleccionado(producto);
    document.documentElement.classList.add("modal-open");
  };

  const handleCerrarProducto = () => {
    setProductoSeleccionado(null);
    document.documentElement.classList.remove("modal-open");
  };

  const renderCartaContent = (categoria, titulo, productos) => (
    <>
      <div className="carta-corner carta-corner-top-left"></div>
      <div className="carta-corner carta-corner-top-right"></div>
      <div className="carta-corner carta-corner-bottom-left"></div>
      <div className="carta-corner carta-corner-bottom-right"></div>

      <div className="carta-content">
        <div className="carta-category-header">
          <div className="carta-decorative-line"></div>
          <h2 className="carta-category-title">{titulo}</h2>
          <div className="carta-decorative-line"></div>
        </div>

        {productos.length > 0 ? (
          <div className="carta-products-grid">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="carta-product-item"
                onClick={() => handleAbrirProducto(producto)}
              >
                {menuImages[producto.id] && (
                  <div className="carta-product-image-wrapper">
                    <img
                      src={menuImages[producto.id]}
                      alt={producto.nombre}
                      loading="eager"
                      className="carta-product-image"
                      onLoad={() => {
                        setImagesLoaded((prev) => ({
                          ...prev,
                          [producto.id]: true,
                        }));
                      }}
                    />
                  </div>
                )}

                <div className="carta-product-info">
                  <div className="carta-product-header">
                    <h3 className="carta-product-name">{producto.nombre}</h3>
                    <span className="carta-product-price">
                      {producto.precio.toFixed(2)} €
                    </span>
                  </div>

                  <p className="carta-product-description">
                    {producto.descripcion}
                  </p>

                  <div className="carta-product-details">
                    {producto.detalle && (
                      <p className="carta-detail-item">• {producto.detalle}</p>
                    )}
                    {producto.incluye && (
                      <p className="carta-detail-item">• {producto.incluye}</p>
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

      <div className="carta-footer">
        <p className="carta-footer-text">
          Av. de Selgas, 5 - 46800 Xàtiva, Valencia • +34 600 000 000
        </p>
      </div>
    </>
  );

  return (
    <>
      <section className="carta-section" ref={cartaSectionRef}>
        <div className="carta-container">
          <div className="carta-header">
            <h1 className="carta-title">Nuestra Carta</h1>
            <p className="carta-subtitle">
              Descubre nuestras especialidades elaboradas con carne madurada
              y productos de proximidad.
            </p>
          </div>

          <div className="carta-wrapper">
            <div className="carta-page-wrapper">
              <div className="carta-page carta-page-bottom">
                {renderCartaContent(
                  nextCategoria,
                  nextTitulo,
                  nextProductosFiltrados
                )}
              </div>

              <div
                className={`carta-page carta-page-top ${isAnimating && animationDirection === "left"
                    ? "carta-page-out-left"
                    : isAnimating && animationDirection === "right"
                      ? "carta-page-out-right"
                      : ""
                  }`}
              >
                {renderCartaContent(
                  activeCategoria,
                  activoTitulo,
                  productosFiltrados
                )}
              </div>
            </div>
          </div>

          <div className="carta-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) setCurrentSlide(index);
                }}
                className={`carta-indicator ${index === currentSlide ? "carta-indicator-active" : ""
                  }`}
                disabled={isAnimating}
              />
            ))}
          </div>
        </div>

        {/* BOTONES - DENTRO DE LA CARTA, ESTÁTICOS EN CENTRO DE PANTALLA */}
        <div
          className={`carta-buttons-container ${buttonsVisible ? "carta-buttons-visible" : ""
            }`}
          ref={buttonContainerRef}
        >
          <button
            onClick={handlePrev}
            className="carta-button carta-button-prev"
            aria-label="Categoría anterior"
            disabled={isAnimating}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 8L10 16L20 24" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="carta-button carta-button-next"
            aria-label="Categoría siguiente"
            disabled={isAnimating}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8L22 16L12 24" />
            </svg>
          </button>
        </div>

        {productoSeleccionado && (
          <div
            className="carta-modal-overlay"
            onClick={handleCerrarProducto}
          >
            <div
              className="carta-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCerrarProducto}
                className="carta-modal-close"
                aria-label="Cerrar"
              >
                ✕
              </button>

              <div className="carta-modal-content">
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

                <div className="carta-modal-info">
                  <div>
                    <h2 className="carta-modal-title">
                      {productoSeleccionado.nombre}
                    </h2>
                    <div className="carta-modal-divider"></div>
                  </div>

                  <div className="carta-modal-price-group">
                    <span className="carta-modal-label">Precio:</span>
                    <span className="carta-modal-price">
                      {productoSeleccionado.precio.toFixed(2)} €
                    </span>
                  </div>

                  <div className="carta-modal-category-group">
                    <span className="carta-modal-label">Categoría:</span>
                    <span className="carta-modal-badge">
                      {productoSeleccionado.categoria}
                    </span>
                  </div>

                  <div>
                    <h3 className="carta-modal-subtitle">Descripción</h3>
                    <p className="carta-modal-description">
                      {productoSeleccionado.descripcion}
                    </p>
                  </div>

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
    </>
  );
}
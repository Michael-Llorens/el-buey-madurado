'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { menuItems } from '@/lib/menu';
import { menuImages } from '@/assets/menu/index.js';
import { CldImage } from 'next-cloudinary';
import './carta.css';

const slides = [
  { key: 'Entrantes', titulo: 'Entrantes' },
  { key: 'Carnes', titulo: 'Carnes' },
  { key: 'Sndwich y hamburguesas', titulo: 'Sndwich y hamburguesas' },
  { key: 'Postres', titulo: 'Postres' },
];

export default function CartaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [animationDirection, setAnimationDirection] = useState<string | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );

  const cartaSectionRef = useRef<HTMLDivElement>(null);
  const cartaWrapperRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  // Precargar imágenes
  useEffect(() => {
    const preloadImages = (productos: any) => {
      productos.forEach((producto: any) => {
        const imagePath =
          menuImages[producto.id as keyof typeof menuImages];
        if (imagePath && !imagesLoaded[producto.id]) {
          const img = new Image();
          img.onload = () =>
            setImagesLoaded((prev) => ({
              ...prev,
              [producto.id]: true,
            }));
          img.src = imagePath;
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

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection('right');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 1000);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection('left');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setAnimationDirection(null);
      setIsAnimating(false);
    }, 1000);
  };

  const activeCategoria = slides[currentSlide].key;
  const activoTitulo = slides[currentSlide].titulo;

  let nextSlideIndex;
  if (animationDirection === 'left') {
    nextSlideIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  } else if (animationDirection === 'right') {
    nextSlideIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  } else {
    nextSlideIndex =
      currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  }

  const nextCategoria = slides[nextSlideIndex].key;
  const nextTitulo = slides[nextSlideIndex].titulo;

  const productosFiltrados = useMemo(
    () =>
      menuItems.filter((item) => item.categoria === activeCategoria),
    [activeCategoria]
  );

  const nextProductosFiltrados = useMemo(
    () =>
      menuItems.filter((item) => item.categoria === nextCategoria),
    [nextCategoria]
  );

  const handleAbrirProducto = (producto: any) => {
    setProductoSeleccionado(producto);
    document.documentElement.classList.add('modal-open');
  };

  const handleCerrarProducto = () => {
    setProductoSeleccionado(null);
    document.documentElement.classList.remove('modal-open');
  };

  const renderCartaContent = (
    _categoria: string,
    titulo: string,
    productos: any
  ) => (
    <div>
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
            {productos.map((producto: any) => (
              <div
                key={producto.id}
                className="carta-product-item"
                onClick={() => handleAbrirProducto(producto)}
              >
                <div className="carta-product-image-wrapper">
                  <CldImage
                    src={menuImages[producto.id as keyof typeof menuImages]}
                    alt={producto.nombre}
                    width={400}
                    height={300}
                    className="carta-product-image"
                  />
                </div>

                <div className="carta-product-info">
                  <div className="carta-product-header">
                    <h3 className="carta-product-name">
                      {producto.nombre}
                    </h3>
                    <span className="carta-product-price">
                      €{producto.precio.toFixed(2)}
                    </span>
                  </div>

                  <p className="carta-product-description">
                    {producto.descripcion}
                  </p>

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

        <div className="carta-footer">
          <p className="carta-footer-text">
            Av. de Selgas, 5 - 46800 Xàtiva, Valencia • +34 600 000 000
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="carta-section" ref={cartaSectionRef}>
      <div className="carta-container">
        <div className="carta-header">
          <h1 className="carta-title">Nuestra Carta</h1>
          <p className="carta-subtitle">
            Descubre nuestras especialidades elaboradas con carne madurada y
            productos de proximidad.
          </p>
        </div>

        <div className="carta-wrapper" ref={cartaWrapperRef}>
          <div className="carta-page-wrapper">
            <div className="carta-page carta-page-bottom">
              {renderCartaContent(
                nextCategoria,
                nextTitulo,
                nextProductosFiltrados
              )}
            </div>

            <div
              className={`carta-page carta-page-top ${
                isAnimating && animationDirection === 'left'
                  ? 'carta-page-out-left'
                  : isAnimating && animationDirection === 'right'
                  ? 'carta-page-out-right'
                  : ''
              }`}
            >
              {renderCartaContent(
                activeCategoria,
                activoTitulo,
                productosFiltrados
              )}
            </div>
            {/* BOTONES FIJOS RESPONSIVOS - ENTRE PRODUCTOS Y BORDE */}
            <div className="carta-buttons-fixed-container" ref={buttonContainerRef}>
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
          </div>
        </div>

        <div className="carta-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) setCurrentSlide(index);
              }}
              className={`carta-indicator ${
                index === currentSlide ? 'carta-indicator-active' : ''
              }`}
              disabled={isAnimating}
            ></button>
          ))}
        </div>
      </div>

      {/* MODAL */}
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
                {menuImages[productoSeleccionado.id as keyof typeof menuImages] ? (
                  <img
                    src={
                      menuImages[
                        productoSeleccionado.id as keyof typeof menuImages
                      ]
                    }
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

                <div>
                  <div className="carta-modal-price-group">
                    <span className="carta-modal-label">Precio</span>
                    <span className="carta-modal-price">
                      €{productoSeleccionado.precio.toFixed(2)}
                    </span>
                  </div>

                  <div className="carta-modal-category-group">
                    <span className="carta-modal-label">Categoría</span>
                    <span className="carta-modal-badge">
                      {productoSeleccionado.categoria}
                    </span>
                  </div>
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
                          INFORMACIÓN
                        </span>
                        <p className="carta-modal-details-text">
                          {productoSeleccionado.detalle}
                        </p>
                      </div>
                    )}

                    {productoSeleccionado.incluye && (
                      <div>
                        <span className="carta-modal-details-label">
                          INCLUYE
                        </span>
                        <p className="carta-modal-details-text">
                          {productoSeleccionado.incluye}
                        </p>
                      </div>
                    )}

                    {productoSeleccionado.tipo && (
                      <div>
                        <span className="carta-modal-details-label">
                          TIPO
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
  );
}
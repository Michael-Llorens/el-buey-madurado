'use client';

import { useState, useEffect, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Review {
    author: string;
    rating: number;
    text: string;
    date: string;
}

const reviews: Review[] = [
  {
    author: "Naira Mendieta Borja",
    rating: 5,
    text: "Excelente comida, desde la carne hasta los postres. Calidad y sabores increíbles. Volveré sin duda, lo recomiendo 100%.",
    date: "Ene 2026",
  },
  {
    author: "Luis Ballesteros",
    rating: 5,
    text: "Si quieres venir al mejor sitio de Xàtiva de carne madurada, este es tu sitio. Wagyu A5 top y vaca rubia gallega increíble. Trato de otro nivel. Recomendable 100%.",
    date: "Ene 2026",
  },
  {
    author: "Zayra Pavia",
    rating: 5,
    text: "Hamburguesas riquísimas, bien servidas y con ingredientes de calidad. Muy buena atención y ambiente agradable. ¡Súper recomendable!",
    date: "Ene 2026",
  },
  {
    author: "Alejandra Sarr Lladosa",
    rating: 5,
    text: "Las mejores hamburguesas que he probado en mucho tiempo. Ingredientes de calidad, sabor increíble y un ambiente que invita a volver. Servicio rápido y amable. Totalmente recomendado.",
    date: "Dic 2025",
  },
  {
    author: "Laura Santacatalina",
    rating: 5,
    text: "Se come muy bien, se nota la calidad de la carne.",
    date: "Dic 2025",
  },
  {
    author: "Sr. Pons",
    rating: 5,
    text: "Las mejores hamburguesas que encontrarás por la zona, sin duda alguna.",
    date: "Dic 2025",
  },
  {
    author: "Sergi Sarrià Domenech",
    rating: 5,
    text: "Excelente trato, rápido, bueno y a buen precio. Espectacular.",
    date: "Dic 2025",
  },
  {
    author: "Jorgito Caraballo",
    rating: 5,
    text: "Excelente comida, muy especial para cualquier ocasión. Recomendado 100%, 10 de 10. Probé el chuletón de vaca diamante y las hamburguesas cátala y garfield.",
    date: "Nov 2025",
  },
  {
    author: "ElOsOs 96",
    rating: 5,
    text: "No tiene sentido el producto que trabajan aquí. Lo mejor de Xàtiva y alrededores con diferencia. Mis dieces para ellos.",
    date: "Nov 2025",
  },
  {
    author: "Andrea Arenas",
    rating: 5,
    text: "De las mejores hamburguesas que he probado. La calidad de la carne es increíble.",
    date: "Nov 2025",
  },
];

export default function GoogleReviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const directionRef = useRef(0);
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Header entrance animation (one-shot on scroll)
    useGSAP(() => {
        if (!headerRef.current) return;
        gsap.from(headerRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
    }, { scope: sectionRef });

    // Slide-in animation when currentIndex changes
    useGSAP(() => {
        if (!cardRef.current) return;
        const dir = directionRef.current >= 0 ? 1 : -1;
        gsap.fromTo(
            cardRef.current,
            { x: dir * 400, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: 'power2.inOut' }
        );
    }, { dependencies: [currentIndex], scope: sectionRef });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % reviews.length;
                directionRef.current = next > prev ? 1 : -1;
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-gradient-to-b from-black/20 to-black/40">
            <div className="max-w-5xl mx-auto px-6">
                {/* Título */}
                <div ref={headerRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading text-white uppercase tracking-wide mb-4">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Descubre por qué El Buey Madurado es el favorito de nuestros comensales
                    </p>
                    <div className="inline-flex items-center gap-3 text-amber-400 mb-6">
                        <FaStar className="text-3xl" />
                        <span className="text-3xl md:text-4xl font-bold">5.0</span>
                        <span className="text-white/80 text-lg md:text-xl">(55 reseñas en Google)</span>
                    </div>
                </div>

                {/* Carrusel de cartas */}
                <div className="overflow-hidden">
                    <div
                        ref={cardRef}
                        key={currentIndex}
                        className="min-h-[450px] md:min-h-[400px] flex items-center justify-center"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 max-w-2xl w-full">
                            {/* Estrellas */}
                            <div className="flex gap-2 mb-8">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className="text-amber-400 fill-amber-400 text-2xl"
                                    />
                                ))}
                            </div>

                            {/* Texto reseña */}
                            <p className="text-white/90 text-xl md:text-2xl leading-relaxed mb-10 italic font-light">
                                "{reviews[currentIndex].text}"
                            </p>

                            {/* Autor y fecha */}
                            <div className="border-t border-white/20 pt-6">
                                <p className="font-semibold text-white text-xl mb-1">
                                    {reviews[currentIndex].author}
                                </p>
                                <p className="text-white/60 text-sm flex items-center gap-2">
                                    <span>Verificado en Google</span>
                                    <span>•</span>
                                    <span>{reviews[currentIndex].date}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

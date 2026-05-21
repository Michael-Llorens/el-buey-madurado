'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type PiezaCarneProps = {
  title: string;
  origin: string;
  breed: string;
  aging: string;
  description: string;
  image: string;
  reverse?: boolean;
};

function PiezaCarne({
  title,
  origin,
  breed,
  aging,
  description,
  image,
  reverse = false,
}: PiezaCarneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const imageWrap = root.querySelector<HTMLDivElement>('[data-pieza="image-wrap"]');
    const overlay = root.querySelector<HTMLDivElement>('[data-pieza="overlay"]');
    const desc = root.querySelector<HTMLDivElement>('[data-pieza="desc"]');
    const img = root.querySelector<HTMLImageElement>('[data-pieza="img"]');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(root, { opacity: 0, y: 32, duration: 0.8, ease: 'power2.out' });
    if (img) tl.from(img, { scale: 1.04, duration: 1.1, ease: 'power2.out' }, 0);
    if (imageWrap && overlay) {
      tl.from(overlay, { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, 0.25);
    }
    if (desc) tl.from(desc, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, 0.15);
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
    >
      {/* IMAGEN CON TEXTO */}
      <div data-pieza="image-wrap" className={`relative ${reverse ? 'md:order-2' : ''}`}>
        <img
          data-pieza="img"
          src={image}
          alt={title}
          className="w-full aspect-[4/5] md:aspect-[3/4] object-cover rounded-2xl shadow-2xl"
        />

        {/* Degradado */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Texto dentro */}
        <div
          data-pieza="overlay"
          className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-amber-300 uppercase tracking-wide leading-tight">
            {title}
          </h3>

          <ul className="mt-2 space-y-1 text-[11px] sm:text-xs uppercase tracking-widest text-white/80">
            <li><strong>Procedencia:</strong> {origin}</li>
            <li><strong>Raza:</strong> {breed}</li>
            <li><strong>Maduración:</strong> {aging}</li>
          </ul>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div data-pieza="desc" className="space-y-4 md:space-y-6">
        <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function MuseoCarne() {
  return (
    <section className="w-full py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-28 md:space-y-40">
        <PiezaCarne
          title="Lomo alto"
          origin="Galicia"
          breed="Buey gallego"
          aging="+60 días"
          description="Corte jugoso y con carácter, perfecto para disfrutar del sabor y la textura en su punto."
          image="/assets/images/carneSobreNosotros1.jpg"
        />

        <PiezaCarne
          reverse
          title="Lomo bajo"
          origin="Galicia"
          breed="Vaca rubia gallega"
          aging="+ 45 días"
          description="Más fino y equilibrado, con una mordida suave y un sabor redondo que engancha."
          image="/assets/images/carneSobreNosotros2.jpg"
        />

        <PiezaCarne
          title="Wagyu"
          origin="Kobe, Japón"
          breed="Tajima-gyu"
          aging="Seleccionada"
          description="Grasa increíblemente fina y sabor intenso: una pieza para probar sin prisas y disfrutar."
          image="/assets/images/carneSobreNosotros3.png"
        />
      </div>
    </section>
  );
}

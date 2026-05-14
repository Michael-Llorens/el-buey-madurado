'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function HeroSectionSobreNosotros() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
    });
  }, { scope: contentRef });

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-start pt-16 pb-10">
      {/* Background imagen */}
      <img
        src="/assets/images/hero-Sobre-Nosotros.jpeg"
        alt="Sobre nosotros - fondo"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white/90 uppercase tracking-wide leading-tight">
          El bienestar de los animales es importante para nosotros
        </h1>
      </div>
    </section>
  );
}

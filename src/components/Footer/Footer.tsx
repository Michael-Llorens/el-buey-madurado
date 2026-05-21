// src/components/Footer/Footer.tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FooterHorario from './FooterHorario';
import FooterLegal from './FooterLegal';
import FooterSocial from './FooterSocial';
import FooterBottom from './FooterBottom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-[#0f0f0f] text-gray-400 border-t border-gray-800">
      {/* Versión móvil */}
      <div className="md:hidden max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Redes Sociales - Centradas */}
        <div className="flex justify-center">
          <FooterSocial />
        </div>

        {/* Horario */}
        <div className="flex justify-center">
          <FooterHorario />
        </div>

        {/* Línea dorada divisora */}
        <div className="flex justify-center">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>

        {/* Legal */}
        <div className="flex justify-center">
          <FooterLegal />
        </div>
      </div>

      {/* Versión desktop */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 py-16 justify-between items-start">
        <div className="flex-1">
          <FooterHorario />
        </div>
        <div className="flex-1 flex justify-center">
          <FooterLegal />
        </div>
        <div className="flex-1 flex justify-end">
          <FooterSocial />
        </div>
      </div>

      <FooterBottom />
    </footer>
  );
}
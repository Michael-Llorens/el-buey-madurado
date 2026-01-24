'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

export default function Logo() {
  const [animKey, setAnimKey] = useState(0);

  return (
    <Link
      href="/"
      className="flex items-center gap-3 group"
      onClick={() => setAnimKey((k) => k + 1)}
      aria-label="Ir al inicio"
    >
      {/* Logo Icono */}
      <CldImage
        src="Logo-Buey_t9mc4b"
        alt="El Buey Madurado"
        width={56}
        height={56}
        className="object-contain"
      />

      <div className="flex flex-col justify-center">
        {/* Nombre en bloque compacto */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span 
            key={`el-${animKey}`}
            className="logo-slide logo-slide-1 text-amber-400 font-bold text-xs uppercase tracking-tight"
          >
            EL
          </span>
          <span 
            key={`buey-${animKey}`}
            className="logo-slide logo-slide-2 text-amber-400 font-black text-2xl md:text-3xl tracking-tighter"
          >
            BUEY
          </span>
          <span 
            key={`madurado-${animKey}`}
            className="logo-slide logo-slide-3 text-amber-400 font-bold text-xs uppercase tracking-tight"
          >
            MADURADO
          </span>
        </div>

        {/* Descriptor Minimalista con bordes sutiles */}
        <span
          key={`descriptor-${animKey}`}
          className="
            logo-slide logo-slide-4
            block
            text-[8px] 
            md:text-[10px] 
            font-light 
            uppercase 
            tracking-[0.3em] 
            text-white
            whitespace-nowrap
            text-center
          "
        >
          Restaurante · Hamburguesería
        </span>
      </div>
    </Link>
  );
}
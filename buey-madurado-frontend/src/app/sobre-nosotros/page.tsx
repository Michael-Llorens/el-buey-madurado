// src/app/sobre-nosotros/page.tsx
'use client';

import HeroSectionSobreNosotros from '@/components/SobreNosotros/HeroSectionSobreNosotros';
import NuestraHistoria from '@/components/SobreNosotros/NuestraHistoria';
import NuestraFilosofia from '@/components/SobreNosotros/NuestraFilosofia';
import Equipo from '@/components/SobreNosotros/Esquipo';

export default function SobreNosotrosPage() {
  return (
    <>
      <HeroSectionSobreNosotros />
      <NuestraHistoria />
      <NuestraFilosofia />
      <Equipo />
    </>
  );
}
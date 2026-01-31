// src/app/sobre-nosotros/page.tsx

import HeroSectionSobreNosotros from '@/components/SobreNosotros/HeroSectionSobreNosotros';
import MuseoCarne from '@/components/SobreNosotros/MuseoCarne';
import HistoriaYValores from '@/components/SobreNosotros/HistoriaYValores';
import Equipo from '@/components/SobreNosotros/Esquipo';

export default function SobreNosotrosPage() {
  return (
    <main className="bg-black">
      <HeroSectionSobreNosotros />
      <MuseoCarne />
      <HistoriaYValores />
      <Equipo />
    </main>
  );
}

// import HeroSectionSobreNosotros from "../components/SobreNosotros/HeroSectionSobreNosotros"
import NuestraHistria from "../components/SobreNosotros/NuestraHistoria"
import NuestraFilosofia from "../components/SobreNosotros/NuestraFilosofia"
import Equipo from "../components/SobreNosotros/Esquipo"

export default function SobreNosotros() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-center py-6 text-amber-300">
        Sobre nosotros
      </h1>
      {/* <HeroSectionSobreNosotros/> */}
      <NuestraHistria />
      <NuestraFilosofia />
      <Equipo />

    </section>
  );
}
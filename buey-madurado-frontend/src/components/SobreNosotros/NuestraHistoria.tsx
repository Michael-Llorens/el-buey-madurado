import sobreNosotrosImg from "../../assets/images/sobre-nosotros.jpg";

export default function NuestraHistoria() {
  return (
    <section className="w-full py-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Text content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-heading text-amber-300 mb-6">
            Nuestra historia
          </h2>

          <p className="text-white leading-relaxed mb-4">
            El Buey Madurado nace con la visión de llevar la experiencia gastronómica
            del buey a otro nivel. Desde nuestros inicios, apostamos por la técnica
            de maduración como el auténtico corazón del sabor.
          </p>

          <p className="text-white leading-relaxed">
            Paciencia, precisión y respeto por el producto son los pilares que nos
            han acompañado desde el primer día. Para nosotros, el tiempo no es un
            obstáculo: es el ingrediente que transforma la carne en una experiencia
            inolvidable.
          </p>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={sobreNosotrosImg.src}
            alt="Corte de buey madurado"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}
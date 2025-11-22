import React from "react";
import nuesetraFilosofiaImg from "../../assets/images/logo-fondo-blanco.jpeg";


export default function NuestraFilosofia() {
  return (
    <section className="w-full py-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={nuesetraFilosofiaImg}
            alt="Cocina de buey madurado"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Text content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-heading text-amber-300 mb-6">
            Nuestra filosofía
          </h2>

          <p className="text-white leading-relaxed mb-4">
            Para nosotros, la maduración no es solo un método: es una forma de entender la cocina.
            Cuidamos cada pieza desde que entra a la cámara hasta que llega al plato.
          </p>

          <p className="text-white leading-relaxed">
            No hacemos comida rápida. Hacemos <span className="font-semibold">cocina de producto</span>,
            con autenticidad y dedicación.
          </p>
        </div>

      </div>
    </section>
  );
}
import React from "react";
import Button from "../Button";
import hamburguesaInicio from "../../assets/images/hamburgesa-inicio.png"; 

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full h-[calc(100vh-4rem)] flex items-center px-6 md:px-16 overflow-hidden"
    >
      {/* 🔹 Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src={hamburguesaInicio}
          alt="Hamburguesa destacada"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Capa oscura */}
      </div>

      {/* 🔹 Contenido principal */}
      <div className="relative flex flex-col justify-center items-start flex-1 space-y-6 z-10 max-w-lg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          No hablamos de comida rápida…<br />
          <span className="text-amber-500">…hablamos de alta cocina a domicilio.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200">
          Carne madurada, ingredientes locales y un sabor que trasciende.
        </p>

        {/* 🔹 Botones */}
        <div className="flex flex-wrap gap-4 mt-4">
          <Button
            variant="primary"
            className="px-6 py-3 text-base md:text-lg"
            onClick={() => (window.location.href = "/carta")}
          >
            Ver Carta
          </Button>

          <Button
            variant="primary"
            className="px-6 py-3 text-base md:text-lg"
            onClick={() => (window.location.href = "/pedido")}
          >
            Pedir Ahora
          </Button>
        </div>
      </div>
    </section>
  );
}
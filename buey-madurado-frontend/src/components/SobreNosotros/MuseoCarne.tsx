'use client';

import { motion } from "framer-motion";
import carneImg from "../../assets/images/carne.webp";

type PiezaCarneProps = {
  title: string;
  origin: string;
  breed: string;
  aging: string;
  description: string;
  reverse?: boolean;
};

function PiezaCarne({
  title,
  origin,
  breed,
  aging,
  description,
  reverse = false,
}: PiezaCarneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center`}
    >
      {/* IMAGEN CON TEXTO */}
      <motion.div
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className={`relative ${reverse ? "md:order-2" : ""}`}
      >
        <img
          src={carneImg.src}
          alt={title}
          className="w-full aspect-[4/5] md:aspect-[3/4] object-cover rounded-2xl shadow-2xl"
        />

        {/* Degradado */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Texto dentro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
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
        </motion.div>
      </motion.div>

      {/* DESCRIPCIÓN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
        className="space-y-4 md:space-y-6"
      >
        <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function MuseoCarne() {
  return (
    <section className="w-full py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-28 md:space-y-40">
        <PiezaCarne
          title="Txuleta de vaca vieja"
          origin="Norte de España"
          breed="Frisona"
          aging="45 días"
          description="Una carne profunda, intensa, con una grasa que se funde lentamente y deja huella."
        />

        <PiezaCarne
          reverse
          title="Entrecot selección"
          origin="Ganaderías locales"
          breed="Cruce nacional"
          aging="30 días"
          description="Equilibrio perfecto entre ternura y carácter, ideal para el fuego vivo."
        />

        <PiezaCarne
          title="Solomillo madurado"
          origin="Seleccionado en origen"
          breed="Vaca nacional"
          aging="25 días"
          description="Textura fina y sabor limpio, una pieza donde la maduración aporta elegancia."
        />
      </div>
    </section>
  );
}

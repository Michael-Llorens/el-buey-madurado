import React from "react";
// import { motion } from "framer-motion";

export default function HeroSectionSobreNosotros() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/maduracion-placeholder.jpg" // opcional
      >
        <source src="/videos/maduracion.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-3xl text-center px-6"
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          El arte de madurar la carne
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-light">
          Un proceso donde el tiempo, la técnica y la dedicación crean un sabor único.
        </p>
      </motion.div>
    </section>
  );
}

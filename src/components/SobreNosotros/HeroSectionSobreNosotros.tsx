'use client';

import { motion } from 'framer-motion';
import logoBuey from "../../assets/images/Logo-Buey.png";

export default function HeroSectionSobreNosotros() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background video */}
      <video
        src="https://res.cloudinary.com/dzktzrrmp/video/upload/v1765027963/202512061410_kldijp.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <img src={logoBuey.src} alt="El Buey Madurado" className="w-28 mb-8" />

        <h1 className="text-4xl md:text-6xl font-heading text-amber-300 uppercase tracking-wide">
          La carne no se explica
        </h1>

        <p className="mt-4 text-white/90 text-lg md:text-xl max-w-2xl">
          Se respeta. Desde el origen hasta el fuego.
        </p>
      </motion.div>
    </section>
  );
}

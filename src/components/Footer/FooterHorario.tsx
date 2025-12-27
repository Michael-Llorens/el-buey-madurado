// src/components/Footer/FooterHorario.tsx
import { FaPhoneAlt } from "react-icons/fa";

export default function FooterHorario() {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-amber-500 font-bold text-lg mb-3 uppercase">Horario</h3>
      <ul className="space-y-1 text-sm">
        <li>Lunes - Viernes: <span className="text-white">19:30 - 23:30</span></li>
        <li>Sábados: <span className="text-white">19:30 - 23:30</span></li>
        <li>Domingos: <span className="text-white">19:30 - 23:30</span></li>
      </ul>

      <div className="mt-4 flex justify-center md:justify-start">
        <a
          href="tel:+34670775786"
          aria-label="Llamar ahora"
          className="inline-flex items-center px-5 py-2 rounded-full font-semibold bg-amber-500 text-[#1a1410]
      hover:bg-[#1a1410] hover:text-amber-500 border-2 border-amber-500
      transform hover:scale-105 transition-all duration-300 text-sm shadow-md"
        >
          <FaPhoneAlt className="mr-3 text-lg" />
          Llamar ahora
        </a>
      </div>
    </div>
  );
}

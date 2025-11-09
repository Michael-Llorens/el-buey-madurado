import { FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa";

export default function FooterSocial() {
  return (
    <div className="flex flex-col items-center md:items-center space-y-4">
      <h3 className="text-amber-500 font-extrabold text-lg uppercase">Síguenos</h3>
      <div className="flex gap-5">
        <a
          href="https://instagram.com/restaurante_el_buey_madurado"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-amber-500 text-amber-500
          hover:bg-amber-500 hover:text-[#1a1410] transform hover:scale-110 transition-all duration-300"
        >
          <FaInstagram className="text-lg" />
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-amber-500 text-amber-500
          hover:bg-amber-500 hover:text-[#1a1410] transform hover:scale-110 transition-all duration-300"
        >
          <FaFacebookF className="text-lg" />
        </a>

        <a
          href="mailto:restauranteelbueymadurado@gmail.com"
          aria-label="Email"
          className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-amber-500 text-amber-500
          hover:bg-amber-500 hover:text-[#1a1410] transform hover:scale-110 transition-all duration-300"
        >
          <FaEnvelope className="text-lg" />
        </a>
      </div>
    </div>
  );
}

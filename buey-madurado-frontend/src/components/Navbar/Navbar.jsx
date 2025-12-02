import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import NavLink from "./NavLink";
import Button from "../Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menú si se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Clase de fondo: negro si scrolled o menú abierto, transparente si no
  const bgClass = scrolled || menuOpen ? "bg-black shadow-md" : "bg-black/50";

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-2 flex items-center justify-between h-20">
        <Logo />

        {/* Menú desktop */}
        <ul className="hidden md:flex items-center gap-10 text-gray-200 font-medium">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/carta">Carta</NavLink>
          <NavLink href="/SobreNosotros">Sobre Nosotros</NavLink>
          <NavLink href="/Contacto">Contacto</NavLink>
        </ul>

        {/* Botón desktop */}
        <div className="hidden md:block">
          <Button variant="primary">Pedir Online</Button>
        </div>

        {/* Botón hamburguesa móvil */}
        <div className="md:hidden">
          <button
            className="text-white hover:text-amber-500 transition-colors duration-200 text-3xl p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <span className="text-amber-500">✕</span> : "☰"}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-16 right-0 h-auto
          ${bgClass} text-white transition-all duration-500 ease-in-out overflow-hidden
          ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
        style={{ minWidth: "220px", maxWidth: "280px" }}
      >
        <ul className="flex flex-col items-start p-6 space-y-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/carta">Carta</NavLink>
          <NavLink href="/SobreNosotros">Sobre Nosotros</NavLink>
          <NavLink href="/contacto">Contacto</NavLink>
          <Button variant="primary" size="md">Reservar</Button>
        </ul>
      </div>
    </nav>
  );
}
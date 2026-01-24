// components/Navbar/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import NavLink from './NavLink';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const bgClass = scrolled || menuOpen ? 'bg-black shadow-md' : 'bg-black/50';

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out ${bgClass}`}
    >
      <div className="w-full flex items-center justify-between h-20 px-4">
        {/* Logo - Izquierda */}
        <Logo />

        {/* Menú desktop - Centro */}
        <ul className="hidden md:flex items-center gap-10 text-gray-200 font-semibold text-lg md:text-xl lg:text-xl flex-1 justify-center">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/carta">Carta</NavLink>
          <NavLink href="/reservas">Reservar</NavLink>
          <NavLink href="/sobre-nosotros">Sobre Nosotros</NavLink>
          <NavLink href="/contacto">Contacto</NavLink>
        </ul>

        {/* Botón hamburguesa móvil */}
        <div className="md:hidden">
          <button
            className="text-white hover:text-amber-500 transition-colors duration-200 text-4xl md:text-5xl p-4"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <span className="text-amber-500">✕</span> : '☰'}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-16 right-0 h-auto
        ${bgClass} text-white transition-all duration-500 ease-in-out overflow-hidden
        ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}
        style={{ minWidth: '220px', maxWidth: '280px' }}
      >
        <ul className="flex flex-col items-start p-6 space-y-4" onClick={() => setMenuOpen(false)}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/carta">Carta</NavLink>
          <NavLink href="/reservas">Reservar</NavLink>
          <NavLink href="/sobre-nosotros">Sobre Nosotros</NavLink>
          <NavLink href="/contacto">Contacto</NavLink>
        </ul>
      </div>
    </nav>
  );
}

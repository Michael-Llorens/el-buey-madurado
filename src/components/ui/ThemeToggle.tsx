'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin-theme';

interface ThemeToggleProps {
  /** Variante visual: 'icon' (solo icono) o 'pill' (icono + texto) */
  variant?: 'icon' | 'pill';
  className?: string;
}

/**
 * Toggle de modo claro/oscuro para el área de administración.
 * Persiste la preferencia en localStorage y aplica la clase
 * `theme-light` en el elemento <html>.
 *
 * El cambio de tema solo afecta a los elementos envueltos en `.admin-themed`
 * (login y dashboard). La web pública mantiene su tema oscuro fijo.
 */
export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  // Inicializamos directamente desde el DOM para evitar el flash
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('theme-light'));
  }, []);

  const toggle = () => {
    const newLight = !isLight;
    setIsLight(newLight);
    document.documentElement.classList.toggle('theme-light', newLight);
    try {
      localStorage.setItem(STORAGE_KEY, newLight ? 'light' : 'dark');
    } catch {
      // localStorage bloqueado: el cambio sigue funcionando, solo no se persiste.
    }
  };

  const sun = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );

  const moon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );

  if (variant === 'pill') {
    return (
      <button
        onClick={toggle}
        aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        title={isLight ? 'Modo oscuro' : 'Modo claro'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
          isLight
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 hover:bg-amber-500/15'
            : 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
        } ${className}`}
      >
        {isLight ? moon : sun}
        <span>{isLight ? 'Oscuro' : 'Claro'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={isLight ? 'Modo oscuro' : 'Modo claro'}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
        isLight
          ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-500/30'
          : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
      } ${className}`}
    >
      {isLight ? moon : sun}
    </button>
  );
}

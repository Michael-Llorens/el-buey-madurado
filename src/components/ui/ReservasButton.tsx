'use client';

import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ReservasButton() {
  return (
    <Link
      href="/reservas"
      aria-label="Reservar mesa"
      style={{
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
      className="
        fixed z-40
        inline-flex items-center gap-2
        px-4 py-2.5 sm:px-5 sm:py-3
        rounded-full
        bg-amber-500 text-[#1a1410]
        text-sm sm:text-base font-semibold
        shadow-xl
        transition-all duration-300
        hover:scale-105 hover:bg-amber-400
        active:scale-95
        max-w-[calc(100vw-2rem)]
      "
      prefetch
    >
      <FaCalendarAlt className="text-sm shrink-0" />
      <span className="whitespace-nowrap">Reservar</span>
    </Link>
  );
}

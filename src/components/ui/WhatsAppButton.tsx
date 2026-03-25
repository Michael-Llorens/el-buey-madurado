'use client';

import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ReservasButton() {
  return (
    <Link
      href="/reservas"
      aria-label="Reservar mesa"
      className="
        fixed bottom-8 right-5 z-[1000]
        flex items-center gap-2
        px-5 py-3
        rounded-full
        bg-amber-500 text-[#1a1410]
        font-semibold
        shadow-xl
        transition-all duration-300
        hover:scale-105 hover:bg-amber-400
        active:scale-95
      "
      prefetch
    >
      <FaCalendarAlt className="text-sm" />
      Reservar
    </Link>
  );
}

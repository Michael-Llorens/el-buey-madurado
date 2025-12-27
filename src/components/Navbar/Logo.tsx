// src/components/Navbar/Logo.tsx
'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <CldImage
        src="Logo-Buey_t9mc4b"
        alt="El Buey Madurado"
        width={80}
        height={80}
        className="object-contain"
      />

    </Link>
  );
}

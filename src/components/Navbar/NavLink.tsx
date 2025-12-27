// components/Navbar/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition-colors duration-200 ${
        isActive ? 'text-amber-500 font-bold' : 'hover:text-amber-500'
      }`}
    >
      {children}
    </Link>
  );
}
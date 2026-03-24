import type { Metadata, Viewport } from 'next';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';
import RootLayoutContent from './RootLayoutContent';

export const metadata: Metadata = {
  title: 'El Buey Madurado - Carne Madurada Premium',
  description: 'Sistema de gestión para el restaurante El Buey Madurado. Pedidos, cocina, mesas, stock y reportes.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo-fondo-blanco.ico',
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'El Buey',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className="bg-[#160a00] text-white overflow-x-hidden">
        <RootLayoutContent>
          {children}
        </RootLayoutContent>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
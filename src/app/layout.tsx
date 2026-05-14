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
  themeColor: '#d97706',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: el script anti-flash añade la clase `theme-light`
    // al <html> antes de la hidratación de React. Sin esta prop, React detecta
    // la diferencia entre el HTML del servidor y el cliente y lanza un warning.
    // Es el patrón oficial para theme switchers (igual que usa next-themes).
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/*
          Script anti-flash: aplica la clase `theme-light` en <html>
          ANTES del primer render para evitar el parpadeo del modo oscuro
          cuando el usuario tiene preferencia guardada en modo claro.
          Solo afecta a las áreas marcadas como `.admin-themed` (login + dashboard).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('admin-theme');if(t==='light')document.documentElement.classList.add('theme-light');}catch(e){}})();`,
          }}
        />
      </head>
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
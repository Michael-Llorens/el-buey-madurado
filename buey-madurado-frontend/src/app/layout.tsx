import type { Metadata, Viewport } from 'next';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/ui/ReservasButton';

export const metadata: Metadata = {
  title: 'El Buey Madurado - Carne Madurada Premium',
  description: 'Tienda online de carne madurada...',
  icons: {
    icon: '/logo-fondo-blanco.ico',
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
        <Navbar />
        <main className="relative min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

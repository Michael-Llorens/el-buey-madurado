'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/ui/ReservasButton';

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Rutas donde NO mostrar Navbar, Footer, Reservar
  const routesWithoutLayout = [
    '/dashboard',
    '/admin',
    '/login',
  ];
  
  // Verificar si la ruta actual empieza con alguna de las rutas sin layout
  const shouldHideLayout = routesWithoutLayout.some(route => 
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className={shouldHideLayout ? "relative min-h-screen" : "relative min-h-screen pt-20"}>
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && <WhatsAppButton />}
    </>
  );
}
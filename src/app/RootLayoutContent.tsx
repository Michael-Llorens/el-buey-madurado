'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import FirstVisitNotice from '@/components/ui/FirstVisitNotice';
import OfflineBanner from '@/components/ui/OfflineBanner';

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [swUpdate, setSwUpdate] = useState(false);

  // Registrar Service Worker para PWA + detectar actualizaciones
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // No registrar SW en desarrollo para evitar cache de HTML viejo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

    navigator.serviceWorker.register('/sw.js').catch(() => {});

    // Escuchar mensajes del SW sobre actualizaciones
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_UPDATED') {
        setSwUpdate(true);
      }
    });
  }, []);
  
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
      {/* Banner de nueva versión disponible */}
      {swUpdate && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600 text-white text-center py-2 px-4 flex items-center justify-center gap-3 shadow-lg">
          <span className="text-sm font-medium">Nueva version disponible</span>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-white text-amber-700 rounded font-semibold text-sm hover:bg-gray-100 transition"
          >
            Actualizar
          </button>
        </div>
      )}
      {!shouldHideLayout && <Navbar />}
      <main className={shouldHideLayout ? "relative min-h-screen" : "relative min-h-screen pt-20"}>
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && !pathname.startsWith('/pedir') && <WhatsAppButton />}
      {!shouldHideLayout && <FirstVisitNotice />}
      <OfflineBanner />
    </>
  );
}
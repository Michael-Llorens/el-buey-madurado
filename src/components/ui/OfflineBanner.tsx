'use client';

import { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-red-600 text-white text-center py-2 px-4 shadow-lg animate-pulse">
      <span className="text-sm font-semibold">Sin conexion — Las comandas no se pueden enviar</span>
    </div>
  );
}

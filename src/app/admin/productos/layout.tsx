'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('usuario');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setUsuario(user || '');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-300">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Ocultar el botón de WhatsApp */
        body > a[href*="whatsapp"],
        body > div[class*="whatsapp"],
        .fixed[class*="whatsapp"],
        a[href*="wa.me"],
        a[href*="whatsapp.com"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>

      <div className="fixed inset-0 bg-gray-900 z-[9999] overflow-hidden flex flex-col">
        {/* HEADER */}
        <header className="bg-gray-900 px-8 py-6 flex justify-between items-center border-b border-gray-800">

          {/* Lado izquierdo: Stock Manager */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Stock Manager</h1>
              <p className="text-gray-400 text-sm">Gestiona productos e ingredientes</p>
            </div>
          </div>

          {/* Lado derecho: Usuario y Logout (columna vertical) */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-gray-400 text-sm">
              Usuario: <span className="font-semibold text-amber-400">{usuario}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
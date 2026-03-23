'use client';

import { useState, useMemo } from 'react';
import { CldImage } from 'next-cloudinary';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePedidos } from '@/lib/hooks/swr';

type ModuloId = 'home' | 'stock' | 'mesas' | 'pedidos' | 'cocina' | 'reportes' | 'usuarios' | 'configuracion';

interface SidebarItem {
  id: ModuloId;
  label: string;
  icon: string;
  roles: string[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'pedidos', label: 'Pedidos', icon: 'P', roles: ['admin', 'camarero', 'cocinero'] },
  { id: 'cocina', label: 'Cocina', icon: 'C', roles: ['admin', 'cocinero'] },
  { id: 'mesas', label: 'Mesas', icon: 'M', roles: ['admin', 'camarero', 'cocinero'] },
  { id: 'stock', label: 'Stock', icon: 'S', roles: ['admin'] },
  { id: 'reportes', label: 'Reportes', icon: 'R', roles: ['admin'] },
  { id: 'usuarios', label: 'Usuarios', icon: 'U', roles: ['admin'] },
];

const COLOR_MAP: Record<ModuloId, string> = {
  home: 'bg-amber-600',
  pedidos: 'bg-green-600',
  cocina: 'bg-orange-600',
  mesas: 'bg-blue-600',
  stock: 'bg-red-600',
  reportes: 'bg-purple-600',
  usuarios: 'bg-yellow-600',
  configuracion: 'bg-gray-600',
};

interface DashboardShellProps {
  children: React.ReactNode;
  moduloActivo?: ModuloId;
  onModuloChange?: (modulo: ModuloId) => void;
}

export default function DashboardShell({
  children,
  moduloActivo = 'home',
  onModuloChange,
}: DashboardShellProps) {
  const { usuario } = useAuth();
  const { pedidos } = usePedidos();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendientesCount = useMemo(
    () => (pedidos ?? []).filter((p: any) => p.estado === 'pendiente').length,
    [pedidos]
  );

  const rol = usuario?.rol ?? '';
  const itemsFiltrados = SIDEBAR_ITEMS.filter((item) => item.roles.includes(rol));

  const handleNav = (id: ModuloId) => {
    onModuloChange?.(id);
    setSidebarOpen(false);
  };

  const moduloLabel = SIDEBAR_ITEMS.find((i) => i.id === moduloActivo)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* ====== SIDEBAR ====== */}

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-64 bg-gray-900 border-r border-gray-800
          flex flex-col
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
          <CldImage
            src="Logo-Buey_t9mc4b"
            alt="El Buey Madurado"
            width={40}
            height={40}
            className="object-contain shrink-0"
          />
          <div>
            <h1 className="text-sm font-bold text-amber-400 leading-tight">El Buey Madurado</h1>
            <p className="text-[10px] text-gray-500">Panel de gestion</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {itemsFiltrados.map((item) => {
            const isActive = moduloActivo === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? `${COLOR_MAP[item.id]} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <span
                  className={`
                    w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 text-white
                    ${isActive ? 'bg-white/20' : COLOR_MAP[item.id]}
                  `}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'pedidos' && pendientesCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {pendientesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-sm font-bold shrink-0">
              {(usuario?.email?.[0] ?? '?').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{usuario?.email ?? '...'}</p>
              <p className="text-[11px] text-gray-500 capitalize">{usuario?.rol ?? '...'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/login';
            }}
            className="w-full mt-3 px-3 py-2 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-all"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* ====== MAIN CONTENT ====== */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{moduloLabel}</h2>
        </header>

        {/* Content */}
        <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StockPanel from '@/components/dashboard/StockPanel';

import UsuariosPanel from './usuarios/page';
import MesasPanel from './mesas/page';
import PedidosPanel from '@/components/dashboard/PedidoPanel';
import ReportesPanel from '@/components/dashboard/ReportesPanel';
import CocinaPanel from '@/components/dashboard/CocinaPanel';

type ModuloActivo =
  | 'home'
  | 'stock'
  | 'mesas'
  | 'pedidos'
  | 'cocina'
  | 'reportes'
  | 'usuarios'
  | 'configuracion';

export default function AdminPanel() {
  const { usuario } = useAuth();
  const searchParams = useSearchParams();

  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('home');

  // ✅ NUEVO: sincroniza el módulo con la URL (?modulo=pedidos, ?modulo=mesas, etc.)
  useEffect(() => {
    const moduloFromUrl = searchParams.get('modulo') as ModuloActivo | null;

    const modulosValidos: ModuloActivo[] = [
      'home',
      'stock',
      'mesas',
      'pedidos',
      'cocina',
      'reportes',
      'usuarios',
      'configuracion',
    ];

    if (moduloFromUrl && modulosValidos.includes(moduloFromUrl)) {
      setModuloActivo(moduloFromUrl);
    }
  }, [searchParams]);

  const modulos = [
    {
      id: 'stock',
      titulo: '📦 Gestión de Stock',
      descripcion: 'Gestiona ingredientes y productos',
      icono: '🥘',
      color: 'from-orange-500 to-red-600',
      rolesPermitidos: ['admin'],
    },
    {
      id: 'mesas',
      titulo: '🪑 Gestión de Mesas',
      descripcion: 'Administra mesas y reservas',
      icono: '🪑',
      color: 'from-blue-500 to-cyan-600',
      rolesPermitidos: ['camarero', 'cocinero', 'admin'],
    },
    {
      id: 'pedidos',
      titulo: '📋 Pedidos',
      descripcion: 'Visualiza y gestiona pedidos',
      icono: '📋',
      color: 'from-green-500 to-emerald-600',
      rolesPermitidos: ['camarero', 'cocinero', 'admin'],
    },
    {
      id: 'cocina',
      titulo: 'Cocina',
      descripcion: 'Panel de cocina en tiempo real',
      icono: '',
      color: 'from-red-500 to-orange-600',
      rolesPermitidos: ['cocinero', 'admin'],
    },
    {
      id: 'reportes',
      titulo: '📊 Reportes',
      descripcion: 'Análisis de ventas y estadísticas',
      icono: '📊',
      color: 'from-purple-500 to-pink-600',
      rolesPermitidos: ['admin'],
    },
    {
      id: 'usuarios',
      titulo: '👥 Usuarios',
      descripcion: 'Gestión de permisos y roles',
      icono: '👥',
      color: 'from-yellow-500 to-amber-600',
      rolesPermitidos: ['admin'],
    },
    {
      id: 'configuracion',
      titulo: '⚙️ Configuración',
      descripcion: 'Ajustes del sistema',
      icono: '⚙️',
      color: 'from-gray-600 to-slate-700',
      rolesPermitidos: ['admin'],
    },
  ];

  const modulosFiltrados = modulos.filter(
    (modulo) => usuario?.rol && modulo.rolesPermitidos.includes(usuario.rol)
  );

  return (
    <DashboardShell>
      {moduloActivo === 'home' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulosFiltrados.map((modulo: any) => (
              <div
                key={modulo.id}
                onClick={() => setModuloActivo(modulo.id as ModuloActivo)}
                className={`bg-gradient-to-br ${modulo.color} rounded-lg p-6 shadow-lg hover:shadow-xl transition cursor-pointer group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{modulo.titulo}</h3>
                    <p className="text-sm text-gray-100 opacity-90">{modulo.descripcion}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-black bg-opacity-30 hover:bg-opacity-50 text-white py-2 px-4 rounded font-semibold transition text-center text-sm">
                    Abrir →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">📊 Estadísticas del Sistema</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm">Ingredientes</p>
                <p className="text-3xl font-bold text-amber-400">--</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm">Productos</p>
                <p className="text-3xl font-bold text-blue-400">--</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm">Mesas Disponibles</p>
                <p className="text-3xl font-bold text-green-400">--</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm">Pedidos Pendientes</p>
                <p className="text-3xl font-bold text-red-400">--</p>
              </div>
            </div>
          </div>
        </>
      )}

      {moduloActivo === 'stock' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-400">📦 Gestión de Stock</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
          <StockPanel />
        </div>
      )}

      {moduloActivo === 'mesas' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-400">🪑 Gestión de Mesas</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
          <MesasPanel />
        </div>
      )}

      {moduloActivo === 'pedidos' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-400">📋 Pedidos</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
          <PedidosPanel />
        </div>
      )}

      {moduloActivo === 'cocina' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-orange-400">Cocina</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              Volver
            </button>
          </div>
          <CocinaPanel />
        </div>
      )}

      {moduloActivo === 'reportes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-purple-400">Reportes</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              Volver
            </button>
          </div>
          <ReportesPanel />
        </div>
      )}

      {moduloActivo === 'usuarios' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400">👥 Usuarios</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
          <UsuariosPanel />
        </div>
      )}

      {moduloActivo === 'configuracion' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-400">⚙️ Configuración</h2>
            <button
              onClick={() => setModuloActivo('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
            >
              ← Volver
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">🚧 Módulo de Configuración - En desarrollo</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
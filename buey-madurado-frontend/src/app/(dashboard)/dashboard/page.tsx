'use client';

import { useState } from 'react';
import StockPanel from '@/components/dashboard/StockPanel';

type ModuloActivo = 'home' | 'stock' | 'mesas' | 'pedidos' | 'reportes' | 'usuarios' | 'configuracion';

export default function AdminPanel() {
  const [usuarioActivo] = useState('Admin');
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('home');

  const modulos = [
    {
      id: 'stock',
      titulo: '📦 Gestión de Stock',
      descripcion: 'Gestiona ingredientes y productos',
      icono: '🥘',
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'mesas',
      titulo: '🪑 Gestión de Mesas',
      descripcion: 'Administra mesas y reservas',
      icono: '🪑',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'pedidos',
      titulo: '📋 Pedidos',
      descripcion: 'Visualiza y gestiona pedidos',
      icono: '📋',
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'reportes',
      titulo: '📊 Reportes',
      descripcion: 'Análisis de ventas y estadísticas',
      icono: '📊',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'usuarios',
      titulo: '👥 Usuarios',
      descripcion: 'Gestión de permisos y roles',
      icono: '👥',
      color: 'from-yellow-500 to-amber-600',
    },
    {
      id: 'configuracion',
      titulo: '⚙️ Configuración',
      descripcion: 'Ajustes del sistema',
      icono: '⚙️',
      color: 'from-gray-600 to-slate-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">🍔 El Buey Madurado</h1>
            <p className="text-amber-100 mt-2">Panel de Administración</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-100">Bienvenido,</p>
            <p className="text-xl font-semibold">{usuarioActivo}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* 🏠 HOME - Vista de módulos */}
        {moduloActivo === 'home' && (
          <>
            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulos.map((modulo) => (
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
                    <button
                      className="flex-1 bg-black bg-opacity-30 hover:bg-opacity-50 text-white py-2 px-4 rounded font-semibold transition text-center text-sm"
                    >
                      Abrir →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">📊 Estadísticas del Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* 📦 STOCK */}
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

        {/* 🪑 MESAS */}
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
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">🚧 Módulo de Mesas - En desarrollo</p>
            </div>
          </div>
        )}

        {/* 📋 PEDIDOS */}
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
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">🚧 Módulo de Pedidos - En desarrollo</p>
            </div>
          </div>
        )}

        {/* 📊 REPORTES */}
        {moduloActivo === 'reportes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-400">📊 Reportes</h2>
              <button
                onClick={() => setModuloActivo('home')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
              >
                ← Volver
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">🚧 Módulo de Reportes - En desarrollo</p>
            </div>
          </div>
        )}

        {/* 👥 USUARIOS */}
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
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">🚧 Módulo de Usuarios - En desarrollo</p>
            </div>
          </div>
        )}

        {/* ⚙️ CONFIGURACIÓN */}
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
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

const MODULOS_VALIDOS: ModuloActivo[] = [
  'home', 'stock', 'mesas', 'pedidos', 'cocina', 'reportes', 'usuarios', 'configuracion',
];

export default function AdminPanel() {
  const searchParams = useSearchParams();
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('pedidos');

  useEffect(() => {
    const moduloFromUrl = searchParams.get('modulo') as ModuloActivo | null;
    if (moduloFromUrl && MODULOS_VALIDOS.includes(moduloFromUrl)) {
      setModuloActivo(moduloFromUrl);
    }
  }, [searchParams]);

  return (
    <DashboardShell moduloActivo={moduloActivo} onModuloChange={setModuloActivo}>
      {moduloActivo === 'stock' && <StockPanel />}
      {moduloActivo === 'mesas' && <MesasPanel />}
      {moduloActivo === 'pedidos' && <PedidosPanel />}
      {moduloActivo === 'cocina' && <CocinaPanel />}
      {moduloActivo === 'reportes' && <ReportesPanel />}
      {moduloActivo === 'usuarios' && <UsuariosPanel />}
      {moduloActivo === 'configuracion' && (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <p className="text-gray-500">Modulo de configuracion en desarrollo</p>
        </div>
      )}
    </DashboardShell>
  );
}


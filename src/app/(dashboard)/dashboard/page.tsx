'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  | 'usuarios';

const MODULOS_VALIDOS: ModuloActivo[] = [
  'home', 'stock', 'mesas', 'pedidos', 'cocina', 'reportes', 'usuarios',
];

export default function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('pedidos');

  // Leer módulo de la URL al montar
  useEffect(() => {
    const moduloFromUrl = searchParams.get('modulo') as ModuloActivo | null;
    if (moduloFromUrl && MODULOS_VALIDOS.includes(moduloFromUrl)) {
      setModuloActivo(moduloFromUrl);
    }
  }, [searchParams]);

  // Cambiar módulo y actualizar URL
  const handleModuloChange = useCallback((modulo: ModuloActivo) => {
    setModuloActivo(modulo);
    router.replace(`/dashboard?modulo=${modulo}`, { scroll: false });
  }, [router]);

  return (
    <DashboardShell moduloActivo={moduloActivo} onModuloChange={handleModuloChange}>
      {moduloActivo === 'stock' && <StockPanel />}
      {moduloActivo === 'mesas' && <MesasPanel />}
      {moduloActivo === 'pedidos' && <PedidosPanel />}
      {moduloActivo === 'cocina' && <CocinaPanel />}
      {moduloActivo === 'reportes' && <ReportesPanel />}
      {moduloActivo === 'usuarios' && <UsuariosPanel />}
    </DashboardShell>
  );
}


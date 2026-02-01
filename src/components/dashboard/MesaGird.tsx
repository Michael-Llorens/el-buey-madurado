'use client';

import MesaCard from './MesaCard';

interface MesaGridProps {
  mesas: any[];
  onEditar: (mesa: any) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'libre' | 'ocupada' | 'reservada') => void;
  eliminandoId: string | null;
}

export default function MesaGrid({
  mesas,
  onEditar,
  onEliminar,
  onCambiarEstado,
  eliminandoId,
}: MesaGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mesas.map(mesa => (
        <MesaCard
          key={mesa._id}
          mesa={mesa}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onCambiarEstado={onCambiarEstado}
          eliminandoId={eliminandoId}
        />
      ))}
    </div>
  );
}
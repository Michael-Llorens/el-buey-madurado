'use client';

import { CldImage } from 'next-cloudinary';

interface ConfirmModalProps {
  open: boolean;
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'danger' | 'warning' | 'info';
  onConfirmar: () => void;
  onCancelar: () => void;
}

const VARIANTE_STYLES = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-amber-600 hover:bg-amber-700',
  info: 'bg-blue-600 hover:bg-blue-700',
};

export default function ConfirmModal({
  open,
  titulo = 'Confirmar accion',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'danger',
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <CldImage
            src="Logo-Buey_t9mc4b"
            alt="El Buey Madurado"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Titulo */}
        <h3 className="text-lg font-bold text-white text-center">{titulo}</h3>

        {/* Mensaje */}
        <p className="text-gray-400 text-sm text-center leading-relaxed">{mensaje}</p>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-sm"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className={`flex-1 py-3 ${VARIANTE_STYLES[variante]} text-white rounded-lg font-semibold transition text-sm`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

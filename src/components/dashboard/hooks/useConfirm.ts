'use client';

import { useState, useCallback } from 'react';

interface ConfirmState {
  open: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  variante: 'danger' | 'warning' | 'info';
  resolver: ((value: boolean) => void) | null;
}

const INITIAL: ConfirmState = {
  open: false,
  titulo: '',
  mensaje: '',
  textoConfirmar: 'Confirmar',
  variante: 'danger',
  resolver: null,
};

/**
 * Hook que reemplaza window.confirm() por un modal personalizado.
 *
 * Uso:
 * ```tsx
 * const { confirmar, confirmProps } = useConfirm();
 *
 * const ok = await confirmar('¿Eliminar este pedido?');
 * if (!ok) return;
 *
 * // En el JSX:
 * <ConfirmModal {...confirmProps} />
 * ```
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>(INITIAL);

  const confirmar = useCallback(
    (
      mensaje: string,
      opciones?: { titulo?: string; textoConfirmar?: string; variante?: 'danger' | 'warning' | 'info' }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          mensaje,
          titulo: opciones?.titulo ?? 'Confirmar accion',
          textoConfirmar: opciones?.textoConfirmar ?? 'Confirmar',
          variante: opciones?.variante ?? 'danger',
          resolver: resolve,
        });
      });
    },
    []
  );

  const onConfirmar = useCallback(() => {
    state.resolver?.(true);
    setState(INITIAL);
  }, [state.resolver]);

  const onCancelar = useCallback(() => {
    state.resolver?.(false);
    setState(INITIAL);
  }, [state.resolver]);

  return {
    confirmar,
    confirmProps: {
      open: state.open,
      titulo: state.titulo,
      mensaje: state.mensaje,
      textoConfirmar: state.textoConfirmar,
      variante: state.variante,
      onConfirmar,
      onCancelar,
    },
  };
}

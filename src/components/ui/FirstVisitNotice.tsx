'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import Button from '@/components/ui/Button';

const NOTICE_STORAGE_KEY = 'elbueymadurado-first-visit-notice-apr-2026-v1';

export default function FirstVisitNotice() {
  const [isOpen, setIsOpen] = useState(false);

  const closeNotice = useEffectEvent(() => {
    try {
      window.localStorage.setItem(NOTICE_STORAGE_KEY, 'seen');
    } catch {
      // If storage is blocked, we still let the visitor close the notice.
    }

    setIsOpen(false);
  });

  useEffect(() => {
    try {
      const hasSeenNotice = window.localStorage.getItem(NOTICE_STORAGE_KEY);

      if (!hasSeenNotice) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNotice();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={() => closeNotice()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-visit-notice-title"
        className="fade-in relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-amber-500/30 bg-[#1a0d04]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

        <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-300">
              Aviso rápido
            </span>

            <h2
              id="first-visit-notice-title"
              className="max-w-md text-3xl font-black uppercase leading-tight text-white sm:text-4xl"
            >
              Abrimos solo a mediodía
            </h2>

            <p className="max-w-lg text-base leading-7 text-stone-200 sm:text-lg">
              Los días 6 y 13 de abril abriremos solo para comidas. Por la noche
              estaremos cerrados.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold text-amber-200">
            <span className="rounded-full border border-amber-500/25 bg-black/30 px-4 py-2">
              6 de abril
            </span>
            <span className="rounded-full border border-amber-500/25 bg-black/30 px-4 py-2">
              13 de abril
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="max-w-sm text-sm leading-6 text-stone-300">
              Gracias por tenerlo en cuenta si vienes a vernos esos días.
            </p>

            <Button
              type="button"
              variant="primary"
              className="shrink-0 px-6 py-2.5 text-sm uppercase tracking-wide"
              onClick={() => closeNotice()}
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

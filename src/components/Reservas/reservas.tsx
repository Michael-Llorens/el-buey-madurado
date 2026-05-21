'use client';

import Script from 'next/script';

export default function Reservas() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 md:max-w-4xl mx-auto py-8 sm:py-12">
      <h2 className="text-amber-500 text-2xl sm:text-3xl font-bold text-center mb-6">
        Reservar mesa
      </h2>
      {/* Carga el script de iFrameResizer (solo en esta página) */}
      <Script
        src="https://www.covermanager.com/js/iframeResizer/iframeResizer.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Llamamos a iFrameResize cuando el script ya está cargado
          // @ts-ignore
          if (typeof window !== 'undefined' && (window as any).iFrameResize) {
            // @ts-ignore
            (window as any).iFrameResize(
              {},
              '#restaurante-el-buey-madurado-xativa'
            );
          }
        }}
      />

        <div className="bg-amber-100 p-2 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-xl">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white">
          <iframe
            id="restaurante-el-buey-madurado-xativa"
            title="Reservas"
            src="https://www.covermanager.com/reservation/module_restaurant/restaurante-el-buey-madurado-xativa/spanish"
            allow="payment"
            frameBorder="0"
            width="100%"
            style={{ minHeight: '450px', height: '60vh', maxHeight: '700px' }}
          />
        </div>
      </div>

    </section>
  );
}

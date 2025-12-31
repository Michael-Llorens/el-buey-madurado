'use client';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 z-[9999] overflow-hidden">
      <style jsx global>{`
        /* Ocultar el botón de WhatsApp */
        body > a[href*="whatsapp"],
        body > div[class*="whatsapp"],
        .fixed[class*="whatsapp"],
        a[href*="wa.me"],
        a[href*="whatsapp.com"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
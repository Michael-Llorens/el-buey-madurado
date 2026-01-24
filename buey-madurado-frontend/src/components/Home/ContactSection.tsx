// components/Home/ContactSection.tsx
'use client';

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL = "https://wa.me/34670775786";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=2e0ce5bd22b7d86a&rlz=1C1UEAD_esES1083ES1083&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOZQSB00aZ9I88OJyJo2CaVn39NapAOp2oRtRFPSbooL-VkyvtQ4Aj3t2f9UyQEvOI7IyvclMC-FVOZ18KA_xjmI4EhBRdN1gAUgChJ6eZhUQ7Tu0EQ%3D%3D&q=Restaurante+el+buey+madurado+Rese%C3%B1as&sa=X&ved=2ahUKEwiB7ua3_v6RAxXuVKQEHU-dHooQ0bkNegQINRAE&biw=1536&bih=695&dpr=1.25&aic=0&zx=1767979934420&no_sw_cr=1";

const WRITE_REVIEW_URL =
  "https://www.google.com/search?sca_esv=2e0ce5bd22b7d86a&rlz=1C1UEAD_esES1083ES1083&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOZQSB00aZ9I88OJyJo2CaVn39NapAOp2oRtRFPSbooL-VkyvtQ4Aj3t2f9UyQEvOI7IyvclMC-FVOZ18KA_xjmI4EhBRdN1gAUgChJ6eZhUQ7Tu0EQ%3D%3D&q=Restaurante+el+buey+madurado+Rese%C3%B1as&sa=X&ved=2ahUKEwiB7ua3_v6RAxXuVKQEHU-dHooQ0bkNegQINRAE&biw=1536&bih=695&dpr=1.25&aic=0&zx=1767979934420&no_sw_cr=1";

const MAPS_DIRECTIONS_URL = "https://maps.app.goo.gl/PFgL2Ww84fGHULMp6";

const ContactSection = () => {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 pt-10 pb-20 fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-amber-600 text-4xl font-bold text-beige-100">
          Contacto y Localización
        </h2>
        <p className="text-gray-400">
          Reserva, dudas o cómo llegar — te lo ponemos fácil.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Información de contacto */}
        <div className="bg-[#0f0f0f] p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-amber-600">Hablemos</h3>
              <p className="text-sm text-gray-400 mt-1">
                Respuesta rápida por WhatsApp, teléfono o email.
              </p>
            </div>

            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-4 py-2 text-sm font-semibold text-amber-500 border border-amber-600 rounded-md hover:bg-amber-600 hover:text-black transition"
            >
              Cómo llegar →
            </a>
          </div>

          {/* Contenido */}
          <div className="flex-1 space-y-4 text-gray-300">
            {/* WhatsApp (primera opción) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contactar por WhatsApp"
              className="
                w-full
                flex items-center justify-between
                gap-3
                px-4 py-3
                rounded-xl
                bg-amber-500 text-[#1a1410]
                font-semibold
                shadow-lg
                hover:bg-amber-400
                transition
              "
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-9 w-9 grid place-items-center rounded-full bg-black/15"
                  aria-hidden="true"
                >
                  <FaWhatsapp className="text-xl" />
                </span>
                WhatsApp
              </span>

              <span className="text-sm opacity-80">Escríbenos →</span>
            </a>

            <p>
              <strong className="text-gray-200">Teléfono:</strong>{" "}
              <a
                href="tel:+34670777586"
                aria-label="Llamar al 670 77 75 86"
                className="text-amber-500 hover:underline"
              >
                +34 670 77 75 86
              </a>
            </p>

            <p>
              <strong className="text-gray-200">Email:</strong>{" "}
              <a
                href="mailto:elbueymadurado@gmail.com"
                className="text-amber-500 hover:underline"
              >
                elbueymaduradoxativa@gmail.com
              </a>
            </p>

            <p>
              <strong className="text-gray-200">Dirección:</strong>{" "}
              Calle Reina, 41. Xátiva, Valencia
            </p>

            {/* Bloque reseñas */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Opiniones</p>
                  <p className="text-white font-semibold">
                    Ver reseñas en Google
                  </p>
                </div>
                <div className="text-amber-500 text-lg" aria-hidden="true">
                  ★★★★★
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm font-semibold text-white border border-white/15 rounded-md hover:bg-white/5 transition"
                >
                  Ver reseñas →
                </a>

                <a
                  href={WRITE_REVIEW_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 text-[#1a1410] rounded-md hover:bg-amber-400 transition"
                >
                  Déjanos tu opinión
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-lg h-[220px] md:h-[280px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193.823107430763!2d-0.5263494328058195!3d38.988622750395706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61a3a2f5215229%3A0x7ecfefdab1c14599!2sRestaurante%20el%20buey%20madurado!5e0!3m2!1ses!2ses!4v1767974032149!5m2!1ses!2ses"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa El Buey Madurado"
          />

          {/* Overlay botones (pro) */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-semibold rounded-md bg-black/60 text-white border border-white/15 hover:bg-black/70 backdrop-blur transition"
            >
              Abrir Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

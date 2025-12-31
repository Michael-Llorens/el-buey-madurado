// components/Home/ContactSection.tsx
'use client';

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto px-6 py-20 fade-in"
    >
      <h2 className="text-amber-600 text-4xl font-bold text-beige-100 mb-8">
        Contacto y Localización
      </h2>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Información de contacto */}
        <div className="bg-[#0f0f0f] p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col">
          {/* Encabezado con título y botón alineados */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-amber-600">
              Hablemos
            </h3>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Av.+de+Selgas,+5,+46800+Xátiva,+Valencia"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 text-sm text-amber-500 border border-amber-600 rounded-md hover:bg-amber-600 hover:text-black transition"
            >
              Cómo llegar →
            </a>
          </div>

          {/* Contenido de contacto */}
          <div className="flex-1 space-y-4 text-gray-300">
            <p>
              <strong>Teléfono:</strong> +34 600 000 000
            </p>
            <p>
              <strong>Correo:</strong>{' '}
              <a
                href="mailto:elbueymadurado@gmail.com"
                className="text-amber-600 hover:underline"
              >
                elbueymadurado@gmail.com
              </a>
            </p>
            <p>
              <strong>Dirección:</strong> Av. de Selgas, 5, 46800 Xátiva,
              Valencia
            </p>

            <div className="mt-6 space-y-2">
              <p>
                <strong>Instagram:</strong>{' '}
                <a
                  href="https://instagram.com/restaurante_el_buey_madurado"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  @restaurante_el_buey_madurado
                </a>
              </p>

              <p>
                <strong>Facebook:</strong>{' '}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  facebook.com/elbueymadurado
                </a>
              </p>

              <p>
                <strong>Gmail:</strong>{' '}
                <a
                  href="mailto:elbueymadurado@gmail.com"
                  className="text-amber-600 hover:underline"
                >
                  elbueymadurado@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Mapa de Google */}
        <div className="rounded-xl overflow-hidden border text-amber-600 shadow-lg h-[400px] md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.136233277889!2d-0.524513524260092!3d38.99106167171492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61b0eaa6a4e7fb%3A0x62750eead409c4e0!2sAv.%20de%20Selgas%2C%205%2C%2046800%20Xátiva%2C%20Valencia!5e0!3m2!1ses!2ses!4v1730028289000!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa El Buey Madurado"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

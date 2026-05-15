import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs — El Buey Madurado',
  description: 'Documentación interactiva de la API REST del sistema de gestión de El Buey Madurado.',
};

/**
 * Página de documentación interactiva de la API.
 *
 * Sirve Swagger UI desde CDN para no añadir ~500 KB de dependencias al bundle.
 * El esquema OpenAPI 3.0 se carga desde /openapi.yaml (archivo estático en public/).
 *
 * Acceso: /api-docs (cualquier usuario, no requiere autenticación para ver el esquema).
 */
export default function ApiDocsPage() {
  return (
    <>
      {/* Estilos de Swagger UI desde CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css"
      />

      <main
        style={{
          minHeight: '100vh',
          background: '#fafafa',
        }}
      >
        {/* Cabecera personalizada */}
        <header
          style={{
            background: 'linear-gradient(135deg, #160a00 0%, #2a1100 100%)',
            color: '#fbbf24',
            padding: '24px 32px',
            borderBottom: '3px solid #d97706',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
            🥩 El Buey Madurado — API REST
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#fef3e2', opacity: 0.85 }}>
            Documentación interactiva del backend del sistema de gestión.
            Swagger UI sobre OpenAPI 3.0.
          </p>
        </header>

        {/* Contenedor donde se monta Swagger UI */}
        <div id="swagger-ui" style={{ padding: 0 }} />

        {/* Swagger UI bundle + inicialización */}
        <script
          src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function () {
                if (window.SwaggerUIBundle) {
                  window.SwaggerUIBundle({
                    url: '/openapi.yaml',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    docExpansion: 'list',
                    defaultModelsExpandDepth: 1,
                    tryItOutEnabled: true,
                    persistAuthorization: true,
                  });
                }
              });
            `,
          }}
        />
      </main>
    </>
  );
}

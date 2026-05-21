const CACHE_VERSION = 'elbuey-v2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/logo-fondo-blanco.ico',
  '/manifest.webmanifest',
];

// Rutas de datos cacheables (stale-while-revalidate)
const SWR_API_ROUTES = [
  '/api/productos',
  '/api/ingredientes',
  '/api/mesas',
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches + notify clients about update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DATA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => {
      // Notificar a todos los clientes de la nueva versión
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
        });
      });
    })
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // API calls con stale-while-revalidate para datos de la carta
  if (url.pathname.startsWith('/api/')) {
    const isSWRRoute = SWR_API_ROUTES.some((r) => url.pathname.startsWith(r));

    if (isSWRRoute) {
      // Stale-while-revalidate: devolver cache + actualizar en background
      event.respondWith(
        caches.open(DATA_CACHE).then((cache) =>
          cache.match(request).then((cached) => {
            const networkFetch = fetch(request).then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            }).catch(() => {
              // Sin conexión: devolver cache o error
              if (cached) return cached;
              return new Response(
                JSON.stringify({ success: false, error: 'Sin conexion' }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
              );
            });

            // Devolver cache si existe, sino esperar a la red
            return cached || networkFetch;
          })
        )
      );
      return;
    }

    // Otras APIs: network-only (mutations, pedidos en tiempo real)
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && (
          url.pathname.match(/\.(js|css|png|jpg|jpeg|ico|svg|woff2?)$/) ||
          url.pathname === '/manifest.webmanifest'
        )) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('/dashboard') || new Response(
          '<html><body style="background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif"><div style="text-align:center"><h1>Sin conexion</h1><p>Vuelve a intentarlo cuando tengas red</p></div></body></html>',
          { status: 503, headers: { 'Content-Type': 'text/html' } }
        );
      }
      return new Response('Sin conexion', { status: 503 });
    })
  );
});

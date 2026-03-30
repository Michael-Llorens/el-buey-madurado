# Arquitectura - El Buey Madurado

**Fecha de generacion:** 2026-03-30
**Tipo:** Monolito web full-stack
**Patron de arquitectura:** Next.js App Router (MVC implicito con Route Handlers)

---

## 1. Resumen Ejecutivo

Aplicacion monolitica Next.js 16 que combina frontend React 19 y backend API en un mismo despliegue. Utiliza el App Router con soporte para Server Components, middleware de autenticacion JWT en el edge y MongoDB como base de datos. La aplicacion sirve dos audiencias: clientes publicos (web + pedidos online) y personal del restaurante (dashboard de gestion).

---

## 2. Diagrama Arquitectonico

```
┌────────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                     │
│  React 19 + Tailwind + Framer Motion + SWR             │
│  CartContext (localStorage) | useAuth (JWT localStorage)│
└───────────────────────┬────────────────────────────────┘
                        │ HTTP/HTTPS
┌───────────────────────▼────────────────────────────────┐
│              NEXT.JS MIDDLEWARE (Edge Runtime)           │
│  JWT verification (jose) → protege /dashboard/*         │
└───────────────────────┬────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────┐
│              NEXT.JS APP ROUTER                         │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │ Paginas          │  │ API Route Handlers           │ │
│  │                  │  │                              │ │
│  │ (public)/        │  │ /api/auth/*      (4 rutas)  │ │
│  │   carta          │  │ /api/productos/* (5 metodos)│ │
│  │   contacto       │  │ /api/ingredientes/* (5)     │ │
│  │   pedir/*        │  │ /api/mesas/*     (5+seed)   │ │
│  │   reservas       │  │ /api/pedidos/*   (6+abrir)  │ │
│  │   sobre-nosotros │  │ /api/public/*    (3 rutas)  │ │
│  │                  │  │ /api/tickets-cocina/* (4)    │ │
│  │ (dashboard)/     │  │ /api/reportes    (1)        │ │
│  │   pedidos        │  │ /api/usuarios/*  (5)        │ │
│  │   mesas          │  │                              │ │
│  │   stock          │  │                              │ │
│  │   cocina         │  │                              │ │
│  │   reportes       │  │                              │ │
│  │   usuarios       │  │                              │ │
│  └──────────────────┘  └─────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          CAPA DE SERVICIOS                        │  │
│  │  pedidoService.ts                                 │  │
│  │  - normalizarPedido, ocuparMesa, liberarMesa      │  │
│  │  - abrirPedidoParaMesa, validarProductosYPrecios  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          UTILIDADES DE SEGURIDAD                  │  │
│  │  middlewareAuth.ts (protegerRuta, verificarRol)   │  │
│  │  sanitize.ts, validateId.ts, rateLimiter.ts       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          MODELOS MONGOOSE (6)                     │  │
│  │  Usuario, Producto, Pedido, Mesa,                 │  │
│  │  Ingrediente, TicketCocina                        │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬────────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────▼────────────────────────────────┐
│              MONGODB                                    │
│  Atlas (produccion) / Docker (desarrollo)               │
└────────────────────────────────────────────────────────┘
```

---

## 3. Grupos de Rutas (App Router)

### (public) - Paginas Publicas

| Ruta | Pagina | Descripcion |
|------|--------|-------------|
| `/` | `page.tsx` | Landing page del restaurante |
| `/carta` | `carta/page.tsx` | Carta digital interactiva |
| `/contacto` | `contacto/page.tsx` | Pagina de contacto |
| `/reservas` | `reservas/page.tsx` | Reservas (enlace TheFork) |
| `/sobre-nosotros` | `sobre-nosotros/page.tsx` | Historia, equipo, resenas |
| `/pedir` | `pedir/page.tsx` | Catalogo de pedidos online |
| `/pedir/carrito` | `pedir/carrito/page.tsx` | Vista del carrito de compra |
| `/pedir/checkout` | `pedir/checkout/page.tsx` | Formulario de checkout |
| `/pedir/confirmacion/[id]` | `pedir/confirmacion/[id]/page.tsx` | Confirmacion del pedido |
| `/pedir/seguimiento/[id]` | `pedir/seguimiento/[id]/page.tsx` | Seguimiento en tiempo real |

**Layout publico:** Navbar + Footer + CartProvider

### (dashboard) - Panel de Gestion (Protegido)

| Ruta | Pagina | Descripcion |
|------|--------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Home del dashboard |
| `/dashboard/pedidos` | `dashboard/pedidos/page.tsx` | Gestion de pedidos |
| `/dashboard/mesas` | `dashboard/mesas/page.tsx` | Gestion de mesas |
| `/dashboard/ingredientes` | `dashboard/ingredientes/layout.tsx` | Stock de ingredientes |
| `/dashboard/productos` | `dashboard/productos/layout.tsx` | Stock de productos |
| `/dashboard/tickets-cocina` | `dashboard/tickets-cocina/layout.tsx` | Panel de cocina |
| `/dashboard/usuarios` | `dashboard/usuarios/page.tsx` | Gestion de usuarios |

**Layout dashboard:** DashboardShell (sidebar + header)

### login - Inicio de Sesion

| Ruta | Pagina | Descripcion |
|------|--------|-------------|
| `/login` | `login/page.tsx` | Formulario de login |

---

## 4. Autenticacion y Autorizacion

### Flujo de Autenticacion
1. Usuario envia credenciales a `POST /api/auth/login`
2. Backend valida con bcryptjs (salt 12) y genera JWT (jsonwebtoken)
3. Token se almacena en cookie `auth_token` (httpOnly, secure, sameSite: lax, 7 dias)
4. Token tambien se devuelve en body para almacenar en localStorage
5. Frontend usa localStorage para inyectar `Authorization: Bearer` en peticiones SWR

### Middleware Edge (`src/middleware.ts`)
- Intercepta todas las rutas `/dashboard/*`
- Usa `jose` (compatible con Edge Runtime) para verificar JWT
- Si token invalido/expirado: borra cookie y redirige a `/login`

### Middleware de API (`src/lib/middlewareAuth.ts`)
- `protegerRuta(req)`: Verifica JWT desde cookie o header Authorization
- `verificarRol(payload, roles[])`: Comprueba que el usuario tiene el rol necesario

### Rate Limiting
- **Login:** 5 intentos/minuto por IP (`src/lib/utils/rateLimiter.ts`)
- **Registro:** 5 intentos/minuto por IP
- **Pedidos publicos:** 10 pedidos/15 min por IP (rate limiter inline en ruta)

### Roles y Permisos

| Accion | admin | camarero | cocinero |
|---|---|---|---|
| CRUD usuarios | Si | No | No |
| Crear/editar ingredientes | Si | No | Si |
| Eliminar ingredientes | Si | No | No |
| Crear/editar productos | Si | No | Si |
| Eliminar productos | Si | No | No |
| Crear/editar pedidos | Si | Si | No |
| Ver pedidos | Si | Si | Si |
| Crear tickets cocina | Si | Si | No |
| Ver/actualizar tickets | Si | No | Si |
| Reportes | Si | Si | Si |
| Mesas | Si | Si | Si |

---

## 5. Gestion de Estado (Frontend)

### SWR Hooks (Data Fetching con Auto-refresh)

| Hook | Endpoint | Intervalo | Descripcion |
|---|---|---|---|
| `useIngredientes()` | `/api/ingredientes` | 5s | Lista de ingredientes |
| `useProductos()` | `/api/productos` | 5s | Lista de productos |
| `useMesas()` | `/api/mesas` | 5s | Lista de mesas con pedido actual |
| `usePedidos()` | `/api/pedidos` | 5s | Lista de pedidos (paginada) |
| `useReportes()` | `/api/reportes` | 5s | Metricas agregadas |
| `useUsuarios()` | `/api/usuarios` | Sin refresh | Lista de usuarios |
| `usePublicProductos()` | `/api/public/productos` | 60s | Catalogo publico |

**Fetcher autenticado** (`authFetcher`): Inyecta token JWT desde localStorage automaticamente.

### Contextos React

- **CartContext** (`src/lib/context/CartContext.tsx`)
  - Estado del carrito de compras con persistencia en localStorage
  - Operaciones: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - Soporte para personalizaciones (extras, ingredientes removidos, precio extras)
  - Control de tipo de pedido: `recoger` | `domicilio`
  - Deduplicacion inteligente: agrupa items identicos (mismo producto + mismas personalizaciones)

- **useAuth** (`src/lib/hooks/useAuth.ts`)
  - Estado de autenticacion global: login, logout, usuario actual
  - Almacena token en localStorage y cookie

### Custom Hooks (Dashboard)

| Hook | Archivo | Descripcion |
|---|---|---|
| `usePedidoForm` | `hooks/usePedidoForm.ts` | Logica del formulario de pedidos (productos, totales, validacion) |
| `usePedidoPanel` | `hooks/usePedidoPanel.ts` | Logica del panel de pedidos (filtros por turno/tipo/estado) |
| `useProductoForm` | `hooks/useProductoForm.ts` | Logica del formulario de productos |
| `useConfirm` | `hooks/useConfirm.ts` | Modal de confirmacion reutilizable |

---

## 6. Capa de Servicios

### PedidoService (`src/lib/services/pedidoService.ts`)

Centraliza logica de negocio de pedidos:

| Funcion | Descripcion |
|---|---|
| `normalizarPedido(doc)` | Mapea campo BD `camarero` a `creadoPor` para el frontend |
| `ocuparMesa(mesaId, pedidoId)` | Marca mesa como ocupada con pedido actual |
| `liberarMesa(mesaId)` | Libera mesa (estado libre, pedidoActual null) |
| `abrirPedidoParaMesa(mesaId, userId)` | Abre o recupera pedido activo de una mesa |
| `validarProductosYObtenerPrecios(productos)` | Valida existencia/disponibilidad y calcula precios desde BD |

---

## 7. Utilidades y Seguridad

| Utilidad | Ubicacion | Funcion |
|----------|-----------|---------|
| `rateLimiter` | `src/lib/utils/rateLimiter.ts` | Limitacion de tasa por IP (en memoria) |
| `sanitize` | `src/lib/utils/sanitize.ts` | Sanitizacion de entrada de usuario |
| `validateId` | `src/lib/utils/validateId.ts` | Validacion de ObjectIds de MongoDB |
| `pagination` | `src/lib/utils/pagination.ts` | Paginacion de resultados (page, limit, sort) |
| `logger` | `src/lib/utils/logger.ts` | Logging estructurado |
| `alergenos` | `src/lib/constants/alergenos.ts` | 14 alergenos UE con labels, iconos y colores |

---

## 8. Integraciones Externas

| Servicio | Proposito | Configuracion |
|----------|-----------|---------------|
| MongoDB Atlas | Base de datos en produccion | `MONGODB_URI` |
| Cloudinary | Almacenamiento de imagenes de productos | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| WhatsApp API | Notificacion de pedidos listos (link directo) | Integrado en PedidoCard |
| Vercel | Hosting y despliegue automatico | Conectado a GitHub |
| Vercel Analytics | Metricas de rendimiento | `@vercel/analytics` |
| GitHub Actions | CI (typecheck + build) | `.github/workflows/ci.yml` |

---

## 9. Estrategia de Testing

| Tipo | Herramienta | Ubicacion | Cobertura |
|------|-------------|-----------|-----------|
| Unit tests | Vitest | `src/lib/**/__tests__/` | Servicios (pedidoService), utilidades (logger, pagination, rateLimiter, sanitize, validateId) |
| Hook tests | Vitest + Testing Library | `src/components/dashboard/hooks/__tests__/` | usePedidoForm, usePedidoPanel, useProductoForm |
| E2E tests | Playwright | `e2e/` | Autenticacion (auth.spec.ts) |

---

## 10. PWA

- **Service Worker:** `public/sw.js` (cache offline)
- **Web Manifest:** `public/manifest.webmanifest` (iconos 192px, 512px, maskable)
- **Favicon:** `public/logo-fondo-blanco.ico`
- **OfflineBanner:** Componente que detecta estado de conexion
- **FirstVisitNotice:** Aviso en primera visita

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

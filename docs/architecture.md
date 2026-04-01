# Arquitectura - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Resumen Ejecutivo

Aplicacion web full-stack para la gestion integral de un restaurante de carne madurada, incluyendo:
- **Sitio web publico:** Home, carta, reservas, "Sobre nosotros", contacto
- **Sistema de pedidos online:** Catalogo, carrito, checkout con Stripe, seguimiento
- **Dashboard de administracion:** Mesas, pedidos (Kanban), stock, cocina, reportes, usuarios

---

## Stack Tecnologico

| Categoria | Tecnologia | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | ^16.0.7 |
| **UI** | React | ^19.2.3 |
| **Lenguaje** | TypeScript (strict) | ^5.9.3 |
| **Estilos** | Tailwind CSS | ^3.4.18 |
| **Base de datos** | MongoDB | 7 |
| **ODM** | Mongoose | ^9.1.5 |
| **Data fetching** | SWR | ^2.4.1 |
| **Auth** | JWT (jose + jsonwebtoken) + bcryptjs | — |
| **Pagos** | Stripe (react-stripe-js + stripe) | ^9.0.1 / ^21.0.1 |
| **Animaciones** | Framer Motion + GSAP | ^12.23.25 / ^3.14.2 |
| **Imagenes** | Cloudinary (next-cloudinary) | ^6.17.5 |
| **Notificaciones** | Sonner | ^2.0.7 |
| **PDF** | jsPDF + html2canvas | — |
| **Analytics** | Vercel Analytics | ^1.6.1 |
| **Testing** | Vitest + Playwright | ^4.1.0 / ^1.58.2 |
| **Contenedor** | Docker (node:20-alpine) | — |

---

## Patron de Arquitectura

```
┌────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                          │
│                                                                │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  Route Groups    │    │   API Routes     │                   │
│  │                  │    │                  │                   │
│  │ (public)/        │    │ /api/auth/*      │                   │
│  │   carta          │    │ /api/ingredientes│                   │
│  │   pedir/*        │◄──►│ /api/mesas       │                   │
│  │   reservas       │    │ /api/pedidos     │                   │
│  │   sobre-nosotros │    │ /api/productos   │                   │
│  │                  │    │ /api/public/*    │                   │
│  │ (dashboard)/     │    │ /api/tickets-*   │                   │
│  │   mesas          │◄──►│ /api/usuarios    │                   │
│  │   pedidos        │    │ /api/reportes    │                   │
│  │   stock          │    └────────┬─────────┘                   │
│  │   cocina         │             │                             │
│  │   reportes       │             │ Mongoose                    │
│  │   usuarios       │             ▼                             │
│  └─────────────────┘    ┌──────────────────┐                   │
│                          │   MongoDB 7      │                   │
│                          │   6 colecciones  │                   │
│                          └──────────────────┘                   │
└────────────────────────────────────────────────────────────────┘
```

### Monolito Next.js con:
- **SSR + CSR hibrido:** Paginas publicas con SSR, dashboard full CSR
- **API Routes RESTful:** 43 endpoints en 9 grupos
- **SWR auto-refresh:** 5s en dashboard, 60s en publico
- **Edge Middleware:** Proteccion de rutas `/dashboard/*` con jose

---

## Autenticacion y Autorizacion

### Flujo de Auth

```
┌─────────┐    POST /api/auth/login    ┌────────────┐
│ Cliente  │ ──────────────────────────►│ API Login  │
│ (Login)  │◄────────────────────────── │            │
│          │   JWT en body + cookie     │ bcrypt +   │
└────┬─────┘   httpOnly (7d)            │ JWT sign   │
     │                                  └────────────┘
     │
     │  Peticiones autenticadas
     │  (header Bearer / cookie)
     │
     ▼
┌─────────────────────┐
│ Edge Middleware      │ → /dashboard/* → Verifica JWT (jose)
│ (src/middleware.ts)  │ → Redirige a /login si invalido
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ API Middleware       │ → protegerRuta() → extrae payload JWT
│ (middlewareAuth.ts)  │ → verificarRol() → compara contra roles permitidos
└─────────────────────┘
```

### Roles y Permisos

| Recurso | admin | camarero | cocinero | Publico |
|---|---|---|---|---|
| Usuarios (CRUD) | ✅ | ❌ | ❌ | ❌ |
| Registro usuarios | ✅ | ❌ | ❌ | ❌ |
| Mesas (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Pedidos (CRUD) | ✅ | ✅ | ✅ | ❌ |
| Productos (crear) | ✅ | ✅ | ✅ | ❌ |
| Productos (editar) | ✅ | ❌ | ✅ | ❌ |
| Productos (eliminar) | ✅ | ❌ | ❌ | ❌ |
| Ingredientes (crear/editar) | ✅ | ❌ | ✅ | ❌ |
| Ingredientes (eliminar) | ✅ | ❌ | ❌ | ❌ |
| Tickets cocina (ver) | ✅ | ❌ | ✅ | ❌ |
| Tickets cocina (crear) | ✅ | ✅ | ❌ | ❌ |
| Tickets cocina (editar) | ✅ | ❌ | ✅ | ❌ |
| Reportes | ✅ | ✅ | ✅ | ❌ |
| Pedidos online | ❌ | ❌ | ❌ | ✅ |
| Ver productos publicos | ❌ | ❌ | ❌ | ✅ |

---

## Data Fetching (SWR)

### Dashboard (autenticado)

```
useIngredientes()  ──► /api/ingredientes  ──► refresh 5s
useProductos()     ──► /api/productos     ──► refresh 5s
useMesas()         ──► /api/mesas         ──► refresh 5s
usePedidos()       ──► /api/pedidos       ──► refresh 5s (paginado)
useReportes()      ──► /api/reportes      ──► refresh 5s
useUsuarios()      ──► /api/usuarios      ──► sin refresh
```

Todos usan `authFetcher<T>` que inyecta token JWT de localStorage.

### Publico (sin auth)

```
usePublicProductos() ──► /api/public/productos ──► refresh 60s (cache s-maxage=60)
```

### CocinaPanel (caso especial)

Realiza 3 fetches paralelos directos (sin hooks SWR dedicados) con refresh 5s: pedidos, productos e ingredientes.

---

## Flujo de Pedidos Online (Stripe)

```
┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│ /pedir       │     │ /pedir/       │     │ /pedir/         │
│ (Catalogo)   │────►│ checkout      │────►│ confirmacion/id │
│              │     │               │     │                 │
│ CartContext   │     │ 1. Datos      │     │ Pedido creado   │
│ + Drawer     │     │ 2. Stripe Pay │     │ + tracking      │
└──────────────┘     └───────┬───────┘     └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │ POST /api/public│
                    │ /checkout       │
                    │ → PaymentIntent │
                    └────────┬────────┘
                             │ succeeded
                    ┌────────▼────────┐
                    │ POST /api/public│
                    │ /checkout/confirm│
                    │ → Crear pedido  │
                    └─────────────────┘
```

---

## Seguridad

| Capa | Implementacion |
|---|---|
| **Edge Middleware** | jose verifica JWT en cookie para `/dashboard/*` |
| **API Auth** | protegerRuta() + verificarRol() por endpoint |
| **Rate Limiting** | In-memory por IP (login 5/min, public 10/15min) |
| **Sanitizacion** | sanitizeBody() recursivo anti-XSS en POST/PUT |
| **Validacion ID** | validarObjectId() en rutas con `:id` |
| **Password** | bcrypt salt 12, campo `select: false` |
| **CORS** | Manejado por Next.js (mismo origen) |
| **Stripe** | PaymentIntent server-side, confirmacion verificada |

---

## Arquitectura de Componentes (Dashboard)

```
AdminPanel (page.tsx)
├── DashboardShell (sidebar + navegacion)
│   ├── StockPanel
│   │   ├── ProductoForm ← useProductoForm
│   │   ├── ProductCardGrid
│   │   ├── IngredienteForm
│   │   ├── IngredientCardGrid
│   │   └── ConfirmModal ← useConfirm
│   ├── MesasPanel
│   │   ├── MesaGrid → MesaCard[]
│   │   ├── MesaMapView
│   │   └── MesaForm
│   ├── PedidoPanel ← usePedidoPanel
│   │   ├── PedidoCard[] (Kanban columns)
│   │   ├── PedidoForm ← usePedidoForm
│   │   ├── CobrarModal
│   │   └── ConfirmModal
│   ├── CocinaPanel (Kanban: pendiente/preparando/listo)
│   ├── ReportesPanel (KPIs + graficos)
│   └── UsuariosPanel (CRUD tabla)
```

---

## Arquitectura de Componentes (Pedido Online)

```
PublicLayout (CartProvider)
├── /pedir → PedirPage
│   ├── ProductoCard[]
│   ├── PersonalizarModal
│   ├── CartDrawer
│   └── CartSummaryBar
├── /pedir/checkout → CheckoutPage
│   └── StripePaymentForm (Elements)
├── /pedir/confirmacion/[id] → ConfirmacionPage
└── /pedir/seguimiento/[id] → SeguimientoPage (SWR refresh)
```

---

## CI/CD

```yaml
# .github/workflows/ci.yml
Trigger: PR → main, push → develop
Pipeline: checkout → Node 20 → npm ci → typecheck → build
Environment: staging (secrets: MONGODB_URI, JWT_SECRET, CLOUDINARY)
```

---

## Contenedores

```yaml
# docker-compose.yml
services:
  app:       Next.js standalone (port 3000)
  mongo:     MongoDB 7 (port 27017)
  mongo-express: Admin UI (port 8081)
```

**Dockerfile:** Multi-stage build con node:20-alpine. Copia standalone output.

---

## Cambios desde ultimo escaneo (30/03 → 01/04)

| Area | Cambio |
|---|---|
| **Stripe** | Integracion completa: `@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe` server |
| **GSAP** | Nueva dependencia de animacion (`gsap ^3.14.2`) |
| **Checkout** | 2 nuevos endpoints: `POST /api/public/checkout`, `POST /api/public/checkout/confirm` |
| **StripePaymentForm** | Nuevo componente public con Stripe Elements |
| **Cobrar** | Endpoint `PUT /api/pedidos/[id]/cobrar` para cobro en dashboard |
| **Carrito** | Nueva pagina `/pedir/carrito` como redirect inteligente |
| **Total endpoints** | 41 → 43 (+2 de checkout Stripe) |

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

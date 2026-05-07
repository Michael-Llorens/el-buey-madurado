<div align="center">

# 🥩 El Buey Madurado

### Sistema integral de gestión para restaurante — *Carta digital, pedidos online, cocina en vivo y panel de administración*

[![Live Demo](https://img.shields.io/badge/Demo-Online-00c853?style=for-the-badge&logo=vercel&logoColor=white)](https://restaurante-el-buey-madurado.vercel.app)
[![CI](https://img.shields.io/github/actions/workflow/status/Michael-Llorens/el-buey-madurado/ci.yml?style=for-the-badge&label=CI&logo=github)](https://github.com/Michael-Llorens/el-buey-madurado/actions)
[![Last Commit](https://img.shields.io/github/last-commit/Michael-Llorens/el-buey-madurado?style=for-the-badge)](https://github.com/Michael-Llorens/el-buey-madurado/commits)
[![License](https://img.shields.io/badge/Licencia-Acad%C3%A9mica-blue?style=for-the-badge)](#-licencia)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)

**🌐 Live demo →** https://restaurante-el-buey-madurado.vercel.app

</div>

---

## 📋 Índice

1. [Visión general](#-visión-general)
2. [Funcionalidades](#-funcionalidades)
3. [Stack técnico](#️-stack-técnico)
4. [Arquitectura](#-arquitectura)
5. [Inicio rápido](#-inicio-rápido)
6. [Variables de entorno](#-variables-de-entorno)
7. [Scripts disponibles](#️-scripts-disponibles)
8. [Estructura del proyecto](#-estructura-del-proyecto)
9. [Sistema de roles y permisos](#-sistema-de-roles-y-permisos)
10. [API REST](#-api-rest)
11. [Tests](#-tests)
12. [CI/CD y despliegue](#-cicd-y-despliegue)
13. [Decisiones técnicas](#-decisiones-técnicas)
14. [Roadmap](#-roadmap)
15. [Licencia y autor](#-licencia)

---

## 🎯 Visión general

**El Buey Madurado** es una aplicación web full-stack para la gestión completa de un restaurante de carne madurada en Xátiva (Valencia). Combina una **web pública** (carta, reservas, pedidos online con pago Stripe, seguimiento en tiempo real) con un **dashboard interno** que cubre el día a día operativo: gestión de mesas, productos, ingredientes, cocina en vivo, cobros y reportes.

| | |
|---|---|
| **Autor** | Michael Llorens Barbera |
| **Curso** | Proyecto Integrado — 2º DAW |
| **Repositorio** | https://github.com/Michael-Llorens/el-buey-madurado |
| **Producción** | https://restaurante-el-buey-madurado.vercel.app |
| **Estado** | ✅ Funcional — TypeCheck 0 errores · ESLint 0 errores · 71/71 tests pasando |

---

## ✨ Funcionalidades

### 🌐 Web pública (cliente final)
- 🏠 **Landing animada** con secciones hero, galería, contacto y reseñas de Google (animadas con GSAP + ScrollTrigger)
- 📖 **Carta digital** con filtros por categoría e información de alérgenos (UE)
- 🛒 **Pedido online** con carrito persistente, modalidades **local / recoger / domicilio**
- 💳 **Pago con tarjeta** integrado vía **Stripe** (modo test)
- 🔍 **Seguimiento de pedido** con auto-refresh y barra de progreso animada
- 📅 **Reservas** y formulario de contacto
- 🏢 **Sección "Sobre nosotros"** con historia, valores, museo de la carne y reseñas

### 👥 Dashboard interno (staff)
- 🔐 **Autenticación con JWT** (cookies httpOnly + Bearer fallback) y rate limiting
- 📦 **CRUD de productos** con imágenes en Cloudinary, ingredientes vinculados y alérgenos
- 🥕 **CRUD de ingredientes** con control de stock y alérgenos UE
- 🪑 **Gestión de mesas** (estado, capacidad, comensales, asignación a pedidos)
- 📋 **Panel de pedidos** con filtros multi-selección, búsqueda libre, vista historial y stats por turno
- 👨‍🍳 **Vista de cocina en vivo** estilo *Kanban* (pendiente / preparando / listo) con sonido al recibir y al alertar pedidos urgentes (>20 min)
- 💵 **Cobro de pedidos** (efectivo / tarjeta / mixto) con cálculo de cambio
- 📊 **Reportes** con agregaciones de Mongo (ventas, productos top, evolución mensual)
- 🎟 **Tickets de cocina** independientes
- 🔒 **Sistema de roles** granular: `admin`, `camarero`, `cocinero`

---

## 🛠️ Stack técnico

### Frontend
- **Next.js 16** (App Router, React Server Components)
- **React 19** + **TypeScript 5.9**
- **Tailwind CSS 3.4** + **PostCSS**
- **GSAP 3.14** (+ ScrollTrigger, useGSAP) — animaciones
- **SWR 2.4** — fetching y revalidación
- **Sonner** — notificaciones toast
- **React Icons**

### Backend
- **Next.js Route Handlers** (API REST)
- **MongoDB 7** + **Mongoose 9**
- **jose** — JWT con Web Crypto (Edge-compatible, ESM)
- **bcryptjs** — hashing de contraseñas
- **Stripe 21** + **@stripe/react-stripe-js** — pagos
- **Cloudinary** — almacenamiento de imágenes

### Tests & Calidad
- **Vitest 4** + **@testing-library/react** — unit + hooks
- **Playwright** — end-to-end
- **ESLint 9** (flat config) + **typescript-eslint**
- **happy-dom** + **jsdom**

### DevOps
- **Docker** + **docker-compose** (con Mongo Express)
- **GitHub Actions** — CI (typecheck + build)
- **Vercel** — CD y hosting
- **MongoDB Atlas** — BD de producción

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENTE (Browser)                      │
│  Web pública  ─┬─  Dashboard interno  ─┬─  Móvil responsive │
└────────────────┼─────────────────────────┼──────────────────┘
                 │                         │
                 ▼                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 (App Router)                    │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  Server         │  │  Middleware  │  │  API Routes     │ │
│  │  Components     │  │  (jose JWT)  │  │  (REST)         │ │
│  └─────────────────┘  └──────────────┘  └─────────────────┘ │
└──────┬──────────────────────┬───────────────────┬───────────┘
       │                      │                   │
       ▼                      ▼                   ▼
┌─────────────┐      ┌─────────────────┐   ┌──────────────┐
│  MongoDB    │      │   Cloudinary    │   │   Stripe     │
│  (Atlas)    │      │   (Imágenes)    │   │   (Pagos)    │
└─────────────┘      └─────────────────┘   └──────────────┘
```

### Estrategia de entornos

| Entorno | Rama | Plataforma | Base de datos |
|---|---|---|---|
| **Desarrollo** | `develop` / `feat/*` | Docker local | MongoDB en contenedor |
| **Staging** | `develop` | Vercel Preview | MongoDB Atlas |
| **Producción** | `main` | Vercel | MongoDB Atlas |

### Flujo de despliegue

```
Local (Docker) → develop → Pull Request → main → Deploy automático (Vercel)
                              ▲
                              │
                       CI: typecheck + build
                       (bloquea merge si falla)
```

---

## 🚀 Inicio rápido

### Opción A — Docker (recomendado, todo incluido)

```bash
# 1. Clonar
git clone https://github.com/Michael-Llorens/el-buey-madurado.git
cd el-buey-madurado

# 2. Crear .env.docker (ver sección "Variables de entorno")
cp .env.example .env.docker
# Edita .env.docker con tus credenciales

# 3. Levantar todo el stack
docker-compose up -d --build
```

**Accesos:**
- 🌐 App → http://localhost:3000
- 🗄 Mongo Express → http://localhost:8081
- 🍃 MongoDB → `mongodb://localhost:27017`

```bash
# Parar contenedores
docker-compose down

# Resetear BD (⚠️ borra datos)
docker-compose down -v
```

### Opción B — Desarrollo local (sin Docker)

**Prerrequisitos:** Node.js ≥ 20, MongoDB local o Atlas.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env.local
cp .env.example .env.local
# Edita .env.local con tu MONGODB_URI, JWT_SECRET, etc.

# 3. Arrancar servidor de desarrollo (puerto 3333)
npm run dev
```

App en http://localhost:3333

---

## 🔐 Variables de entorno

Copia `.env.example` y completa cada valor:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secreto para firmar JWT (≥ 64 chars). Genera con `openssl rand -hex 32` | `f3a9b2c1...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary (lectura de imágenes vía `<CldImage>`) | `dzktzrrmp` |
| `STRIPE_SECRET_KEY` | Clave privada de Stripe — server-side. **Nunca exponer al cliente** | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe — usada en el cliente | `pk_test_...` |
| `NEXT_PUBLIC_API_URL` | URL base de la API | `http://localhost:3000/api` |
| `NEXT_PUBLIC_APP_NAME` | Nombre mostrado en metadatos | `El Buey Madurado` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |

**🔒 Almacenamiento seguro:**
- **Producción** → Vercel Environment Variables
- **CI** → GitHub Actions Secrets
- **Local** → `.env.local` o `.env.docker` (ambos en `.gitignore`)

> ⚠️ **Nunca** commitees `.env*` reales. Usa `openssl rand -hex 32` para generar `JWT_SECRET`.

---

## ⚙️ Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en puerto **3333** (sin Turbopack) |
| `npm run dev:turbo` | Igual con Turbopack (más rápido, experimental) |
| `npm run build` | Compila la app para producción |
| `npm start` | Sirve la build de producción |
| `npm run typecheck` | Valida tipos con `tsc --noEmit` |
| `npm run lint` | Ejecuta ESLint sobre todo el repo |
| `npm run lint:fix` | Aplica fixes automáticos de ESLint |
| `npm test` | Ejecuta toda la suite de tests (unit + hooks) |
| `npm run test:unit` | Solo unit tests |
| `npm run test:hooks` | Solo tests de hooks del dashboard |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:e2e` | Tests end-to-end con Playwright |
| `npm run test:e2e:ui` | Playwright en modo UI interactivo |
| `npm run db:backup` | Backup de Mongo (requiere `MONGODB_URI`) |

---

## 📁 Estructura del proyecto

```
el-buey-madurado/
├── .github/workflows/      # CI: typecheck + build
├── docs/                   # Documentación técnica adicional
├── e2e/                    # Tests Playwright
├── public/                 # Assets estáticos (imágenes, iconos)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (dashboard)/    # 🔒 Rutas internas (staff)
│   │   │   └── dashboard/  # productos, mesas, pedidos, ingredientes...
│   │   ├── (public)/       # 🌐 Rutas públicas
│   │   │   ├── carta/
│   │   │   ├── pedir/      # carrito, checkout, confirmación, seguimiento
│   │   │   ├── reservas/
│   │   │   ├── contacto/
│   │   │   └── sobre-nosotros/
│   │   ├── api/            # Route Handlers
│   │   │   ├── auth/       # login, logout, register, me
│   │   │   ├── productos/  # CRUD productos
│   │   │   ├── pedidos/    # CRUD + cobrar + abrir
│   │   │   ├── mesas/      # CRUD mesas + seed
│   │   │   ├── public/     # Endpoints públicos (carta, checkout, seguimiento)
│   │   │   └── ...
│   │   ├── login/          # Página de login
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/      # PedidoPanel, CocinaPanel, ReportesPanel...
│   │   ├── public/         # Componentes de la web pública
│   │   ├── Home/           # Secciones de la landing
│   │   ├── Navbar/  Footer/  Reservas/  SobreNosotros/
│   │   └── ui/             # Botones, modales, toasts, banners
│   ├── lib/
│   │   ├── auth.ts                # JWT (jose) — generar / verificar tokens
│   │   ├── middlewareAuth.ts      # protegerRuta + protegerRutaPorRol
│   │   ├── db.ts                  # Conexión Mongoose con cache
│   │   ├── apiClient.ts           # Wrapper fetch
│   │   ├── models/                # Schemas Mongoose (Usuario, Producto...)
│   │   ├── services/              # Lógica de negocio (pedidoService...)
│   │   ├── hooks/                 # SWR + auth hooks
│   │   ├── context/               # CartContext
│   │   ├── constants/             # alergenos, menu, etc.
│   │   ├── types/                 # Tipos TypeScript compartidos
│   │   └── utils/
│   │       ├── logger.ts          # Logger condicional (dev/prod)
│   │       ├── errors.ts          # getErrorMessage(unknown) helper
│   │       ├── rateLimiter.ts     # Rate limiting in-memory
│   │       ├── sanitize.ts        # Sanitización de inputs
│   │       ├── validateId.ts      # Validación de ObjectIds
│   │       └── pagination.ts
│   └── middleware.ts              # Edge middleware (protege /dashboard)
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs       # ESLint 9 flat config
├── next.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## 🔒 Sistema de roles y permisos

La aplicación define tres roles persistidos en el JWT y aplicados tanto en `middleware.ts` (Edge) como en cada Route Handler vía el helper `protegerRutaPorRol()`.

### Matriz de permisos

| Operación | Endpoint | `admin` | `camarero` | `cocinero` |
|---|---|:---:|:---:|:---:|
| Ver carta pública | `GET /api/public/productos` | ✅ | ✅ | ✅ |
| Crear pedido público (cliente) | `POST /api/public/checkout` | 🌐 | 🌐 | 🌐 |
| Listar pedidos | `GET /api/pedidos` | ✅ | ✅ | ✅ |
| Crear pedido en local | `POST /api/pedidos` | ✅ | ✅ | ❌ |
| Abrir pedido para mesa | `POST /api/pedidos/abrir` | ✅ | ✅ | ❌ |
| Cobrar pedido | `PUT /api/pedidos/[id]/cobrar` | ✅ | ✅ | ❌ |
| Cancelar pedido | `DELETE /api/pedidos/[id]` | ✅ | ❌ | ❌ |
| Cambiar estado pedido | `PUT /api/pedidos/[id]` | ✅ | ✅ | ✅ |
| Crear / borrar producto | `POST /api/productos` · `DELETE /api/productos/[id]` | ✅ | ❌ | ❌ |
| Editar producto | `PUT /api/productos/[id]` | ✅ | ❌ | ✅ |
| Crear / editar ingrediente | `POST /api/ingredientes` · `PUT /api/ingredientes/[id]` | ✅ | ❌ | ✅ |
| Eliminar ingrediente | `DELETE /api/ingredientes/[id]` | ✅ | ❌ | ❌ |
| Crear / configurar mesa | `POST /api/mesas` | ✅ | ❌ | ❌ |
| Modificar mesa | `PUT /api/mesas/[id]` | ✅ | ✅ | ❌ |
| Eliminar mesa | `DELETE /api/mesas/[id]` | ✅ | ❌ | ❌ |
| Reportes y métricas | `GET /api/reportes` | ✅ | ❌ | ❌ |
| Gestión de usuarios | `*/api/usuarios/*` | ✅ | ❌ | ❌ |
| Tickets de cocina (lectura) | `GET /api/tickets-cocina` | ✅ | ❌ | ✅ |
| Tickets de cocina (escritura) | `POST /api/tickets-cocina` | ✅ | ✅ | ❌ |

🌐 = público (sin autenticación) · ✅ = permitido · ❌ = denegado (HTTP 403)

### Implementación

```ts
// src/lib/middlewareAuth.ts
const auth = await protegerRutaPorRol(req, ['admin', 'camarero']);
if (!auth.valido) return auth.response!;
```

---

## 🌐 API REST

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Inicia sesión, devuelve JWT en cookie httpOnly + body |
| `POST` | `/api/auth/logout` | Borra la cookie de sesión |
| `POST` | `/api/auth/register` | Crea usuario (solo admin autenticado) |
| `GET` | `/api/auth/me` | Devuelve el usuario de la sesión actual |

### Recursos protegidos (dashboard)

| Recurso | Endpoints |
|---|---|
| **Productos** | `GET/POST /api/productos` · `GET/PUT/DELETE /api/productos/[id]` |
| **Ingredientes** | `GET/POST /api/ingredientes` · `GET/PUT/DELETE /api/ingredientes/[id]` |
| **Mesas** | `GET/POST /api/mesas` · `PUT/DELETE /api/mesas/[id]` · `POST /api/mesas/seed` |
| **Pedidos** | `GET/POST /api/pedidos` · `GET/PUT/DELETE /api/pedidos/[id]` · `POST /api/pedidos/abrir` · `PUT /api/pedidos/[id]/cobrar` |
| **Tickets cocina** | `GET/POST /api/tickets-cocina` · `GET/PUT/DELETE /api/tickets-cocina/[id]` |
| **Usuarios** | `GET/POST /api/usuarios` · `GET/PUT/DELETE /api/usuarios/[id]` |
| **Reportes** | `GET /api/reportes` |

### Endpoints públicos (cliente final)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/public/productos` | Carta pública (productos activos) |
| `POST` | `/api/public/checkout` | Crea PaymentIntent de Stripe |
| `POST` | `/api/public/checkout/confirm` | Confirma pago y crea pedido |
| `POST` | `/api/public/pedidos` | Crea pedido sin pago (recoger / domicilio efectivo) |
| `GET` | `/api/public/pedidos/[id]` | Datos del pedido para seguimiento |

### Formato de respuesta

```ts
// Éxito
{ success: true, data: <T>, message?: string }

// Error
{ success: false, error: string }
```

### Seguridad aplicada

- ✅ **Rate limiting** en login (5/min/IP) y checkout (10/15min/IP)
- ✅ **Sanitización** de bodies (`sanitizeBody()`)
- ✅ **Validación** de ObjectIds (`validarObjectId()`)
- ✅ **Cookies httpOnly + Secure + SameSite=Lax**
- ✅ **bcryptjs** para hashing de contraseñas (12 rounds)
- ✅ **JWT con jose** (HS256, expira en 7 días)
- ✅ **Verificación de rol** en cada endpoint sensible

---

## 🧪 Tests

| Tipo | Framework | Comando | Estado |
|---|---|---|---|
| **Unit** | Vitest 4 | `npm run test:unit` | ✅ |
| **Hooks** | Vitest + RTL | `npm run test:hooks` | ✅ |
| **E2E** | Playwright | `npm run test:e2e` | ✅ |

```bash
# Resultado actual (npm test)
✓ Unit:   7 files / 49 tests passing
✓ Hooks:  3 files / 22 tests passing
─────────────────────────────────────
✓ Total: 10 files / 71 tests passing
```

**Cobertura actual:**

| Categoría | Archivos cubiertos |
|---|---|
| **Servicios** | `pedidoService` (lógica de negocio) · `pedidoService.db` (integración Mongo) |
| **Utilidades** | `logger` · `pagination` · `rateLimiter` · `sanitize` · `validateId` |
| **Hooks dashboard** | `usePedidoPanel` (filtros, stats, edición) · `usePedidoForm` · `useProductoForm` |

---

## 🔄 CI/CD y despliegue

### Continuous Integration — GitHub Actions

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en:
- **Push** a `develop`
- **Pull Request** hacia `main`

Pasos:
1. Setup Node 20 + caché de dependencias
2. `npm ci`
3. `npm run typecheck`
4. `npm run build` (con todas las env vars necesarias)

🛑 **Si CI falla → el merge a `main` queda bloqueado** (rama protegida).

### Continuous Deployment — Vercel

| Trigger | Resultado |
|---|---|
| Push a `main` | Despliegue a producción (~60s) |
| Pull Request | Preview deployment con URL única |
| Cualquier commit | HTTPS + CDN global automático |

---

## 🧠 Decisiones técnicas

Las decisiones más relevantes que dan forma al proyecto:

### 1. **`jose` en vez de `jsonwebtoken`**
Edge Runtime de Next.js no soporta APIs de Node nativas. `jose` usa Web Crypto, funciona en middleware Edge **y** en Route Handlers, eliminando la necesidad de mantener dos librerías JWT.

### 2. **Cookies httpOnly + body para el JWT**
La cookie protege contra XSS (no accesible desde JS), y el body permite migrar a otros clientes (móvil, etc.) sin cambios en el backend. El middleware lee de cookie; los Route Handlers aceptan ambos.

### 3. **GSAP como única librería de animación**
Inicialmente convivían `framer-motion` + `gsap`. GSAP es framework-agnóstico, más rendido en animaciones complejas y soporta scroll-driven (ScrollTrigger). Migración completa → bundle más liviano.

### 4. **Logger centralizado (`src/lib/utils/logger.ts`)**
En vez de `console.log` repartidos, un wrapper que silencia `log/warn` en producción y siempre propaga `error`. Preparado para conectar Sentry/Logtail sin cambiar llamadas.

### 5. **Helper `getErrorMessage(unknown)`**
TypeScript estricto trata `catch` como `unknown`. El helper extrae mensaje de forma segura (Error, string, objeto con `.message`, fallback). Adiós a `catch (error: any)`.

### 6. **`protegerRutaPorRol()` combinado**
Validación de auth + rol en una sola llamada → menos boilerplate, menos bugs por olvidar la verificación de rol.

### 7. **Mongo Atlas + Mongoose con cache de conexión**
La conexión se cachea entre invocaciones serverless en Vercel para evitar agotar el pool. Ver [`src/lib/db.ts`](src/lib/db.ts).

### 8. **SWR para fetching en cliente**
Revalidación automática + actualizaciones optimistas + dedupe de requests. Esencial para el dashboard de cocina (refresca cada 5s) y panel de pedidos.

### 9. **Stripe en modo test, lazy import**
La SDK de Stripe se importa dinámicamente para no romper el build de CI cuando no hay credenciales. Pago real en sandbox, listo para flip a live keys.

### 10. **Roles en JWT + middleware Edge**
El payload del JWT lleva `rol`. El middleware Edge protege `/dashboard/*` con `jose`; cada Route Handler verifica rol específico para operaciones sensibles. Defensa en profundidad.

---

## 🚧 Roadmap

Mejoras planificadas (no bloqueantes):

- [ ] **Refactor de componentes grandes** — `PedidoPanel` (715 líneas), `ReportesPanel` (676), `CocinaPanel` (628) → trocear en sub-componentes
- [ ] **Tipado estricto** — eliminar `any` residuales en props (~170 warnings ESLint no-bloqueantes)
- [ ] **Webhook Stripe + idempotencyKey** para confirmar pagos asíncronamente y evitar pedidos duplicados
- [ ] **Refresh de cookie JWT** en cada request autenticado para no echar al usuario al expirar
- [ ] **Índices Mongo** en `Pedido.mesa` y `Pedido.productos.producto` para optimizar populates
- [ ] **Frontend con guard por rol** — ocultar botones/módulos según el rol del usuario logueado
- [ ] **Monitoring** (Sentry) y **Analytics** (ya integrado Vercel Analytics)
- [ ] **Dominio personalizado** y entorno de staging dedicado
- [ ] **Internacionalización** (i18n) con `next-intl`

---

## 🤝 Contribuciones

Aunque es un proyecto académico, las contribuciones son bienvenidas:

```bash
1. Fork del repositorio
2. git checkout -b feat/nombre-cambio
3. git commit -m "feat: descripción"
4. git push origin feat/nombre-cambio
5. Abrir Pull Request hacia develop
```

**Convenciones:**
- Commits siguen [Conventional Commits](https://www.conventionalcommits.org/)
- Antes de PR: `npm run typecheck && npm run lint && npm test`
- Código con tipado estricto (no `any`)

---

## 📜 Licencia

Proyecto educativo — uso académico.
Realizado como **Proyecto Integrado** del ciclo formativo **Desarrollo de Aplicaciones Web (DAW)**.

---

## 👨‍💻 Autor

<div align="center">

**Michael Llorens Barbera**
*Estudiante de 2º DAW*

[![GitHub](https://img.shields.io/badge/GitHub-Michael--Llorens-181717?style=flat-square&logo=github)](https://github.com/Michael-Llorens)

</div>

---

<div align="center">

⭐ **Si este proyecto te ha resultado útil, considera darle una estrella en GitHub**

</div>

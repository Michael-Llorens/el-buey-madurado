# El Buey Madurado - Resumen del Proyecto

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Descripcion

Aplicacion web full-stack para **El Buey Madurado**, un restaurante especializado en carne madurada. El sistema cubre tanto la presencia web publica como la gestion operativa interna del restaurante.

---

## Tipo de Proyecto

| Atributo | Valor |
|---|---|
| **Tipo de repositorio** | Monolito |
| **Tipo de proyecto** | Web Application (Next.js Full-Stack) |
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript (strict) |
| **Runtime** | Node.js 20 |

---

## Funcionalidades Principales

### 1. Sitio Web Publico
- **Home:** Hero con video, marquesina, galeria, contacto
- **Carta:** Menu interactivo con slides por categoria
- **Reservas:** Integracion con CoverManager (iframe)
- **Sobre Nosotros:** Historia, museo de carne, equipo, resenas Google
- **Contacto:** WhatsApp, telefono, email, Google Maps

### 2. Sistema de Pedidos Online
- **Catalogo:** Productos con alergenos, personalizacion, carrito persistente
- **Tipos de pedido:** Recoger y domicilio
- **Checkout:** Datos del cliente + pago con Stripe
- **Confirmacion y seguimiento:** Tracking en tiempo real del pedido

### 3. Dashboard de Administracion
- **Mesas:** Vista lista + mapa, semaforo de ocupacion, CRUD
- **Pedidos:** Panel Kanban con estados, filtros por turno, ticket PDF 80mm
- **Stock:** Productos + ingredientes con filtros, busqueda, CRUD
- **Cocina:** Vista Kanban por plato individual, alergenos destacados, sonido
- **Cobro:** Modal con efectivo/tarjeta/mixto, subcuentas, cambio
- **Reportes:** KPIs, top productos, ingresos diarios, exportacion PDF/Excel
- **Usuarios:** CRUD con roles (admin, camarero, cocinero)

---

## Stack Tecnologico

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js ^16.0.7 + React ^19.2.3 |
| Lenguaje | TypeScript ^5.9.3 (strict) |
| Estilos | Tailwind CSS ^3.4.18 |
| Base de datos | MongoDB 7 + Mongoose ^9.1.5 |
| Data fetching | SWR ^2.4.1 (refresh 5s dashboard, 60s publico) |
| Auth | JWT (jose + jsonwebtoken) + bcryptjs |
| Pagos | Stripe (react-stripe-js + stripe server) |
| Animaciones | Framer Motion ^12.23.25 + GSAP ^3.14.2 |
| Imagenes | Cloudinary (next-cloudinary ^6.17.5) |
| Notificaciones | Sonner ^2.0.7 |
| PDF | jsPDF + html2canvas |
| Analytics | Vercel Analytics ^1.6.1 |
| Testing | Vitest ^4.1.0 + Playwright ^1.58.2 |

---

## Metricas del Proyecto

| Metrica | Valor |
|---|---|
| Endpoints API | 43 (9 grupos) |
| Modelos de datos | 6 |
| Indices MongoDB | 12 |
| Componentes React | ~62 |
| Hooks | 14 |
| Paginas | 15 + 7 layouts |
| Total archivos fuente | ~120 |
| Datos semilla | 68 ingredientes + 64 productos + 15 mesas |

---

## Scripts Disponibles

| Script | Comando | Descripcion |
|---|---|---|
| `dev` | `cross-env TURBOPACK=0 next dev -p 3333` | Desarrollo en puerto 3333 |
| `build` | `next build` | Build de produccion |
| `start` | `next start` | Servidor de produccion |
| `lint` | `next lint` | Linter ESLint |
| `typecheck` | `tsc --noEmit` | Verificacion de tipos |
| `test` | `vitest run` | Tests unitarios |
| `test:unit` | `vitest run --exclude '*.test.tsx'` | Solo tests .ts |
| `test:hooks` | `vitest run hooks/__tests__/` | Tests de hooks |
| `test:watch` | `vitest` | Tests en modo watch |
| `test:e2e` | `playwright test` | Tests end-to-end |
| `test:e2e:ui` | `playwright test --ui` | E2E con UI |
| `db:backup` | `mongodump` | Backup de MongoDB |

---

## Variables de Entorno

| Variable | Proposito |
|---|---|
| `MONGODB_URI` | URI de conexion a MongoDB |
| `JWT_SECRET` | Secreto para firmar JWT |
| `NEXTAUTH_SECRET` | Secreto NextAuth (CI) |
| `NEXTAUTH_URL` | URL base de la app |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publica de Stripe |

---

## Estado Actual

- **Rama principal:** `main`
- **Rama de desarrollo activa:** `feat/project-overhaul-phases-1-7`
- **CI:** GitHub Actions (typecheck + build en PR a main)
- **Despliegue:** Docker (standalone) o Vercel
- **PWA:** Service Worker, manifest, OfflineBanner

---

## Documentacion Relacionada

| Documento | Descripcion |
|---|---|
| [Arquitectura](./architecture.md) | Diagramas, auth, roles, SWR, seguridad |
| [Contratos API](./api-contracts.md) | 43 endpoints documentados |
| [Modelos de Datos](./data-models.md) | 6 modelos Mongoose con ERD |
| [Inventario de Componentes](./component-inventory.md) | ~100 archivos inventariados |
| [Arbol de Codigo Fuente](./source-tree-analysis.md) | Estructura completa anotada |
| [Guia de Desarrollo](./development-guide.md) | Setup, convenciones, testing |
| [Guia de Despliegue](./deployment-guide.md) | Docker, Vercel, CI/CD |

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

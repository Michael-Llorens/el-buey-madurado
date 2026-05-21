<div align="center">

# 📖 DOCUMENTACIÓN TÉCNICA DEL PROYECTO

# 🥩 El Buey Madurado

**Sistema integral de gestión para restaurante**
*Web pública con pedidos online + Dashboard operativo interno*

---

| | |
|---|---|
| **Autor** | Michael Llorens Barbera |
| **Curso** | 2º DAW — Desarrollo de Aplicaciones Web |
| **Módulo** | Proyecto Integrado (PI) |
| **Año académico** | 2025 / 2026 |
| **Fecha de defensa** | Mayo 2026 |
| **Repositorio** | https://github.com/Michael-Llorens/el-buey-madurado |
| **Entorno productivo** | https://www.restauranteelbueymadurado.com |

</div>

---

## 📋 Índice

1. [Introducción y contexto](#1-introducción-y-contexto)
2. [Análisis de requisitos](#2-análisis-de-requisitos)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Modelo de datos](#5-modelo-de-datos)
6. [Funcionalidades del sistema](#6-funcionalidades-del-sistema)
7. [Sistema de autenticación y autorización](#7-sistema-de-autenticación-y-autorización)
8. [Sistema de pagos (Stripe)](#8-sistema-de-pagos-stripe)
9. [Frontend: arquitectura y componentes](#9-frontend-arquitectura-y-componentes)
10. [API REST](#10-api-rest)
11. [Seguridad](#11-seguridad)
12. [Tests y calidad de código](#12-tests-y-calidad-de-código)
13. [CI/CD y despliegue](#13-cicd-y-despliegue)
14. [Decisiones técnicas](#14-decisiones-técnicas)
15. [Estructura del proyecto](#15-estructura-del-proyecto)
16. [Estado actual y métricas](#16-estado-actual-y-métricas)
17. [Mejoras futuras](#17-mejoras-futuras)
18. [Conclusiones](#18-conclusiones)

---

# 1. Introducción y contexto

## 1.1. Descripción general

**El Buey Madurado** es una aplicación web full-stack desarrollada como Proyecto Integrado del ciclo formativo **Desarrollo de Aplicaciones Web (2º DAW)**. Está pensada para un restaurante real de carne madurada situado en **Xátiva (Valencia)** y resuelve dos problemas operativos simultáneos:

1. **Cara al cliente final:** una web moderna donde puede consultar la carta, reservar mesa, hacer pedidos online (con pago Stripe) para recoger o domicilio, y seguir el estado de su pedido en tiempo real.
2. **Cara al staff interno:** un dashboard que cubre el día a día del restaurante — toma de pedidos en mesa, gestión de cocina con cola en vivo (estilo Kanban), cobros con cálculo de cambio, y reportes con métricas de negocio.

El proyecto demuestra dominio sobre todo el stack moderno de desarrollo web: **Next.js 16 (App Router) + React 19 + TypeScript + MongoDB + Stripe + GSAP**, además de prácticas profesionales como **CI/CD automatizado, tests automatizados, control de versiones con ramas protegidas, contenerización con Docker, despliegue en cloud (Vercel + MongoDB Atlas), y autenticación segura con JWT**.

## 1.2. Motivación y objetivos

### Motivación
- Construir un caso real útil — no un *to-do list* genérico, sino un sistema que un restaurante podría usar mañana.
- Aplicar de forma integrada todos los módulos cursados durante el ciclo: Desarrollo Web en Entorno Cliente y Servidor, Diseño de Interfaces, Bases de Datos, Despliegue de Aplicaciones Web.
- Profundizar en tecnologías contemporáneas (React Server Components, Edge Middleware, JWT con `jose`, pagos integrados) más allá del temario obligatorio.

### Objetivos del proyecto

| # | Objetivo | Cumplimiento |
|---|---|---|
| O1 | Diseñar e implementar una arquitectura full-stack escalable | ✅ Completado |
| O2 | Permitir pedidos online con pago real integrado | ✅ Stripe en modo test |
| O3 | Soporte multi-rol (admin / camarero / cocinero) con permisos granulares | ✅ 3 roles + matriz |
| O4 | Vista en vivo para cocina con notificaciones | ✅ SWR auto-refresh + sonido |
| O5 | Despliegue automatizado y entornos separados | ✅ Vercel + GitHub Actions |
| O6 | Tests automatizados y código tipado estrictamente | ✅ 71 tests + TypeScript |
| O7 | Diseño responsive y animaciones profesionales | ✅ Tailwind + GSAP |

---

# 2. Análisis de requisitos

## 2.1. Actores del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                          ACTORES                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 Cliente  ──── consulta carta, pide online, sigue pedido │
│                                                              │
│  👨‍💼 Camarero ─── toma pedidos en mesa, cobra, cambia estado │
│                                                              │
│  👨‍🍳 Cocinero ─── ve cola de cocina, marca platos, ingredie. │
│                                                              │
│  👔 Admin ────── todo lo anterior + reportes + usuarios      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2.2. Requisitos funcionales

### RF-Cliente (web pública)
- **RF-C1:** Visualizar carta digital con filtros por categoría
- **RF-C2:** Ver alérgenos UE (14 regulados) por producto
- **RF-C3:** Añadir productos a un carrito persistente (localStorage)
- **RF-C4:** Personalizar productos (extras, ingredientes a remover, notas)
- **RF-C5:** Realizar pedido para **recoger en local** (efectivo o tarjeta)
- **RF-C6:** Realizar pedido para **entrega a domicilio** (con dirección)
- **RF-C7:** Pagar con tarjeta vía Stripe
- **RF-C8:** Recibir confirmación con número de pedido
- **RF-C9:** Seguir el estado del pedido en tiempo real con barra de progreso animada
- **RF-C10:** Reservar mesa (vía widget externo CoverManager embebido)
- **RF-C11:** Contactar mediante formulario o redes

### RF-Camarero (dashboard)
- **RF-A1:** Login seguro con persistencia de sesión
- **RF-A2:** Ver mapa visual del restaurante con estado de cada mesa
- **RF-A3:** Abrir un pedido nuevo asociado a una mesa
- **RF-A4:** Editar pedido existente (añadir / quitar productos)
- **RF-A5:** Cambiar estado del pedido (pendiente → preparando → listo → servido)
- **RF-A6:** Cobrar pedido (efectivo / tarjeta / mixto) con cálculo automático de cambio
- **RF-A7:** Filtrar y buscar pedidos por múltiples criterios
- **RF-A8:** Ver historial de pedidos por fecha
- **RF-A9:** Recibir notificación sonora al recibir un pedido nuevo

### RF-Cocinero (dashboard)
- **RF-K1:** Ver cola de cocina estilo Kanban (pendientes / preparando / listos)
- **RF-K2:** Ver tiempo transcurrido desde la creación con semáforo (verde / amarillo / rojo)
- **RF-K3:** Cambiar estado de cada plato individualmente
- **RF-K4:** Recibir alerta sonora doble si un pedido supera 20 min sin servir
- **RF-K5:** Filtrar pedidos por tipo (local / recoger / domicilio)
- **RF-K6:** Ver alérgenos por plato

### RF-Admin (dashboard)
- **RF-AD1:** CRUD completo de productos (con imagen, ingredientes vinculados, precios extra, alérgenos)
- **RF-AD2:** CRUD completo de ingredientes (con categoría, stock, alérgenos UE)
- **RF-AD3:** CRUD de mesas (capacidad, comensales, estado)
- **RF-AD4:** CRUD de usuarios (asignar roles)
- **RF-AD5:** Ver reportes con métricas: ventas, productos top, evolución mensual, recaudación por turno
- **RF-AD6:** Cancelar pedidos
- **RF-AD7:** Inicializar mesas (seed)

## 2.3. Requisitos no funcionales

| # | Requisito | Implementación |
|---|---|---|
| RNF1 | **Responsive** — debe funcionar en móvil, tablet y desktop | Tailwind CSS + diseño mobile-first |
| RNF2 | **Performance** — primera pintura < 2s | Next.js + Server Components + ISR + CDN Vercel |
| RNF3 | **Seguridad** — protección OWASP Top 10 | JWT httpOnly, bcrypt 12 rounds, sanitización, rate limiting, validación |
| RNF4 | **Disponibilidad** — > 99% uptime | Vercel (multi-región) + MongoDB Atlas (multi-AZ) |
| RNF5 | **Escalabilidad** — soportar picos de tráfico | Serverless (auto-scaling), conexión Mongo cacheada |
| RNF6 | **Mantenibilidad** — código tipado y testeado | TypeScript estricto, 71 tests automatizados, ESLint |
| RNF7 | **Usabilidad** — UI intuitiva con feedback inmediato | Sonner toasts, animaciones GSAP, skeletons |
| RNF8 | **Accesibilidad** — semántica HTML, contraste, aria-labels | ARIA en modales, contraste WCAG AA |
| RNF9 | **Trazabilidad** — logs y errores rastreables | Logger centralizado, helper `getErrorMessage` |
| RNF10 | **Reproducibilidad** — entorno idéntico para todos los devs | Docker + docker-compose con Mongo Express |

---

# 3. Stack tecnológico

## 3.1. Tabla resumen

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Framework** | Next.js | 16 | App Router, RSC, API Routes, Edge Middleware |
| **UI Library** | React | 19 | Componentes, hooks, Server Components |
| **Lenguaje** | TypeScript | 5.9 | Tipado estático estricto |
| **Estilos** | Tailwind CSS | 3.4 | Utility-first, responsive, customización |
| **Animaciones** | GSAP | 3.14 | Animaciones de alto rendimiento, scroll-driven |
| **Plugin GSAP** | @gsap/react | 2.1 | Hook `useGSAP` con cleanup automático |
| **Plugin GSAP** | ScrollTrigger | — | Animaciones disparadas por scroll |
| **Iconos** | react-icons | 5.5 | Librería unificada (Font Awesome, etc.) |
| **Toasts** | Sonner | 2.0 | Notificaciones modernas, accesibles |
| **Fetching cliente** | SWR | 2.4 | Stale-while-revalidate, dedupe, refresh automático |
| **Cross-env** | cross-env | 10.1 | Variables de entorno multiplataforma (Windows/Unix) |
| **Base de datos** | MongoDB | 7 | NoSQL document-oriented |
| **ORM/ODM** | Mongoose | 9.1 | Schemas, validación, populate, índices |
| **Auth (JWT)** | jose | 6.2 | JWT con Web Crypto, Edge-compatible |
| **Hashing** | bcryptjs | 3.0 | Hash de contraseñas, 12 rounds |
| **Pagos** | Stripe | 21.0 | PaymentIntents, server SDK |
| **Pagos cliente** | @stripe/react-stripe-js + @stripe/stripe-js | 6.1 / 9.0 | Elements UI |
| **Imágenes** | next-cloudinary | 6.17 | `<CldImage>` optimizado |
| **PDF** | jspdf | 4.2 | Generación de tickets PDF |
| **Captura DOM** | html2canvas | 1.4 | Render de comprobantes |
| **Tests unitarios** | Vitest | 4.1 | Runner moderno, ESM-first |
| **Tests React** | @testing-library/react | 16.3 | Testing de componentes |
| **DOM emulado** | happy-dom + jsdom | 20 / 29 | Entornos JS para tests |
| **Tests E2E** | Playwright | 1.58 | Automatización de browser real |
| **Linter** | ESLint | 9.39 | Flat config v9 + plugins Next y TS |
| **Análisis Vercel** | @vercel/analytics | 1.6 | Métricas de uso reales |
| **Contenedores** | Docker + docker-compose | — | Reproducibilidad de entorno |
| **CI** | GitHub Actions | — | Typecheck + build automático |
| **CD/Hosting** | Vercel | — | Deploy automático, CDN, HTTPS |
| **DB Cloud** | MongoDB Atlas | — | Cluster gestionado, backups |
| **CDN imágenes** | Cloudinary | — | Storage + transformaciones |

## 3.2. Justificación de las elecciones

### Next.js 16 + React 19
**Por qué:** Combina Server Components (mejor performance + SEO), Route Handlers (API integrada sin proyecto separado), Edge Middleware (auth ultra-rápida), y App Router (rutas anidadas con grupos). Vercel ofrece hosting nativo gratuito.

**Alternativas descartadas:**
- *React puro + Express* → necesita dos proyectos, dos despliegues, dos configs de auth.
- *Remix* → menor ecosistema y comunidad.
- *Vue/Nuxt* → la asignatura usa React, mantengo coherencia.

### TypeScript estricto
**Por qué:** Atrapa errores en tiempo de compilación, autocompletado superior, documentación viva en los tipos. En un proyecto con 10+ modelos y 25+ endpoints, los tipos previenen bugs reales (ej: pasar `string` cuando se espera `ObjectId`).

### MongoDB + Mongoose
**Por qué:** Modelo documental encaja con la naturaleza del dominio (un pedido contiene productos con personalizaciones, alérgenos…). Mongoose añade validación, hooks (`pre('save')` para hashear passwords) y populate (joins virtuales).

**Alternativas descartadas:**
- *PostgreSQL + Prisma* → relaciones más rígidas, peor para subdocumentos profundos.
- *Firebase* → vendor lock-in.

### `jose` para JWT
**Por qué:** Edge Runtime de Next.js (donde vive el middleware) **no soporta** `jsonwebtoken` (usa APIs de Node nativas). `jose` usa Web Crypto, funciona en middleware Edge **y** en Route Handlers. Resultado: una sola librería para todo.

### Stripe (modo test)
**Por qué:** Estándar de la industria, excelente DX (Test Cards, Webhooks UI), SDK oficial en JS/TS, integración con React via `@stripe/react-stripe-js`, cumple PCI-DSS automáticamente.

### GSAP en lugar de Framer Motion
**Por qué (cambio durante el desarrollo):** Inicialmente convivían las dos. Decidí consolidar en GSAP porque:
- **Framework-agnóstico** (funciona en vanilla JS, Vue, Svelte)
- **Más rendido** en animaciones complejas (timelines, scroll-driven)
- **ScrollTrigger** es el estándar de oro para scroll animations
- Reducción de bundle al eliminar una de las dos.

### Tailwind CSS
**Por qué:** Utility-first elimina el problema del nombrado de clases CSS, mantenibilidad superior (los estilos viven con el componente), y purge automático elimina CSS no usado en producción.

### SWR
**Por qué:** Para el dashboard de cocina necesitaba **revalidación cada 5 segundos** sin escribir lógica de polling manual. SWR ofrece eso + dedupe de requests + cache compartida + revalidación on-focus.

### Vitest en lugar de Jest
**Por qué:** Configuración instantánea (sin Babel), ESM nativo, compatible con Vite (más rápido). Testing Library es el mismo, así que la API de tests es idéntica a Jest.

### Docker
**Por qué:** Reproducibilidad. `docker-compose up` levanta toda la app + MongoDB + Mongo Express en un comando, sin instalar Mongo localmente.

---

# 4. Arquitectura del sistema

## 4.1. Diagrama general

```
┌──────────────────────────────────────────────────────────────────┐
│                       USUARIO (Browser)                           │
│   Web pública  │  Dashboard interno  │  Móvil responsive          │
└────────┬───────────────────┬───────────────────┬─────────────────┘
         │ HTTPS             │ HTTPS             │ HTTPS
         ▼                   ▼                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                      VERCEL (Edge Network)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  NEXT.JS 16 (App Router)                    │  │
│  │                                                              │  │
│  │   ┌──────────────┐    ┌──────────────┐   ┌──────────────┐  │  │
│  │   │   Server     │    │   Edge       │   │  Route       │  │  │
│  │   │ Components   │◄──►│ Middleware   │   │  Handlers    │  │  │
│  │   │   (RSC)      │    │  (jose JWT)  │   │  (REST API)  │  │  │
│  │   └──────────────┘    └──────────────┘   └──────┬───────┘  │  │
│  └────────────────────────────────────────────────┼──────────┘  │
└─────────────────────────────────────────────────────┼─────────────┘
                                                     │
        ┌────────────────────┬───────────────────────┼──────────────┐
        ▼                    ▼                       ▼              ▼
┌──────────────┐   ┌─────────────────┐   ┌────────────────┐   ┌──────────┐
│  MongoDB     │   │   Cloudinary    │   │    Stripe      │   │  Vercel  │
│  Atlas       │   │   (imágenes)    │   │  (pagos test)  │   │ Analytics│
│  (cluster)   │   │                 │   │                │   │          │
└──────────────┘   └─────────────────┘   └────────────────┘   └──────────┘
```

## 4.2. Flujos principales

### 4.2.1. Flujo de pedido público con pago Stripe

```
Cliente añade producto al carrito
        │
        ▼
Carrito (CartContext) → localStorage
        │
        ▼
/pedir/checkout → POST /api/public/checkout
        │
        ▼
Server: validar productos → calcular precios desde BD (no del cliente)
        │
        ▼
Stripe.paymentIntents.create({ amount, metadata: { pedidoData } })
        │
        ▼
Cliente recibe clientSecret → Elements de Stripe → 3DS / SCA
        │
        ▼
Pago confirmado en cliente → POST /api/public/checkout/confirm
        │
        ▼
Server: stripe.paymentIntents.retrieve(id) → status === 'succeeded'
        │
        ▼
Verificar idempotencia (¿ya existe pedido con este paymentId?)
        │
        ▼
Crear Pedido en MongoDB con estado='pendiente', metodoPago='tarjeta'
        │
        ▼
Redirección a /pedir/confirmacion/[id] → seguimiento en tiempo real
```

### 4.2.2. Flujo de auth en dashboard

```
Usuario → /login → POST /api/auth/login
        │
        ▼
Server: rate limit (5/min/IP) → buscar usuario → bcrypt.compare()
        │
        ▼
generarToken(usuario) [jose: SignJWT con HS256, 7 días]
        │
        ▼
Set-Cookie: auth_token (httpOnly + secure + sameSite=lax) + body con token
        │
        ▼
Cliente accede a /dashboard
        │
        ▼
Edge Middleware (src/middleware.ts):
  - jwtVerify(token) con jose
  - Si inválido → redirect /login + clear cookie
  - Si válido → NextResponse.next()
        │
        ▼
Route Handler (ej: /api/productos):
  - protegerRutaPorRol(req, ['admin']) → valida token + rol
  - Si rol incorrecto → 403
```

### 4.2.3. Flujo de cocina en vivo

```
Camarero crea pedido → POST /api/pedidos → Mongo (estado: pendiente)
        │
        ▼
Cocinero ve dashboard /dashboard?modulo=cocina
        │
        ▼
SWR fetch /api/pedidos?estado=pendiente,preparando,listo
  → refresca cada 5 segundos automáticamente
        │
        ▼
Pedido nuevo aparece → useEffect detecta cambio → playBeepNuevo() + toast
        │
        ▼
Cocinero hace click en "Empezar a preparar"
  → PUT /api/pedidos/[id] { estado: 'preparando' }
        │
        ▼
Mongo actualiza → SWR mutate() → UI actualiza
        │
        ▼
Si pasa >20 min sin servir → useEffect detecta → playBeepUrgente() (doble beep)
```

## 4.3. Estrategia de entornos

| Entorno | Rama Git | Plataforma | Base de datos | URL |
|---|---|---|---|---|
| **Local Dev** | `feat/*` | Docker | MongoDB en contenedor | `localhost:3000` |
| **Local Dev (sin Docker)** | `feat/*` | Node directo | Mongo Atlas (dev) | `localhost:3333` |
| **Staging** | `develop` | Vercel Preview | MongoDB Atlas | `*.vercel.app` (dinámica) |
| **Producción** | `main` | Vercel | MongoDB Atlas | `www.restauranteelbueymadurado.com` |

---

# 5. Modelo de datos

## 5.1. Visión general

```
┌─────────────────┐
│    Usuario      │
│ ─────────────── │
│  email (uniq)   │
│  password (hash)│
│  rol            │ ──────────────┐
│  activo         │               │
└─────────────────┘               │
                                  │ creado_por
                                  ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      Mesa       │◄─────►│     Pedido      │◄─────►│    Producto     │
│ ─────────────── │       │ ─────────────── │       │ ─────────────── │
│  nombre (uniq)  │       │  tipo           │       │  nombre         │
│  capacidad      │       │  productos[]    │       │  precio         │
│  comensales     │       │  estado         │       │  categoria      │
│  estado         │       │  total          │       │  ingredientes[] │
│  pedidoActual   │       │  metodoPago     │       │  alergenos      │
│  activa         │       │  cliente        │       │  disponible     │
└─────────────────┘       │  direccionEntr. │       └────────┬────────┘
                          └────────┬────────┘                │
                                   │                          │
                                   ▼                          ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │  TicketCocina   │       │   Ingrediente   │
                          │ ─────────────── │       │ ─────────────── │
                          │  pedido (ref)   │       │  nombre         │
                          │  items[]        │       │  categoria      │
                          │  prioridad      │       │  precioBase     │
                          │  estado         │       │  precioExtra    │
                          │  horaInicio/Fin │       │  inventario     │
                          └─────────────────┘       │  alergenos[]    │
                                                    └─────────────────┘
```

## 5.2. Esquemas detallados

### 5.2.1. Usuario (`src/lib/models/Usuario.ts`)

```typescript
interface IUsuario {
  email: string              // único, lowercase, validado por regex
  password: string           // hash bcrypt 12 rounds, select: false
  rol: 'admin' | 'camarero' | 'cocinero'  // default: camarero
  activo: boolean            // default: true (soft delete)
  ultimoLogin?: Date
  createdAt: Date            // timestamps automáticos
  updatedAt: Date

  // Métodos
  comparePassword(p: string): Promise<boolean>
}
```

**Particularidades:**
- Hook `pre('save')` hashea automáticamente la password si ha sido modificada.
- Campo `password` con `select: false` para que NO se devuelva por defecto en queries.
- Validación de email con regex en el schema.

### 5.2.2. Pedido (`src/lib/models/Pedido.ts`) — el más complejo

```typescript
interface IPedido {
  tipo: 'local' | 'recoger' | 'domicilio'

  // Solo para local
  mesa?: ObjectId            // ref Mesa, requerido si tipo='local'

  // Solo para domicilio
  direccionEntrega?: {
    calle, numero, piso?, ciudad, codigoPostal, telefono, notas?
  }

  productos: [{
    producto: ObjectId       // ref Producto
    cantidad: number         // min: 1
    precioUnitario: number   // snapshot del precio al momento del pedido
    subtotal: number
    notas?: string           // max 200 chars
    personalizaciones?: {
      ingredientesExtra?: string[]
      ingredientesRemovidos?: string[]
    }
    estadoProducto?: 'pendiente' | 'preparando' | 'listo'
  }]

  subtotal: number
  impuestos: number          // 21% IVA España
  descuento: number
  gastoEnvio: number         // 3.50€ para domicilio
  total: number

  estado: 'pendiente' | 'preparando' | 'listo' | 'en_camino'
        | 'servido' | 'entregado' | 'pagado' | 'cancelado'

  camarero?: ObjectId        // ref Usuario, alias 'creadoPor'
  repartidor?: ObjectId      // ref Usuario, para domicilio
  cliente?: string           // max 100 chars
  telefono?: string          // max 20 chars
  metodoPago?: 'efectivo' | 'tarjeta' | 'mixto'
  notas?: string             // max 500 chars

  createdAt, updatedAt

  // Métodos
  calcularTotales(): IPedido
}
```

**Particularidades:**
- **Validación condicional:** `mesa` es `required` solo si `tipo === 'local'`. `direccionEntrega` solo si `tipo === 'domicilio'`. Esto se hace con función en el `required`.
- **Snapshot de precios:** `precioUnitario` se guarda en el momento del pedido para que cambios futuros del precio del producto no afecten pedidos pasados (auditoría).
- **Personalizaciones:** subdocumento que registra los extras añadidos y los ingredientes quitados (ej: hamburguesa sin cebolla, con bacon extra).
- **Estado del producto:** dentro del array, cada producto tiene su propio estado para que cocina marque cada plato individualmente.
- **4 índices** para queries frecuentes: `(tipo, estado)`, `(mesa, estado)`, `(estado, createdAt)`, `(camarero, createdAt)`.
- Cálculo de IVA al 21% español en `calcularTotales()`.

### 5.2.3. Producto (`src/lib/models/Producto.ts`)

```typescript
interface IProducto {
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen?: string                        // URL de Cloudinary

  ingredientes: [{
    ingrediente: ObjectId                // ref Ingrediente
    cantidad: number
    unidad: string                       // default 'gramos'
  }]

  ingredientesExtra?: [{                 // extras de pago disponibles
    nombre: string                       // max 50 chars
    precio: number                       // €
  }]

  permitirPersonalizacion: boolean       // default: true
  permitirExtras: boolean                // default: true
  permitirRemover: boolean               // default: true

  disponible: boolean                    // visible en carta
  activo: boolean                        // soft delete
}
```

**Particularidades:**
- **Sistema de extras con precio:** un producto puede definir extras (ej: "Doble queso +2€") que se ofrecen al cliente en la web.
- **Flags de personalización** controlan qué se permite editar al cliente por producto.
- **Índice de texto** `(nombre, descripcion)` para búsqueda full-text.
- Los alérgenos NO están en el producto — se calculan a partir de los `ingredientes` populados.

### 5.2.4. Ingrediente (`src/lib/models/Ingrediente.ts`)

```typescript
interface IIngrediente {
  nombre: string
  categoria: string
  precioBase: number                    // coste base
  precioExtra: number                   // coste como extra
  inventario: {
    cantidad: number
    unidad: string                      // default 'kg'
  }
  alergenos: AlergenoUE[]               // ⚠️ validado contra los 14 UE
  disponible: boolean
  activo: boolean
}
```

**Particularidades:**
- **Alérgenos validados** contra la constante `ALERGENOS_UE` (14 alérgenos del Reglamento UE 1169/2011): gluten, crustáceos, huevos, pescado, cacahuetes, soja, lácteos, frutos secos, apio, mostaza, sésamo, sulfitos, altramuces, moluscos. Si se intenta guardar un alérgeno que no está en la lista, falla la validación.

### 5.2.5. Mesa (`src/lib/models/Mesa.ts`)

```typescript
interface IMesa {
  nombre: string                        // único (ej: "Mesa 1")
  capacidad: number                     // 1-20
  comensalesActuales: number            // validado: ≤ capacidad
  estado: 'libre' | 'ocupada' | 'reservada'
  pedidoActual?: ObjectId               // ref Pedido (el activo)
  activa: boolean
}
```

**Particularidades:**
- Validador custom para `comensalesActuales` que funciona tanto en `save()` (document validator) como en `findByIdAndUpdate()` (update validator).

### 5.2.6. TicketCocina (`src/lib/models/TicketCocina.ts`)

```typescript
interface ITicketCocina {
  pedido: ObjectId                      // ref Pedido
  items: [{
    producto: ObjectId
    cantidad: number
    notas: string
  }]
  prioridad: 'baja' | 'media' | 'alta'
  estado: 'pendiente' | 'en-preparacion' | 'completado'
  completado: boolean
  horaInicio?: Date
  horaFin?: Date
}
```

**Uso:** modelo independiente para gestionar la cola de cocina con tiempos de inicio y fin (métricas de velocidad de servicio).

---

# 6. Funcionalidades del sistema

## 6.1. Web pública

### Páginas

| Ruta | Descripción |
|---|---|
| `/` | Landing animada con hero, galería, contacto, reseñas |
| `/carta` | Carta digital con filtros por categoría y alérgenos |
| `/sobre-nosotros` | Historia, valores, museo de la carne, reseñas Google |
| `/reservas` | Widget externo embebido de **CoverManager** (iframe + `iframeResizer.min.js` cargado vía `next/script`) |
| `/contacto` | Datos de contacto y formulario |
| `/pedir` | Inicio del flujo de pedido online |
| `/pedir/carrito` | Carrito (productos + tipo recoger/domicilio) |
| `/pedir/checkout` | Datos del cliente + Stripe Elements |
| `/pedir/confirmacion/[id]` | Confirmación con número de pedido |
| `/pedir/seguimiento/[id]` | Tracking en vivo del estado del pedido |

### Estrategia de datos para la carta pública

> **Decisión técnica importante:** la página de pedidos `/pedir/page.tsx` carga los productos desde un **JSON estático local** (`public/data/productos.json`), no desde la API ni desde `usePublicProductos`. Esto se hizo así para:
> - Evitar dependencia de la BD en una página crítica para conversión.
> - Carga instantánea sin spinners ni revalidación.
> - Permite que la carta pública funcione incluso si la API tiene problemas.
>
> Como contrapartida: cambios en productos vía dashboard requieren actualizar el JSON manualmente o hacer redeploy.
>
> El endpoint `/api/public/productos` existe y funciona, pero queda como recurso disponible para futuras integraciones (apps móviles, widgets de terceros).

### Carrito persistente (`CartContext`)

```typescript
// src/lib/context/CartContext.tsx
- Persiste en localStorage (clave: 'buey_cart')
- Hidratación segura (evita mismatch SSR/client)
- Detecta items idénticos con personalizaciones para no duplicar
- Calcula total automáticamente
- Almacena el tipo de pedido elegido (recoger / domicilio)
```

### Animaciones GSAP en landing

- **Hero:** entrada con `gsap.from()` controlada por `useGSAP`
- **Galería:** `ScrollTrigger` con `pin` para efecto de stack
- **Reseñas:** carrusel auto-rotativo cada 5s con animación de slide
- **Sección "Sobre nosotros":** múltiples sub-componentes con animaciones encadenadas en scroll

## 6.2. Dashboard interno

### Patrón arquitectónico

A diferencia de la web pública (que usa páginas Next.js separadas), **el dashboard usa un patrón modular** con una única ruta (`/dashboard`) que renderiza diferentes paneles según un **query parameter** `?modulo=X`:

```typescript
// src/app/(dashboard)/dashboard/page.tsx
type ModuloActivo = 'home' | 'stock' | 'mesas' | 'pedidos' | 'cocina' | 'reportes' | 'usuarios';

// La URL determina qué panel se renderiza:
//   /dashboard?modulo=cocina  → CocinaPanel
//   /dashboard?modulo=pedidos → PedidosPanel
//   /dashboard?modulo=stock   → StockPanel
//   ...
```

**Ventaja:** transición instantánea entre módulos sin recarga de página, estado del Shell preservado, una sola sesión SWR compartida.

> Nota: existen `layout.tsx` placeholder en `dashboard/{ingredientes,productos,tickets-cocina}/` con texto "Página en construcción". No son módulos en uso — todos los módulos activos viven dentro de `dashboard/page.tsx` con el patrón `?modulo=`.

### Layout (`DashboardShell.tsx`)

- Sidebar lateral fija con navegación entre módulos
- Selector de módulo (vía query param, no rutas)
- Avatar con menú: cambiar contraseña, cerrar sesión
- Banner `OfflineBanner` si está offline
- Detecta el rol del usuario para mostrar/ocultar entradas del menú

### Módulo de pedidos (`PedidoPanel.tsx`)

**Vista normal:** solo pedidos del **turno actual**:
- Comida: 12:00 - 17:00
- Cena: 19:00 - 01:00
- Fuera de turno: desde 00:00 del día actual

**Funcionalidad:**
- Filtros multi-selección por estado (pendiente, preparando, listo…)
- Filtros multi-selección por tipo (local, recoger, domicilio)
- Filtro de tiempo (30min, 1h, 3h, hoy, todos)
- Búsqueda libre (mesa, cliente, teléfono, camarero, producto, dirección)
- Ordenación: recientes / urgencia (prioridad estado + tipo + fecha)
- Vista historial con datepicker
- Stats en vivo del turno (total, pendientes, preparando, listos, servidos, pagados, recaudación)
- **Notificación sonora** al recibir pedido nuevo
- **Notificación sonora especial (doble tono)** cuando un pedido pasa a "listo"

### Módulo de cocina (`CocinaPanel.tsx`)

**Vista Kanban con 3 columnas:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PENDIENTE   │  │ PREPARANDO  │  │   LISTO     │
│  (amarillo) │  │   (azul)    │  │   (verde)   │
├─────────────┤  ├─────────────┤  ├─────────────┤
│ Card pedido │  │ Card pedido │  │ Card pedido │
│  - Mesa     │  │  - Mesa     │  │  - Mesa     │
│  - TimeBadge│  │  - TimeBadge│  │  - TimeBadge│
│  - Productos│  │  - Productos│  │  - Productos│
│  - Alergenos│  │  - Alergenos│  │  - Alergenos│
│  - Botón →  │  │  - Botón →  │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

- **TimeBadge** auto-refresca cada 30s con semáforo:
  - Verde: < 10 min
  - Amarillo: 10-19 min
  - Rojo: ≥ 20 min
- Refresh automático cada 5s vía SWR
- Filtro por tipo de pedido
- Botones de transición de estado por columna
- Sonido beep al recibir nuevo pedido
- Sonido alerta (triple beep grave) si supera 20 min

### Módulo de cobro (`CobrarModal.tsx`)

- 3 métodos: efectivo / tarjeta / mixto
- Si efectivo: input de "importe recibido" → calcula cambio automático
- Si mixto: split entre efectivo y tarjeta
- Al confirmar: marca pedido como `pagado` y libera la mesa

### Módulo de stock (`StockPanel.tsx`)

Panel unificado para CRUD de **productos e ingredientes** con sistema de tabs:
- **Tab Productos** y **Tab Ingredientes** intercambiables
- **Filtros** por categoría, búsqueda libre y disponibilidad (todos / sí / no)
- **Categorías dinámicas** calculadas a partir de los datos reales
- **Modo formulario inline:** add-product, add-ingredient, edit-product, edit-ingredient
- **Eliminación con confirmación** vía hook `useConfirm` (modal genérico)
- Carga datos de SWR (`useProductos`, `useIngredientes`) con revalidación automática

### Módulo de reportes (`ReportesPanel.tsx`)

Métricas calculadas con agregaciones de Mongo:
- **Resumen general:** total pedidos, ingresos brutos, descuentos, impuestos
- **Hoy vs ayer:** comparativa de ingresos del día
- **Productos top:** ranking de los 10 más vendidos en 30 días
- **Evolución mensual:** serie temporal de últimos 30 días
- **Pedidos por hora:** detección de horas pico
- **Ticket medio:** precio promedio por pedido
- **Distribución por método de pago**
- **Distribución por tipo (local / recoger / domicilio)**

---

# 7. Sistema de autenticación y autorización

## 7.1. Login

```typescript
// POST /api/auth/login
1. Rate limit: 5 intentos/minuto/IP (in-memory)
2. Validación: email + password no vacíos
3. Buscar Usuario.findOne({ email }).select('+password')
4. usuario.comparePassword(password) [bcrypt.compare]
5. Verificar que usuario.activo === true
6. generarToken(usuario) [jose: SignJWT HS256, exp 7d]
7. Set-Cookie: auth_token (httpOnly, secure, sameSite=lax, 7d)
8. Body de respuesta también lleva el token (compatibilidad)
9. Actualizar usuario.ultimoLogin
```

## 7.2. Generación y verificación de tokens

```typescript
// src/lib/auth.ts
generarToken(usuario): Promise<string>
  → SignJWT({ userId, email, rol })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

verificarToken(token): Promise<TokenPayload | null>
  → jwtVerify(token, secret)
  → return payload | null si falla
```

## 7.3. Middleware Edge

```typescript
// src/middleware.ts
// Se ejecuta en el Edge Runtime de Vercel (rapidísimo, global)
matcher: ['/dashboard/:path*']

flujo:
1. Leer cookie 'auth_token'
2. Si no existe → redirect /login
3. jwtVerify(token) [jose]
4. Si inválido/expirado → clear cookie + redirect /login
5. Si válido → next()
```

## 7.4. Protección de rutas API

```typescript
// src/lib/middlewareAuth.ts

// Solo verificar sesión:
const auth = await protegerRuta(req);
if (!auth.valido) return auth.response!;

// Verificar sesión + rol:
const auth = await protegerRutaPorRol(req, ['admin', 'camarero']);
if (!auth.valido) return auth.response!;
// → 401 si no hay sesión
// → 403 si rol no permitido
```

## 7.5. Matriz de permisos

| Operación | admin | camarero | cocinero |
|---|:-:|:-:|:-:|
| Login / consultar sesión | ✅ | ✅ | ✅ |
| Listar pedidos | ✅ | ✅ | ✅ |
| Crear pedido en mesa | ✅ | ✅ | ❌ |
| Cobrar pedido | ✅ | ✅ | ❌ |
| Cambiar estado pedido (cocina) | ✅ | ✅ | ✅ |
| Cancelar pedido | ✅ | ❌ | ❌ |
| Crear / borrar producto | ✅ | ❌ | ❌ |
| Editar producto | ✅ | ❌ | ✅ |
| CRUD ingredientes (sin DELETE) | ✅ | ❌ | ✅ |
| Eliminar ingrediente | ✅ | ❌ | ❌ |
| Gestión de mesas | ✅ | parcial | ❌ |
| Reportes | ✅ | ❌ | ❌ |
| Gestión de usuarios | ✅ | ❌ | ❌ |
| Tickets de cocina (lectura) | ✅ | ❌ | ✅ |
| Tickets de cocina (creación) | ✅ | ✅ | ❌ |

## 7.6. Defensa en profundidad

```
┌─────────────────────────────────────┐
│  Capa 1: Middleware Edge             │  → bloquea /dashboard sin token
├─────────────────────────────────────┤
│  Capa 2: protegerRuta() en Handler   │  → 401 si token inválido
├─────────────────────────────────────┤
│  Capa 3: protegerRutaPorRol()        │  → 403 si rol incorrecto
├─────────────────────────────────────┤
│  Capa 4: Validación de input         │  → sanitizeBody, validateId
├─────────────────────────────────────┤
│  Capa 5: Rate limiting               │  → 5/min login, 10/15min checkout
└─────────────────────────────────────┘
```

---

# 8. Sistema de pagos (Stripe)

## 8.1. Por qué Stripe

- **Estándar de la industria** — usado por Lyft, Shopify, Amazon.
- **Cumple PCI-DSS automáticamente** — los datos de tarjeta nunca tocan nuestro servidor (van directos al iframe de Stripe).
- **Excelente DX** — tarjetas de prueba, dashboard claro, SDK oficial en JS/TS.
- **Soporte 3DS / SCA** automático para cumplir PSD2.

## 8.2. Flujo completo (PaymentIntents API)

```
   ┌──────────────┐                  ┌──────────────┐                ┌─────────────┐
   │   CLIENTE    │                  │  NUESTRO API │                │   STRIPE    │
   └──────┬───────┘                  └──────┬───────┘                └──────┬──────┘
          │                                 │                               │
          │  1. POST /api/public/checkout   │                               │
          │  { tipo, productos, cliente }   │                               │
          ├────────────────────────────────►│                               │
          │                                 │  2. Validar productos         │
          │                                 │     Calcular precio EN BD     │
          │                                 │     (no se fía del cliente)   │
          │                                 │                               │
          │                                 │  3. paymentIntents.create()   │
          │                                 │     metadata: { pedidoData }  │
          │                                 ├──────────────────────────────►│
          │                                 │                               │
          │                                 │       { clientSecret }        │
          │                                 │◄──────────────────────────────┤
          │  { clientSecret }               │                               │
          │◄────────────────────────────────┤                               │
          │                                 │                               │
          │  4. Stripe Elements (iframe)    │                               │
          │     usuario introduce tarjeta   │                               │
          │  ────────────────────────────────────────────────────────────►  │
          │                                 │                               │
          │            5. 3DS / SCA challenge si es necesario               │
          │  ◄──────────────────────────────────────────────────────────►  │
          │                                 │                               │
          │  6. POST /api/public/checkout/  │                               │
          │     confirm { paymentIntentId } │                               │
          ├────────────────────────────────►│                               │
          │                                 │  7. paymentIntents.retrieve() │
          │                                 ├──────────────────────────────►│
          │                                 │                               │
          │                                 │  status === 'succeeded' ?     │
          │                                 │◄──────────────────────────────┤
          │                                 │                               │
          │                                 │  8. ¿Existe pedido con este   │
          │                                 │     paymentId? (idempotencia) │
          │                                 │                               │
          │                                 │  9. Pedido.create({ ... })    │
          │                                 │     en MongoDB                │
          │                                 │                               │
          │  { _id, estado, total, tipo }   │                               │
          │◄────────────────────────────────┤                               │
          │                                 │                               │
          │  10. Redirect a confirmación    │                               │
          │      /pedir/confirmacion/[id]   │                               │
          │                                 │                               │
```

## 8.3. Detalles de implementación

### Lazy loading del SDK
```typescript
// src/app/api/public/checkout/route.ts
async function getStripe() {
  const Stripe = (await import('stripe')).default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada');
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' as const });
}
```
**Por qué dinámico:** evita romper el build de CI cuando no hay credenciales en el entorno (ej: tests E2E sin secrets).

### Cálculo de precios server-side
**Crítico:** los precios se calculan en el servidor leyendo de la BD, **nunca** se confía en lo que viene del cliente:
```typescript
const productosConPrecios = await validarProductosYObtenerPrecios(body.productos);
```
Esto evita que un usuario malicioso modifique el JSON del cliente y pague 0.01€ por un chuletón.

### Idempotencia
Antes de crear el pedido en `confirm`, verificamos si ya existe uno con ese `paymentIntentId` en las notas. Si el cliente reclica el botón de confirmar, no se crean pedidos duplicados.

### Metadata para reconstruir el pedido
Stripe permite adjuntar `metadata` al PaymentIntent. Aprovecho esto para guardar el JSON del pedido. Cuando el pago se confirma, recupero esos metadatos y creo el pedido. Ventaja: si el cliente cierra el navegador entre el pago y la confirmación, podemos recuperar el pedido manualmente desde el dashboard de Stripe.

---

# 9. Frontend: arquitectura y componentes

## 9.1. Estructura de componentes

```
src/components/
├── ProtectedRoute.tsx         # Wrapper de auth para componentes (legacy/UX)
│
├── Navbar/                    # Navegación principal
│   ├── Navbar.tsx
│   ├── NavLink.tsx
│   └── Logo.tsx
│
├── Footer/                    # Pie con enlaces, horarios, redes
│   ├── Footer.tsx
│   ├── FooterBottom.tsx
│   ├── FooterHorario.tsx
│   ├── FooterLegal.tsx
│   ├── FooterSocial.tsx
│   └── SocialButton.tsx       # ⚠️ Existe duplicado SocialButtom.tsx (typo, deuda técnica)
│
├── Home/                      # Secciones de la landing
│   ├── HeroSectionHome.tsx    # Hero con video/imagen + CTA
│   ├── GallerySection.tsx     # Galería con ScrollTrigger
│   ├── ContactSection.tsx     # Bloque de contacto en home
│   └── Marquee.tsx            # Banda horizontal animada
│
├── SobreNosotros/             # Sección "Sobre nosotros"
│   ├── HeroSectionSobreNosotros.tsx
│   ├── HistoriaYValores.tsx
│   ├── MuseoCarne.tsx
│   ├── GoogleReviews.tsx
│   ├── Esquipo.tsx            # ⭐ ACTIVO (importado en /sobre-nosotros) — typo en el nombre
│   └── Equipo.tsx             # ⚠️ HUÉRFANO (no se importa, deuda técnica)
│
├── Reservas/
│   └── reservas.tsx           # Embed del widget externo de CoverManager (iframe + iframeResizer)
│
├── public/                    # Componentes del flujo de pedido público
│   ├── ProductoCard.tsx       # Tarjeta producto en carta
│   ├── PersonalizarModal.tsx  # Modal extras / quitar ingredientes / notas
│   ├── CartDrawer.tsx         # Panel lateral del carrito
│   ├── CartSummaryBar.tsx     # Barra inferior con resumen (móvil)
│   └── StripePaymentForm.tsx  # Wrapper Stripe Elements
│
├── ui/                        # Primitivos reutilizables
│   ├── Button.tsx
│   ├── FirstVisitNotice.tsx   # Modal de aviso de primera visita
│   ├── OfflineBanner.tsx      # Banner persistente si no hay red
│   ├── ReservasButton.tsx
│   └── WhatsAppButton.tsx     # FAB flotante de WhatsApp
│
└── dashboard/                 # Componentes del dashboard interno
    ├── DashboardShell.tsx     # Layout con sidebar (rol-aware)
    ├── PedidoPanel.tsx        # Panel principal de pedidos (715 líneas)
    ├── PedidoCard.tsx
    ├── PedidoForm.tsx
    ├── CocinaPanel.tsx        # Vista Kanban cocina (628 líneas)
    ├── CobrarModal.tsx        # Modal de cobro con cálculo de cambio
    ├── ReportesPanel.tsx      # Reportes y métricas (676 líneas)
    ├── StockPanel.tsx         # Panel de gestión de stock
    ├── ProductoForm.tsx
    ├── ProductoList.tsx
    ├── ProductCardGrid.tsx
    ├── IngredienteForm.tsx
    ├── IngredienteList.tsx
    ├── IngredientCardGrid.tsx
    ├── MesaCard.tsx
    ├── MesaForm.tsx
    ├── MesaGrid.tsx
    ├── MesaMapView.tsx        # Vista mapa visual de mesas
    ├── PersonalizarProductoModal.tsx  # Versión interna del modal de personalización
    ├── ConfirmModal.tsx       # Modal genérico de confirmación
    ├── ButtonGrid.tsx
    └── hooks/
        ├── usePedidoPanel.ts  # Lógica del panel de pedidos
        ├── usePedidoForm.ts
        ├── useProductoForm.ts
        ├── useConfirm.ts      # Modal de confirmación reutilizable (returns Promise)
        └── __tests__/
```

## 9.2. Patrones de diseño aplicados

### Custom hooks
Toda la lógica compleja se extrae a hooks reutilizables (`usePedidoPanel`, `useConfirm`, `useAuth`...). Los componentes solo gestionan presentación.

### Composition over inheritance
Modal `ConfirmModal` parametrizado, reutilizado en cancelar pedido, eliminar producto, eliminar mesa, etc.

### Container / Presentational
- Containers: `PedidoPanel.tsx` orquesta data + estado.
- Presentational: `PedidoCard.tsx`, `MesaCard.tsx` reciben props y solo renderizan.

### Provider pattern
- `CartContext` envuelve la app pública para compartir el carrito.
- Toaster de Sonner como provider en el layout.

## 9.3. Hooks SWR personalizados (`src/lib/hooks/swr/`)

Wrappers tipados sobre SWR para cada recurso de la API. Centralizan la URL, el tipo de respuesta y el revalidado:

| Hook | Endpoint | Uso |
|---|---|---|
| `usePedidos()` | `/api/pedidos` | Panel de pedidos + cocina (refresh 5s) |
| `useMesas()` | `/api/mesas` | Vista mapa mesas |
| `useProductos()` | `/api/productos` | CRUD productos en StockPanel |
| `useIngredientes()` | `/api/ingredientes` | CRUD ingredientes en StockPanel |
| `useUsuarios()` | `/api/usuarios` | Gestión usuarios (admin) |
| `useReportes()` | `/api/reportes` | Métricas y gráficas |
| `authFetcher` | — | Adjunta el JWT al header (de cookie o localStorage) |

> Nota: existe también `usePublicProductos.ts` pero **no está re-exportado** en `index.ts`, no se usa actualmente. La carta pública usa otra estrategia (ver siguiente sección).

Patrón común:
```typescript
export function usePedidos() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/pedidos',
    authFetcher,
    { refreshInterval: 5000 }
  );
  return { pedidos: data ?? [], error, isLoading, mutate };
}
```

## 9.4. Componentes públicos del flujo de pedido (`src/components/public/`)

| Componente | Función |
|---|---|
| `ProductoCard.tsx` | Tarjeta de producto en la carta + botón "Añadir al carrito" |
| `PersonalizarModal.tsx` | Modal para añadir extras / quitar ingredientes / notas antes de añadir al carrito |
| `CartDrawer.tsx` | Panel lateral deslizable con el carrito completo |
| `CartSummaryBar.tsx` | Barra inferior fija con resumen del carrito (móvil) |
| `StripePaymentForm.tsx` | Wrapper del `<Elements>` de Stripe con validación y manejo de errores |

## 9.5. Componente legacy `ProtectedRoute`

```typescript
// src/components/ProtectedRoute.tsx
<ProtectedRoute requiredRol={['admin']}>
  <PaginaSensible />
</ProtectedRoute>
```

Wrapper de cliente que verifica autenticación y rol antes de renderizar children. **Funcionalmente redundante** desde que se añadió el middleware Edge (`src/middleware.ts`) que protege `/dashboard/*` antes de llegar al componente. Permanece como capa adicional para componentes específicos o redirecciones con UX personalizado (mensaje + delay antes de redirect).

## 9.6. Animaciones GSAP

Toda la web pública usa GSAP. Patrón consistente:

```typescript
const ref = useRef<HTMLDivElement>(null);

useGSAP(() => {
  gsap.from(ref.current, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: ref.current,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}, { scope: sectionRef });

return <div ref={ref}>...</div>;
```

**Beneficios de `useGSAP`:**
- Cleanup automático al desmontar (no hay que `kill()` manualmente)
- Scope opcional limita los selectores al árbol del componente
- Re-ejecuta si las `dependencies` cambian (ideal para carruseles)

## 9.7. Responsive design

- **Mobile-first:** los breakpoints van de pequeño a grande.
- Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- Grids fluidos: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Sidebar del dashboard se convierte en menú hamburguesa en móvil.
- Tipografía responsive: `text-3xl md:text-4xl lg:text-5xl`.

## 9.8. Accesibilidad

- Modales con `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- Botones con `aria-label` cuando solo tienen icono.
- Foco gestionado al abrir modales (escape para cerrar).
- Contraste WCAG AA verificado (texto sobre fondo oscuro).
- Imágenes con `alt` descriptivo.

---

# 10. API REST

## 10.1. Convenciones

- Todas las respuestas siguen el formato:
  ```json
  // Éxito
  { "success": true, "data": <T>, "message": "opcional" }
  // Error
  { "success": false, "error": "mensaje" }
  ```
- Códigos HTTP:
  - `200` OK general
  - `201` recurso creado
  - `400` validación falla
  - `401` sin autenticar
  - `403` rol insuficiente
  - `404` recurso no encontrado
  - `429` rate limit excedido
  - `500` error interno

## 10.2. Catálogo completo

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | 🌐 | Login + cookie httpOnly |
| `POST` | `/api/auth/logout` | 🌐 | Limpia cookie |
| `POST` | `/api/auth/register` | admin | Crea nuevo usuario |
| `GET` | `/api/auth/me` | 🔒 | Devuelve usuario de la sesión |

### Productos (uso interno + carta pública)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/productos` | 🔒 | Listar todos |
| `POST` | `/api/productos` | admin | Crear |
| `PUT` | `/api/productos` | admin | Editar (id en body) |
| `DELETE` | `/api/productos` | admin | Eliminar (id en query) |
| `GET` | `/api/productos/[id]` | 🔒 | Ver uno |
| `PUT` | `/api/productos/[id]` | admin/cocinero | Editar |
| `DELETE` | `/api/productos/[id]` | admin | Eliminar |
| `GET` | `/api/public/productos` | 🌐 | Carta pública |

### Pedidos
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/pedidos` | 🔒 | Listar (paginado, con filtros) |
| `POST` | `/api/pedidos` | admin/camarero | Crear pedido en local |
| `GET` | `/api/pedidos/[id]` | 🔒 | Ver detalle |
| `PUT` | `/api/pedidos/[id]` | 🔒 | Actualizar (cambiar estado) |
| `DELETE` | `/api/pedidos/[id]` | admin | Cancelar |
| `POST` | `/api/pedidos/abrir` | admin/camarero | Abrir pedido nuevo para mesa |
| `PUT` | `/api/pedidos/[id]/cobrar` | admin/camarero | Cobrar |
| `POST` | `/api/public/pedidos` | 🌐 | Crear pedido público (sin pago) |
| `GET` | `/api/public/pedidos/[id]` | 🌐 | Tracking de pedido |

### Pagos públicos (Stripe)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/public/checkout` | 🌐 | Crear PaymentIntent |
| `POST` | `/api/public/checkout/confirm` | 🌐 | Confirmar pago + crear pedido |

### Mesas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/mesas` | 🔒 | Listar |
| `POST` | `/api/mesas` | admin | Crear |
| `PUT` | `/api/mesas/[id]` | admin/camarero | Modificar |
| `DELETE` | `/api/mesas/[id]` | admin | Eliminar |
| `POST` | `/api/mesas/seed` | admin | Crear 15 mesas iniciales |

### Ingredientes
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/ingredientes` | 🔒 | Listar |
| `POST` | `/api/ingredientes` | admin/cocinero | Crear |
| `GET` | `/api/ingredientes/[id]` | 🔒 | Ver |
| `PUT` | `/api/ingredientes/[id]` | admin/cocinero | Editar |
| `DELETE` | `/api/ingredientes/[id]` | admin | Eliminar |

### Usuarios
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/usuarios` | admin | Listar |
| `POST` | `/api/usuarios` | admin | Crear |
| `GET` | `/api/usuarios/[id]` | admin | Ver |
| `PUT` | `/api/usuarios/[id]` | admin | Editar |
| `DELETE` | `/api/usuarios/[id]` | admin | Eliminar (soft) |

### Tickets cocina y reportes
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/tickets-cocina` | admin/cocinero | Listar tickets |
| `POST` | `/api/tickets-cocina` | admin/camarero | Crear |
| `GET` | `/api/tickets-cocina/[id]` | 🔒 | Ver |
| `PUT` | `/api/tickets-cocina/[id]` | admin/cocinero | Actualizar |
| `GET` | `/api/reportes` | admin | Métricas y agregaciones |

🌐 = público · 🔒 = autenticación requerida (cualquier rol)

---

# 11. Seguridad

## 11.1. OWASP Top 10 — mitigaciones aplicadas

| Riesgo | Mitigación |
|---|---|
| **A01 Broken Access Control** | Middleware Edge + `protegerRutaPorRol()` en cada endpoint sensible |
| **A02 Cryptographic Failures** | bcrypt 12 rounds, JWT con HS256, HTTPS forzado por Vercel |
| **A03 Injection** | Mongoose escapa por defecto, sanitización custom en `sanitizeBody()`, validación de ObjectIds |
| **A04 Insecure Design** | Cálculo de precios SIEMPRE server-side, validación condicional de campos según `tipo` |
| **A05 Security Misconfiguration** | Variables sensibles en `.env*` (gitignored), rotación de keys |
| **A07 Auth Failures** | Rate limit en login (5/min/IP), cuentas con `activo: false` se bloquean |
| **A08 Data Integrity** | Validación Mongoose en cada `save`, `runValidators: true` en updates |
| **A09 Logging** | Logger centralizado con niveles (`logger.error`/`warn`/`log`) |
| **A10 SSRF** | No hay endpoints que hagan fetch a URLs proporcionadas por el usuario |

## 11.2. Detalle de medidas

### Autenticación
- Cookie `auth_token` con flags `httpOnly` (no accesible vía JS) + `secure` (solo HTTPS) + `sameSite=lax`
- Token también en body por compatibilidad multi-cliente
- Expiración de 7 días
- Logout limpia la cookie

### Validación de input
```typescript
// src/lib/utils/sanitize.ts
sanitizeBody(body)  // limpia objetos antes de procesarlos

// src/lib/utils/validateId.ts
validarObjectId(id)  // verifica formato Mongo antes de querys
```

### Rate limiting
- **Login:** 5 intentos por minuto por IP
- **Checkout público:** 10 requests por 15 minutos por IP
- Implementación in-memory (Map) — para producción real escalaría a Redis

### Hashing de contraseñas
```typescript
// src/lib/models/Usuario.ts (hook pre-save)
const salt = await bcrypt.genSalt(12);
this.password = await bcrypt.hash(this.password, salt);
```
12 rounds: balance entre seguridad y CPU (genera hash en ~250ms).

### Manejo de errores
- Helper `getErrorMessage(error: unknown)` para extraer mensajes de forma type-safe
- Logger condicional silencia `log/warn` en producción, mantiene `error`
- No se exponen stack traces al cliente

### Variables sensibles
- `.env.local`, `.env.docker` → `.gitignore`
- En producción: Vercel Environment Variables (cifradas)
- En CI: GitHub Actions Secrets

---

# 12. Tests y calidad de código

## 12.1. Estrategia de testing

```
┌──────────────────────┐
│   E2E (Playwright)   │  → Flujos críticos de cliente
├──────────────────────┤
│  Integration tests   │  → Endpoints + DB (pedidoService.db)
├──────────────────────┤
│  Component tests     │  → Hooks del dashboard
├──────────────────────┤
│  Unit tests          │  → Funciones puras (utils, services)
└──────────────────────┘
```

## 12.2. Cobertura actual

### Unit + integration (49 tests / 7 archivos)
- `pedidoService.test.ts` — lógica de negocio (validar productos, calcular totales, normalizar)
- `pedidoService.db.test.ts` — integración real con MongoDB (abrir mesa, liberar mesa)
- `logger.test.ts` — comportamiento condicional dev/prod
- `pagination.test.ts` — parsing de query params
- `rateLimiter.test.ts` — ventana móvil de rate limit
- `sanitize.test.ts` — limpieza de objetos
- `validateId.test.ts` — validación de ObjectIds

### Hooks (22 tests / 3 archivos)
- `usePedidoPanel.test.tsx` — stats, filtros, edición
- `usePedidoForm.test.tsx` — añadir/quitar productos del pedido
- `useProductoForm.test.tsx` — validación del form de producto

### Total: **71/71 tests pasando**

## 12.3. Comandos

```bash
npm test               # Toda la suite (unit + hooks)
npm run test:unit      # Solo unit (excluye .tsx)
npm run test:hooks     # Solo hooks del dashboard
npm run test:watch     # Vitest en watch mode
npm run test:e2e       # Playwright
npm run test:e2e:ui    # Playwright en modo UI
```

## 12.4. Calidad de código

### TypeScript estricto
```json
// tsconfig.json (extracto)
"strict": true,
"noEmit": true,
"esModuleInterop": true,
```
**Resultado:** 0 errores de tipos.

### ESLint flat config (v9)
```javascript
// eslint.config.mjs
- next/core-web-vitals
- typescript-eslint
- react-hooks
- Custom rules: no-console (allow error/warn), no-explicit-any (warn)
```
**Resultado:** 0 errores, 171 warnings (mejoras de tipo o React Compiler hints, no bloqueantes).

### Convenciones aplicadas
- **Conventional Commits** mayoritariamente (`feat:`, `fix:`, `refactor:`, `docs:`) — algunos commits antiguos de las primeras fases no siguen la convención
- **Imports absolutos** con alias `@/` (configurado en `tsconfig.json`)
- **Naming en español** para entidades del dominio (`Pedido`, `protegerRuta`) y en inglés para infraestructura (`getErrorMessage`, `useGSAP`)

---

# 13. CI/CD y despliegue

## 13.1. Continuous Integration

`.github/workflows/ci.yml` — Se ejecuta en cada push a `develop` y en cada PR a `main`:

```yaml
1. checkout del código
2. Setup Node 20 + cache de npm
3. npm ci  (instalación reproducible)
4. npm run typecheck
5. npm run build  (con todas las env vars)
```

**Si falla cualquier paso → el merge a `main` queda bloqueado** (rama protegida en GitHub).

## 13.2. Continuous Deployment (Vercel)

| Trigger | Resultado | Tiempo aprox. |
|---|---|---|
| Push a `main` | Deploy a producción | ~60s |
| PR abierto | Preview deployment con URL única | ~60s |
| Cualquier deploy | HTTPS + CDN global automáticos | inmediato |

### Características automáticas
- **HTTPS obligatorio** con renovación de certificados
- **CDN global** — assets servidos desde el edge más cercano
- **Rollback** instantáneo a deploys anteriores
- **Preview por PR** — cada PR genera una URL para revisar visualmente

## 13.3. Estrategia de ramas

```
main              ●────●────●────●  (protegida, solo PR + CI verde)
                  │    │    │    │
                  │    │    │    PR
                  │    │    │
develop      ●────┴●───┴●───●─────  (integración)
             │     │    │
             │     │    feat/payment-stripe
             │     │
             feat/role-checks   feat/cocina-kanban
```

---

# 14. Decisiones técnicas

Las decisiones más relevantes que dan forma al proyecto, con su justificación:

## D1. App Router en lugar de Pages Router
**Por qué:** API más moderna, soporte nativo de Server Components, layouts anidados, route groups (`(public)`, `(dashboard)`), streaming.

## D2. JWT con `jose` (en vez de `jsonwebtoken`)
**Por qué:** Edge Runtime no soporta APIs nativas de Node. `jose` usa Web Crypto, funciona en middleware Edge **y** en Route Handlers. Una sola librería para todo.

## D3. Cookies httpOnly + Body para el JWT
**Por qué:** la cookie protege contra XSS (no accesible desde JS); el body permite migrar a clientes nativos (móvil) sin tocar backend.

## D4. GSAP como única librería de animación (eliminé Framer Motion)
**Por qué:** GSAP es framework-agnóstico, más rendido, mejor para scroll. Tener dos librerías de animación en el bundle era duplicación innecesaria.

## D5. Logger centralizado en lugar de `console.log`
**Por qué:** Permite silenciar logs informativos en producción y dejar solo errores. Preparado para conectar Sentry/Logtail sin cambiar las llamadas.

## D6. Helper `getErrorMessage(unknown)` en vez de `catch (error: any)`
**Por qué:** TypeScript estricto trata `catch` como `unknown`. El helper extrae el mensaje de forma type-safe, evitando 60+ ocurrencias de `any`.

## D7. `protegerRutaPorRol()` combinado
**Por qué:** Antes había 9 endpoints que llamaban `await protegerRuta(req)` pero descartaban el resultado — un **bug de seguridad real**. El helper combinado fuerza la verificación en una sola línea.

## D8. Cálculo de precios server-side
**Por qué:** Si confiara en los precios del cliente, un atacante podría modificar el JSON y pagar 0.01€ por un chuletón. La validación en `pedidoService` lee precios reales de la BD.

## D9. PaymentIntent con metadata para idempotencia
**Por qué:** Si el cliente reclica "Confirmar pago", no debemos crear el pedido dos veces. Verificamos por `paymentIntentId` antes de insertar.

## D10. Cache de conexión Mongoose en serverless
**Por qué:** En Vercel cada Route Handler es una invocación serverless. Sin cache, cada request abriría una conexión nueva agotando el pool. La solución cachea la conexión en `global`.

## D11. SWR para fetching cliente (en vez de fetch manual)
**Por qué:** Revalidación automática + dedupe + cache compartida. Esencial para cocina (refresca cada 5s) y panel de pedidos.

## D12. Stripe import dinámico
**Por qué:** El SDK de Stripe lanza error si no encuentra `STRIPE_SECRET_KEY` al inicializarse. Lazy import permite que el build pase en CI sin las keys.

## D13. ESLint v9 flat config
**Por qué:** ESLint 9 deprecó `.eslintrc`. Migré a `eslint.config.mjs` (formato flat) que es la API recomendada hacia adelante.

## D14. Validación de alérgenos contra constante
**Por qué:** El Reglamento UE 1169/2011 define exactamente 14 alérgenos. Hardcodear la lista en `ALERGENOS_UE` con validación Mongoose evita typos como "lactos" en lugar de "lacteos".

## D15. Snapshot de precios en Pedido
**Por qué:** Si cambio el precio de un producto mañana, los pedidos pasados deben mantener el precio histórico (auditoría, contabilidad). El campo `precioUnitario` en `IProductoPedido` lo garantiza.

---

# 15. Estructura del proyecto

```
el-buey-madurado/
├── .github/workflows/ci.yml           # CI: typecheck + build
├── .env.example                       # Plantilla de variables
├── .gitignore
├── docker-compose.yml                 # Stack: app + mongo + mongo-express
├── Dockerfile                         # Build multi-stage de la app
├── eslint.config.mjs                  # ESLint v9 flat config
├── next.config.ts                     # Config Next.js (standalone output)
├── package.json
├── playwright.config.ts               # Tests E2E
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json                      # TypeScript estricto
├── vitest.config.ts
│
├── docs/                              # Documentación adicional
│   └── DOCUMENTACION.md               # Este archivo
│
├── e2e/                               # Tests Playwright
│
├── public/                            # Assets estáticos
│   ├── assets/images/                 # Imágenes locales
│   ├── data/                          # JSON estáticos
│   └── icons/
│
└── src/
    ├── app/                           # Next.js App Router
    │   │
    │   ├── (dashboard)/               # 🔒 Grupo de rutas protegidas
    │   │   ├── layout.tsx             # Layout: <ProtectedRoute> + <Toaster>  (Shell se monta dentro)
    │   │   └── dashboard/
    │   │       ├── page.tsx           # ⭐ Hub modular (?modulo=cocina|stock|...)
    │   │       ├── mesas/page.tsx     # Vista mapa de mesas
    │   │       ├── pedidos/page.tsx   # (referenciado pero el panel real está en components/)
    │   │       ├── usuarios/page.tsx  # CRUD de usuarios
    │   │       ├── ingredientes/layout.tsx   # Placeholder "en construcción"
    │   │       ├── productos/layout.tsx      # Placeholder "en construcción"
    │   │       └── tickets-cocina/layout.tsx # Placeholder "en construcción"
    │   │
    │   ├── (public)/                  # 🌐 Grupo de rutas públicas
    │   │   ├── layout.tsx             # Layout del grupo (envuelve en CartProvider)
    │   │   ├── carta/page.tsx
    │   │   ├── contacto/page.tsx
    │   │   ├── reservas/page.tsx
    │   │   ├── sobre-nosotros/page.tsx
    │   │   └── pedir/
    │   │       ├── page.tsx
    │   │       ├── carrito/page.tsx
    │   │       ├── checkout/page.tsx
    │   │       ├── confirmacion/[id]/page.tsx
    │   │       └── seguimiento/[id]/page.tsx
    │   │
    │   ├── api/                       # Route Handlers (REST)
    │   │   ├── auth/                  # login, logout, register, me
    │   │   ├── productos/             # CRUD productos
    │   │   ├── pedidos/               # CRUD + abrir + cobrar
    │   │   ├── mesas/                 # CRUD + seed
    │   │   ├── ingredientes/
    │   │   ├── usuarios/
    │   │   ├── tickets-cocina/
    │   │   ├── reportes/
    │   │   └── public/                # Endpoints sin auth
    │   │       ├── productos/         # Carta pública
    │   │       ├── pedidos/           # Crear pedido + tracking
    │   │       └── checkout/          # Stripe (create + confirm)
    │   │
    │   ├── login/page.tsx
    │   ├── layout.tsx                 # Root layout (CartProvider, Toaster)
    │   ├── globals.css
    │   └── not-found.tsx
    │
    ├── components/                    # Ver desglose en sección 9.1
    │   ├── ProtectedRoute.tsx         # Wrapper auth de cliente (legacy, complementa middleware)
    │   ├── Navbar/                    # Navbar.tsx + NavLink + Logo
    │   ├── Footer/                    # Footer + FooterBottom + FooterHorario + FooterLegal + FooterSocial + SocialButton
    │   ├── Home/                      # HeroSectionHome + GallerySection + ContactSection + Marquee
    │   ├── SobreNosotros/             # 4 secciones + Equipo (legacy: Esquipo.tsx duplicado)
    │   ├── Reservas/                  # reservas.tsx (formulario)
    │   ├── public/                    # ProductoCard + CartDrawer + CartSummaryBar + PersonalizarModal + StripePaymentForm
    │   ├── ui/                        # Button + FirstVisitNotice + OfflineBanner + ReservasButton + WhatsAppButton
    │   └── dashboard/                 # Ver sección 9.1 (incluye StockPanel)
    │
    ├── lib/                           # Lógica compartida
    │   ├── auth.ts                    # JWT con jose
    │   ├── middlewareAuth.ts          # protegerRuta + protegerRutaPorRol
    │   ├── db.ts                      # Conexión Mongoose con cache
    │   ├── apiClient.ts               # Wrapper fetch (con manejo de errores)
    │   ├── api.ts                     # Wrapper apiFetch + objeto api.{recurso}.{verbo}
    │   ├── menu.ts                    # ⚠️ Catálogo estático LEGACY — no se usa (sustituido por src/data/menu.ts)
    │   ├── models/                    # Schemas Mongoose
    │   │   ├── Usuario.ts
    │   │   ├── Producto.ts
    │   │   ├── Pedido.ts
    │   │   ├── Mesa.ts
    │   │   ├── Ingrediente.ts
    │   │   └── TicketCocina.ts
    │   ├── services/
    │   │   ├── pedidoService.ts       # Lógica de negocio pedidos
    │   │   └── __tests__/
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   ├── useScrollAnimations.ts
    │   │   └── swr/                   # Hooks SWR específicos
    │   ├── context/
    │   │   └── CartContext.tsx        # Carrito persistente
    │   ├── constants/
    │   │   └── alergenos.ts           # 14 alérgenos UE
    │   ├── types/                     # Tipos compartidos
    │   └── utils/
    │       ├── logger.ts              # Logger condicional
    │       ├── errors.ts              # getErrorMessage(unknown)
    │       ├── rateLimiter.ts         # Rate limiting in-memory
    │       ├── sanitize.ts            # Sanitización de inputs
    │       ├── validateId.ts          # Validación ObjectIds
    │       ├── pagination.ts          # Helper de paginación
    │       └── __tests__/
    │
    ├── data/                          # Datos estáticos del proyecto
    │   └── menu.ts                    # ⭐ Catálogo del menú (importado por /carta)
    │
    └── middleware.ts                  # Edge middleware (jose JWT)
```

---

# 16. Estado actual y métricas

## 16.1. Calidad de código

| Métrica | Valor | Estado |
|---|---|---|
| **Errores TypeScript** | 0 | ✅ |
| **Errores ESLint** | 0 | ✅ |
| **Warnings ESLint** | 171 | ⚠️ no bloqueantes |
| **Tests unit + hooks pasando** | 71/71 | ✅ |
| **Cobertura aprox. (servicios + utils + hooks)** | ~80% | ✅ |

## 16.2. Tamaño del proyecto

| Métrica | Valor |
|---|---|
| **Archivos `.ts` / `.tsx`** | ~150 |
| **Endpoints API** | 25 |
| **Modelos Mongoose** | 6 |
| **Componentes React** | ~50 |
| **Páginas** | 18 |

## 16.3. Refactor reciente (Fases 1 + 2)

Documentadas con detalle:
- ✅ Console.log → logger centralizado en 18 archivos API
- ✅ ESLint v9 flat config configurado
- ✅ 3 tests rotos arreglados
- ✅ JWT consolidado en `jose` (eliminado `jsonwebtoken` + `jwt-decode`)
- ✅ 62 ocurrencias de `catch (error: any)` migradas a `unknown` con helper
- ✅ Framer Motion eliminado, 4 componentes migrados a GSAP
- ✅ `protegerRutaPorRol()` añadido + bugs de seguridad fixados (9 endpoints sin verificación de auth real)
- ✅ Bugs reales fixados: hooks condicionales en seguimiento, useEffectEvent mal usado, Date.now en render

---

# 17. Mejoras futuras

## 17.1. Roadmap planificado

### Corto plazo (próximas semanas)
- [ ] **Refactor de componentes grandes** — `PedidoPanel` (715), `ReportesPanel` (676), `CocinaPanel` (628) → trocear en sub-componentes para mejorar mantenibilidad
- [ ] **Tipado estricto** — eliminar los ~170 warnings de `any` residuales

### Medio plazo
- [ ] **Webhook Stripe + idempotencyKey** — confirmación asíncrona del pago, más robusto que el flujo síncrono actual
- [ ] **Refresh de cookie JWT** — extender sesión en cada request para no echar al usuario al expirar
- [ ] **Frontend con guard por rol** — ocultar botones/módulos según rol del usuario logueado (defensa en profundidad UX)
- [ ] **Índices Mongo adicionales** en `Pedido.mesa` y `Pedido.productos.producto` para optimizar populates

### Largo plazo
- [ ] **Monitoring** — integrar Sentry para errores en producción
- [ ] **Internacionalización** (i18n) con `next-intl` (catalán + inglés)
- [ ] **Notificaciones push** al cliente cuando su pedido cambia de estado (Service Workers)
- [ ] **Modo offline** para el dashboard (PWA + cache de pedidos)
- [ ] **Dominio personalizado** (elbueymadurado.com)
- [ ] **Sistema de reservas reales** integrado con disponibilidad de mesas
- [ ] **App móvil nativa** para camareros (React Native compartiendo modelos)

## 17.2. Mejoras de proceso
- [ ] **Lint en CI** — añadir `npm run lint` al workflow de GitHub Actions
- [ ] **Tests E2E en CI** — actualmente solo se ejecutan en local
- [ ] **Coverage report** automático en cada PR
- [ ] **Dependabot** para actualizaciones automáticas de dependencias

---

# 18. Conclusiones

## 18.1. Logros

Este proyecto ha conseguido construir un **sistema completo, real y desplegable** que resuelve un problema concreto de un sector concreto (restauración). Las capacidades técnicas demostradas son:

1. **Dominio del stack moderno** — Next.js 16 con App Router, RSC, Edge Middleware, Route Handlers — lo más actual de la industria.
2. **Modelado de dominio complejo** — 6 modelos relacionados, validaciones condicionales, snapshots de precios, gestión de roles.
3. **Integraciones de terceros** — Stripe para pagos reales (con SCA), Cloudinary para imágenes, MongoDB Atlas para BD.
4. **Buenas prácticas de ingeniería** — TypeScript estricto, tests automatizados, CI/CD, ramas protegidas, code reviews.
5. **Seguridad aplicada en profundidad** — JWT en cookie httpOnly, bcrypt 12 rounds, rate limiting, sanitización, verificación de roles en cada endpoint, defensa en capas.
6. **UX cuidada** — animaciones GSAP, notificaciones sonoras, responsive design, feedback inmediato, dark mode visual coherente.

## 18.2. Aprendizajes clave

- **Los Edge Runtimes tienen restricciones** — no toda librería de Node funciona allí. Esto me llevó a aprender `jose` y entender por qué la API web (Web Crypto) es preferible.
- **La validación SIEMPRE va en el servidor** — me costó internalizar esto. Mi primer intento dejaba que el cliente enviara los precios. La refactorización a calcular en `pedidoService` desde la BD fue una lección clave.
- **Idempotencia en pagos no es opcional** — un cliente puede reclicar, perder conexión, recargar. Pensar en estos casos *antes* de implementar es crítico.
- **El refactor sostenido evita la deuda técnica** — durante el desarrollo hice una "Fase 1+2" de mejoras (refactor de logs, tipos, JWT, framer→gsap, roles) que mejoró el código sin añadir features. Es trabajo invisible pero el resultado se nota.
- **Los hooks de React 19 tienen reglas estrictas** — el linter me detectó hooks llamados condicionalmente, `setState` en effects, llamadas impuras durante render. Aprender el "porqué" detrás de cada regla me hizo escribir mejor código.
- **Docker + docker-compose es magia para reproducibilidad** — un solo `docker-compose up` arranca toda la app sin instalar nada localmente. Esencial para colaboración.

## 18.3. Dificultades superadas

- **Migración a Next.js 16** durante el desarrollo (algunos breaking changes con React 19)
- **Convivencia de Framer Motion + GSAP** que finalmente resolví consolidando en GSAP
- **Bugs sutiles en autenticación** — descubrí que 9 endpoints usaban `await protegerRuta(req)` pero descartaban el resultado, lo que efectivamente desactivaba la protección. Lo descubrí solo durante una auditoría sistemática.
- **Stripe en CI** — el build fallaba en GitHub Actions porque el SDK requería las env vars al inicializarse. Lazy import lo solucionó.
- **Hidratación SSR/Cliente del carrito** — al cargar la página, el server no tiene acceso a localStorage, lo que causaba mismatch. Lo resolví con un flag `hydrated`.

## 18.4. Defensa final

> *"El Buey Madurado no es solo un proyecto académico — es una aplicación real que un restaurante podría desplegar mañana. Combina las tecnologías más actuales del stack web (Next.js 16, React 19, Edge Computing, JWT moderno, pagos reales) con prácticas profesionales de ingeniería (TypeScript estricto, CI/CD, tests, seguridad en capas). El resultado es un sistema completo, mantenible y escalable, listo para iterar y crecer."*

---

<div align="center">

## 👨‍💻 Autor

**Michael Llorens Barbera**
*Estudiante de 2º DAW — Proyecto Integrado*

[GitHub: @Michael-Llorens](https://github.com/Michael-Llorens)

---

**🥩 El Buey Madurado** · Mayo 2026

*Documentación técnica generada para defensa del Proyecto Integrado.*

</div>

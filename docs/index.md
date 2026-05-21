# El Buey Madurado - Indice de Documentacion

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Resumen del Proyecto

- **Tipo:** Monolito web full-stack
- **Lenguaje principal:** TypeScript (strict)
- **Arquitectura:** Next.js 16 App Router (SSR + API Routes)
- **Stack:** React 19, Tailwind CSS, MongoDB/Mongoose, SWR, JWT, Stripe, Framer Motion, GSAP

## Referencia Rapida

- **Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + MongoDB + Mongoose ^9.1.5
- **Punto de entrada:** `src/app/layout.tsx` (layout raiz), `src/middleware.ts` (seguridad Edge)
- **Patron de arquitectura:** Monolito Next.js con App Router, API Routes RESTful, SWR auto-refresh
- **Modelos:** 6 (Usuario, Producto, Pedido, Mesa, Ingrediente, TicketCocina)
- **Endpoints API:** 43 endpoints en 9 grupos de recursos
- **Componentes:** ~62 componentes React + 14 hooks + 15 paginas
- **Datos semilla:** 68 ingredientes + 64 productos + 15 mesas + 14 alergenos UE

## Documentacion Generada

| Documento | Descripcion |
|-----------|-------------|
| [Resumen del Proyecto](./project-overview.md) | Vision general, stack tecnologico, metricas, scripts y variables |
| [Arquitectura](./architecture.md) | Diagramas, auth, roles, SWR, seguridad, flujo Stripe, CI/CD |
| [Arbol de Codigo Fuente](./source-tree-analysis.md) | Estructura completa de archivos con descripciones y estadisticas |
| [Contratos API](./api-contracts.md) | 43 endpoints documentados (auth, CRUD, publicos, checkout, reportes) |
| [Modelos de Datos](./data-models.md) | 6 modelos Mongoose con campos, relaciones, indices, ERD y estados |
| [Inventario de Componentes](./component-inventory.md) | ~100 archivos organizados por categoria con hooks, paginas y patrones |
| [Guia de Desarrollo](./development-guide.md) | Configuracion del entorno, convenciones, testing, Docker |
| [Guia de Despliegue](./deployment-guide.md) | Docker, Vercel, MongoDB Atlas, CI/CD, PWA |

## Documentacion Existente

- [README.md](../README.md) — Documentacion principal del repositorio
- [Auditoria](./auditoria-el-buey-madurado.md) — Auditoria del proyecto
- [Plan de Mejoras](./plan-mejoras-el-buey-madurado.md) — Plan de mejoras identificado
- [Seguimiento de Mejoras](./seguimiento-mejoras-el-buey-madurado.md) — Seguimiento del progreso de mejoras

## Cambios Principales desde el Ultimo Escaneo (30/03 → 01/04)

- **Stripe integrado:** `@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe` server SDK
- **2 nuevos endpoints:** `POST /api/public/checkout` (crear PaymentIntent), `POST /api/public/checkout/confirm` (confirmar pago)
- **StripePaymentForm:** Nuevo componente con Stripe Elements para pago online
- **GSAP:** Nueva dependencia de animacion (`gsap ^3.14.2`)
- **Pagina carrito:** Nueva ruta `/pedir/carrito` como redirect inteligente
- **CobrarModal:** Modal de cobro con efectivo/tarjeta/mixto, subcuentas y cambio
- **Total endpoints:** 41 → 43

## Como Empezar

1. Consulta la [Guia de Desarrollo](./development-guide.md) para configurar el entorno
2. Revisa la [Arquitectura](./architecture.md) para entender la estructura
3. Consulta los [Contratos API](./api-contracts.md) para trabajar con el backend
4. Revisa los [Modelos de Datos](./data-models.md) para entender el dominio
5. Consulta el [Inventario de Componentes](./component-inventory.md) para la UI

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

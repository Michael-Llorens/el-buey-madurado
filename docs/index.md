# El Buey Madurado - Indice de Documentacion

## Resumen del Proyecto

- **Tipo:** Monolito web full-stack
- **Lenguaje principal:** TypeScript
- **Arquitectura:** Next.js 16 App Router (SSR + API Routes)
- **Stack:** React 19, Tailwind CSS, MongoDB/Mongoose, SWR, JWT, Framer Motion

## Referencia Rapida

- **Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + MongoDB + Mongoose ^9.1.5
- **Punto de entrada:** `src/app/layout.tsx` (layout raiz), `src/middleware.ts` (seguridad Edge)
- **Patron de arquitectura:** Monolito Next.js con App Router, API Routes RESTful, SWR auto-refresh
- **Modelos:** 6 (Usuario, Producto, Pedido, Mesa, Ingrediente, TicketCocina)
- **Endpoints API:** 41 endpoints en 9 grupos de recursos
- **Componentes:** ~59 componentes React
- **Datos semilla:** 68 ingredientes + 64 productos + 15 mesas + 14 alergenos UE

## Documentacion Generada

| Documento | Descripcion |
|-----------|-------------|
| [Resumen del Proyecto](./project-overview.md) | Vision general, stack tecnologico, estado actual, scripts y variables |
| [Arquitectura](./architecture.md) | Diagramas, grupos de rutas, autenticacion, roles, SWR hooks, servicios |
| [Arbol de Codigo Fuente](./source-tree-analysis.md) | Estructura completa de archivos con descripciones y estadisticas |
| [Contratos API](./api-contracts.md) | 41 endpoints documentados (auth, CRUD, publicos, reportes) |
| [Modelos de Datos](./data-models.md) | 6 modelos Mongoose con campos, relaciones, indices y validaciones |
| [Inventario de Componentes](./component-inventory.md) | ~59 componentes organizados por categoria con hooks y patrones |
| [Guia de Desarrollo](./development-guide.md) | Configuracion del entorno, convenciones, testing |
| [Guia de Despliegue](./deployment-guide.md) | Docker, Vercel, MongoDB Atlas, CI/CD |

## Documentacion Existente

- [README.md](../README.md) - Documentacion principal del repositorio
- [Auditoria](./auditoria-el-buey-madurado.md) - Auditoria del proyecto
- [Plan de Mejoras](./plan-mejoras-el-buey-madurado.md) - Plan de mejoras identificado
- [Seguimiento de Mejoras](./seguimiento-mejoras-el-buey-madurado.md) - Seguimiento del progreso de mejoras

## Cambios Principales desde el Ultimo Escaneo (25/03 → 30/03)

- **Sistema de pedidos online:** Flujo completo `/pedir` con catalogo, carrito (CartContext), checkout y seguimiento
- **Endpoints publicos:** `/api/public/productos`, `/api/public/pedidos`, `/api/public/pedidos/[id]` sin autenticacion
- **Componentes public/:** ProductoCard, PersonalizarModal, CartDrawer, CartSummaryBar
- **WhatsApp:** Boton de notificacion en PedidoCard para pedidos listos (recoger/domicilio)
- **PedidoCard compacto:** Diseno de 2 filas de botones, indicador de urgencia temporal, badges de tipo
- **Filtrado por turno:** Panel de pedidos con filtro turno actual vs historial
- **Stock con filtros:** StockPanel con busqueda, filtro por categoria y disponibilidad
- **Refresh 5s:** Todos los hooks SWR del dashboard con `refreshInterval: 5000`
- **Rate limiting publico:** 10 pedidos/15 min por IP en endpoint de pedidos online
- **Datos semilla:** 68 ingredientes + 64 productos del menu real del restaurante

## Como Empezar

1. Consulta la [Guia de Desarrollo](./development-guide.md) para configurar el entorno
2. Revisa la [Arquitectura](./architecture.md) para entender la estructura
3. Consulta los [Contratos API](./api-contracts.md) para trabajar con el backend
4. Revisa los [Modelos de Datos](./data-models.md) para entender el dominio
5. Consulta el [Inventario de Componentes](./component-inventory.md) para la UI

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

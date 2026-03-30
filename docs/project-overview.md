# El Buey Madurado - Resumen del Proyecto

**Fecha de generacion:** 2026-03-30
**Tipo de repositorio:** Monolito
**Tipo de proyecto:** Aplicacion web full-stack
**Tipo de escaneo:** Profundo (deep scan)

---

## Resumen Ejecutivo

**El Buey Madurado** es un sistema integral de gestion para un restaurante de carnes maduradas ubicado en Xativa, Valencia. La aplicacion cubre la presencia publica del restaurante (pagina web, carta digital, sistema de pedidos online con carrito y seguimiento) y la gestion interna del negocio (dashboard de administracion, gestion de pedidos multicanal, stock con filtros, mesas interactivas, cocina y reportes en tiempo real).

**Autor:** Michael Llorens Barbera
**Curso:** 2 DAW - Proyecto Integrado
**Repositorio:** https://github.com/Michael-Llorens/el-buey-madurado
**Demo en vivo:** https://restaurante-el-buey-madurado.vercel.app

---

## Estado Actual (Marzo 2026)

### Web Publica
- Pagina de inicio con hero video (MP4), galeria animada y seccion de contacto
- Carta digital interactiva organizada por categorias
- **Sistema de pedidos online** (`/pedir`) con catalogo publico, personalizacion de productos, carrito persistente, checkout y seguimiento de pedido en tiempo real
- Pagina de reservas (enlace externo a TheFork)
- Seccion "Sobre Nosotros" con equipo, historia, museo de carne y resenas de Google
- Pagina de contacto
- PWA con manifest.webmanifest, Service Worker y soporte offline

### Dashboard de Administracion
- **Panel de pedidos** con filtrado por turno actual/historial, tipo (local/recoger/domicilio) y grid de 5 columnas
- **PedidoCard compacto** con botones de accion en 2 filas, indicador de tiempo/urgencia y boton WhatsApp
- **Gestion de mesas** con mapa visual interactivo y tarjetas con estado
- **Panel de stock** con tabs productos/ingredientes, filtros por categoria, busqueda por texto y filtro de disponibilidad
- Panel de cocina para gestion de tickets con prioridades
- Panel de reportes con metricas agregadas (ingresos, top productos, graficos diarios)
- Gestion de usuarios con control de roles (admin, camarero, cocinero)
- **Refresh automatico cada 5s** en todos los datos del dashboard via SWR

### Sistema de Pedidos Online (nuevo desde 25/03)
- Catalogo publico de productos (`/api/public/productos`) sin autenticacion
- Modal de personalizacion de productos (ingredientes extra, quitar ingredientes)
- Carrito persistente en localStorage con `CartContext`
- Drawer lateral del carrito con resumen y barra flotante
- Checkout con formulario de cliente, tipo de pedido y direccion de entrega
- Pagina de confirmacion con ID de pedido
- Seguimiento de estado del pedido en tiempo real (`/pedir/seguimiento/[id]`)
- **Notificacion por WhatsApp** para pedidos listos (recoger/domicilio)
- Rate limiting por IP en endpoint publico (10 pedidos/15 min)

---

## Stack Tecnologico

| Categoria | Tecnologia | Version | Justificacion |
|-----------|-----------|---------|---------------|
| Framework | Next.js | ^16.0.7 | Framework React full-stack con App Router, SSR y API Routes |
| Frontend | React | ^19.2.3 | Libreria UI con Server Components |
| Lenguaje | TypeScript | ^5.9.3 | Tipado estatico para mayor robustez |
| Estilos | Tailwind CSS | ^3.4.18 | Utilidades CSS para desarrollo rapido |
| Animaciones | Framer Motion | ^12.23.25 | Animaciones declarativas para React |
| Base de datos | MongoDB | 7 (Docker) | Base de datos NoSQL documental |
| ODM | Mongoose | ^9.1.5 | ODM para MongoDB con esquemas y validaciones |
| Autenticacion | JWT (jose + jsonwebtoken) | - | Tokens JWT con verificacion en middleware y API |
| Imagenes | Cloudinary (next-cloudinary) | ^6.17.5 | Almacenamiento y optimizacion de imagenes |
| Notificaciones | Sonner | ^2.0.7 | Toasts/notificaciones en UI |
| Data Fetching | SWR | ^2.4.1 | Cache, deduplicacion y revalidacion automatica (5s) |
| PDF | jsPDF + html2canvas | ^4.2.1 / ^1.4.1 | Generacion de PDFs (exportacion de reportes) |
| Iconos | React Icons | ^5.5.0 | Libreria de iconos |
| Password Hash | bcryptjs | ^3.0.3 | Hash de passwords con salt 12 |
| Analytics | Vercel Analytics | ^1.6.1 | Metricas de rendimiento y uso |

### Dependencias de Desarrollo

| Herramienta | Version |
|---|---|
| Vitest | ^4.1.0 |
| Playwright | ^1.58.2 |
| Testing Library React | ^16.3.2 |
| ESLint (+ next config) | ^9.39.2 |
| PostCSS | ^8.5.6 |
| cross-env | ^10.1.0 |

---

## Scripts Principales

| Script | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo en puerto 3333 (sin Turbopack) |
| `npm run dev:turbo` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de produccion (output: standalone) |
| `npm run start` | Servidor de produccion |
| `npm run test` | Tests unitarios + hooks con Vitest |
| `npm run test:unit` | Solo tests unitarios (excluye .test.tsx) |
| `npm run test:hooks` | Solo tests de hooks del dashboard |
| `npm run test:e2e` | Tests end-to-end con Playwright |
| `npm run typecheck` | Verificacion de tipos TypeScript |
| `npm run lint` | Linting con ESLint |
| `npm run db:backup` | Backup de MongoDB con mongodump |

---

## Variables de Entorno Requeridas

| Variable | Descripcion |
|---|---|
| `MONGODB_URI` | URI de conexion a MongoDB |
| `JWT_SECRET` | Secreto para firmar tokens JWT (recomendado: 64 chars hex) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `NEXT_PUBLIC_API_URL` | URL base de la API |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicacion |
| `NEXTAUTH_SECRET` | Secreto NextAuth (base64) |
| `NEXTAUTH_URL` | URL de la aplicacion |

---

## Datos Semilla

El sistema incluye datos del menu real del restaurante:
- **68 ingredientes** organizados por categorias (carnes, verduras, salsas, lacteos, etc.)
- **64 productos** del menu (entrantes frios/calientes, carnes, hamburguesas, postres, bebidas con subcategorias)
- **15 mesas** predefinidas con capacidad de 4 comensales
- **14 alergenos UE** regulados (Reglamento 1169/2011) con iconos, labels y colores
- Seed automatico de mesas via endpoint `POST /api/mesas/seed`

---

## Estructura del Repositorio

```
el-buey-madurado/
├── src/                   # Codigo fuente principal
│   ├── app/               # Next.js App Router (rutas, API, layouts)
│   ├── components/        # Componentes React (dashboard, public, ui)
│   ├── lib/               # Logica de negocio, modelos, hooks, utilidades
│   ├── data/              # Datos estaticos (menu.ts - 650 lineas)
│   └── middleware.ts      # Middleware Edge (JWT en /dashboard/*)
├── public/                # Archivos publicos (PWA, iconos, video, imagenes)
├── e2e/                   # Tests end-to-end (Playwright)
├── docs/                  # Documentacion del proyecto
├── Dockerfile             # Imagen Docker de produccion (standalone)
├── docker-compose.yml     # Servicios Docker (app + MongoDB)
└── package.json           # Dependencias y scripts
```

---

## Despliegue

- **Output:** `standalone` (optimizado para Docker/contenedores)
- **Hosting produccion:** Vercel (CD automatico desde GitHub)
- **Base de datos produccion:** MongoDB Atlas
- **Contenedores:** Dockerfile + docker-compose.yml
- **CI:** GitHub Actions (typecheck + build)
- **PWA:** manifest.webmanifest + Service Worker + iconos 192/512px

---

## Documentacion Relacionada

- [Arquitectura](./architecture.md)
- [Arbol de Codigo Fuente](./source-tree-analysis.md)
- [Contratos API](./api-contracts.md)
- [Modelos de Datos](./data-models.md)
- [Inventario de Componentes](./component-inventory.md)
- [Guia de Desarrollo](./development-guide.md)
- [Guia de Despliegue](./deployment-guide.md)

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

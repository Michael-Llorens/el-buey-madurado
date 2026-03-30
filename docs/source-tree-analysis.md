# Arbol de Codigo Fuente - El Buey Madurado

**Fecha de generacion:** 2026-03-30

---

## Estructura Completa

```
el-buey-madurado/
├── .github/
│   └── workflows/
│       └── ci.yml                          # Pipeline CI: typecheck + build
├── docs/                                   # Documentacion del proyecto
│   ├── index.md                            # Indice maestro de documentacion
│   ├── project-overview.md                 # Resumen del proyecto
│   ├── architecture.md                     # Arquitectura del sistema
│   ├── source-tree-analysis.md             # Este archivo
│   ├── api-contracts.md                    # Contratos API (41 endpoints)
│   ├── data-models.md                      # Modelos de datos (6 modelos)
│   ├── component-inventory.md              # Inventario de componentes (~59)
│   ├── development-guide.md                # Guia de desarrollo
│   ├── deployment-guide.md                 # Guia de despliegue
│   ├── project-scan-report.json            # Datos del escaneo
│   ├── auditoria-el-buey-madurado.md       # Auditoria del proyecto
│   ├── plan-mejoras-el-buey-madurado.md    # Plan de mejoras
│   └── seguimiento-mejoras-el-buey-madurado.md
├── e2e/                                    # Tests end-to-end (Playwright)
│   └── auth.spec.ts                        # Test de autenticacion E2E
├── public/                                 # Archivos estaticos publicos
│   ├── assets/
│   │   └── images/                         # Imagenes del sitio (~19 archivos)
│   │       ├── carne[1-10].*              # Galeria de carnes
│   │       ├── carneSobreNosotros[1-3].*  # Imagenes Sobre Nosotros
│   │       ├── hero-Sobre-Nosotros.jpeg   # Hero Sobre Nosotros
│   │       ├── josep.jpeg                 # Equipo
│   │       ├── letis.webp                 # Equipo
│   │       ├── miguel.jpeg                # Equipo
│   │       └── local[1-3]img.jpeg         # Imagenes del local
│   ├── icons/
│   │   ├── icon-192.png                   # Icono PWA 192px
│   │   ├── icon-512.png                   # Icono PWA 512px
│   │   └── icon-maskable-512.png          # Icono maskable PWA
│   ├── hero.mp4                           # Video hero de la landing
│   ├── logo-fondo-blanco.ico              # Favicon
│   ├── manifest.webmanifest               # Manifest PWA
│   └── sw.js                              # Service Worker (PWA)
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── layout.tsx                      # Layout raiz (html, body, fonts)
│   │   ├── page.tsx                        # Pagina principal (landing)
│   │   ├── RootLayoutContent.tsx           # Contenido del layout (Sonner)
│   │   ├── globals.css                     # Estilos globales (Tailwind base)
│   │   │
│   │   ├── (public)/                       # Grupo de rutas publicas
│   │   │   ├── layout.tsx                  # Layout: Navbar + Footer + CartProvider
│   │   │   ├── carta/
│   │   │   │   └── page.tsx               # Carta digital del menu
│   │   │   ├── contacto/
│   │   │   │   └── page.tsx               # Pagina de contacto
│   │   │   ├── reservas/
│   │   │   │   └── page.tsx               # Reservas (TheFork)
│   │   │   ├── sobre-nosotros/
│   │   │   │   └── page.tsx               # Pagina Sobre Nosotros
│   │   │   └── pedir/                      # ★ Sistema de pedidos online
│   │   │       ├── page.tsx               # Catalogo de productos
│   │   │       ├── carrito/
│   │   │       │   └── page.tsx           # Vista del carrito
│   │   │       ├── checkout/
│   │   │       │   └── page.tsx           # Formulario de checkout
│   │   │       ├── confirmacion/
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx       # Confirmacion de pedido
│   │   │       └── seguimiento/
│   │   │           └── [id]/
│   │   │               └── page.tsx       # Seguimiento en tiempo real
│   │   │
│   │   ├── (dashboard)/                    # Grupo de rutas protegidas
│   │   │   ├── layout.tsx                  # Layout: DashboardShell (sidebar)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx               # Dashboard home
│   │   │       ├── pedidos/
│   │   │       │   └── page.tsx           # Panel de pedidos
│   │   │       ├── mesas/
│   │   │       │   └── page.tsx           # Gestion de mesas
│   │   │       ├── ingredientes/
│   │   │       │   └── layout.tsx         # Stock de ingredientes
│   │   │       ├── productos/
│   │   │       │   └── layout.tsx         # Stock de productos
│   │   │       ├── tickets-cocina/
│   │   │       │   └── layout.tsx         # Panel de cocina
│   │   │       └── usuarios/
│   │   │           └── page.tsx           # Gestion de usuarios
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                    # Pagina de login
│   │   │
│   │   └── api/                            # API Route Handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts         # POST: login + cookie JWT
│   │       │   ├── logout/route.ts        # POST: logout + borrar cookie
│   │       │   ├── me/route.ts            # GET: usuario actual
│   │       │   └── register/route.ts      # POST: registro (solo admin)
│   │       ├── ingredientes/
│   │       │   ├── route.ts               # GET (lista) + POST (crear)
│   │       │   └── [id]/route.ts          # GET + PUT + DELETE
│   │       ├── mesas/
│   │       │   ├── route.ts               # GET (lista) + POST (crear)
│   │       │   ├── [id]/route.ts          # PUT + DELETE
│   │       │   └── seed/route.ts          # POST: crear 15 mesas iniciales
│   │       ├── pedidos/
│   │       │   ├── route.ts               # GET (paginado) + POST (crear)
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts           # GET + PUT + DELETE
│   │       │   │   └── cobrar/route.ts    # PUT: cobrar pedido
│   │       │   └── abrir/route.ts         # POST: abrir pedido en mesa
│   │       ├── productos/
│   │       │   ├── route.ts               # GET + POST + PUT + DELETE
│   │       │   └── [id]/route.ts          # GET + PUT + DELETE
│   │       ├── public/                     # ★ Endpoints sin autenticacion
│   │       │   ├── productos/route.ts     # GET: catalogo publico
│   │       │   └── pedidos/
│   │       │       ├── route.ts           # POST: crear pedido online
│   │       │       └── [id]/route.ts      # GET: seguimiento de pedido
│   │       ├── reportes/
│   │       │   └── route.ts               # GET: metricas agregadas
│   │       ├── tickets-cocina/
│   │       │   ├── route.ts               # GET + POST
│   │       │   └── [id]/route.ts          # GET + PUT
│   │       └── usuarios/
│   │           ├── route.ts               # GET + POST
│   │           └── [id]/route.ts          # GET + PUT + DELETE
│   │
│   ├── components/                         # Componentes React
│   │   ├── dashboard/                     # ★ Componentes del panel (22 archivos)
│   │   │   ├── DashboardShell.tsx         # Shell con sidebar
│   │   │   ├── PedidoPanel.tsx            # Panel de pedidos
│   │   │   ├── PedidoForm.tsx             # Formulario de pedido
│   │   │   ├── PedidoCard.tsx             # Tarjeta compacta de pedido
│   │   │   ├── CocinaPanel.tsx            # Panel de cocina
│   │   │   ├── StockPanel.tsx             # Panel de stock con filtros
│   │   │   ├── ReportesPanel.tsx          # Panel de reportes
│   │   │   ├── ProductoForm.tsx           # Formulario de producto
│   │   │   ├── ProductoList.tsx           # Lista de productos
│   │   │   ├── ProductCardGrid.tsx        # Grid de productos
│   │   │   ├── IngredienteForm.tsx        # Formulario de ingrediente
│   │   │   ├── IngredienteList.tsx        # Lista de ingredientes
│   │   │   ├── IngredientCardGrid.tsx     # Grid de ingredientes
│   │   │   ├── MesaGrid.tsx              # Grid de mesas
│   │   │   ├── MesaCard.tsx              # Tarjeta de mesa
│   │   │   ├── MesaForm.tsx              # Formulario de mesa
│   │   │   ├── MesaMapView.tsx           # Mapa interactivo de mesas
│   │   │   ├── ButtonGrid.tsx            # Grid de botones de accion
│   │   │   ├── ConfirmModal.tsx          # Modal de confirmacion
│   │   │   ├── CobrarModal.tsx           # Modal de cobro
│   │   │   ├── PersonalizarProductoModal.tsx  # Modal personalizacion
│   │   │   └── hooks/                     # Hooks del dashboard
│   │   │       ├── usePedidoForm.ts
│   │   │       ├── usePedidoPanel.ts
│   │   │       ├── useProductoForm.ts
│   │   │       ├── useConfirm.ts
│   │   │       └── __tests__/            # Tests de hooks
│   │   │           ├── usePedidoForm.test.tsx
│   │   │           ├── usePedidoPanel.test.tsx
│   │   │           └── useProductoForm.test.tsx
│   │   ├── public/                        # ★ Componentes pedidos online
│   │   │   ├── ProductoCard.tsx           # Tarjeta producto publico
│   │   │   ├── PersonalizarModal.tsx      # Modal personalizacion publico
│   │   │   ├── CartDrawer.tsx             # Drawer lateral del carrito
│   │   │   └── CartSummaryBar.tsx         # Barra resumen del carrito
│   │   ├── Home/                          # Landing page
│   │   │   ├── HeroSectionHome.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── Marquee.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── Logo.tsx
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   ├── FooterBottom.tsx
│   │   │   ├── FooterHorario.tsx
│   │   │   ├── FooterLegal.tsx
│   │   │   ├── FooterSocial.tsx
│   │   │   ├── SocialButton.tsx
│   │   │   └── SocialButtom.tsx
│   │   ├── SobreNosotros/
│   │   │   ├── HeroSectionSobreNosotros.tsx
│   │   │   ├── HistoriaYValores.tsx
│   │   │   ├── Equipo.tsx
│   │   │   ├── Esquipo.tsx
│   │   │   ├── MuseoCarne.tsx
│   │   │   └── GoogleReviews.tsx
│   │   ├── Reservas/
│   │   │   └── reservas.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx                 # Boton reutilizable
│   │   │   ├── WhatsAppButton.tsx         # Boton flotante WhatsApp
│   │   │   ├── ReservasButton.tsx         # Boton flotante reservas
│   │   │   ├── FirstVisitNotice.tsx       # Aviso primera visita
│   │   │   └── OfflineBanner.tsx          # Banner offline (PWA)
│   │   └── ProtectedRoute.tsx             # HOC proteccion de rutas
│   │
│   ├── data/
│   │   └── menu.ts                        # Datos estaticos del menu (650 lineas, 64 productos)
│   │
│   ├── lib/                                # Logica compartida
│   │   ├── api.ts                         # Funciones de API genericas
│   │   ├── apiClient.ts                   # Cliente API configurado
│   │   ├── auth.ts                        # Utilidades JWT (generarToken, verificarToken)
│   │   ├── db.ts                          # Conexion MongoDB singleton
│   │   ├── menu.ts                        # Utilidades de menu
│   │   ├── middlewareAuth.ts              # Middleware auth API (protegerRuta, verificarRol)
│   │   ├── models/                        # Modelos Mongoose (6)
│   │   │   ├── Usuario.ts                # Usuarios con roles y bcrypt
│   │   │   ├── Producto.ts               # Productos con ingredientes y extras
│   │   │   ├── Pedido.ts                 # Pedidos multicanal
│   │   │   ├── Mesa.ts                   # Mesas con estado y pedido actual
│   │   │   ├── Ingrediente.ts            # Ingredientes con alergenos UE
│   │   │   └── TicketCocina.ts           # Tickets de cocina
│   │   ├── services/                      # Servicios de logica de negocio
│   │   │   ├── pedidoService.ts          # Logica centralizada de pedidos
│   │   │   └── __tests__/
│   │   │       ├── pedidoService.test.ts
│   │   │       └── pedidoService.db.test.ts
│   │   ├── constants/
│   │   │   └── alergenos.ts              # 14 alergenos UE (labels, iconos, colores)
│   │   ├── context/
│   │   │   └── CartContext.tsx            # ★ Contexto del carrito (localStorage)
│   │   ├── types/
│   │   │   └── index.ts                  # Re-exports de interfaces + ApiResponse, AuthUser
│   │   ├── utils/
│   │   │   ├── logger.ts                 # Logging estructurado
│   │   │   ├── pagination.ts             # Paginacion de resultados
│   │   │   ├── rateLimiter.ts            # Rate limiting en memoria
│   │   │   ├── sanitize.ts              # Sanitizacion de inputs
│   │   │   ├── validateId.ts            # Validacion ObjectId MongoDB
│   │   │   └── __tests__/
│   │   │       ├── logger.test.ts
│   │   │       ├── pagination.test.ts
│   │   │       ├── rateLimiter.test.ts
│   │   │       ├── sanitize.test.ts
│   │   │       └── validateId.test.ts
│   │   └── hooks/
│   │       ├── useAuth.ts                # Hook de autenticacion global
│   │       └── swr/                      # ★ Hooks SWR (7 hooks)
│   │           ├── index.ts             # Re-exports
│   │           ├── fetcher.ts           # authFetcher con JWT
│   │           ├── useIngredientes.ts   # 5s refresh
│   │           ├── useProductos.ts      # 5s refresh
│   │           ├── useMesas.ts          # 5s refresh
│   │           ├── usePedidos.ts        # 5s refresh (paginado)
│   │           ├── useReportes.ts       # 5s refresh
│   │           ├── useUsuarios.ts       # Sin refresh
│   │           └── usePublicProductos.ts # 60s refresh (sin auth)
│   │
│   ├── assets/                             # Assets importados (CSS/fonts)
│   └── middleware.ts                       # ★ Middleware Edge: JWT /dashboard/*
│
├── Dockerfile                              # Imagen Docker standalone
├── docker-compose.yml                     # Docker: app + MongoDB
├── next.config.ts                         # Config Next.js (output: standalone)
├── tailwind.config.ts                     # Config Tailwind CSS
├── vitest.config.ts                       # Config Vitest
├── playwright.config.ts                   # Config Playwright
├── tsconfig.json                          # Config TypeScript
├── postcss.config.mjs                     # Config PostCSS
├── next-env.d.ts                          # Tipos Next.js (auto)
├── .env.example                           # Variables de entorno de ejemplo
├── mailmap                                # Mapa de autores Git
├── package.json                           # Dependencias y scripts
└── README.md                              # Documentacion principal
```

---

## Estadisticas

| Metrica | Valor |
|---------|-------|
| Archivos TypeScript/TSX | ~120 |
| Modelos Mongoose | 6 |
| API Route Handlers | 17 archivos (41 endpoints) |
| Componentes React | ~59 |
| Custom Hooks | 12 (4 dashboard + 7 SWR + 1 auth) |
| Tests unitarios | 8 archivos |
| Tests E2E | 1 archivo |
| Paginas publicas | 10 |
| Paginas dashboard | 7 |
| Imagenes publicas | ~19 |

---

## Directorios Criticos

| Directorio | Proposito |
|------------|-----------|
| `src/app/api/` | Todos los endpoints REST del backend (41 endpoints) |
| `src/app/api/public/` | Endpoints sin autenticacion para pedidos online |
| `src/app/(public)/pedir/` | Flujo completo de pedidos online (5 paginas) |
| `src/lib/models/` | Esquemas y modelos de MongoDB (fuente de verdad del dominio) |
| `src/lib/services/` | Logica de negocio centralizada (pedidoService) |
| `src/lib/context/` | CartContext para el carrito de compras |
| `src/components/dashboard/` | Componentes del panel de gestion (22 archivos) |
| `src/components/public/` | Componentes del sistema de pedidos online (4 archivos) |
| `src/lib/hooks/swr/` | Hooks SWR con auto-refresh (7 hooks) |
| `src/lib/utils/` | Utilidades transversales (seguridad, validacion, logging) |
| `src/middleware.ts` | Punto de entrada de seguridad (proteccion JWT en edge) |

---

## Puntos de Entrada

| Archivo | Tipo | Funcion |
|---------|------|---------|
| `src/app/layout.tsx` | Layout raiz | Layout principal (html, body, metadata) |
| `src/app/page.tsx` | Pagina | Landing page del restaurante |
| `src/middleware.ts` | Middleware | Interceptor JWT para rutas `/dashboard/*` |
| `src/lib/db.ts` | Conexion | Conexion singleton a MongoDB |
| `src/lib/context/CartContext.tsx` | Contexto | Carrito de compras global |

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

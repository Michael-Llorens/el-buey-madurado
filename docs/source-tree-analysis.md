# Arbol de Codigo Fuente - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

---

## Estructura General

```
el-buey-madurado/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI: typecheck + build en PR a main y push a develop
├── docs/                             # Documentacion del proyecto (project_knowledge)
│   ├── index.md                      # Indice maestro
│   ├── project-overview.md           # Resumen del proyecto
│   ├── architecture.md               # Arquitectura del sistema
│   ├── api-contracts.md              # 43 endpoints documentados
│   ├── data-models.md                # 6 modelos Mongoose
│   ├── component-inventory.md        # ~100 archivos inventariados
│   ├── source-tree-analysis.md       # Este archivo
│   ├── development-guide.md          # Guia de desarrollo
│   ├── deployment-guide.md           # Guia de despliegue
│   ├── auditoria-el-buey-madurado.md # Auditoria manual
│   ├── plan-mejoras-el-buey-madurado.md
│   └── seguimiento-mejoras-el-buey-madurado.md
├── e2e/                              # Tests end-to-end (Playwright)
├── public/                           # Assets estaticos
│   ├── data/
│   │   └── productos.json            # Productos para pagina publica /pedir
│   ├── icons/                        # Iconos PWA
│   ├── images/                       # Imagenes del sitio
│   └── manifest.webmanifest          # PWA manifest
├── src/                              # Codigo fuente principal
│   ├── app/                          # Next.js App Router (paginas + API)
│   ├── assets/                       # Assets importados por componentes
│   ├── components/                   # Componentes React
│   ├── data/                         # Datos semilla (ingredientes, productos)
│   ├── lib/                          # Logica compartida (modelos, hooks, utils)
│   └── middleware.ts                 # Edge middleware (proteccion /dashboard/*)
├── Dockerfile                        # Build multi-stage (node:20-alpine)
├── docker-compose.yml                # App + MongoDB 7 + Mongo Express
├── next.config.ts                    # output: "standalone"
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript strict, paths @/*
├── vitest.config.ts                  # Unit tests
├── playwright.config.ts              # E2E tests (chromium)
├── package.json                      # Scripts y dependencias
└── postcss.config.mjs                # PostCSS + Tailwind
```

---

## Directorio `src/app/` — Paginas y API

```
src/app/
├── layout.tsx                        # ENTRY: Root layout (metadata SEO, PWA, Analytics)
├── RootLayoutContent.tsx             # Client layout: Navbar, Footer, SW, banners
├── page.tsx                          # / → Home (Hero + Marquee + Galeria + Contacto)
├── globals.css                       # Estilos globales
├── login/
│   └── page.tsx                      # /login → Login admin
│
├── (public)/                         # Route group: paginas publicas
│   ├── layout.tsx                    # CartProvider wrapper
│   ├── globals.css                   # Estilos publicos
│   ├── carta/
│   │   ├── page.tsx                  # /carta → Carta con slides por categoria
│   │   └── carta.css
│   ├── contacto/
│   │   └── page.tsx                  # /contacto → Auto-scroll a contacto
│   ├── reservas/
│   │   └── page.tsx                  # /reservas → iframe CoverManager
│   ├── sobre-nosotros/
│   │   └── page.tsx                  # /sobre-nosotros → Historia, museo, equipo
│   ├── admin/                        # (vacio)
│   └── pedir/                        # Sistema de pedidos online
│       ├── page.tsx                  # /pedir → Catalogo con carrito
│       ├── carrito/
│       │   └── page.tsx              # /pedir/carrito → Redirect
│       ├── checkout/
│       │   └── page.tsx              # /pedir/checkout → Datos + Stripe
│       ├── confirmacion/
│       │   └── [id]/
│       │       └── page.tsx          # /pedir/confirmacion/[id] → Post-pago
│       └── seguimiento/
│           └── [id]/
│               └── page.tsx          # /pedir/seguimiento/[id] → Tracking
│
├── (dashboard)/                      # Route group: panel de administracion
│   ├── layout.tsx                    # ProtectedRoute + Toaster
│   └── dashboard/
│       ├── page.tsx                  # /dashboard → AdminPanel (modulos via URL)
│       ├── mesas/
│       │   └── page.tsx              # /dashboard/mesas → MesasPanel
│       ├── pedidos/
│       │   └── page.tsx              # /dashboard/pedidos → Redirect a /dashboard
│       ├── usuarios/
│       │   └── page.tsx              # /dashboard/usuarios → UsuariosPanel
│       ├── ingredientes/
│       │   └── layout.tsx            # Placeholder "en construccion"
│       ├── productos/
│       │   └── layout.tsx            # Placeholder "en construccion"
│       └── tickets-cocina/
│           └── layout.tsx            # Placeholder "en construccion"
│
└── api/                              # API Routes (43 endpoints)
    ├── auth/
    │   ├── login/route.ts            # POST login
    │   ├── logout/route.ts           # POST logout
    │   ├── me/route.ts               # GET me
    │   └── register/route.ts         # POST register (admin only)
    ├── ingredientes/
    │   ├── route.ts                  # GET list, POST create
    │   └── [id]/route.ts             # GET, PUT, DELETE by id
    ├── mesas/
    │   ├── route.ts                  # GET list, POST create
    │   ├── [id]/route.ts             # PUT, DELETE by id
    │   └── seed/route.ts             # POST seed 15 mesas
    ├── pedidos/
    │   ├── route.ts                  # GET list (paginado), POST create
    │   ├── abrir/route.ts            # POST abrir pedido para mesa
    │   └── [id]/
    │       ├── route.ts              # GET, PUT, DELETE by id
    │       └── cobrar/route.ts       # PUT cobrar pedido
    ├── productos/
    │   ├── route.ts                  # GET, POST, PUT, DELETE (id en body/query)
    │   └── [id]/route.ts             # GET, PUT, DELETE by id (roles estrictos)
    ├── public/                       # Sin autenticacion
    │   ├── productos/route.ts        # GET productos disponibles
    │   ├── pedidos/
    │   │   ├── route.ts              # POST crear pedido publico
    │   │   └── [id]/route.ts         # GET estado pedido
    │   └── checkout/
    │       ├── route.ts              # POST crear Stripe PaymentIntent
    │       └── confirm/route.ts      # POST confirmar pago y crear pedido
    ├── tickets-cocina/
    │   ├── route.ts                  # GET list, POST create
    │   └── [id]/route.ts             # GET, PUT by id
    ├── usuarios/
    │   ├── route.ts                  # GET list, POST create (admin)
    │   └── [id]/route.ts             # GET, PUT, DELETE by id (admin)
    └── reportes/
        └── route.ts                  # GET dashboard reportes (agregaciones)
```

---

## Directorio `src/components/` — Componentes React

```
src/components/
├── dashboard/                        # 21 componentes + 4 hooks del dashboard
│   ├── DashboardShell.tsx            # Shell principal con sidebar
│   ├── MesaCard.tsx                  # Card de mesa individual
│   ├── MesaGrid.tsx                  # Grid de mesas
│   ├── MesaForm.tsx                  # CRUD mesa
│   ├── MesaMapView.tsx               # Vista mapa del restaurante
│   ├── StockPanel.tsx                # Panel stock (productos + ingredientes)
│   ├── CobrarModal.tsx               # Modal de cobro
│   ├── ConfirmModal.tsx              # Modal de confirmacion reutilizable
│   ├── ProductoForm.tsx              # CRUD producto
│   ├── ProductoList.tsx              # Tabla productos (legacy)
│   ├── ProductCardGrid.tsx           # Grid cards productos
│   ├── IngredienteForm.tsx           # CRUD ingrediente (14 alergenos UE)
│   ├── IngredienteList.tsx           # Lista ingredientes responsive
│   ├── IngredientCardGrid.tsx        # Grid cards ingredientes
│   ├── PedidoForm.tsx                # Formulario pedido completo
│   ├── PedidoCard.tsx                # Card pedido con flujo estados
│   ├── PedidoPanel.tsx               # Panel Kanban pedidos
│   ├── CocinaPanel.tsx               # Vista cocina con alergenos y sonido
│   ├── ReportesPanel.tsx             # Panel reportes con PDF/Excel
│   ├── ButtonGrid.tsx                # Botones accion rapida
│   ├── PersonalizarProductoModal.tsx # Modal personalizar (dashboard)
│   └── hooks/
│       ├── useConfirm.ts             # Confirm modal Promise-based
│       ├── useProductoForm.ts        # Logica form producto
│       ├── usePedidoForm.ts          # Logica form pedido
│       ├── usePedidoPanel.ts         # Logica panel pedidos
│       └── __tests__/               # Tests de hooks
│
├── public/                           # 5 componentes de pedido online
│   ├── ProductoCard.tsx              # Card producto publico
│   ├── PersonalizarModal.tsx         # Modal personalizacion publico
│   ├── CartDrawer.tsx                # Drawer carrito
│   ├── CartSummaryBar.tsx            # Barra resumen carrito
│   └── StripePaymentForm.tsx         # Formulario pago Stripe
│
├── Home/                             # 4 componentes de la home
│   ├── HeroSectionHome.tsx
│   ├── Marquee.tsx
│   ├── GallerySection.tsx
│   └── ContactSection.tsx
│
├── Navbar/                           # 3 componentes
│   ├── Navbar.tsx
│   ├── NavLink.tsx
│   └── Logo.tsx
│
├── Footer/                           # 7 archivos (2 duplicados con typo)
│   ├── Footer.tsx
│   ├── FooterBottom.tsx
│   ├── FooterLegal.tsx
│   ├── FooterHorario.tsx
│   ├── FooterSocial.tsx
│   ├── SocialButtom.tsx              # ⚠ Typo (importado)
│   └── SocialButton.tsx              # Duplicado (no importado)
│
├── SobreNosotros/                    # 6 archivos (1 duplicado con typo)
│   ├── HeroSectionSobreNosotros.tsx
│   ├── HistoriaYValores.tsx
│   ├── MuseoCarne.tsx
│   ├── GoogleReviews.tsx
│   ├── Esquipo.tsx                   # ⚠ Typo (importado)
│   └── Equipo.tsx                    # Duplicado (no importado)
│
├── Reservas/
│   └── reservas.tsx                  # iframe CoverManager
│
├── ui/                               # 5 componentes reutilizables
│   ├── Button.tsx                    # Variantes + tamanos
│   ├── OfflineBanner.tsx             # Banner offline
│   ├── FirstVisitNotice.tsx          # Modal primera visita
│   ├── WhatsAppButton.tsx            # ⚠ Actualmente = ReservasButton
│   └── ReservasButton.tsx            # Boton flotante reservar
│
└── ProtectedRoute.tsx                # HOC auth + roles
```

---

## Directorio `src/lib/` — Logica Compartida

```
src/lib/
├── api.ts                            # apiFetch() - helper server-side
├── apiClient.ts                      # apiRequest() + wrappers CRUD por recurso
├── auth.ts                           # generateToken() + verifyToken() (JWT 7d)
├── db.ts                             # Conexion singleton MongoDB/Mongoose
├── menu.ts                           # Datos estaticos del menu (/carta)
├── middlewareAuth.ts                  # protegerRuta() + verificarRol()
├── middleware.ts → src/middleware.ts  # Edge middleware (jose)
│
├── constants/
│   └── alergenos.ts                  # 14 alergenos UE + labels/iconos/colores
│
├── context/
│   └── CartContext.tsx                # CartProvider + useCart() (localStorage)
│
├── hooks/
│   ├── useAuth.ts                    # Login, logout, verificacion token
│   └── swr/
│       ├── fetcher.ts                # authFetcher<T> generico
│       ├── index.ts                  # Barrel exports
│       ├── useIngredientes.ts        # SWR 5s
│       ├── useProductos.ts           # SWR 5s
│       ├── useMesas.ts              # SWR 5s
│       ├── usePedidos.ts            # SWR 5s (paginado)
│       ├── useUsuarios.ts           # SWR sin refresh
│       ├── useReportes.ts           # SWR 5s
│       └── usePublicProductos.ts    # SWR 60s (sin auth)
│
├── models/
│   ├── Usuario.ts                    # Auth + roles + bcrypt
│   ├── Producto.ts                   # Menu + ingredientes + extras
│   ├── Pedido.ts                     # Pedidos multi-tipo + estados
│   ├── Mesa.ts                       # Mesas con estado en tiempo real
│   ├── Ingrediente.ts                # Stock + alergenos UE
│   └── TicketCocina.ts              # Tickets para cocina
│
├── services/
│   ├── pedidoService.ts              # normalizarPedido, ocupar/liberarMesa
│   └── __tests__/                    # Tests de servicios
│
├── types/
│   └── index.ts                      # Re-exports interfaces + ApiResponse<T>
│
└── utils/
    ├── logger.ts                     # Logger dev/prod
    ├── pagination.ts                 # Paginacion API
    ├── rateLimiter.ts                # Rate limit in-memory
    ├── sanitize.ts                   # Anti-XSS
    └── validateId.ts                 # Validador ObjectId
```

---

## Estadisticas

| Metrica | Valor |
|---|---|
| Archivos TypeScript/TSX | ~120 |
| Componentes React | ~62 |
| API Route files | 19 |
| Modelos Mongoose | 6 |
| Hooks SWR | 9 |
| Hooks custom (dashboard) | 4 |
| Paginas (pages) | 15 |
| Layouts | 7 |
| Utilidades | 5 |
| Tests (unit) | src/**/*.test.ts |
| Tests (E2E) | e2e/ (Playwright) |

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

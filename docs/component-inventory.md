# Inventario de Componentes - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Resumen

- **Total archivos:** ~100 (componentes, hooks, paginas, utilidades, contextos, servicios)
- **Componentes React:** ~62
- **Hooks:** 14 (4 dashboard + 9 SWR + 1 auth)
- **Paginas:** 15 pages + 7 layouts
- **Patron SWR:** Refresh 5s en dashboard, 60s en publico

---

## 1. Componentes Dashboard (`src/components/dashboard/`)

### Componentes Principales (21)

| Componente | Descripcion | Props clave | Patrones |
|---|---|---|---|
| `DashboardShell` | Shell principal con sidebar responsivo y navegacion por modulos | `children`, `moduloActivo`, `onModuloChange` | Sidebar con roles, badge pedidos pendientes, CldImage |
| `MesaCard` | Tarjeta de mesa con estado visual y acciones contextuales | `mesa`, `onEditar`, `onEliminar`, `onCambiarEstado`, `onHacerPedido` | Colores por estado, barra de ocupacion |
| `MesaGrid` | Grid responsivo de MesaCards | `mesas[]`, callbacks CRUD | Grid layout |
| `MesaForm` | Formulario crear/editar mesa | `mesa?`, `onGuardar`, `onCancelar` | Formulario controlado, fetch con token |
| `MesaMapView` | Vista mapa del restaurante con sillas y semaforo de tiempo | `mesas[]`, `onHacerPedido`, `onCambiarEstado` | Re-render 60s, forma segun capacidad |
| `StockPanel` | Panel de stock con tabs (productos/ingredientes), filtros y CRUD | Autocontenido | SWR, tabs, filtros multiples |
| `CobrarModal` | Modal de cobro con metodos de pago y calculo de cambio | `pedido`, `onClose`, `onCobrado` | Subcuentas, botones rapidos efectivo |
| `ConfirmModal` | Modal confirmacion reutilizable (danger/warning/info) | `open`, `titulo`, `mensaje`, `variante` | Modal overlay, CldImage |
| `ProductoForm` | Formulario producto con ingredientes, imagen y personalizacion | `producto?`, `onGuardar`, `onCancelar` | Delega a `useProductoForm` |
| `ProductoList` | Tabla de productos (legacy) | `productos[]`, `onEliminar` | Tabla HTML |
| `ProductCardGrid` | Grid de cards de productos con imagen y acciones | `productos[]`, `onEditar`, `onEliminar` | Grid responsivo, iconos categoria |
| `IngredienteForm` | Formulario ingrediente con 14 alergenos UE | `ingrediente?`, `onGuardar`, `onCancelar` | Toggle visual alergenos |
| `IngredienteList` | Lista ingredientes con tabla desktop y cards mobile | `onEliminar?` | SWR, responsive |
| `IngredientCardGrid` | Grid cards de ingredientes con inventario y precios | `ingredientes[]`, `onEditar`, `onEliminar` | Calculo valor total stock |
| `PedidoForm` | Formulario pedido: tipo, catalogo, carrito, personalizacion | `onGuardar`, `onCancelar`, `modo`, `pedidoId?`, `mesaIdPreseleccionada?` | Delega a `usePedidoForm`, catalogo 2 pasos |
| `PedidoCard` | Card de pedido con estado, tiempo, productos y flujo | `pedido`, `onCambiarEstado`, `onEliminar`, `onCobrar?` | Semaforo urgencia, URL WhatsApp |
| `PedidoPanel` | Panel Kanban de pedidos con columnas, filtros y ticket PDF | Autocontenido | jsPDF 80mm, kanban, SWR |
| `CocinaPanel` | Vista cocina Kanban con estado por plato, alergenos y sonido | Autocontenido | 3 fetches paralelos, refresh 5s, AudioContext |
| `ReportesPanel` | Panel reportes con KPIs, graficos y exportacion PDF/Excel | Autocontenido | SWR, jsPDF, xlsx |
| `ButtonGrid` | Botones de accion rapida para stock | `setModo` | Grid con gradientes |
| `PersonalizarProductoModal` | Modal dashboard para extras y quitar ingredientes | `producto`, `cantidad`, `onConfirmar`, `onCancelar` | SWR ingredientes |

### Hooks del Dashboard (`src/components/dashboard/hooks/`)

| Hook | Descripcion | Dependencias |
|---|---|---|
| `useConfirm()` | Reemplaza window.confirm() por modal Promise-based | Ninguna |
| `useProductoForm()` | Logica formulario producto: estado, ingredientes, imagen base64 | `useIngredientes` |
| `usePedidoForm()` | Logica formulario pedido: productos, personalizacion, totales | `useMesas`, `useProductos` |
| `usePedidoPanel()` | Logica panel pedidos: CRUD, filtros, sonido alerta | `usePedidos`, `useConfirm` |

---

## 2. Componentes Publicos (`src/components/public/`)

| Componente | Descripcion | Props clave | Patrones |
|---|---|---|---|
| `ProductoCard` | Card producto publico con imagen, alergenos y controles +/- | `producto`, `onAnadir`, `enCarrito?` | Gradiente por categoria, badge "Personalizable" |
| `PersonalizarModal` | Modal publico: punto de carne, quitar/anadir ingredientes, notas | `producto`, `onConfirm`, `onClose` | Bottom-sheet mobile, punto de carne condicional |
| `CartDrawer` | Drawer lateral del carrito con items y link a checkout | `open`, `onClose` | Slide-in, bloqueo scroll |
| `CartSummaryBar` | Barra fija inferior con resumen del carrito | Autocontenido | Fixed bottom, oculta si vacio |
| `StripePaymentForm` | Formulario pago Stripe Elements, confirma y crea pedido | `total`, `paymentIntentId`, `onSuccess`, `onError` | PaymentElement, confirmacion 2 pasos |

---

## 3. Componentes Home (`src/components/Home/`)

| Componente | Descripcion | Patrones |
|---|---|---|
| `HeroSectionHome` | Hero con video de fondo, titulo animado y CTA a /carta | Video autoplay |
| `Marquee` | Marquesina horizontal infinita (burger del mes) | CSS animation |
| `GallerySection` | Galeria con crossfade desktop y scroll mobile con ping-pong | Shuffle, requestAnimationFrame |
| `ContactSection` | Contacto: WhatsApp, telefono, email, Google Maps, resenas | iframe Google Maps |

---

## 4. Componentes Navbar (`src/components/Navbar/`)

| Componente | Descripcion |
|---|---|
| `Navbar` | Barra fija con menu desktop, hamburguesa mobile, link "Pedir Online" |
| `NavLink` | Link con estado activo segun pathname |
| `Logo` | Logo animado con Cloudinary y texto |

---

## 5. Componentes Footer (`src/components/Footer/`)

| Componente | Descripcion | Nota |
|---|---|---|
| `Footer` | Contenedor layout mobile/desktop | — |
| `FooterBottom` | Copyright con ano dinamico | — |
| `FooterLegal` | Links legales (terminos, privacidad, cookies) | — |
| `FooterHorario` | Horarios y boton de llamar | — |
| `FooterSocial` | Botones Instagram y TikTok | — |
| `SocialButtom` | Boton social con borde animado | Typo en nombre (el importado) |
| `SocialButton` | Duplicado corregido (no importado) | Duplicado |

---

## 6. Componentes Sobre Nosotros (`src/components/SobreNosotros/`)

| Componente | Descripcion | Nota |
|---|---|---|
| `HeroSectionSobreNosotros` | Hero fullscreen con imagen y titulo bienestar animal | framer-motion |
| `HistoriaYValores` | Historia, valores y estadisticas | framer-motion scroll |
| `MuseoCarne` | Showcase de piezas (Lomo alto, Wagyu, etc.) | framer-motion |
| `GoogleReviews` | Carrusel resenas Google con autoplay 5s | AnimatePresence |
| `Equipo` | Grid de propietarios (Josep y Miguel) | Duplicado no importado |
| `Esquipo` | Mismo contenido que Equipo | Typo, es el importado |

---

## 7. Componentes UI Reutilizables (`src/components/ui/`)

| Componente | Descripcion | Nota |
|---|---|---|
| `Button` | Boton con variantes (primary, secondary, primary_carta, secondary_carta) y tamanos | — |
| `OfflineBanner` | Banner fijo cuando se pierde conexion | Event listeners online/offline |
| `FirstVisitNotice` | Modal primera visita con horarios especiales | localStorage |
| `WhatsAppButton` | Exporta `ReservasButton` (contenido identico) | Mismo codigo que ReservasButton |
| `ReservasButton` | Boton flotante "Reservar" → /reservas | — |

---

## 8. Componentes Reservas y ProtectedRoute

| Componente | Descripcion |
|---|---|
| `Reservas` | iframe CoverManager para reservas online |
| `ProtectedRoute` | HOC: verifica auth y roles, redirige si no autorizado |

---

## 9. Hooks SWR (`src/lib/hooks/swr/`)

| Hook | Endpoint | Refresh | Auth |
|---|---|---|---|
| `useIngredientes()` | `/api/ingredientes` | 5s | Si |
| `useProductos()` | `/api/productos` | 5s | Si |
| `useMesas()` | `/api/mesas` | 5s | Si |
| `usePedidos()` | `/api/pedidos` | 5s | Si |
| `useUsuarios()` | `/api/usuarios` | Sin refresh | Si |
| `useReportes()` | `/api/reportes` | 5s | Si |
| `usePublicProductos()` | `/api/public/productos` | 60s | No |
| `authFetcher<T>()` | Generico | N/A | Si (token de localStorage) |

---

## 10. Hook de Autenticacion

| Hook | Descripcion |
|---|---|
| `useAuth()` | Login, logout, verificacion token via /api/auth/me. localStorage + fetch |

---

## 11. Contexto (`src/lib/context/`)

| Contexto | Descripcion | Persistencia |
|---|---|---|
| `CartProvider` / `useCart()` | Carrito publico: items, add/remove/update, total, tipoPedido | localStorage |

---

## 12. Servicios (`src/lib/services/`)

| Servicio | Exports | Descripcion |
|---|---|---|
| `pedidoService.ts` | `normalizarPedido()`, `ocuparMesa()`, `liberarMesa()`, `abrirPedidoParaMesa()` | Logica server-side de pedidos y mesas |

---

## 13. Utilidades (`src/lib/utils/`)

| Utilidad | Exports | Descripcion |
|---|---|---|
| `logger.ts` | `logger` | Logger (log/warn solo en dev, error siempre) |
| `pagination.ts` | `getPaginationParams()`, `buildPaginatedResponse()` | Paginacion para API routes |
| `rateLimiter.ts` | `checkRateLimit()` | Rate limiter in-memory por IP |
| `sanitize.ts` | `sanitizeString()`, `sanitizeBody<T>()` | Anti-XSS recursivo |
| `validateId.ts` | `validarObjectId()` | Validador MongoDB ObjectId |

---

## 14. Constantes (`src/lib/constants/`)

| Archivo | Exports |
|---|---|
| `alergenos.ts` | `ALERGENOS_UE` (14), `AlergenoUE`, `ALERGENOS_LABELS`, `ALERGENOS_ICONOS`, `ALERGENOS_COLORES`, `getAlergenosProducto()` |

---

## 15. API Client (`src/lib/apiClient.ts`)

| Export | Descripcion |
|---|---|
| `fetchWithToken()` | Fetch con token JWT de localStorage |
| `apiRequest<T>()` | Wrapper tipado para API calls |
| `ingredientesApi` | CRUD ingredientes |
| `productosApi` | CRUD productos |
| `mesasApi` | CRUD mesas |
| `pedidosApi` | CRUD pedidos |
| `authApi` | Login, logout, me |

---

## 16. Paginas

### Paginas Publicas (11)

| Pagina | Ruta | Descripcion |
|---|---|---|
| `Home` | `/` | Hero + Marquee + Galeria + Contacto |
| `CartaPage` | `/carta` | Carta con slides por categoria |
| `ContactoPage` | `/contacto` | Auto-scroll a seccion contacto |
| `ReservasPage` | `/reservas` | iframe CoverManager |
| `SobreNosotrosPage` | `/sobre-nosotros` | Historia, museo, equipo, resenas |
| `PedirPage` | `/pedir` | Catalogo online con carrito y personalizacion |
| `CarritoPage` | `/pedir/carrito` | Redirect a /pedir o /pedir/checkout |
| `CheckoutPage` | `/pedir/checkout` | Checkout 2 pasos: datos + Stripe |
| `ConfirmacionPage` | `/pedir/confirmacion/[id]` | Confirmacion post-pago |
| `SeguimientoPage` | `/pedir/seguimiento/[id]` | Tracking tiempo real con timeline |
| `LoginPage` | `/login` | Login admin con redireccion por rol |

### Paginas Dashboard (4 activas + 3 placeholder)

| Pagina | Ruta | Descripcion |
|---|---|---|
| `AdminPanel` | `/dashboard` | Orquesta modulos via URL params |
| `MesasPanel` | `/dashboard/mesas` | CRUD mesas con vista lista y mapa |
| `UsuariosPanel` | `/dashboard/usuarios` | CRUD usuarios con tabla |
| Redirect | `/dashboard/pedidos` | Redirige a /dashboard |
| Placeholder | `/dashboard/ingredientes` | "Pagina en construccion" |
| Placeholder | `/dashboard/productos` | "Pagina en construccion" |
| Placeholder | `/dashboard/tickets-cocina` | "Pagina en construccion" |

### Layouts (7)

| Layout | Ruta | Descripcion |
|---|---|---|
| `RootLayout` | `/` | Metadata SEO, PWA, Vercel Analytics |
| `RootLayoutContent` | `/` | Navbar, Footer, WhatsApp, OfflineBanner, SW |
| `PublicLayout` | `/(public)` | CartProvider wrapper |
| `DashboardLayout` | `/(dashboard)` | ProtectedRoute + Toaster |
| Layout ingredientes | `/(dashboard)/dashboard/ingredientes` | Placeholder |
| Layout productos | `/(dashboard)/dashboard/productos` | Placeholder |
| Layout tickets-cocina | `/(dashboard)/dashboard/tickets-cocina` | Placeholder |

---

## Hallazgos Notables

1. **Archivos duplicados con typo:** `SocialButtom.tsx`/`SocialButton.tsx` y `Esquipo.tsx`/`Equipo.tsx` — el codigo importa las versiones con typo
2. **WhatsAppButton sobrescrito:** Contenido actual identico a `ReservasButton.tsx`
3. **Carga de productos dual:** Dashboard usa API (SWR), pagina publica `/pedir` usa JSON estatico (`public/data/productos.json`)
4. **PWA:** Service Worker en produccion, OfflineBanner, manifest.webmanifest
5. **Stripe integrado:** Checkout con PaymentIntent en 2 pasos (crear intent → confirmar pago → crear pedido)

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

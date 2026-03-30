# Inventario de Componentes - El Buey Madurado

**Fecha de generacion:** 2026-03-30

---

## Resumen

| Categoria | Cantidad |
|-----------|----------|
| Dashboard - Paneles | 5 |
| Dashboard - Formularios | 4 |
| Dashboard - Tarjetas/Grids | 7 |
| Dashboard - Modales | 3 |
| Dashboard - Listas | 2 |
| Dashboard - Shell | 1 |
| Dashboard - Hooks | 4 |
| Pedidos Online (public/) | 4 |
| Home (landing) | 4 |
| Navbar | 3 |
| Footer | 6 |
| Sobre Nosotros | 6 |
| Reservas | 1 |
| UI reutilizables | 5 |
| Proteccion | 1 |
| Layout | 3 |
| **Total** | **~59** |

---

## 1. Componentes del Dashboard (`src/components/dashboard/`)

### Paneles (Vistas principales)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `DashboardShell` | `DashboardShell.tsx` | Contenedor principal del dashboard con sidebar, navegacion lateral y header |
| `PedidoPanel` | `PedidoPanel.tsx` | Panel de gestion de pedidos con filtrado por turno (actual/historial), tipo y estado. Grid de 5 columnas. |
| `CocinaPanel` | `CocinaPanel.tsx` | Panel de tickets de cocina para cocineros con prioridades y estados |
| `StockPanel` | `StockPanel.tsx` | Panel de gestion de inventario con tabs (productos/ingredientes), busqueda por texto, filtros por categoria y disponibilidad |
| `ReportesPanel` | `ReportesPanel.tsx` | Panel de reportes con metricas agregadas, top productos, ingresos diarios y distribucion por tipo/estado |

### Formularios

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `PedidoForm` | `PedidoForm.tsx` | Formulario de creacion/edicion de pedidos multicanal (local/recoger/domicilio) |
| `ProductoForm` | `ProductoForm.tsx` | Formulario CRUD de productos con ingredientes vinculados y configuracion de extras |
| `IngredienteForm` | `IngredienteForm.tsx` | Formulario CRUD de ingredientes con alergenos UE, inventario y precios |
| `MesaForm` | `MesaForm.tsx` | Formulario CRUD de mesas con capacidad y estado |

### Tarjetas y Grids

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `PedidoCard` | `PedidoCard.tsx` | Tarjeta compacta de pedido con: estado con color, tipo con icono/badge, tiempo con indicador de urgencia (ok/warn/danger), productos (max 3), total, camarero, acciones en 2 filas (siguiente estado + WhatsApp, editar + ver + cancelar) |
| `ProductCardGrid` | `ProductCardGrid.tsx` | Grid de tarjetas de productos con imagen, precio y estado |
| `IngredientCardGrid` | `IngredientCardGrid.tsx` | Grid de tarjetas de ingredientes con inventario y alergenos |
| `MesaGrid` | `MesaGrid.tsx` | Grid de mesas con estado visual (libre/ocupada/reservada) |
| `MesaCard` | `MesaCard.tsx` | Tarjeta de mesa individual con comensales y acciones |
| `MesaMapView` | `MesaMapView.tsx` | Vista de mapa/plano interactivo de mesas |
| `ButtonGrid` | `ButtonGrid.tsx` | Grid de botones de accion rapida |

### Modales

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `ConfirmModal` | `ConfirmModal.tsx` | Modal de confirmacion generico reutilizable (via hook `useConfirm`) |
| `CobrarModal` | `CobrarModal.tsx` | Modal de cobro de pedido con metodo de pago y calculo de cambio |
| `PersonalizarProductoModal` | `PersonalizarProductoModal.tsx` | Modal para personalizar productos en pedido (extras, quitar ingredientes) |

### Listas

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `ProductoList` | `ProductoList.tsx` | Lista completa de productos con busqueda y filtros |
| `IngredienteList` | `IngredienteList.tsx` | Lista completa de ingredientes con busqueda |

---

## 2. Hooks del Dashboard (`src/components/dashboard/hooks/`)

| Hook | Archivo | Tests | Descripcion |
|------|---------|-------|-------------|
| `usePedidoForm` | `usePedidoForm.ts` | Si | Logica del formulario de pedido: gestion de productos, calculos de totales, validacion |
| `usePedidoPanel` | `usePedidoPanel.ts` | Si | Logica del panel de pedidos: filtrado por turno actual/historial, tipo, estado, acciones sobre pedidos |
| `useProductoForm` | `useProductoForm.ts` | Si | Logica del formulario de producto: ingredientes, extras, validacion |
| `useConfirm` | `useConfirm.ts` | No | Hook para modal de confirmacion reutilizable (confirmar/cancelar async) |

---

## 3. Componentes de Pedidos Online (`src/components/public/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `ProductoCard` | `ProductoCard.tsx` | Tarjeta de producto para el catalogo publico con imagen, precio, alergenos y boton de anadir |
| `PersonalizarModal` | `PersonalizarModal.tsx` | Modal publico de personalizacion: seleccionar extras, quitar ingredientes, notas |
| `CartDrawer` | `CartDrawer.tsx` | Drawer lateral del carrito de compra con lista de items, cantidades, personalizaciones y total |
| `CartSummaryBar` | `CartSummaryBar.tsx` | Barra flotante inferior con resumen del carrito (items, total) y enlace al carrito |

---

## 4. Componentes de la Landing / Home (`src/components/Home/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `HeroSectionHome` | `HeroSectionHome.tsx` | Seccion hero con video MP4 de fondo, titulo y CTA |
| `GallerySection` | `GallerySection.tsx` | Galeria animada de imagenes del restaurante |
| `Marquee` | `Marquee.tsx` | Marquee animado (texto en movimiento) |
| `ContactSection` | `ContactSection.tsx` | Seccion de contacto con mapa y datos |

---

## 5. Navbar (`src/components/Navbar/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `Navbar` | `Navbar.tsx` | Barra de navegacion principal responsive |
| `NavLink` | `NavLink.tsx` | Enlace de navegacion con estado activo |
| `Logo` | `Logo.tsx` | Logotipo del restaurante |

---

## 6. Footer (`src/components/Footer/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `Footer` | `Footer.tsx` | Pie de pagina completo |
| `FooterBottom` | `FooterBottom.tsx` | Parte inferior del footer (copyright) |
| `FooterHorario` | `FooterHorario.tsx` | Horarios del restaurante |
| `FooterLegal` | `FooterLegal.tsx` | Enlaces legales |
| `FooterSocial` | `FooterSocial.tsx` | Redes sociales |
| `SocialButton` / `SocialButtom` | `SocialButton.tsx` / `SocialButtom.tsx` | Botones de redes sociales |

---

## 7. Sobre Nosotros (`src/components/SobreNosotros/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `HeroSectionSobreNosotros` | `HeroSectionSobreNosotros.tsx` | Seccion hero de la pagina Sobre Nosotros |
| `HistoriaYValores` | `HistoriaYValores.tsx` | Historia y valores del restaurante |
| `Equipo` / `Esquipo` | `Equipo.tsx` / `Esquipo.tsx` | Equipo del restaurante |
| `MuseoCarne` | `MuseoCarne.tsx` | Seccion del museo de carne |
| `GoogleReviews` | `GoogleReviews.tsx` | Resenas de Google del restaurante |

---

## 8. Reservas (`src/components/Reservas/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `reservas` | `reservas.tsx` | Componente de reservas (enlace externo TheFork) |

---

## 9. Componentes UI Reutilizables (`src/components/ui/`)

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `Button` | `Button.tsx` | Boton generico reutilizable con variantes |
| `ReservasButton` | `ReservasButton.tsx` | Boton flotante de reservas |
| `WhatsAppButton` | `WhatsAppButton.tsx` | Boton flotante de WhatsApp |
| `FirstVisitNotice` | `FirstVisitNotice.tsx` | Aviso para primera visita del usuario |
| `OfflineBanner` | `OfflineBanner.tsx` | Banner de deteccion de estado offline (PWA) |

---

## 10. Componentes de Proteccion

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `ProtectedRoute` | `ProtectedRoute.tsx` | HOC que protege rutas verificando autenticacion |

---

## 11. Layouts y Root

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `RootLayoutContent` | `app/RootLayoutContent.tsx` | Contenido del layout raiz (Sonner toaster, etc.) |
| Layout publico | `app/(public)/layout.tsx` | Layout con Navbar + Footer + CartProvider |
| Layout dashboard | `app/(dashboard)/layout.tsx` | Layout con DashboardShell (sidebar) |

---

## 12. Hooks Globales

### Autenticacion
| Hook | Archivo | Descripcion |
|------|---------|-------------|
| `useAuth` | `src/lib/hooks/useAuth.ts` | Estado de autenticacion global: login, logout, usuario actual |

### SWR Data Fetching (`src/lib/hooks/swr/`)

| Hook | Endpoint | Refresh | Descripcion |
|------|----------|---------|-------------|
| `useIngredientes` | `/api/ingredientes` | 5s | Lista de ingredientes |
| `useProductos` | `/api/productos` | 5s | Lista de productos |
| `useMesas` | `/api/mesas` | 5s | Lista de mesas con pedido actual |
| `usePedidos` | `/api/pedidos` | 5s | Lista de pedidos (paginada) |
| `useReportes` | `/api/reportes` | 5s | Metricas y reportes agregados |
| `useUsuarios` | `/api/usuarios` | Sin refresh | Lista de usuarios |
| `usePublicProductos` | `/api/public/productos` | 60s | Catalogo publico sin auth |
| `authFetcher` | - | - | Fetcher generico con inyeccion JWT |

### Contextos

| Contexto | Archivo | Descripcion |
|----------|---------|-------------|
| `CartContext` / `useCart` | `src/lib/context/CartContext.tsx` | Carrito de compra con persistencia localStorage, personalizaciones, tipo de pedido |

---

## Patrones Identificados

1. **Panel + Form + Card/Grid**: Patron recurrente en el dashboard (ej: PedidoPanel → PedidoForm + PedidoCard)
2. **Hooks de formulario**: Logica de UI compleja extraida en hooks personalizados con tests
3. **Modales de confirmacion**: Patron async para acciones destructivas (`useConfirm`)
4. **SWR deduplicado con refresh**: Todos los datos del dashboard se actualizan cada 5s. SWR deduplica automaticamente si multiples componentes usan el mismo hook.
5. **Grupos de rutas**: Separacion clara entre paginas publicas y dashboard protegido con layouts independientes
6. **CartContext persistente**: El carrito usa localStorage para sobrevivir a recargas y compara personalizaciones para deduplicar items
7. **Flujos de estado por tipo**: PedidoCard implementa flujos de estados diferentes segun el tipo de pedido (local, recoger, domicilio)
8. **WhatsApp integration**: PedidoCard genera links directos a WhatsApp con mensaje preformateado segun tipo de pedido

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

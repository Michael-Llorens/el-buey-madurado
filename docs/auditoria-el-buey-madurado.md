# Auditoria Tecnica - El Buey Madurado

> **Fecha:** 2026-03-23
> **Version del proyecto:** Post-mejoras (Fases 1-7 completadas)
> **Branch:** main
> **Proposito:** Documentacion tecnica completa del estado actual del proyecto

---

## 1. Resumen del proyecto

**El Buey Madurado** es una aplicacion web full-stack para la gestion integral de un restaurante premium de carnes maduradas. Combina una web publica orientada al cliente con un panel de administracion (dashboard) para la operativa diaria del negocio.

### Tipo de aplicacion
Plataforma SaaS de gestion de restaurante con:
- **Web publica:** landing, carta interactiva, reservas, sobre nosotros, contacto
- **Dashboard privado:** gestion de mesas, pedidos (local/recoger/domicilio), productos, ingredientes, cocina en tiempo real, reportes, usuarios

### Usuarios y roles
| Rol | Acceso |
|-----|--------|
| `admin` | CRUD completo, reportes, usuarios, stock, cocina |
| `camarero` | Mesas, pedidos, cocina |
| `cocinero` | Cocina, pedidos (lectura) |

### Estado general
Proyecto **production-ready** tras 7 fases de mejora. Seguridad reforzada, tests unitarios y e2e, capa de servicios, cache SWR, dashboard de reportes, panel de cocina en tiempo real y responsive completo.

---

## 2. Stack tecnologico

### Dependencias de produccion
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Next.js (App Router) | 16.0.7 | Framework full-stack |
| React | 19.2.3 | UI |
| TypeScript (strict) | 5.9.3 | Tipado estatico |
| Tailwind CSS | 3.4.18 | Estilos utility-first |
| MongoDB | 7 (Docker) | Base de datos |
| Mongoose | 9.1.5 | ODM |
| SWR | 2.4.1 | Cache de datos, deduplicacion, polling |
| jsonwebtoken | 9.0.3 | Generacion/verificacion JWT (Node.js) |
| jose | 6.2.1 | Verificacion JWT (Edge Runtime - middleware) |
| bcryptjs | 3.0.3 | Hashing de passwords (12 salt rounds) |
| sonner | 2.0.7 | Notificaciones toast |
| Framer Motion | 12.23.25 | Animaciones |
| next-cloudinary | 6.17.5 | Gestion de imagenes |
| React Icons | 5.5.0 | Iconos |
| Vercel Analytics | 1.6.1 | Analytics |
| jwt-decode | 4.0.0 | Decodificacion JWT en cliente |

### Dependencias de desarrollo
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Vitest | 4.1.0 | Test runner unitario |
| Playwright | 1.58.2 | Tests e2e |
| @testing-library/react | 16.3.2 | Testing de hooks React |
| happy-dom | 20.8.4 | Entorno DOM ligero para tests |
| ESLint + eslint-config-next | 9.39.2 | Linting |
| cross-env | 10.1.0 | Variables de entorno cross-platform |

### Infraestructura
| Componente | Tecnologia |
|-----------|-----------|
| Contenedores | Docker + Docker Compose (multi-stage) |
| CI/CD | GitHub Actions (typecheck + build) |
| Hosting | Vercel (produccion) |
| BD en desarrollo | MongoDB 7 + Mongo Express (Docker) |
| Reservas | CoverManager (iframe embebido) |

---

## 3. Arquitectura

### Organizacion global
```
src/
├── app/
│   ├── (public)/              # Paginas publicas (carta, reservas, contacto, sobre-nosotros)
│   ├── (dashboard)/           # Dashboard protegido
│   │   └── dashboard/         # Modulos: mesas, pedidos, usuarios
│   ├── api/                   # 25 API Route handlers
│   │   ├── auth/              # login, register, logout, me
│   │   ├── ingredientes/      # CRUD
│   │   ├── mesas/             # CRUD + seed
│   │   ├── pedidos/           # CRUD + abrir
│   │   ├── productos/         # CRUD
│   │   ├── reportes/          # Agregaciones MongoDB
│   │   ├── tickets-cocina/    # CRUD
│   │   └── usuarios/          # CRUD (admin)
│   └── login/                 # Pagina de login
├── components/
│   ├── dashboard/             # 18 componentes del dashboard
│   │   └── hooks/             # 3 custom hooks extraidos
│   ├── Home/                  # Landing
│   ├── Navbar/                # Navegacion
│   ├── Footer/                # Pie de pagina
│   ├── SobreNosotros/         # Seccion sobre nosotros
│   ├── Reservas/              # Componente de reservas
│   ├── ui/                    # Componentes base
│   └── ProtectedRoute.tsx     # Guard de autenticacion
├── lib/
│   ├── auth.ts                # Utilidades JWT (getJwtSecret con throw)
│   ├── db.ts                  # Conexion MongoDB con cache serverless
│   ├── middlewareAuth.ts      # Middleware auth para API routes
│   ├── hooks/
│   │   ├── useAuth.ts         # Hook de autenticacion (login/logout/me)
│   │   └── swr/               # 7 hooks SWR + fetcher
│   ├── models/                # 6 modelos Mongoose
│   ├── services/              # Capa de servicios (pedidoService)
│   ├── types/                 # Tipos TypeScript + re-exports
│   └── utils/                 # sanitize, rateLimiter, pagination, validateId, logger
├── middleware.ts               # Edge middleware (proteccion server-side /dashboard/*)
├── data/                       # Datos estaticos del menu
└── assets/                     # Imagenes
```

### Patrones arquitectonicos
- **Route Groups** para layouts diferenciados (publico vs dashboard)
- **API Routes RESTful** con patron consistente por recurso
- **Edge Middleware** con jose para proteccion server-side de /dashboard/*
- **Capa de servicios** (pedidoService.ts) para logica de negocio
- **SWR hooks** para cache, deduplicacion y polling automatico
- **Custom hooks** para separacion de logica y presentacion en el dashboard
- **Sanitizacion centralizada** en todos los handlers POST/PUT
- **Rate limiting** en endpoints de autenticacion
- **Logger condicional** que silencia logs en produccion

---

## 4. Modelos de datos (6 modelos Mongoose)

### 4.1 Usuario
| Campo | Tipo | Validacion |
|-------|------|-----------|
| email | String | required, unique, lowercase, regex |
| password | String | required, min 6, `select: false`, bcrypt 12 |
| rol | Enum | 'admin' \| 'camarero' \| 'cocinero' |
| activo | Boolean | default: true |
| ultimoLogin | Date | opcional |

Metodo: `comparePassword()` con bcrypt.compare

### 4.2 Ingrediente
| Campo | Tipo | Validacion |
|-------|------|-----------|
| nombre | String | required |
| categoria | String | required |
| precioBase / precioExtra | Number | required, default 0 |
| inventario | { cantidad, unidad } | required |
| disponible / activo | Boolean | default: true |

Indices: `{nombre: 1}`, `{categoria: 1}`

### 4.3 Producto
| Campo | Tipo | Validacion |
|-------|------|-----------|
| nombre | String | required, trim |
| descripcion | String | trim |
| precio | Number | required, min 0 |
| categoria | String | required |
| imagen | String | opcional (Cloudinary) |
| ingredientes[] | [{ingrediente: ObjectId, cantidad, unidad}] | ref: Ingrediente |
| ingredientesExtra[] | [{nombre, precio}] | subdocumento |
| permitirPersonalizacion/Extras/Remover | Boolean | default: true |
| disponible / activo | Boolean | default: true |

Indices: `{categoria: 1, disponible: 1}`, text index en nombre+descripcion

### 4.4 Mesa
| Campo | Tipo | Validacion |
|-------|------|-----------|
| nombre | String | required, unique, 1-40 chars |
| capacidad | Number | required, 1-20 |
| comensalesActuales | Number | validator: <= capacidad |
| estado | Enum | 'libre' \| 'ocupada' \| 'reservada' |
| pedidoActual | ObjectId | ref: Pedido, opcional |
| activa | Boolean | default: true |

Indice: `{estado: 1}`

### 4.5 Pedido (modelo principal)
| Campo | Tipo | Notas |
|-------|------|-------|
| tipo | Enum | 'local' \| 'recoger' \| 'domicilio' |
| mesa | ObjectId | solo para tipo 'local' |
| direccionEntrega | Subdocumento | solo para tipo 'domicilio' |
| productos[] | [{producto, cantidad, precioUnitario, subtotal, notas, personalizaciones}] | |
| subtotal / impuestos / descuento / gastoEnvio / total | Number | IVA 21% |
| estado | Enum | 'pendiente' \| 'preparando' \| 'listo' \| 'en_camino' \| 'servido' \| 'entregado' \| 'pagado' \| 'cancelado' |
| camarero / repartidor | ObjectId | ref: Usuario |
| cliente / telefono | String | opcionales |
| metodoPago | Enum | 'efectivo' \| 'tarjeta' \| 'mixto' |

Metodo: `calcularTotales()` — subtotal + IVA 21% - descuento + gastoEnvio
Indices: `{tipo,estado}`, `{mesa,estado}`, `{estado,createdAt}`, `{camarero,createdAt}`

### 4.6 TicketCocina
| Campo | Tipo | Validacion |
|-------|------|-----------|
| pedido | ObjectId | ref: Pedido, required |
| items[] | [{producto, cantidad, notas}] | required |
| prioridad | Enum | 'baja' \| 'media' \| 'alta' |
| estado | Enum | 'pendiente' \| 'en-preparacion' \| 'completado' |
| completado | Boolean | default: false |
| horaInicio / horaFin | Date | opcionales |

Indices: `{estado: 1, completado: 1}`

### Relaciones
```
Usuario ──ref──► Pedido.camarero / Pedido.repartidor
Ingrediente ──ref──► Producto.ingredientes[].ingrediente
Producto ──ref──► Pedido.productos[].producto
Mesa ◄──bidirectional──► Pedido (Mesa.pedidoActual ↔ Pedido.mesa)
Pedido ──ref──► TicketCocina.pedido
```

---

## 5. API (25 route handlers)

### Autenticacion
| Endpoint | Metodo | Proteccion | Funcion |
|----------|--------|-----------|---------|
| /api/auth/login | POST | Publico + rate limit 5/min | Login con JWT 7d + cookie httpOnly |
| /api/auth/register | POST | Admin + rate limit | Crear usuario (solo admins) |
| /api/auth/me | GET | Auth (cookie o header) | Verificar sesion |
| /api/auth/logout | POST | Publico | Borrar cookie httpOnly |

### Recursos CRUD
| Recurso | GET | POST | PUT | DELETE | Proteccion |
|---------|-----|------|-----|--------|-----------|
| /api/mesas | Lista | Crear | Actualizar | Eliminar | Auth |
| /api/mesas/seed | — | Crear 15 | — | — | Auth |
| /api/pedidos | Lista paginada | Crear | Actualizar estado | Cancelar | Auth |
| /api/pedidos/abrir | — | Abrir/recuperar | — | — | Auth |
| /api/productos | Lista | Crear | Actualizar | Eliminar | Auth + roles |
| /api/ingredientes | Lista | Crear | Actualizar | Eliminar | Auth + roles |
| /api/tickets-cocina | Lista | Crear | Actualizar | Eliminar | Auth + roles |
| /api/usuarios | Lista | Crear | Actualizar | Eliminar | Admin |
| /api/reportes | Agregaciones | — | — | — | Auth |

### Patrones comunes en todos los handlers
- `connectDB()` al inicio
- `protegerRuta(req)` para verificar auth
- `sanitizeBody()` en todos los POST/PUT
- `validarObjectId()` en todos los `[id]`
- Respuesta uniforme: `NextResponse.json<ApiResponse>({ success, data, error })`
- Codigos HTTP: 200, 201, 400, 401, 404, 429, 500

---

## 6. Seguridad

### Autenticacion
| Capa | Implementacion |
|------|---------------|
| **Password** | bcryptjs con 12 salt rounds, `select: false` en schema |
| **JWT** | HS256, expiracion 7 dias, secret obligatorio (throw si no existe) |
| **Cookie** | httpOnly, Secure (produccion), SameSite=Lax, path=/ |
| **Middleware** | Edge middleware con jose verifica cookie en /dashboard/* |
| **API** | protegerRuta() lee cookie o header Authorization |
| **Frontend** | useAuth verifica sesion via /api/auth/me al cargar |
| **Registro** | Protegido: solo admins pueden crear usuarios |

### Proteccion de entrada
| Medida | Implementacion |
|--------|---------------|
| **Sanitizacion XSS** | sanitizeBody() en 13 handlers POST/PUT — escapa < > " ' & |
| **Rate limiting** | 5 intentos/min por IP en login y register — responde 429 |
| **Validacion ObjectId** | validarObjectId() en 7 handlers [id] — responde 400 |
| **Validacion de esquema** | Mongoose schema validators en todos los modelos |

### Arquitectura de seguridad
```
Cliente → Edge Middleware (jose) → API Route → protegerRuta() → Handler → sanitizeBody() → Mongoose
                                                                          ↑
                                                                   checkRateLimit()
                                                                   validarObjectId()
```

---

## 7. Cache y rendimiento (SWR)

### Hooks SWR implementados
| Hook | Endpoint | Refresh | Deduplicacion |
|------|----------|---------|--------------|
| useIngredientes | /api/ingredientes | Por defecto | 4 consumidores → 1 fetch |
| useProductos | /api/productos | Por defecto | Compartido |
| useMesas | /api/mesas | Por defecto | Compartido |
| usePedidos | /api/pedidos | 30s | Panel + cocina |
| useUsuarios | /api/usuarios | Por defecto | Unico |
| useReportes | /api/reportes | 60s | Unico |

### Fetcher con auth
`authFetcher<T>(url)` — inyecta JWT de localStorage como header Authorization automaticamente.

### Beneficios obtenidos
- Ingredientes: 4 componentes comparten 1 fetch (deduplicacion)
- Navegacion entre modulos del dashboard sin re-fetch (cache stale-while-revalidate)
- Panel cocina actualizado cada 5s, pedidos cada 30s, reportes cada 60s
- ~150 lineas de fetch manual eliminadas

---

## 8. Capa de servicios

### pedidoService.ts (6 funciones)
| Funcion | Proposito |
|---------|-----------|
| `normalizarPedido(doc)` | Mapea campo BD `camarero` → frontend `creadoPor` |
| `ocuparMesa(mesaId, pedidoId)` | Marca mesa como ocupada y asocia pedido |
| `liberarMesa(mesaId)` | Resetea mesa a libre y desvincula pedido |
| `abrirPedidoParaMesa(mesaId, userId)` | Abre pedido nuevo o devuelve el existente |
| `validarProductosYObtenerPrecios(productos)` | Valida existencia/disponibilidad y calcula precios desde BD |

---

## 9. Frontend

### Paginas publicas (6)
| Pagina | Ruta | Tipo |
|--------|------|------|
| Landing | / | Server component |
| Carta | /carta | Client (animaciones CSS) |
| Reservas | /reservas | Server + client (iframe CoverManager) |
| Sobre nosotros | /sobre-nosotros | Server component |
| Contacto | /contacto | Client (scroll) |
| Login | /login | Client (formulario) |

### Modulos del dashboard (7)
| Modulo | Componente | Roles | Descripcion |
|--------|-----------|-------|-------------|
| Stock | StockPanel | admin | Productos + ingredientes (tabs) |
| Mesas | MesasPanel | todos | Grid de mesas con estado |
| Pedidos | PedidoPanel | todos | Lista, filtros, CRUD, detalle |
| Cocina | CocinaPanel | cocinero, admin | Kanban 3 columnas, polling 5s, notificaciones |
| Reportes | ReportesPanel | admin | Tarjetas, tablas, graficos CSS |
| Usuarios | UsuariosPanel | admin | Tabla desktop + cards mobile |
| Configuracion | — | admin | Placeholder |

### Custom hooks extraidos
| Hook | Lineas | Proposito |
|------|--------|-----------|
| usePedidoPanel | ~250 | Estado del panel, filtrado, stats, detalle |
| usePedidoForm | ~430 | Formulario de pedido (3 tipos), validacion, calculo de totales |
| useProductoForm | ~310 | Formulario de producto, ingredientes, imagen |

### Responsive design
| Patron | Implementacion |
|--------|---------------|
| Tablas → cards en mobile | `hidden md:block` (tabla) + `md:hidden` (cards) |
| Grids progresivos | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` |
| Texto responsive | `text-xl sm:text-2xl lg:text-3xl` |
| Padding adaptativo | `p-4 sm:p-6` |
| Touch targets | Botones full-width en mobile |
| Header responsive | `flex-col sm:flex-row` en DashboardShell |
| Iframe responsive | `min-h-[400px] sm:min-h-[500px] md:min-h-[550px]` |

---

## 10. Testing

### Estrategia de testing
```
Unit tests (Vitest)         → Funciones puras (utils, services)
Integration tests (Vitest)  → Servicios con mock Mongoose
Hook tests (Vitest + happy-dom) → Hooks React con mock SWR/fetch
E2E tests (Playwright)      → Flujos criticos en navegador real
```

### Cobertura por capa
| Capa | Ficheros | Tests | Que cubre |
|------|----------|-------|-----------|
| Utils | 5 | 23 | sanitize, pagination, validateId, logger, rateLimiter |
| Servicios (puro) | 1 | 7 | normalizarPedido |
| Servicios (mock BD) | 1 | 14 | ocuparMesa, liberarMesa, abrirPedidoParaMesa, validarProductosYObtenerPrecios |
| Hooks dashboard | 3 | 22 | usePedidoPanel, usePedidoForm, useProductoForm |
| E2E | 1 | 8 | Login, redirect sin sesion, paginas publicas |
| **Total** | **11** | **74** | |

### Scripts
| Comando | Funcion |
|---------|---------|
| `npm test` | Unit + hooks (dos pasadas para evitar OOM) |
| `npm run test:unit` | Solo tests unitarios |
| `npm run test:hooks` | Solo tests de hooks |
| `npm run test:e2e` | Playwright headless |
| `npm run test:e2e:ui` | Playwright con UI interactiva |

---

## 11. DevOps

### Docker
- **Dockerfile:** Multi-stage (builder + runner) con Node 20 Alpine
- **docker-compose.yml:** 3 servicios (app, MongoDB 7, Mongo Express)
- **Volumen persistente** para datos de MongoDB

### CI/CD (GitHub Actions)
- **Trigger:** PR a main, push a develop
- **Steps:** checkout → Node 20 → npm ci → typecheck → build
- **Secrets:** MONGODB_URI, JWT_SECRET, NEXTAUTH_SECRET, Cloudinary

### Backup
- Script `npm run db:backup` ejecuta mongodump con timestamp

### Variables de entorno
| Variable | Proposito |
|----------|-----------|
| MONGODB_URI | Conexion a MongoDB |
| JWT_SECRET | Secreto para firmar JWT (obligatorio) |
| NEXT_PUBLIC_API_URL | URL base de la API |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Cloudinary |
| NODE_ENV | Entorno (production/development) |

---

## 12. Calidad del codigo

### TypeScript
- **strict mode** activado (noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters)
- Path alias `@/*` para imports limpios
- Tipos re-exportados desde modelos Mongoose
- `ApiResponse<T>` generico para todas las respuestas API

### Patrones de codigo
- Componentes < 350 lineas (logica extraida a hooks)
- Separacion clara: API handlers → servicios → modelos
- Fetcher centralizado con auth automatica
- Logger condicional (silenciado en produccion)
- Sanitizacion centralizada (no repetida en cada handler)

### Convenciones
- Mezcla espanol/ingles consistente: dominio en espanol, tecnico en ingles
- Ficheros TypeScript con extension .ts/.tsx
- Nombres de archivos: PascalCase (componentes), camelCase (hooks/utils)

---

## 13. Rendimiento

### Optimizaciones implementadas
| Area | Optimizacion |
|------|-------------|
| Video hero | `preload="none"` + poster image (evita carga de 19.5 MB) |
| Server components | Paginas publicas sin `'use client'` donde es posible |
| SWR cache | Stale-while-revalidate, deduplicacion automatica |
| Populate selectivo | Proyeccion en populate() para no traer todos los campos |
| Paginacion | GET /api/pedidos con page, limit, sort |
| Indices MongoDB | 8 indices definidos en modelos |
| useMemo/useCallback | En CocinaPanel para evitar renders innecesarios |

### Posibles mejoras futuras
- Comprimir hero.mp4 (19.5 MB → objetivo < 5 MB)
- Code splitting para modulos del dashboard (lazy loading)
- next/image para optimizacion automatica de imagenes
- React.lazy para carga diferida de componentes pesados

---

## 14. Documentacion del proyecto

| Documento | Proposito |
|-----------|-----------|
| README.md | Descripcion, setup, stack, endpoints, Docker |
| docs/auditoria-el-buey-madurado.md | Este documento — estado tecnico completo |
| docs/plan-mejoras-el-buey-madurado.md | Hoja de ruta (7 fases, todas completadas) |
| docs/seguimiento-mejoras-el-buey-madurado.md | Registro detallado de cada mejora aplicada |

---

## 15. Resumen de metricas

| Metrica | Valor |
|---------|-------|
| Rutas API | 25 |
| Modelos Mongoose | 6 |
| Componentes React | 20+ |
| Custom hooks | 6 (3 dashboard + 3 SWR principales) |
| Tests unitarios | 66 |
| Tests e2e | 8 |
| Paginas publicas | 6 |
| Modulos dashboard | 7 |
| Ficheros de utilidades | 5 |
| Lineas de codigo (estimado) | ~8.000+ |
| `npm run typecheck` | OK (0 errores) |
| `npm run build` | OK (25 rutas + middleware) |
| `npm test` | OK (71/71) |

---

> **Este documento refleja el estado del proyecto a fecha 2026-03-23, tras la ejecucion completa de las 7 fases de mejora planificadas.**

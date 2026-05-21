# Contratos API - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Resumen

- **Total endpoints:** 43 metodos HTTP en 19 archivos de rutas
- **Grupos:** 9 (auth, ingredientes, mesas, pedidos, productos, public, tickets-cocina, usuarios, reportes)
- **Autenticacion:** JWT (cookie httpOnly `auth_token` + header `Authorization: Bearer`)
- **Formato de respuesta uniforme:** `ApiResponse<T>` → `{ success, data?, error?, message? }`

## Patron de Seguridad Transversal

| Middleware | Descripcion |
|---|---|
| `protegerRuta()` | Extrae token de header Bearer o cookie `auth_token`. 401 si falta/invalido |
| `verificarRol([...roles])` | Compara rol del payload JWT contra array de roles permitidos |
| `sanitizeBody()` | Sanitizacion HTML recursiva anti-XSS en POST/PUT |
| `validarObjectId()` | Valida MongoDB ObjectId, retorna 400 si invalido |
| `checkRateLimit()` | Rate limiter in-memory por IP con ventana configurable |

---

## 1. Autenticacion (`/api/auth/`)

### POST `/api/auth/login`
- **Auth:** No
- **Rate limit:** 5 intentos/min por IP
- **Body:** `{ email: string, password: string }`
- **Respuesta:** `{ success, data: { token, usuario: { id, email, rol } } }`
- **Notas:** Verifica bcrypt, comprueba `activo === true`, actualiza `ultimoLogin`. Devuelve token en body Y cookie httpOnly (7 dias)

### POST `/api/auth/logout`
- **Auth:** No
- **Respuesta:** `{ success, message }`
- **Notas:** Borra cookie `auth_token` con `maxAge: 0`

### GET `/api/auth/me`
- **Auth:** Si (cookie o header Bearer)
- **Respuesta:** `{ success, data: { id, email, rol } }`
- **Notas:** Datos del payload JWT, no consulta BD

### POST `/api/auth/register`
- **Auth:** Si — Solo `admin`
- **Rate limit:** 5 intentos/min por IP
- **Body:** `{ email: string, password: string (min 6), rol?: 'admin'|'camarero'|'cocinero' }`
- **Respuesta:** `{ success, data: { usuario: { id, email, rol } } }` (201)

---

## 2. Ingredientes (`/api/ingredientes/`)

### GET `/api/ingredientes`
- **Auth:** Si
- **Respuesta:** `{ success, data: Ingrediente[] }`

### POST `/api/ingredientes`
- **Auth:** Si — Roles: `admin`, `cocinero`
- **Middleware:** `sanitizeBody`
- **Body:** Campos del modelo Ingrediente
- **Respuesta:** `{ success, data: Ingrediente }` (201)

### GET `/api/ingredientes/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Ingrediente }`

### PUT `/api/ingredientes/:id`
- **Auth:** Si — Roles: `admin`, `cocinero`
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Body:** Campos a actualizar
- **Respuesta:** `{ success, data: Ingrediente }`

### DELETE `/api/ingredientes/:id`
- **Auth:** Si — Solo `admin`
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Ingrediente }`

---

## 3. Mesas (`/api/mesas/`)

### GET `/api/mesas`
- **Auth:** Si
- **Respuesta:** `{ success, data: Mesa[] }` (con populate de `pedidoActual`, ordenadas por nombre)

### POST `/api/mesas`
- **Auth:** Si
- **Body:** Campos del modelo Mesa
- **Respuesta:** `{ success, data: Mesa, message }` (201)

### PUT `/api/mesas/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Body:** `{ nombre?, estado?, activa?, capacidad?, comensalesActuales? }`
- **Validaciones:** capacidad 1-20, comensales >= 0 y <= capacidad
- **Respuesta:** `{ success, data: Mesa, message }`

### DELETE `/api/mesas/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Mesa, message }`

### POST `/api/mesas/seed`
- **Auth:** Si
- **Respuesta:** `{ success, data: Mesa[], message }` (201)
- **Notas:** Crea 15 mesas de 4 comensales. Solo funciona si no existen mesas

---

## 4. Pedidos (`/api/pedidos/`)

### GET `/api/pedidos`
- **Auth:** Si
- **Query params:** `estado`, `mesa`, `tipo`, `page`, `limit`, `sort`
- **Respuesta:** `{ success, data: { items: Pedido[], total, page, limit, ... } }`
- **Notas:** Paginado. Populate de mesa, productos (con ingredientes anidados) y camarero. Usa `normalizarPedido`

### POST `/api/pedidos`
- **Auth:** Si
- **Middleware:** `sanitizeBody`
- **Body:** `{ tipo: 'local'|'domicilio'|'recoger', mesa?, productos[], direccionEntrega?, cliente?, telefono?, notas?, descuento?, gastoEnvio? }`
- **Validaciones por tipo:**
  - `local`: mesa requerida, no puede estar ocupada
  - `domicilio`: direccionEntrega completa requerida, gastoEnvio default 3.50
  - `recoger`: telefono requerido
- **Respuesta:** `{ success, data: Pedido, message }` (201)
- **Notas:** Valida precios desde BD, calcula totales, ocupa mesa si es local

### GET `/api/pedidos/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Pedido }` (populate completo)

### PUT `/api/pedidos/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Body:** `{ productos?, productoIndex? + estadoProducto?, estado?, cliente?, notas?, descuento?, metodoPago? }`
- **Logica especial:**
  - `productoIndex` + `estadoProducto`: actualiza estado de plato individual. Si pedido estaba `pendiente` → `preparando`. Si todos los platos no-bebidas estan `listo` → pedido pasa a `listo`
  - Si estado es `pagado`/`entregado`/`cancelado` y tipo `local` → libera mesa
- **Respuesta:** `{ success, data: Pedido, message }`

### DELETE `/api/pedidos/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, message }`
- **Notas:** Cancela (no elimina). Libera mesa si es local

### POST `/api/pedidos/abrir`
- **Auth:** Si
- **Body:** `{ mesaId: string }`
- **Respuesta:** `{ success, data: { pedidoId } }` (200 si existente, 201 si nuevo)
- **Notas:** Abre pedido para mesa. Si ya hay uno activo, devuelve su ID

### PUT `/api/pedidos/:id/cobrar`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Body:** `{ metodoPago: 'efectivo'|'tarjeta'|'mixto', importeRecibido?: number }`
- **Validaciones:** No cobrar cancelado ni pagado. Efectivo requiere importe >= total
- **Respuesta:** `{ success, data: { ...Pedido, cambio? }, message }`
- **Notas:** Marca `pagado`, calcula cambio, libera mesa si local

---

## 5. Productos (`/api/productos/`)

### GET `/api/productos`
- **Auth:** Si
- **Respuesta:** `{ success, data: Producto[] }` (con populate de ingredientes)

### POST `/api/productos`
- **Auth:** Si
- **Middleware:** `sanitizeBody`
- **Body:** Campos del modelo Producto
- **Respuesta:** `{ success, data: Producto, message }` (201)

### PUT `/api/productos` (sin :id)
- **Auth:** Si
- **Body:** `{ id, ...datosActualizados }` (id en body)
- **Respuesta:** `{ success, data: Producto, message }`

### DELETE `/api/productos` (sin :id)
- **Auth:** Si
- **Query param:** `?id=xxx`
- **Respuesta:** `{ success, message }`

### GET `/api/productos/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Producto }`

### PUT `/api/productos/:id`
- **Auth:** Si — Roles: `admin`, `cocinero`
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Respuesta:** `{ success, data: Producto }`

### DELETE `/api/productos/:id`
- **Auth:** Si — Solo `admin`
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Producto }`

> **Nota:** Existe duplicacion entre `/api/productos` (PUT/DELETE con id en body/query) y `/api/productos/:id` (PUT/DELETE con id en URL). Las rutas con `:id` tienen control de roles mas estricto.

---

## 6. API Publica (`/api/public/`) — SIN AUTENTICACION

### GET `/api/public/productos`
- **Auth:** No
- **Cache:** `public, s-maxage=60`
- **Respuesta:** `{ success, data: Producto[] }` (solo `disponible: true` y `activo: true`, con ingredientes y alergenos)

### POST `/api/public/pedidos`
- **Auth:** No
- **Rate limit:** 10 solicitudes / 15 min por IP
- **Body:** `{ tipo: 'recoger'|'domicilio', cliente: string, telefono: string, productos[], direccionEntrega?, notas? }`
- **Validaciones:** cliente max 100 chars, telefono obligatorio, min 1 producto, direccion completa para domicilio
- **Respuesta:** `{ success, data: { _id, total, estado, tipo } }` (201)
- **Notas:** Gasto envio 3.50 para domicilio. Descuento fijo 0

### GET `/api/public/pedidos/:id`
- **Auth:** No
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: { _id, estado, tipo, createdAt, total, productos: [{producto: {nombre}, cantidad}] } }`
- **Notas:** Solo datos limitados (sin info sensible)

### POST `/api/public/checkout`
- **Auth:** No
- **Rate limit:** 10 solicitudes / 15 min por IP
- **Body:** `{ tipo: 'recoger'|'domicilio', cliente, telefono, productos[], direccionEntrega?, notas? }`
- **Respuesta:** `{ success, data: { clientSecret, paymentIntentId, total } }`
- **Notas:** Crea Stripe PaymentIntent. NO crea pedido. Calcula subtotal + IVA 21% + gastoEnvio. Guarda datos en metadata del PaymentIntent

### POST `/api/public/checkout/confirm`
- **Auth:** No
- **Body:** `{ paymentIntentId: string }`
- **Respuesta:** `{ success, data: { _id, estado, total, tipo }, message }`
- **Notas:** Verifica pago `succeeded` con Stripe, recupera datos de metadata, crea pedido con `metodoPago: 'tarjeta'` y `estado: 'pendiente'`. Comprueba duplicados

---

## 7. Tickets de Cocina (`/api/tickets-cocina/`)

### GET `/api/tickets-cocina`
- **Auth:** Si — Roles: `admin`, `cocinero`
- **Respuesta:** `{ success, data: TicketCocina[] }` (solo `completado: false`, populate de pedido, orden ascendente)

### POST `/api/tickets-cocina`
- **Auth:** Si — Roles: `admin`, `camarero`
- **Middleware:** `sanitizeBody`
- **Body:** Campos del modelo TicketCocina
- **Respuesta:** `{ success, data: TicketCocina }` (201)

### GET `/api/tickets-cocina/:id`
- **Auth:** Si
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: TicketCocina }`

### PUT `/api/tickets-cocina/:id`
- **Auth:** Si — Roles: `admin`, `cocinero`
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Respuesta:** `{ success, data: TicketCocina }`

---

## 8. Usuarios (`/api/usuarios/`)

### GET `/api/usuarios`
- **Auth:** Si — Solo `admin`
- **Respuesta:** `{ success, data: Usuario[] }` (sin password)

### POST `/api/usuarios`
- **Auth:** Si — Solo `admin`
- **Middleware:** `sanitizeBody`
- **Body:** Campos del modelo Usuario
- **Respuesta:** `{ success, data: { id, email, rol } }` (201)

### GET `/api/usuarios/:id`
- **Auth:** Si — Solo `admin`
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: Usuario }` (sin password)

### PUT `/api/usuarios/:id`
- **Auth:** Si — Solo `admin`
- **Middleware:** `validarObjectId`, `sanitizeBody`
- **Respuesta:** `{ success, data: Usuario }` (sin password)
- **Notas:** Excluye campo `password` de la actualizacion

### DELETE `/api/usuarios/:id`
- **Auth:** Si — Solo `admin`
- **Middleware:** `validarObjectId`
- **Respuesta:** `{ success, data: { id } }`

---

## 9. Reportes (`/api/reportes/`)

### GET `/api/reportes`
- **Auth:** Si
- **Respuesta:**
```json
{
  "success": true,
  "data": {
    "resumen": { "totalPedidos, ingresosPagados, ticketMedio, descuentos, impuestos, pedidosHoy, ingresosHoy" },
    "porTipo": [{ "_id": "local|domicilio|recoger", "count": 0, "ingresos": 0 }],
    "porEstado": [{ "_id": "estado", "count": 0 }],
    "topProductos": [{ "nombre": "", "cantidad": 0, "ingresos": 0 }],
    "ingresosDiarios": [{ "_id": "YYYY-MM-DD", "ingresos": 0 }]
  }
}
```
- **Notas:** Agregaciones MongoDB. Top 10 productos. Ingresos de ultimos 30 dias (solo pagados)

---

## Resumen de Conteo por Grupo

| Grupo | GET | POST | PUT | DELETE | Total |
|---|---|---|---|---|---|
| Auth | 1 | 3 | 0 | 0 | **4** |
| Ingredientes | 2 | 1 | 1 | 1 | **5** |
| Mesas | 1 | 2 | 1 | 1 | **5** |
| Pedidos | 2 | 2 | 2 | 1 | **7** |
| Productos | 2 | 1 | 2 | 2 | **7** |
| Public | 2 | 3 | 0 | 0 | **5** |
| Tickets Cocina | 2 | 1 | 1 | 0 | **4** |
| Usuarios | 2 | 1 | 1 | 1 | **5** |
| Reportes | 1 | 0 | 0 | 0 | **1** |
| **Total** | **15** | **14** | **8** | **6** | **43** |

---

## Rate Limiting

| Endpoint | Limite | Ventana |
|---|---|---|
| `POST /api/auth/login` | 5 intentos | 1 minuto |
| `POST /api/auth/register` | 5 intentos | 1 minuto |
| `POST /api/public/pedidos` | 10 solicitudes | 15 minutos |
| `POST /api/public/checkout` | 10 solicitudes | 15 minutos |

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

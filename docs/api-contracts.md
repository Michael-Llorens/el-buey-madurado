# Contratos API - El Buey Madurado

**Fecha de generacion:** 2026-03-30
**Base URL:** `/api`
**Formato:** JSON
**Autenticacion:** JWT Bearer token (cookie `auth_token` o header `Authorization: Bearer`)

---

## Formato de Respuesta Estandar

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Todas las rutas protegidas devuelven `401` si no hay token valido y `403` si el rol no tiene permisos.

---

## 1. Autenticacion (`/api/auth`)

### POST `/api/auth/login`
- **Auth:** No
- **Rate Limit:** 5 intentos/minuto por IP
- **Body:** `{ email: string, password: string }`
- **Respuesta 200:** `{ success: true, data: { token: string, usuario: { id, email, rol } } }`
- **Cookies:** Setea `auth_token` (httpOnly, secure, sameSite: lax, 7 dias)
- **Errores:** 400 (campos vacios), 401 (credenciales invalidas), 403 (usuario inactivo), 429 (rate limit)

### POST `/api/auth/register`
- **Auth:** Si (solo `admin`)
- **Rate Limit:** 5 intentos/minuto por IP
- **Body:** `{ email: string, password: string, rol?: 'admin' | 'camarero' | 'cocinero' }`
- **Respuesta 201:** `{ success: true, data: { usuario: { id, email, rol } } }`
- **Errores:** 400 (validacion), 403 (no admin), 409 (email duplicado), 429 (rate limit)

### POST `/api/auth/logout`
- **Auth:** No (borra cookie)
- **Respuesta 200:** `{ success: true, message: 'Sesion cerrada correctamente' }`
- **Cookies:** Borra `auth_token` (maxAge: 0)

### GET `/api/auth/me`
- **Auth:** Si (cualquier rol)
- **Respuesta 200:** `{ success: true, data: { id, email, rol } }`
- **Errores:** 401 (no autenticado / token invalido)

---

## 2. Productos (`/api/productos`)

### GET `/api/productos`
- **Auth:** Si (cualquier rol)
- **Respuesta 200:** Lista de todos los productos con ingredientes populados
- **Populate:** `ingredientes.ingrediente` (nombre, categoria)
- **Orden:** `createdAt DESC`

### POST `/api/productos`
- **Auth:** Si (cualquier rol autenticado)
- **Body:** `{ nombre, descripcion?, precio, categoria, imagen?, ingredientes?, ingredientesExtra?, permitirPersonalizacion?, permitirExtras?, permitirRemover?, disponible?, activo? }`
- **Respuesta 201:** Producto creado

### PUT `/api/productos` (alternativa sin [id])
- **Auth:** Si
- **Body:** `{ id: string, ...campos_a_actualizar }`
- **Respuesta 200:** Producto actualizado

### DELETE `/api/productos?id=xxx`
- **Auth:** Si
- **Query:** `id` del producto a eliminar
- **Respuesta 200:** Producto eliminado

### GET `/api/productos/[id]`
- **Auth:** Si
- **Respuesta 200:** Producto individual

### PUT `/api/productos/[id]`
- **Auth:** Si (admin, cocinero)
- **Body:** Campos a actualizar
- **Respuesta 200:** Producto actualizado

### DELETE `/api/productos/[id]`
- **Auth:** Si (solo admin)
- **Respuesta 200:** Producto eliminado

---

## 3. Ingredientes (`/api/ingredientes`)

### GET `/api/ingredientes`
- **Auth:** Si (cualquier rol)
- **Respuesta 200:** Lista de todos los ingredientes (lean)

### POST `/api/ingredientes`
- **Auth:** Si (admin, cocinero)
- **Body:** `{ nombre, categoria, precioBase?, precioExtra?, inventario?, alergenos?, disponible?, activo? }`
- **Respuesta 201:** Ingrediente creado
- **Errores:** 403 (rol insuficiente)

### GET `/api/ingredientes/[id]`
- **Auth:** Si
- **Respuesta 200:** Ingrediente individual

### PUT `/api/ingredientes/[id]`
- **Auth:** Si (admin, cocinero)
- **Body:** Campos a actualizar
- **Respuesta 200:** Ingrediente actualizado

### DELETE `/api/ingredientes/[id]`
- **Auth:** Si (solo admin)
- **Respuesta 200:** Ingrediente eliminado

---

## 4. Mesas (`/api/mesas`)

### GET `/api/mesas`
- **Auth:** Si
- **Respuesta 200:** Lista de mesas con pedido actual populado
- **Populate:** `pedidoActual` (_id, tipo, estado, createdAt)
- **Orden:** `nombre ASC`

### POST `/api/mesas`
- **Auth:** Si
- **Body:** `{ nombre, capacidad, estado?, activa? }`
- **Respuesta 201:** Mesa creada

### PUT `/api/mesas/[id]`
- **Auth:** Si
- **Body:** `{ nombre?, capacidad?, comensalesActuales?, estado?, activa? }`
- **Validacion:** comensalesActuales <= capacidad (validacion cruzada con BD si capacidad no viene en update)
- **Respuesta 200:** Mesa actualizada

### DELETE `/api/mesas/[id]`
- **Auth:** Si
- **Respuesta 200:** Mesa eliminada

### POST `/api/mesas/seed`
- **Auth:** Si
- **Descripcion:** Crea 15 mesas iniciales (capacidad 4, estado libre). Falla si ya existen mesas.
- **Respuesta 201:** 15 mesas creadas
- **Errores:** 400 (ya existen mesas)

---

## 5. Pedidos (`/api/pedidos`)

### GET `/api/pedidos`
- **Auth:** Si
- **Query Params:** `estado?`, `mesa?`, `tipo?`, `page?`, `limit?`, `sort?`
- **Respuesta 200:** Lista paginada de pedidos
- **Populate:** mesa, productos.producto (con ingredientes.ingrediente), camarero
- **Formato paginado:** `{ data: [...], total, page, limit }`

### POST `/api/pedidos`
- **Auth:** Si
- **Body (local):** `{ tipo: 'local', mesa: ObjectId, productos: [...], cliente?, notas?, descuento? }`
- **Body (recoger):** `{ tipo: 'recoger', telefono: string, productos: [...], cliente?, notas? }`
- **Body (domicilio):** `{ tipo: 'domicilio', direccionEntrega: {...}, productos: [...], cliente?, notas?, gastoEnvio? }`
- **Validacion:** Mesa libre (local), telefono (recoger), direccion completa (domicilio)
- **Logica:** Valida productos en BD, calcula precios, calcularTotales(), ocupa mesa si local
- **Respuesta 201:** Pedido creado con datos completos

### GET `/api/pedidos/[id]`
- **Auth:** Si
- **Respuesta 200:** Pedido con todos los populates (mesa, productos, ingredientes, camarero)

### PUT `/api/pedidos/[id]`
- **Auth:** Si
- **Body:** `{ estado?, productos?, cliente?, notas?, descuento?, metodoPago? }`
- **Logica:** Recalcula precios si se actualizan productos, libera mesa si estado final (pagado/entregado/cancelado) y tipo local
- **Respuesta 200:** Pedido actualizado

### DELETE `/api/pedidos/[id]`
- **Auth:** Si
- **Logica:** Cambia estado a `cancelado` (no elimina). Libera mesa si tipo local.
- **Respuesta 200:** Pedido cancelado

### POST `/api/pedidos/abrir`
- **Auth:** Si
- **Body:** `{ mesaId: string }`
- **Logica:** Si la mesa ya tiene pedido activo, devuelve ese ID. Si no, crea pedido nuevo vacio y ocupa la mesa.
- **Respuesta 200/201:** `{ pedidoId: string }`

### PUT `/api/pedidos/[id]/cobrar`
- **Auth:** Si
- **Body:** `{ metodoPago: 'efectivo' | 'tarjeta' | 'mixto', importeRecibido?: number }`
- **Logica:** Marca como pagado, calcula cambio (efectivo), libera mesa si local
- **Respuesta 200:** Pedido cobrado con campo `cambio` si aplica
- **Errores:** 400 (metodo invalido, ya pagado, ya cancelado, importe insuficiente)

---

## 6. Endpoints Publicos (`/api/public`) - SIN AUTENTICACION

### GET `/api/public/productos`
- **Auth:** No
- **Cache:** `Cache-Control: public, s-maxage=60`
- **Respuesta 200:** Productos disponibles y activos con ingredientes populados (nombre, alergenos, precioExtra)
- **Orden:** `categoria ASC, nombre ASC`

### POST `/api/public/pedidos`
- **Auth:** No
- **Rate Limit:** 10 pedidos/15 minutos por IP
- **Body:** `{ tipo: 'recoger' | 'domicilio', cliente: string, telefono: string, productos: [...], direccionEntrega?: {...}, notas? }`
- **Validacion:** Solo tipos recoger/domicilio, cliente obligatorio (max 100), telefono obligatorio, al menos 1 producto, direccion completa si domicilio
- **Logica:** Valida productos en BD, calcula precios (gastoEnvio: 3.50 si domicilio)
- **Respuesta 201:** `{ _id, total, estado, tipo }`
- **Errores:** 400 (validacion), 429 (rate limit)

### GET `/api/public/pedidos/[id]`
- **Auth:** No
- **Respuesta 200:** Estado resumido del pedido `{ _id, estado, tipo, createdAt, total, productos: [{ producto: { nombre }, cantidad }] }`
- **Nota:** Solo expone datos minimos (sin datos sensibles del restaurante)

---

## 7. Tickets de Cocina (`/api/tickets-cocina`)

### GET `/api/tickets-cocina`
- **Auth:** Si (admin, cocinero)
- **Respuesta 200:** Tickets no completados, ordenados por creacion ASC
- **Populate:** `pedido` (tipo, estado, mesa, total, createdAt)

### POST `/api/tickets-cocina`
- **Auth:** Si (admin, camarero)
- **Body:** `{ pedido: ObjectId, items: [{ producto, cantidad, notas? }], prioridad? }`
- **Respuesta 201:** Ticket creado

### GET `/api/tickets-cocina/[id]`
- **Auth:** Si
- **Respuesta 200:** Ticket individual con pedido populado

### PUT `/api/tickets-cocina/[id]`
- **Auth:** Si (admin, cocinero)
- **Body:** `{ estado?, prioridad?, completado?, horaInicio?, horaFin? }`
- **Respuesta 200:** Ticket actualizado

---

## 8. Usuarios (`/api/usuarios`)

### GET `/api/usuarios`
- **Auth:** Si (solo admin)
- **Respuesta 200:** Lista de usuarios sin password, orden por email ASC

### POST `/api/usuarios`
- **Auth:** Si (solo admin)
- **Body:** `{ email, password, rol? }`
- **Respuesta 201:** `{ id, email, rol }`

### GET `/api/usuarios/[id]`
- **Auth:** Si (solo admin)
- **Respuesta 200:** Usuario sin password

### PUT `/api/usuarios/[id]`
- **Auth:** Si (solo admin)
- **Body:** Campos a actualizar (excluye password)
- **Respuesta 200:** Usuario actualizado

### DELETE `/api/usuarios/[id]`
- **Auth:** Si (solo admin)
- **Respuesta 200:** `{ id }`

---

## 9. Reportes (`/api/reportes`)

### GET `/api/reportes`
- **Auth:** Si (cualquier rol autenticado)
- **Respuesta 200:** Datos agregados con MongoDB aggregation pipeline

```typescript
{
  resumen: {
    totalPedidos: number;
    ingresosPagados: number;
    pedidosPagados: number;
    pedidosCancelados: number;
    ticketMedio: number;
    descuentosTotales: number;
    impuestosTotales: number;
    pedidosHoy: number;
    ingresosHoy: number;
  };
  porTipo: Array<{ tipo: string; count: number; ingresos: number }>;
  porEstado: Array<{ estado: string; count: number }>;
  topProductos: Array<{ nombre: string; categoria: string; cantidadVendida: number; ingresos: number }>;
  ingresosDiarios: Array<{ fecha: string; ingresos: number; pedidos: number }>; // ultimos 30 dias
}
```

---

## Resumen de Endpoints

| Recurso | Endpoints | Auth | Metodos |
|---------|-----------|------|---------|
| Auth | 4 | Mixto | POST (3), GET (1) |
| Productos | 7 | Si | GET (2), POST (1), PUT (2), DELETE (2) |
| Ingredientes | 5 | Si | GET (2), POST (1), PUT (1), DELETE (1) |
| Mesas | 5 | Si | GET (1), POST (2), PUT (1), DELETE (1) |
| Pedidos | 7 | Si | GET (2), POST (2), PUT (2), DELETE (1) |
| Public | 3 | No | GET (2), POST (1) |
| Tickets Cocina | 4 | Si | GET (2), POST (1), PUT (1) |
| Usuarios | 5 | Si (admin) | GET (2), POST (1), PUT (1), DELETE (1) |
| Reportes | 1 | Si | GET (1) |
| **Total** | **41** | | |

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

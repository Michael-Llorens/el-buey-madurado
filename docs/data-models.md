# Modelos de Datos - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

## Resumen

- **Base de datos:** MongoDB 7 (via Mongoose ^9.1.5)
- **Modelos:** 6 (Usuario, Producto, Pedido, Mesa, Ingrediente, TicketCocina)
- **Indices:** 12
- **Patron:** Mongoose schemas con interfaces TypeScript, timestamps automaticos

---

## 1. Usuario (`src/lib/models/Usuario.ts`)

Gestion de empleados del restaurante con autenticacion.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `email` | String | Si | — | unique, lowercase, regex email |
| `password` | String | Si | — | minlength 6, `select: false` |
| `rol` | String (enum) | No | `'camarero'` | `'admin'` \| `'camarero'` \| `'cocinero'` |
| `activo` | Boolean | No | `true` | — |
| `ultimoLogin` | Date | No | — | — |
| `createdAt` | Date | Auto | — | timestamps |
| `updatedAt` | Date | Auto | — | timestamps |

### Hooks y Metodos

- **Pre-save:** Hash de password con bcrypt (salt rounds: 12). Solo si password fue modificado
- **Metodo:** `comparePassword(passwordIngresado)` → `Promise<boolean>` via bcrypt.compare

### Indices

- `email`: unique (implicito por `unique: true`)

---

## 2. Producto (`src/lib/models/Producto.ts`)

Platos y bebidas del menu con personalizacion e ingredientes extra.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `nombre` | String | Si | — | trim |
| `descripcion` | String | No | — | trim |
| `precio` | Number | Si | — | min 0 |
| `categoria` | String | Si | — | — |
| `imagen` | String | No | — | URL de Cloudinary |
| `ingredientes` | [ProductoIngrediente] | No | `[]` | Subdocumento |
| `ingredientesExtra` | [IngredienteExtra] | No | `[]` | Subdocumento |
| `permitirPersonalizacion` | Boolean | No | `true` | — |
| `permitirExtras` | Boolean | No | `true` | — |
| `permitirRemover` | Boolean | No | `true` | — |
| `disponible` | Boolean | No | `true` | — |
| `activo` | Boolean | No | `true` | — |

### Subdocumento: ProductoIngrediente

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `ingrediente` | ObjectId → Ingrediente | Si | ref |
| `cantidad` | Number | Si | min 0 |
| `unidad` | String | Si | default `'gramos'` |

### Subdocumento: IngredienteExtra

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `nombre` | String | Si | trim, maxlength 50 |
| `precio` | Number | Si | min 0, default 0 |

### Indices

- `{ categoria: 1, disponible: 1 }` — busqueda por categoria filtrada
- `{ nombre: 'text', descripcion: 'text' }` — busqueda full-text

### Relaciones

- `ingredientes[].ingrediente` → **Ingrediente** (ref, populate)

---

## 3. Pedido (`src/lib/models/Pedido.ts`)

Pedidos de restaurante (local, recoger, domicilio) con flujo de estados.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `tipo` | String (enum) | Si | `'local'` | `'local'` \| `'recoger'` \| `'domicilio'` |
| `mesa` | ObjectId → Mesa | Condicional | — | Requerido si `tipo === 'local'` |
| `direccionEntrega` | DireccionEntrega | Condicional | — | Requerido si `tipo === 'domicilio'` |
| `productos` | [ProductoPedido] | Si | — | Subdocumento |
| `subtotal` | Number | Si | `0` | min 0 |
| `impuestos` | Number | Si | `0` | min 0 |
| `descuento` | Number | No | `0` | min 0 |
| `gastoEnvio` | Number | No | `0` | min 0 (solo domicilio, default 3.50) |
| `total` | Number | Si | `0` | min 0 |
| `estado` | String (enum) | No | `'pendiente'` | Ver diagrama de estados |
| `camarero` | ObjectId → Usuario | No | — | alias `creadoPor` |
| `repartidor` | ObjectId → Usuario | No | — | Solo domicilio |
| `cliente` | String | No | — | maxlength 100 |
| `telefono` | String | No | — | maxlength 20 |
| `metodoPago` | String (enum) | No | — | `'efectivo'` \| `'tarjeta'` \| `'mixto'` |
| `notas` | String | No | — | maxlength 500 |

### Subdocumento: ProductoPedido

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `producto` | ObjectId → Producto | Si | ref |
| `cantidad` | Number | Si | min 1 |
| `precioUnitario` | Number | Si | min 0 |
| `subtotal` | Number | Si | min 0 |
| `notas` | String | No | maxlength 200 |
| `personalizaciones.ingredientesExtra` | [String] | No | — |
| `personalizaciones.ingredientesRemovidos` | [String] | No | — |
| `estadoProducto` | String (enum) | No | `'pendiente'` | `'pendiente'` \| `'preparando'` \| `'listo'` |

### Subdocumento: DireccionEntrega

| Campo | Tipo | Requerido |
|---|---|---|
| `calle` | String | Si |
| `numero` | String | Si |
| `piso` | String | No |
| `ciudad` | String | Si |
| `codigoPostal` | String | Si |
| `telefono` | String | Si |
| `notas` | String | No |

### Diagrama de Estados del Pedido

```
                    ┌─────────────────────────────────────┐
                    │            cancelado                 │
                    └─────────────────────────────────────┘
                              ↑ (cualquier estado)
                              │
pendiente → preparando → listo ─┬→ servido → pagado    (local)
                                ├→ en_camino → entregado (domicilio)
                                └→ entregado             (recoger)
```

### Estado por Plato Individual

```
pendiente → preparando → listo
```

- Si el pedido estaba `pendiente` y un plato pasa a `preparando` → pedido pasa a `preparando`
- Si todos los platos no-bebidas estan `listo` → pedido pasa a `listo`

### Metodos

- `calcularTotales()`: Calcula subtotal (suma de productos), impuestos (21% IVA), total (subtotal + impuestos + gastoEnvio - descuento)

### Indices

- `{ tipo: 1, estado: 1 }` — filtrado por tipo y estado
- `{ mesa: 1, estado: 1 }` — busqueda de pedido activo por mesa
- `{ estado: 1, createdAt: -1 }` — listado de pedidos recientes por estado
- `{ camarero: 1, createdAt: -1 }` — historial por camarero

### Relaciones

- `mesa` → **Mesa** (ref)
- `productos[].producto` → **Producto** (ref, populate con ingredientes anidados)
- `camarero` → **Usuario** (ref)
- `repartidor` → **Usuario** (ref)

---

## 4. Mesa (`src/lib/models/Mesa.ts`)

Mesas fisicas del restaurante con estado en tiempo real.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `nombre` | String | Si | — | unique, trim, 1-40 chars |
| `capacidad` | Number | Si | — | 1-20 |
| `comensalesActuales` | Number | No | `0` | min 0, <= capacidad (validador custom) |
| `estado` | String (enum) | No | `'libre'` | `'libre'` \| `'ocupada'` \| `'reservada'` |
| `pedidoActual` | ObjectId → Pedido | No | — | ref |
| `activa` | Boolean | No | `true` | — |

### Validador Custom

`comensalesActuales` tiene un validador que funciona tanto en `save()` (document) como en `findByIdAndUpdate()` (query). Compara contra `capacidad` del mismo documento/update.

### Indices

- `nombre`: unique (implicito)
- `{ estado: 1 }` — filtrado rapido por estado

### Relaciones

- `pedidoActual` → **Pedido** (ref, populate en GET /api/mesas)

---

## 5. Ingrediente (`src/lib/models/Ingrediente.ts`)

Ingredientes individuales con gestion de stock y alergenos UE.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `nombre` | String | Si | — | — |
| `categoria` | String | Si | — | — |
| `precioBase` | Number | Si | `0` | — |
| `precioExtra` | Number | Si | `0` | Precio al anadir como extra |
| `inventario.cantidad` | Number | Si | `0` | — |
| `inventario.unidad` | String | Si | `'kg'` | — |
| `alergenos` | [String] | No | `[]` | Validador: solo 14 alergenos UE (Reglamento 1169/2011) |
| `disponible` | Boolean | No | `true` | — |
| `activo` | Boolean | No | `true` | — |

### Alergenos UE Validos (14)

`gluten`, `crustaceos`, `huevos`, `pescado`, `cacahuetes`, `soja`, `lacteos`, `frutos_secos`, `apio`, `mostaza`, `sesamo`, `sulfitos`, `altramuces`, `moluscos`

### Indices

- `{ nombre: 1 }` — busqueda por nombre
- `{ categoria: 1 }` — filtrado por categoria

---

## 6. TicketCocina (`src/lib/models/TicketCocina.ts`)

Tickets enviados a la cocina para preparacion de pedidos.

### Campos

| Campo | Tipo | Requerido | Default | Validacion |
|---|---|---|---|---|
| `pedido` | ObjectId → Pedido | Si | — | ref |
| `items` | [TicketItem] | Si | — | Subdocumento |
| `prioridad` | String (enum) | No | `'media'` | `'baja'` \| `'media'` \| `'alta'` |
| `estado` | String (enum) | No | `'pendiente'` | `'pendiente'` \| `'en-preparacion'` \| `'completado'` |
| `completado` | Boolean | No | `false` | — |
| `horaInicio` | Date | No | — | — |
| `horaFin` | Date | No | — | — |

### Subdocumento: TicketItem

| Campo | Tipo | Requerido |
|---|---|---|
| `producto` | ObjectId → Producto | Si |
| `cantidad` | Number | Si (min 1) |
| `notas` | String | No (default `''`) |

### Indices

- `{ estado: 1, completado: 1 }` — filtrado de tickets activos

### Relaciones

- `pedido` → **Pedido** (ref, populate)
- `items[].producto` → **Producto** (ref)

---

## Diagrama de Relaciones (ERD Simplificado)

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│ Usuario  │     │   Mesa    │     │ Ingrediente  │
│──────────│     │───────────│     │──────────────│
│ email    │     │ nombre    │     │ nombre       │
│ password │     │ capacidad │     │ categoria    │
│ rol      │◄──┐ │ estado    │     │ alergenos[]  │
│ activo   │   │ │pedidoActual│◄┐  │ inventario   │
└──────────┘   │ └───────────┘  │  └──────┬───────┘
               │                │         │
               │  ┌─────────┐   │         │ ingredientes[]
               └──│ Pedido  │───┘         │
                  │─────────│             │
                  │ tipo    │     ┌───────┴──────┐
                  │ estado  │     │  Producto    │
                  │productos│────►│──────────────│
                  │ total   │     │ nombre       │
                  │ mesa    │     │ categoria    │
                  └────┬────┘     │ ingredientes │
                       │          │ extras       │
                  ┌────┴──────┐   └──────────────┘
                  │TicketCocina│
                  │───────────│
                  │ items[]   │
                  │ prioridad │
                  │ estado    │
                  └───────────┘
```

---

## Datos Semilla

| Coleccion | Cantidad | Fuente |
|---|---|---|
| Ingredientes | 68 | `src/data/` (menu real) |
| Productos | 64 | `src/data/` (menu real) |
| Mesas | 15 | `/api/mesas/seed` |
| Alergenos UE | 14 | `src/lib/constants/alergenos.ts` |

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

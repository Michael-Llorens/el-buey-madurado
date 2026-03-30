# Modelos de Datos - El Buey Madurado

**Fecha de generacion:** 2026-03-30
**ODM:** Mongoose ^9.1.5
**Base de datos:** MongoDB 7

---

## Diagrama de Relaciones

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Usuario    │◄────│     Pedido      │────►│     Mesa     │
│              │     │                 │     │              │
│ email        │     │ tipo            │     │ nombre       │
│ password     │     │ productos[]     │     │ capacidad    │
│ rol          │     │ estado          │     │ comensales   │
│ activo       │     │ total           │     │ estado       │
│ ultimoLogin  │     │ cliente         │     │ pedidoActual │
└──────────────┘     │ telefono        │     │ activa       │
                     │ direccionEntrega│     └──────────────┘
                     │ personalizaciones│
                     │ gastoEnvio      │
                     └────────┬────────┘
                              │ productos[]
                              ▼
                     ┌─────────────────┐     ┌──────────────┐
                     │    Producto     │────►│ Ingrediente  │
                     │                 │     │              │
                     │ nombre          │     │ nombre       │
                     │ precio          │     │ categoria    │
                     │ categoria       │     │ precioBase   │
                     │ ingredientes[]  │     │ precioExtra  │
                     │ ingredientesExtra│    │ inventario   │
                     │ permitirPersona.│     │ alergenos[]  │
                     │ permitirExtras  │     │ disponible   │
                     │ permitirRemover │     └──────────────┘
                     └────────┬────────┘
                              │ referenciado por
                              ▼
                     ┌─────────────────┐
                     │  TicketCocina   │
                     │                 │
                     │ pedido (ref)    │
                     │ items[]         │
                     │ prioridad       │
                     │ estado          │
                     │ completado      │
                     │ horaInicio/Fin  │
                     └─────────────────┘
```

---

## 1. Usuario

**Coleccion:** `usuarios`
**Archivo:** `src/lib/models/Usuario.ts`

| Campo | Tipo | Requerido | Unico | Default | Descripcion |
|-------|------|-----------|-------|---------|-------------|
| `email` | String | Si | Si | - | Email (lowercase, regex validado) |
| `password` | String | Si | No | - | Hash bcrypt (salt: 12). `select: false` |
| `rol` | String (enum) | No | No | `camarero` | `admin` / `camarero` / `cocinero` |
| `activo` | Boolean | No | No | `true` | Estado activo/inactivo |
| `ultimoLogin` | Date | No | No | - | Fecha del ultimo inicio de sesion |
| `createdAt` | Date | Auto | No | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | No | - | Timestamp de actualizacion |

**Metodos:**
- `comparePassword(passwordIngresado: string): Promise<boolean>` - Compara password con hash bcrypt

**Hooks:**
- `pre('save')`: Hash automatico de password con bcrypt (salt 12) si fue modificado

**Indices:**
- `email` (unique, via schema)

---

## 2. Producto

**Coleccion:** `productos`
**Archivo:** `src/lib/models/Producto.ts`

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `nombre` | String | Si | - | Nombre del producto (trim) |
| `descripcion` | String | No | - | Descripcion del producto (trim) |
| `precio` | Number | Si | - | Precio base (min: 0) |
| `categoria` | String | Si | - | Categoria (Entrantes, Carnes, Hamburguesas, Postres, Bebidas) |
| `imagen` | String | No | - | URL de imagen en Cloudinary |
| `ingredientes` | [ProductoIngrediente] | No | `[]` | Lista de ingredientes vinculados |
| `ingredientesExtra` | [IngredienteExtra] | No | `[]` | Extras disponibles con precio |
| `permitirPersonalizacion` | Boolean | No | `true` | Permite modificar ingredientes |
| `permitirExtras` | Boolean | No | `true` | Permite anadir extras |
| `permitirRemover` | Boolean | No | `true` | Permite quitar ingredientes |
| `disponible` | Boolean | No | `true` | Disponible para venta |
| `activo` | Boolean | No | `true` | Activo en el sistema |
| `createdAt` | Date | Auto | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | - | Timestamp de actualizacion |

**Subdocumento ProductoIngrediente:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `ingrediente` | ObjectId → Ingrediente | Si | - | Referencia al ingrediente |
| `cantidad` | Number | Si | - | Cantidad necesaria (min: 0) |
| `unidad` | String | Si | `gramos` | Unidad de medida |

**Subdocumento IngredienteExtra:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `nombre` | String | Si | - | Nombre del extra (max: 50, trim) |
| `precio` | Number | Si | `0` | Precio del extra (min: 0) |

**Indices:**
- `{ categoria: 1, disponible: 1 }` - Busqueda por categoria disponible
- `{ nombre: 'text', descripcion: 'text' }` - Busqueda full-text

---

## 3. Pedido

**Coleccion:** `pedidos`
**Archivo:** `src/lib/models/Pedido.ts`

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `tipo` | String (enum) | Si | `local` | `local` / `recoger` / `domicilio` |
| `mesa` | ObjectId → Mesa | Condicional | - | Requerido si tipo === `local` |
| `direccionEntrega` | DireccionEntrega | Condicional | - | Requerido si tipo === `domicilio` |
| `productos` | [ProductoPedido] | Si | `[]` | Lista de productos con precios |
| `subtotal` | Number | Si | `0` | Suma de subtotales (min: 0) |
| `impuestos` | Number | Si | `0` | IVA 21% calculado (min: 0) |
| `descuento` | Number | No | `0` | Descuento aplicado (min: 0) |
| `gastoEnvio` | Number | No | `0` | Coste envio domicilio (default: 3.50) |
| `total` | Number | Si | `0` | Total final (min: 0) |
| `estado` | String (enum) | No | `pendiente` | Estado del flujo del pedido |
| `camarero` | ObjectId → Usuario | No | - | Creador del pedido (alias: `creadoPor`) |
| `repartidor` | ObjectId → Usuario | No | - | Repartidor asignado (domicilio) |
| `cliente` | String | No | - | Nombre del cliente (max: 100) |
| `telefono` | String | No | - | Telefono del cliente (max: 20) |
| `metodoPago` | String (enum) | No | - | `efectivo` / `tarjeta` / `mixto` |
| `notas` | String | No | - | Notas adicionales (max: 500) |
| `createdAt` | Date | Auto | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | - | Timestamp de actualizacion |

**Estados del pedido:**

```
                    ┌──── servido ────── pagado
                    │     (local)
pendiente → preparando → listo ──┤
                    │     ├──── entregado
                    │     │     (recoger)
                    │     └──── en_camino → entregado
                    │           (domicilio)
                    └──── cancelado (desde cualquier estado activo)
```

**Subdocumento ProductoPedido:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `producto` | ObjectId → Producto | Si | Referencia al producto |
| `cantidad` | Number | Si | Cantidad (min: 1) |
| `precioUnitario` | Number | Si | Precio unitario (min: 0) |
| `subtotal` | Number | Si | Subtotal linea (min: 0) |
| `notas` | String | No | Notas especiales (max: 200) |
| `personalizaciones.ingredientesExtra` | [String] | No | Extras anadidos |
| `personalizaciones.ingredientesRemovidos` | [String] | No | Ingredientes quitados |

**Subdocumento DireccionEntrega:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `calle` | String | Si | Nombre de la calle |
| `numero` | String | Si | Numero |
| `piso` | String | No | Piso/puerta |
| `ciudad` | String | Si | Ciudad |
| `codigoPostal` | String | Si | Codigo postal |
| `telefono` | String | Si | Telefono de contacto |
| `notas` | String | No | Notas de entrega |

**Metodos:**
- `calcularTotales()`: Recalcula subtotal, impuestos (21% IVA) y total (incluyendo gastoEnvio y descuento)

**Indices:**
- `{ tipo: 1, estado: 1 }` - Filtro por tipo y estado
- `{ mesa: 1, estado: 1 }` - Busqueda por mesa
- `{ estado: 1, createdAt: -1 }` - Ordenacion por estado reciente
- `{ camarero: 1, createdAt: -1 }` - Pedidos por camarero

---

## 4. Mesa

**Coleccion:** `mesas`
**Archivo:** `src/lib/models/Mesa.ts`

| Campo | Tipo | Requerido | Unico | Default | Descripcion |
|-------|------|-----------|-------|---------|-------------|
| `nombre` | String | Si | Si | - | Nombre de la mesa (1-40 chars, trim) |
| `capacidad` | Number | Si | No | - | Capacidad maxima (1-20) |
| `comensalesActuales` | Number | No | No | `0` | Comensales sentados (min: 0) |
| `estado` | String (enum) | No | No | `libre` | `libre` / `ocupada` / `reservada` |
| `pedidoActual` | ObjectId → Pedido | No | No | - | Pedido activo en la mesa |
| `activa` | Boolean | No | No | `true` | Mesa activa/inactiva |
| `createdAt` | Date | Auto | No | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | No | - | Timestamp de actualizacion |

**Validacion personalizada:** `comensalesActuales` no puede superar `capacidad` (validador custom que funciona en `save()` y `findByIdAndUpdate()`)

**Indices:**
- `nombre` (unique, via schema)
- `{ estado: 1 }`

---

## 5. Ingrediente

**Coleccion:** `ingredientes`
**Archivo:** `src/lib/models/Ingrediente.ts`

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `nombre` | String | Si | - | Nombre del ingrediente |
| `categoria` | String | Si | - | Categoria (carnes, verduras, salsas, etc.) |
| `precioBase` | Number | Si | `0` | Precio base del ingrediente |
| `precioExtra` | Number | Si | `0` | Precio cuando se anade como extra |
| `inventario.cantidad` | Number | Si | `0` | Cantidad en stock |
| `inventario.unidad` | String | Si | `kg` | Unidad de medida |
| `alergenos` | [String] | No | `[]` | Alergenos UE (validado contra lista de 14) |
| `disponible` | Boolean | No | `true` | Disponible para uso |
| `activo` | Boolean | No | `true` | Activo en el sistema |
| `createdAt` | Date | Auto | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | - | Timestamp de actualizacion |

**Alergenos UE Validos (14):**
`gluten`, `crustaceos`, `huevos`, `pescado`, `cacahuetes`, `soja`, `lacteos`, `frutos_secos`, `apio`, `mostaza`, `sesamo`, `sulfitos`, `altramuces`, `moluscos`

**Indices:**
- `{ nombre: 1 }`
- `{ categoria: 1 }`

---

## 6. TicketCocina

**Coleccion:** `ticketcocinas`
**Archivo:** `src/lib/models/TicketCocina.ts`

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `pedido` | ObjectId → Pedido | Si | - | Pedido asociado |
| `items[].producto` | ObjectId → Producto | Si | - | Producto a preparar |
| `items[].cantidad` | Number | Si | - | Cantidad (min: 1) |
| `items[].notas` | String | No | `''` | Notas para cocina |
| `prioridad` | String (enum) | No | `media` | `baja` / `media` / `alta` |
| `estado` | String (enum) | No | `pendiente` | `pendiente` / `en-preparacion` / `completado` |
| `completado` | Boolean | No | `false` | Ticket finalizado |
| `horaInicio` | Date | No | - | Hora inicio de preparacion |
| `horaFin` | Date | No | - | Hora finalizacion |
| `createdAt` | Date | Auto | - | Timestamp de creacion |
| `updatedAt` | Date | Auto | - | Timestamp de actualizacion |

**Indices:**
- `{ estado: 1, completado: 1 }`

---

## Resumen de Modelos

| Modelo | Coleccion | Campos | Relaciones | Indices |
|--------|-----------|--------|------------|---------|
| Usuario | usuarios | 7 | - | email (unique) |
| Producto | productos | 13 | → Ingrediente | categoria+disponible, text(nombre,descripcion) |
| Pedido | pedidos | 17 | → Mesa, Producto, Usuario | tipo+estado, mesa+estado, estado+fecha, camarero+fecha |
| Mesa | mesas | 7 | → Pedido | nombre (unique), estado |
| Ingrediente | ingredientes | 9 | - | nombre, categoria |
| TicketCocina | ticketcocinas | 8 | → Pedido, Producto | estado+completado |

---

*Actualizado el 2026-03-30 | Escaneo profundo (deep scan)*

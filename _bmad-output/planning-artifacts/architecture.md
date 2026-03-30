---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/project-context.md', 'docs/architecture.md', 'docs/api-contracts.md', 'docs/data-models.md', 'docs/component-inventory.md', 'docs/auditoria-el-buey-madurado.md']
workflowType: 'architecture'
project_name: 'el-buey-madurado'
user_name: 'Micha'
date: '2026-03-25'
status: 'complete'
---

# Documento de Decisiones de Arquitectura — El Buey Madurado PDA

_Decisiones arquitectonicas para la evolucion del sistema hacia una PDA profesional de restaurante._

---

## 1. Contexto del Proyecto

### Estado Actual (Brownfield)

El Buey Madurado es una aplicacion web full-stack existente con:
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5.9 (strict)
- **Base de datos:** MongoDB 7 + Mongoose 9.1.5
- **Autenticacion:** JWT dual (jose edge + jsonwebtoken server)
- **Frontend:** Tailwind CSS 3.4 + SWR 2.4 + Framer Motion
- **Infra:** Docker + GitHub Actions CI + Vercel CD
- **Codigo:** 25 API routes, 6 modelos Mongoose, 20+ componentes, 74 tests

### Objetivo Arquitectonico

Evolucionar el sistema para soportar las nuevas funcionalidades de PDA profesional definidas en el PRD:
- Toma de comandas rapida (< 30s, <= 6 toques)
- Mapa de mesas en tiempo real
- Comunicacion cocina-sala con indicadores de tiempo
- Cuentas divididas y cobros
- Alergenos (14 de la UE)
- PWA instalable optimizada para tablets
- Turnos, cierres de caja y reportes avanzados

### Restriccion Fundamental

**El stack existente NO se cambia.** Todas las decisiones se toman dentro del ecosistema Next.js + MongoDB + Tailwind + SWR ya establecido.

---

## 2. Decisiones Arquitectonicas Clave

### ADR-01: Comunicacion en Tiempo Real

| | |
|---|---|
| **Decision** | Mantener polling con SWR, NO migrar a WebSocket |
| **Contexto** | Se necesita actualizacion cocina-sala en < 5s. Ya existe SWR con polling en pedidos (30s) y cocina (5s) |
| **Alternativas** | WebSocket (Socket.io), Server-Sent Events, SWR polling |
| **Justificacion** | SWR polling ya funciona, es simple, no requiere infra adicional (WebSocket server), compatible con Vercel serverless. La latencia de 3-5s es aceptable para hosteleria. WebSocket anade complejidad innecesaria para el volumen esperado (<100 pedidos/dia) |
| **Consecuencias** | Mantener intervalo de polling: cocina 3s, pedidos 5s, mesas 10s, reportes 60s. Si en futuro se necesita <1s, migrar a SSE |

### ADR-02: Gestion de Estado para Cuentas Divididas

| | |
|---|---|
| **Decision** | Estado local en componente con useReducer, sincronizacion con API al cobrar |
| **Contexto** | Cuentas divididas requieren manipulacion compleja de subcuentas (mover productos, recalcular totales) |
| **Alternativas** | Estado en servidor (cada operacion = API call), Zustand/Jotai, useReducer local |
| **Justificacion** | useReducer maneja bien la complejidad de subcuentas sin dependencias extra. No se necesita estado global — las subcuentas son locales a un pedido. Solo se persiste al confirmar cobro, reduciendo llamadas API |
| **Consecuencias** | Crear reducer `splitBillReducer` con acciones: SPLIT_EQUAL, SPLIT_BY_PRODUCT, MOVE_ITEM, SET_PAYMENT_METHOD, CONFIRM_PAYMENT |

### ADR-03: Modelo de Datos para Alergenos

| | |
|---|---|
| **Decision** | Campo `alergenos: string[]` en modelo Ingrediente con los 14 alergenos UE como enum |
| **Contexto** | FR-06 requiere alergenos visibles en comanda y cocina |
| **Alternativas** | Coleccion separada de alergenos, campo en Producto, campo en Ingrediente |
| **Justificacion** | Los alergenos son propiedad del ingrediente, no del producto. Un producto hereda los alergenos de sus ingredientes automaticamente. Enum con los 14 alergenos UE estandar evita errores de texto libre |
| **Consecuencias** | Extender modelo Ingrediente. Crear utilidad `getAlergenosProducto(producto)` que recorre ingredientes y devuelve alergenos unicos. Mostrar en comanda y ticket de cocina |

### ADR-04: Arquitectura de Cuentas Divididas (Backend)

| | |
|---|---|
| **Decision** | Subdocumentos `subcuentas[]` dentro del modelo Pedido |
| **Contexto** | FR-05 requiere dividir cuentas y cobrar por separado |
| **Alternativas** | Coleccion separada SubCuenta, subdocumentos en Pedido, modelo virtual en frontend |
| **Justificacion** | Las subcuentas son parte del ciclo de vida del pedido. No tienen sentido fuera del contexto de un pedido. Subdocumentos mantienen la atomicidad y evitan queries adicionales |
| **Consecuencias** | Nuevo subdocumento `ISubcuenta { productos: IProductoPedido[], metodoPago?, propina?, total, pagada }`. Nuevo endpoint `PUT /api/pedidos/[id]/dividir`. Nuevo endpoint `PUT /api/pedidos/[id]/cobrar-subcuenta` |

### ADR-05: PWA Strategy

| | |
|---|---|
| **Decision** | Service Worker manual (ya existente) + next-pwa para cache avanzado |
| **Contexto** | FR-07 requiere PWA instalable con cache offline |
| **Alternativas** | SW manual, next-pwa, Workbox directo, Serwist |
| **Justificacion** | Ya existe `public/sw.js` y `manifest.webmanifest`. Extender el SW existente con cache de productos/carta es mas sencillo que introducir next-pwa con su config. Mantener control total del caching |
| **Consecuencias** | Extender SW con estrategia: Network-first para API mutations, Stale-while-revalidate para GET de productos/ingredientes/mesas, Cache-first para assets estaticos |

### ADR-06: Turnos y Cierre de Caja

| | |
|---|---|
| **Decision** | Nuevo modelo Turno con referencia a Usuario y array de operaciones |
| **Contexto** | FR-08 requiere apertura/cierre de turno y cierre de caja |
| **Alternativas** | Campos en Usuario, modelo separado Turno, logs en Pedido |
| **Justificacion** | Un turno es una entidad con ciclo de vida propio (abierto/cerrado), con datos de caja que deben persistir historicamente. No encaja en Usuario (multiples turnos) ni en Pedido (transversal) |
| **Consecuencias** | Nuevo modelo `Turno { usuario, horaInicio, horaFin, estado, resumenCaja: { efectivo, tarjeta, mixto, propinas, total }, pedidosAtendidos[] }`. Nuevos endpoints: `POST /api/turnos/abrir`, `POST /api/turnos/cerrar`, `GET /api/turnos` |

---

## 3. Patrones de Implementacion

### Patron de API Route Handler (Extender Existente)

Todos los nuevos endpoints DEBEN seguir el patron existente:

```typescript
export async function METHOD(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRuta(req);
    if (!auth.valido) return auth.response;
    const body = await req.json();
    const cleanBody = sanitizeBody(body);
    // ... logica
    return NextResponse.json<ApiResponse<T>>({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json<ApiResponse>({ success: false, error: 'msg' }, { status: 500 });
  }
}
```

### Patron de Componente Dashboard (Extender Existente)

Nuevos componentes del dashboard DEBEN seguir:

```
'use client'
→ Props interface
→ Hooks SWR para datos
→ Hook custom para logica compleja (si > 100 lineas de logica)
→ Toast (sonner) para feedback
→ Tailwind para estilos
→ Touch-first: botones minimo 44x44px, areas de toque generosas
```

### Patron de Hook Custom

Cuando un componente supera ~150 lineas de logica, extraer a hook:

```
src/components/dashboard/hooks/useNombreFeature.ts
→ Estado con useState/useReducer
→ Efectos con useEffect
→ Callbacks memoizados si rendimiento lo requiere
→ Return: { datos, acciones, estados }
```

### Patron de Modelo Mongoose (Extender Existente)

```typescript
// Interfaz TypeScript
export interface INuevoModelo extends Document { ... }

// Schema con validaciones
const NuevoModeloSchema = new Schema({ ... }, { timestamps: true });

// Indices para queries frecuentes
NuevoModeloSchema.index({ campoFrecuente: 1 });

// Export con cache de modelo
const NuevoModelo: Model<INuevoModelo> = mongoose.models.NuevoModelo ||
  mongoose.model<INuevoModelo>('NuevoModelo', NuevoModeloSchema);
export default NuevoModelo;
```

### Patron SWR Hook (Extender Existente)

```typescript
// src/lib/hooks/swr/useNuevoRecurso.ts
export function useNuevoRecurso() {
  const { data, error, isLoading, mutate } = useSWR<INuevoRecurso[]>(
    '/api/nuevo-recurso',
    authFetcher
  );
  return { recursos: data ?? [], error, isLoading, mutate };
}
```

---

## 4. Extensiones al Modelo de Datos

### Cambios en Modelos Existentes

**Ingrediente** — Anadir campo:
```
alergenos: string[]  // Enum: 14 alergenos UE
```

**Pedido** — Anadir campos:
```
subcuentas: ISubcuenta[]  // Para cuentas divididas
propina: number           // Propina total del pedido
```

### Nuevos Modelos

**Turno:**
```
usuario: ObjectId → Usuario
horaInicio: Date
horaFin: Date
estado: 'abierto' | 'cerrado'
resumenCaja: {
  efectivo: number
  tarjeta: number
  mixto: number
  propinas: number
  total: number
  pedidosCount: number
}
```

**Alergeno (constante, no modelo):**
```typescript
// src/lib/constants/alergenos.ts
export const ALERGENOS_UE = [
  'gluten', 'crustaceos', 'huevos', 'pescado', 'cacahuetes',
  'soja', 'lacteos', 'frutos_secos', 'apio', 'mostaza',
  'sesamo', 'sulfitos', 'altramuces', 'moluscos'
] as const;
```

---

## 5. Nuevos Endpoints API

| Endpoint | Metodo | Descripcion | Scope |
|----------|--------|-------------|-------|
| `PUT /api/pedidos/[id]/dividir` | PUT | Crear subcuentas en un pedido | MVP |
| `PUT /api/pedidos/[id]/cobrar-subcuenta` | PUT | Cobrar una subcuenta individual | MVP |
| `PUT /api/pedidos/[id]/cobrar` | PUT | Cobrar pedido completo (sin dividir) | MVP |
| `POST /api/turnos/abrir` | POST | Abrir turno para usuario actual | Crecimiento |
| `POST /api/turnos/cerrar` | POST | Cerrar turno con resumen de caja | Crecimiento |
| `GET /api/turnos` | GET | Listar turnos (filtros por fecha/usuario) | Crecimiento |
| `GET /api/turnos/actual` | GET | Obtener turno activo del usuario | Crecimiento |

---

## 6. Estructura de Proyecto (Nuevos Archivos)

```
src/
├── app/api/
│   ├── pedidos/[id]/
│   │   ├── dividir/route.ts          # PUT dividir cuenta
│   │   ├── cobrar/route.ts           # PUT cobrar pedido
│   │   └── cobrar-subcuenta/route.ts # PUT cobrar subcuenta
│   └── turnos/
│       ├── route.ts                  # GET listar, POST crear
│       ├── abrir/route.ts            # POST abrir turno
│       ├── cerrar/route.ts           # POST cerrar turno
│       └── actual/route.ts           # GET turno activo
├── components/dashboard/
│   ├── CobroModal.tsx                # Modal de cobro (metodo pago, cambio)
│   ├── DividirCuentaModal.tsx        # Modal cuentas divididas
│   ├── AlergenosDisplay.tsx          # Componente iconos alergenos
│   ├── TurnoPanel.tsx                # Panel apertura/cierre turno
│   ├── CierreCajaPanel.tsx           # Panel cierre de caja
│   └── hooks/
│       ├── useCobro.ts               # Hook logica de cobro
│       ├── useDividirCuenta.ts       # Hook reducer cuentas divididas
│       └── useTurno.ts               # Hook gestion de turno
├── lib/
│   ├── constants/
│   │   └── alergenos.ts              # 14 alergenos UE
│   ├── models/
│   │   └── Turno.ts                  # Modelo Mongoose turno
│   ├── hooks/swr/
│   │   └── useTurnos.ts             # Hook SWR turnos
│   └── utils/
│       └── alergenos.ts              # getAlergenosProducto()
```

---

## 7. Validacion de Cobertura

### Requisitos Funcionales → Decisiones Arquitectonicas

| FR | Cubierto por |
|----|-------------|
| FR-01 Mesas | Existente + polling SWR 10s (ADR-01) |
| FR-02 Comandas | Existente + optimizacion tactil |
| FR-03 Cocina-Sala | Existente + polling SWR 3s (ADR-01) |
| FR-04 Cobro | Nuevos endpoints cobrar (ADR-04) |
| FR-05 Cuentas divididas | useReducer local + subdocumentos (ADR-02, ADR-04) |
| FR-06 Alergenos | Campo en Ingrediente + utilidad (ADR-03) |
| FR-07 PWA | SW extendido (ADR-05) |
| FR-08 Turnos | Nuevo modelo Turno (ADR-06) |
| FR-09 Reportes | Existente + extensiones |
| FR-10 Stock | Existente |
| FR-11 Auth | Existente |

### NFRs → Soporte Arquitectonico

| NFR | Soporte |
|-----|---------|
| Rendimiento < 200ms | Indices MongoDB existentes + nuevos |
| Tiempo real 3-5s | SWR polling (ADR-01) |
| PWA > 90 Lighthouse | SW + manifest (ADR-05) |
| Touch 44x44px | Patron de componentes touch-first |
| TypeScript strict | Existente, sin cambios |
| Tests >= 80% | Patron de testing existente |

---

## 8. Riesgos Arquitectonicos

| Riesgo | Mitigacion |
|--------|------------|
| Polling excesivo con muchos clientes | SWR deduplica automaticamente. Si > 20 clientes simultaneos, considerar SSE |
| Subcuentas complejas en subdocumentos | Validacion exhaustiva en reducer + tests unitarios |
| Modelo Turno crece con datos de caja | Indices en `{usuario, estado}` y `{horaInicio}` |
| Cache PWA stale | Versionado de SW + prompt de actualizacion |

---

*Documento de arquitectura generado el 2026-03-25 — El Buey Madurado PDA Profesional*

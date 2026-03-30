---
project_name: 'el-buey-madurado'
user_name: 'Micha'
date: '2026-03-25'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 42
optimized_for_llm: true
---

# Contexto del Proyecto para Agentes IA

_Este archivo contiene reglas criticas y patrones que los agentes IA deben seguir al implementar codigo en este proyecto. Se enfoca en detalles no obvios que los agentes podrian pasar por alto._

---

## Stack Tecnologico y Versiones

| Tecnologia | Version | Notas |
|-----------|---------|-------|
| Next.js | 16.0.7 | App Router, output: standalone |
| React | 19.2.3 | Server Components habilitados |
| TypeScript | 5.9.3 | Strict mode completo |
| Tailwind CSS | 3.4.18 | Tema oscuro base: `bg-[#160a00] text-white` |
| MongoDB | 7 | Docker local, Atlas produccion |
| Mongoose | 9.1.5 | ODM con interfaces TypeScript |
| jose | 6.2.1 | JWT en Edge Runtime (middleware) |
| jsonwebtoken | 9.0.3 | JWT en API Routes (servidor) |
| SWR | 2.4.1 | Data fetching con cache |
| Framer Motion | 12.23.25 | Animaciones |
| Cloudinary | next-cloudinary 6.17.5 | Imagenes |
| Sonner | 2.0.7 | Toast notifications |
| jsPDF | 4.2.1 | Exportacion PDF |
| Vitest | 4.1.0 | Tests unitarios (happy-dom) |
| Playwright | 1.58.2 | Tests E2E |
| ESLint | 9.39.2 | eslint-config-next |

---

## Reglas Criticas de Implementacion

### Reglas Especificas del Lenguaje

- **TypeScript estricto obligatorio**: `strict: true`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- **Alias de import**: Usar `@/` para importar desde `src/` (ej: `import { X } from '@/lib/types'`)
- **Target ES2020**: No usar caracteristicas de ES2021+ sin verificar compatibilidad
- **Interfaces Mongoose con Document**: Cada modelo exporta `IModelo extends Document`
- **Re-exportar tipos**: Los tipos de modelos se re-exportan desde `@/lib/types/index.ts`
- **Nunca `any` explicito**: Usar tipos genericos o `unknown` cuando el tipo no se conoce

### Reglas Especificas del Framework

#### Next.js App Router
- **Grupos de rutas**: `(public)` para paginas publicas, `(dashboard)` para panel protegido
- **API Route Handlers**: Archivos `route.ts` con funciones exportadas `GET`, `POST`, `PUT`, `DELETE`
- **Middleware Edge**: `src/middleware.ts` usa `jose` (NO jsonwebtoken) para verificar JWT en Edge Runtime
- **API Routes server**: Usan `jsonwebtoken` para generar/verificar tokens (NO jose)
- **Output standalone**: `next.config.ts` tiene `output: "standalone"` para Docker

#### Patron de API Route Handler
```typescript
// SIEMPRE seguir este patron:
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { protegerRuta } from '@/lib/middlewareAuth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await protegerRuta(req);
    if (!auth.valido) return auth.response;
    // ... logica
    return NextResponse.json<ApiResponse<T>>({ success: true, data: resultado });
  } catch (error) {
    console.error('Descripcion del error:', error);
    return NextResponse.json<ApiResponse>({ success: false, error: 'Mensaje' }, { status: 500 });
  }
}
```

#### Patron de Autenticacion
- `protegerRuta(req)` retorna `{ valido: boolean, payload?: TokenPayload, response?: NextResponse }`
- Token JWT en cookie `auth_token` (httpOnly) Y en header `Authorization: Bearer <token>`
- Roles: `admin`, `camarero`, `cocinero`
- Token expira en 7 dias
- Password hasheado con bcrypt (salt: 12)

#### Patron de Componentes React
- **`'use client'`** al inicio de componentes interactivos
- Props definidas con interface (no type alias)
- Hooks custom para logica compleja: `usePedidoForm`, `usePedidoPanel`, `useProductoForm`
- **Toast con Sonner**: `toast.success()`, `toast.error()` para notificaciones
- **SWR para data fetching**: Hooks en `@/lib/hooks/swr/` con `authFetcher`

#### Patron SWR + authFetcher
- `authFetcher<T>` lee token de `localStorage`, inyecta header Authorization
- Lanza error si `!res.ok` o `!json.success`
- Retorna `json.data` (desenvuelto de ApiResponse)
- Cada hook de recurso retorna: `{ recursos: data ?? [], error, isLoading, mutate }`

#### Patron apiClient (cliente)
- `apiRequest<T>(endpoint, options)` → retorna `ApiResponse<T>`, nunca lanza excepciones
- Objetos por recurso: `ingredientesApi`, `productosApi`, `mesasApi`, `pedidosApi`, `authApi`
- Cada uno tiene: `list()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

### Reglas de Testing

- **Vitest** para tests unitarios y de hooks (NO Jest)
- **Tests en carpetas `__tests__/`** junto al codigo que prueban
- **Patron de nombres**: `*.test.ts` o `*.test.tsx`
- **happy-dom** como entorno de test para componentes React
- **Playwright** solo para E2E en carpeta `e2e/`
- **Scripts separados**: `test:unit` (excluye .test.tsx), `test:hooks` (solo hooks del dashboard)
- **Globals habilitados** en vitest.config.ts (no necesario importar describe/it/expect)
- **Alias `@/`** configurado en vitest para resolverlo a `src/`

### Reglas de Calidad y Estilo de Codigo

- **Nombres de dominio en espanol**: Modelos (Usuario, Producto, Pedido, Mesa, Ingrediente), campos (nombre, precio, estado), funciones (protegerRuta, generarToken, calcularTotales)
- **Nombres tecnicos en ingles**: Variables de infra (connectDB, middleware, layout), tipos genericos (ApiResponse)
- **Archivos PascalCase** para modelos y componentes: `Usuario.ts`, `PedidoForm.tsx`
- **Archivos camelCase** para utilidades y hooks: `apiClient.ts`, `useAuth.ts`
- **Respuesta API estandar**: `ApiResponse<T> = { success: boolean, data?: T, error?: string, message?: string }`
- **Sanitizacion obligatoria**: Usar `sanitizeBody()` en toda entrada de usuario en API routes
- **Validacion de IDs**: Usar `validateId()` antes de operaciones con ObjectId
- **Logger con emojis**: Usar `logger.log()` con prefijos contextuales
- **Tailwind CSS**: Tema oscuro base (`bg-[#160a00]`), NO usar CSS modules ni styled-components

### Reglas de Flujo de Trabajo

- **Branches**: `main` (protegida, solo PR), `develop` (desarrollo activo), feature branches
- **CI obligatorio**: Push a develop y PR a main ejecutan typecheck + build
- **No push directo a main**: Solo mediante Pull Request con CI pasando
- **Docker para desarrollo local**: `docker-compose up -d --build` (app + mongo + mongo-express)
- **Variables de entorno**: `.env.local` para desarrollo, `.env.docker` para Docker, Vercel para produccion
- **Despliegue automatico**: Push a main → Vercel despliega automaticamente

### Reglas Criticas - No Olvidar

- **NUNCA usar `jsonwebtoken` en middleware Edge**: Solo `jose` funciona en Edge Runtime de Next.js
- **SIEMPRE llamar `await connectDB()`** al inicio de cada API route handler
- **SIEMPRE usar `protegerRuta(req)`** en routes que requieren autenticacion
- **NUNCA exponer password en respuestas**: El campo tiene `select: false` en el schema
- **Validacion condicional en Pedido**: `mesa` requerida solo si `tipo === 'local'`, `direccionEntrega` requerida solo si `tipo === 'domicilio'`
- **IVA 21%** se calcula automaticamente en `calcularTotales()` del modelo Pedido
- **Conexion MongoDB cacheada**: Usa patron singleton global, NO crear nuevas conexiones
- **ObjectId conversion**: Usar `new mongoose.Types.ObjectId(stringId)` para referencias
- **Importar modelos dependientes**: Los modelos que referencian otros deben importarlos primero (ej: `Producto.ts` importa `./Ingrediente` al inicio)
- **Paginacion disponible**: Usar `getPaginationParams(req)` y `buildPaginatedResponse()` de `@/lib/utils/pagination`
- **Rate limiting disponible**: Usar `rateLimiter` de `@/lib/utils/rateLimiter` en endpoints publicos
- **PWA activa**: Service Worker en `public/sw.js`, manifest en `public/manifest.webmanifest`

---

## Guia de Uso

**Para Agentes IA:**
- Leer este archivo antes de implementar cualquier codigo
- Seguir TODAS las reglas exactamente como estan documentadas
- En caso de duda, preferir la opcion mas restrictiva
- Actualizar este archivo si emergen nuevos patrones

**Para Humanos:**
- Mantener este archivo conciso y enfocado en las necesidades de los agentes
- Actualizar cuando cambie el stack tecnologico
- Revisar periodicamente para eliminar reglas obsoletas

Ultima actualizacion: 2026-03-25

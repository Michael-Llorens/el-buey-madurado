# Guia de Desarrollo - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

---

## Prerequisitos

| Herramienta | Version |
|---|---|
| Node.js | 20.x |
| npm | 10.x |
| MongoDB | 7.x (local o Atlas) |
| Git | 2.x |

---

## Configuracion del Entorno

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd el-buey-madurado
npm install
```

### 2. Variables de entorno

Crear `.env.local` (para desarrollo) con:

```env
MONGODB_URI=mongodb://localhost:27017/el-buey-madurado
JWT_SECRET=tu-secreto-jwt-aqui
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Iniciar desarrollo

```bash
npm run dev          # Puerto 3333 (sin Turbopack)
npm run dev:turbo    # Con Turbopack
npm run dev:debug    # Puerto default (3000)
```

### 4. Datos semilla

Tras iniciar la app, ejecutar seed de mesas:
```bash
curl -X POST http://localhost:3333/api/mesas/seed -H "Authorization: Bearer <token>"
```

Los ingredientes y productos se cargan desde `src/data/`.

---

## Estructura del Proyecto

```
src/
├── app/              # Paginas y API routes (Next.js App Router)
├── components/       # Componentes React organizados por dominio
├── data/             # Datos semilla (ingredientes, productos)
└── lib/              # Logica compartida
    ├── models/       # 6 modelos Mongoose
    ├── hooks/        # useAuth + 9 hooks SWR
    ├── context/      # CartContext (carrito publico)
    ├── services/     # Logica de negocio server-side
    ├── utils/        # Utilidades (sanitize, pagination, etc.)
    ├── constants/    # Alergenos UE
    └── types/        # Tipos compartidos
```

---

## Convenciones de Codigo

### Naming
- **Componentes:** PascalCase (`MesaCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`usePedidos.ts`)
- **Modelos:** PascalCase singular (`Pedido.ts`)
- **API routes:** kebab-case (`tickets-cocina/`)
- **Utilidades:** camelCase (`sanitize.ts`)

### Patrones
- **API Response:** Todas las rutas devuelven `ApiResponse<T>` → `{ success, data?, error?, message? }`
- **SWR Hooks:** Un hook por recurso en `src/lib/hooks/swr/`, refresh 5s en dashboard
- **Auth:** `protegerRuta()` + `verificarRol()` en cada endpoint protegido
- **Sanitizacion:** `sanitizeBody()` en todo POST/PUT que recibe body
- **Validacion ID:** `validarObjectId()` en toda ruta con parametro `:id`

### TypeScript
- `strict: true`, `noImplicitAny`, `strictNullChecks`
- Path alias: `@/*` → `./src/*`
- Interfaces exportadas desde modelos Mongoose

---

## Testing

### Unit Tests (Vitest)

```bash
npm test              # Todos los tests
npm run test:unit     # Solo .test.ts (sin .test.tsx)
npm run test:hooks    # Solo hooks del dashboard
npm run test:watch    # Modo watch
```

Configuracion en `vitest.config.ts`:
- `globals: true`
- Include: `src/**/*.test.ts`, `src/**/*.test.tsx`
- Alias: `@/` → `./src/`

### E2E Tests (Playwright)

```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Con UI interactiva
```

Configuracion en `playwright.config.ts`:
- Test dir: `./e2e/`
- Browser: Chromium
- Base URL: `http://localhost:3000`
- Web server: `npm run dev` (auto-start)

---

## Build y Verificacion

```bash
npm run typecheck     # Verificacion de tipos (tsc --noEmit)
npm run lint          # ESLint
npm run build         # Build de produccion (standalone)
```

---

## Base de Datos

### Conexion

Singleton en `src/lib/db.ts`. Usa variable `MONGODB_URI`.

### Modelos

6 modelos Mongoose en `src/lib/models/`:
- `Usuario` — Auth con bcrypt
- `Producto` — Menu con ingredientes y extras
- `Pedido` — Multi-tipo con flujo de estados
- `Mesa` — Estado en tiempo real
- `Ingrediente` — Stock con alergenos UE
- `TicketCocina` — Tickets para cocina

### Backup

```bash
npm run db:backup     # mongodump al directorio ./backups/
```

---

## Docker (desarrollo local)

```bash
docker-compose up -d              # App + MongoDB + Mongo Express
docker-compose up -d mongo        # Solo MongoDB
```

Servicios:
- App: `http://localhost:3000`
- MongoDB: `localhost:27017`
- Mongo Express: `http://localhost:8081`

---

## Ramas y CI

- **main:** Rama de produccion
- **develop:** Rama de integracion
- **feat/*:** Ramas de feature

CI (`.github/workflows/ci.yml`):
- Trigger: PR a main, push a develop
- Pipeline: checkout → Node 20 → npm ci → typecheck → build

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

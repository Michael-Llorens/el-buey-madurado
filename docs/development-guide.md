# Guia de Desarrollo - El Buey Madurado

**Fecha de generacion:** 2026-03-25

---

## Prerrequisitos

| Herramienta | Version | Proposito |
|-------------|---------|-----------|
| Node.js | 20+ | Runtime de JavaScript |
| npm | 10+ | Gestor de paquetes |
| Docker | 20+ | Contenedores (desarrollo local) |
| Docker Compose | 2+ | Orquestacion de servicios |
| Git | 2.30+ | Control de versiones |

---

## Configuracion del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/Michael-Llorens/el-buey-madurado.git
cd el-buey-madurado
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` y rellenar los valores:

```bash
cp .env.example .env.local
```

**Variables requeridas:**

| Variable | Descripcion |
|----------|-------------|
| `MONGODB_URI` | URI de conexion a MongoDB |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `NEXTAUTH_SECRET` | Secreto de NextAuth |
| `NEXTAUTH_URL` | URL base de la aplicacion |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |

---

## Desarrollo Local

### Opcion A: Docker (recomendado)

```bash
# Arrancar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar servicios
docker-compose down

# Reset completo (borra datos de MongoDB)
docker-compose down -v
```

**Servicios Docker:**

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| app | 3000 | Aplicacion Next.js |
| mongo | 27017 | MongoDB 7 |
| mongo-express | 8081 | Admin visual de MongoDB |

### Opcion B: Desarrollo local sin Docker

```bash
# Necesitas MongoDB local o Atlas URI en .env.local
npm run dev        # Desarrollo sin Turbopack
npm run dev:turbo  # Desarrollo con Turbopack
npm run dev:debug  # Modo debug
```

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (sin Turbopack) |
| `npm run dev:turbo` | Servidor de desarrollo (con Turbopack) |
| `npm run build` | Build de produccion |
| `npm start` | Servidor de produccion |
| `npm run lint` | Ejecutar ESLint |
| `npm run typecheck` | Verificar tipos TypeScript |
| `npm test` | Ejecutar todos los tests (unit + hooks) |
| `npm run test:unit` | Solo tests unitarios (excluyendo .test.tsx) |
| `npm run test:hooks` | Solo tests de hooks |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:e2e` | Tests E2E con Playwright |
| `npm run test:e2e:ui` | Tests E2E con UI de Playwright |
| `npm run db:backup` | Backup de MongoDB (requiere mongodump) |

---

## Estructura de Tests

### Tests unitarios (Vitest)

```
src/lib/services/__tests__/     # Tests de servicios
src/lib/utils/__tests__/        # Tests de utilidades
src/components/dashboard/hooks/__tests__/  # Tests de hooks
```

**Ejecutar:**
```bash
npm test              # Todos
npm run test:unit     # Solo unitarios
npm run test:hooks    # Solo hooks
npm run test:watch    # Modo watch
```

### Tests E2E (Playwright)

```
e2e/auth.spec.ts     # Test de autenticacion
```

**Ejecutar:**
```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Con interfaz visual
```

---

## Flujo de Git

```
main (protegida) ← PR ← develop ← feature branches
```

- **No** se permite push directo a `main`
- Solo mediante Pull Request con CI pasando
- Branch `develop` para desarrollo activo
- Feature branches para funcionalidades

---

## Convenciones de Codigo

- **Lenguaje del codigo:** Espanol para nombres de dominio (modelos, variables de negocio)
- **Framework:** Next.js App Router con TypeScript estricto
- **Estilos:** Tailwind CSS (clases de utilidad)
- **Componentes:** Funcionales con hooks
- **API:** Route Handlers en `src/app/api/`
- **Modelos:** Mongoose con interfaces TypeScript
- **Imports:** Alias `@/` para `src/`

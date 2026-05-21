# Guia de Despliegue - El Buey Madurado

> Actualizado: 2026-04-01 | Escaneo profundo (full rescan)

---

## Opciones de Despliegue

### 1. Docker (Recomendado para produccion propia)

#### Prerequisitos
- Docker + Docker Compose
- MongoDB 7 (incluido en docker-compose o externo)

#### Despliegue

```bash
# Crear .env.docker con variables de produccion
cp .env.local .env.docker
# Editar .env.docker con valores de produccion

# Levantar todo
docker-compose up -d
```

#### Dockerfile (Multi-stage)

```
Stage 1 (builder): node:20-alpine
  → npm ci → copy source → npm run build

Stage 2 (runner): node:20-alpine
  → Copy standalone output + static + public
  → EXPOSE 3000 → CMD ["node", "server.js"]
```

Configuracion Next.js: `output: "standalone"` (en `next.config.ts`)

#### Servicios Docker

| Servicio | Puerto | Descripcion |
|---|---|---|
| `app` | 3000 | Next.js standalone |
| `mongo` | 27017 | MongoDB 7 |
| `mongo-express` | 8081 | Admin UI (desarrollo) |

---

### 2. Vercel (Recomendado para despliegue rapido)

#### Configuracion

1. Conectar repositorio en Vercel
2. Configurar variables de entorno:
   - `MONGODB_URI` (MongoDB Atlas recomendado)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Build command: `npm run build` (auto-detectado)
4. Output: Standalone

#### Vercel Analytics

Ya integrado via `@vercel/analytics` en el layout raiz.

---

## Variables de Entorno de Produccion

| Variable | Requerida | Descripcion |
|---|---|---|
| `MONGODB_URI` | Si | URI MongoDB (Atlas o local) |
| `JWT_SECRET` | Si | Secreto JWT (min 32 chars recomendado) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Si | Cloud name Cloudinary |
| `STRIPE_SECRET_KEY` | Si | Clave secreta Stripe (produccion: `sk_live_*`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Si | Clave publica Stripe (produccion: `pk_live_*`) |
| `NEXTAUTH_SECRET` | CI | Secreto para CI pipeline |
| `NEXTAUTH_URL` | CI | URL base de la app |

---

## MongoDB Atlas (Produccion)

### Configuracion recomendada
1. Crear cluster M10+ en region cercana
2. Habilitar Network Access (IP whitelist o 0.0.0.0/0 para Vercel)
3. Crear usuario de base de datos
4. Obtener connection string: `mongodb+srv://...`

### Indices

Los indices se crean automaticamente por Mongoose al primer uso:
- 12 indices definidos en los modelos
- Indice unique en `Usuario.email` y `Mesa.nombre`
- Indices compuestos en `Pedido` (tipo+estado, mesa+estado, etc.)

### Backup

```bash
npm run db:backup  # mongodump → ./backups/YYYYMMDD_HHMMSS/
```

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
Trigger:
  - Pull request → main
  - Push → develop

Jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - Checkout
      - Setup Node 20 (con cache npm)
      - npm ci
      - npm run typecheck
      - npm run build (con secrets)
```

### Secrets requeridos en GitHub

| Secret | Usado en |
|---|---|
| `MONGODB_URI` | Build (conexion BD) |
| `JWT_SECRET` | Build |
| `NEXTAUTH_SECRET` | Build |
| `NEXTAUTH_URL` | Build |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Build |

---

## PWA

La aplicacion incluye soporte PWA:
- `public/manifest.webmanifest` — Manifest de la app
- `public/icons/` — Iconos en multiples tamanos
- Service Worker registrado en produccion (`RootLayoutContent.tsx`)
- `OfflineBanner` — Banner cuando se pierde conexion

---

## Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] MongoDB accesible desde el servidor
- [ ] Stripe keys de produccion (`sk_live_*`, `pk_live_*`)
- [ ] Cloudinary configurado
- [ ] Datos semilla cargados (mesas, ingredientes, productos)
- [ ] Usuario admin creado
- [ ] HTTPS configurado
- [ ] DNS apuntando al servidor
- [ ] Backup automatico de MongoDB configurado

---

*Generado automaticamente el 2026-04-01 | Escaneo profundo (full rescan)*

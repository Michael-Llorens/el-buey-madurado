# Guia de Despliegue - El Buey Madurado

**Fecha de generacion:** 2026-03-25

---

## Entornos

| Entorno | Branch | Plataforma | Base de Datos | URL |
|---------|--------|------------|---------------|-----|
| Desarrollo | `develop` / feature | Docker local | MongoDB (contenedor) | http://localhost:3000 |
| Staging | `develop` | Vercel Preview | MongoDB Atlas | Preview URL automatica |
| Produccion | `main` | Vercel | MongoDB Atlas | https://restaurante-el-buey-madurado.vercel.app |

---

## Pipeline CI/CD

### Integracion Continua (GitHub Actions)

**Archivo:** `.github/workflows/ci.yml`

**Se ejecuta en:**
- Push a `develop`
- Pull Request hacia `main`

**Pasos:**
1. Checkout del codigo
2. Setup Node.js 20 (con cache npm)
3. `npm ci` — Instalacion de dependencias
4. `npm run typecheck` — Verificacion de tipos TypeScript
5. `npm run build` — Build de produccion

**Si CI falla → el merge se bloquea.**

**Secrets requeridos en GitHub Actions:**
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

---

### Despliegue Continuo (Vercel)

**Trigger:** Push a `main` → despliegue automatico

**Caracteristicas:**
- Preview deployments automaticos para cada PR
- HTTPS automatico con CDN
- Soporte para rollback
- Tiempo de despliegue: ~60 segundos
- Variables de entorno configuradas en Vercel Dashboard

---

## Configuracion Docker

### Dockerfile

Build multi-etapa con output standalone de Next.js.

**Configuracion Next.js:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
    output: "standalone",
};
```

### Docker Compose (desarrollo)

**Servicios:**

| Servicio | Imagen | Puertos | Funcion |
|----------|--------|---------|---------|
| `app` | Build local | 3000:3000 | Aplicacion Next.js |
| `mongo` | mongo:7 | 27017:27017 | MongoDB |
| `mongo-express` | mongo-express:latest | 8081:8081 | Admin visual MongoDB |

**Volumen persistente:** `mongo_data` para datos de MongoDB

**Credenciales por defecto (solo desarrollo):**
- MongoDB root: `root` / `password`
- Variables de entorno: `.env.docker`

---

## Flujo de Despliegue

```
1. Desarrollo local (Docker o npm run dev)
   ↓
2. Push a develop
   ↓ (CI se ejecuta automaticamente)
3. CI pasa → Preview deployment en Vercel
   ↓
4. Pull Request hacia main
   ↓ (CI se ejecuta en el PR)
5. CI pasa → Review y merge
   ↓
6. Push a main → Deploy automatico a produccion (Vercel)
```

---

## Variables de Entorno por Entorno

| Variable | Desarrollo | Staging | Produccion |
|----------|-----------|---------|------------|
| `MONGODB_URI` | `.env.docker` | GitHub Secrets / Vercel | Vercel Env Vars |
| `JWT_SECRET` | `.env.local` | GitHub Secrets / Vercel | Vercel Env Vars |
| `NEXTAUTH_SECRET` | `.env.local` | GitHub Secrets / Vercel | Vercel Env Vars |
| `NEXTAUTH_URL` | `http://localhost:3000` | Preview URL | URL produccion |
| `NODE_ENV` | `development` | `production` | `production` |

---

## Backup de Base de Datos

```bash
# Backup manual con mongodump
npm run db:backup

# Resultado en: ./backups/YYYYMMDD_HHMMSS/
```

---

## PWA

La aplicacion incluye soporte PWA:
- **Service Worker:** `public/sw.js`
- **Web Manifest:** `public/manifest.webmanifest`
- Permite instalacion como aplicacion nativa en dispositivos

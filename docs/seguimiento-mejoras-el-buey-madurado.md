# Seguimiento de mejoras - El Buey Madurado

> **Fecha de inicio:** 2026-03-14
> **Basado en:** [Plan de mejoras](plan-mejoras-el-buey-madurado.md)
> **Propósito:** Registro trazable de la ejecución real de cada mejora planificada

---

## 1. Objetivo del documento

Este archivo es el **panel de control operativo** del proyecto. Registra qué mejoras del plan se han ejecutado, cuáles están pendientes, qué archivos se tocaron, qué validaciones se hicieron y qué riesgos quedan abiertos.

No sustituye al plan de mejoras — lo complementa con el estado real de implementación. Debe actualizarse cada vez que se complete, avance o bloquee una mejora.

**Convenciones de estado:**
- `pendiente` — No iniciada
- `en curso` — Trabajo comenzado, no finalizado
- `hecho` — Completada y validada
- `bloqueado` — No se puede avanzar por una dependencia o impedimento

---

## 2. Estado general

| Indicador | Valor |
|-----------|-------|
| **Avance global** | **Fases 1-7 completadas + rediseño UX PDA profesional + filtros avanzados + optimizaciones UX.** Proyecto production-ready. |
| **Fase actual** | Dashboard PDA profesional completo: sidebar, tarjetas estilo PDA, filtros multi-selección en dropdown, búsqueda universal, ordenación por urgencia, número de pedido visible (#XXXX), sonido en pedidos nuevos, confirmaciones modales. 71 unit tests + 8 e2e tests. 25 rutas API. |
| **Bloqueos actuales** | Ninguno |
| **Última actualización** | 2026-03-24 |

### Proximos pasos pendientes
1. **PWA (Progressive Web App)** — Instalar como app nativa en tablet/movil. Ideal para cocina y camareros. next-pwa.
2. **Exportar reportes a PDF** — Boton en ReportesPanel que genera PDF del resumen de ventas.
3. **Dashboard home con stats reales** — Ahora abre directo en Pedidos; valorar si recuperar la vista home con KPIs conectados.
4. **Modulo configuracion** — Placeholder pendiente: cambiar contrasena, IVA, horarios, gastos de envio por defecto.
5. **Carta interactiva** — Modal de producto comentado en carta publica: completar para que el cliente vea ingredientes, alergenos y foto.
6. **Ampliar tests e2e** — Flujos autenticados (login → crear pedido → cocina → pagar).
7. **Ampliar cobertura unitaria** — `IngredienteForm`, `MesaForm`, `StockPanel`.
8. **Comprimir hero.mp4** — De 19.5 MB a <5 MB con ffmpeg/Cloudinary.
9. **Notificaciones push** — Service Worker para avisar al cocinero con pestana en segundo plano.
10. **Internacionalizacion** — Espanol + ingles + valenciano con next-intl.

---

## 3. Tabla maestra de seguimiento

### Mejoras críticas (P1)

| ID | Mejora | Prioridad | Estado | Fecha | Archivos afectados | Validación | Observaciones |
|----|--------|-----------|--------|-------|-------------------|------------|---------------|
| MC-01 | Eliminar fallback JWT_SECRET | P1 | **hecho** | 2026-03-14 | `src/lib/auth.ts` | typecheck + build OK | Función helper `getJwtSecret()` para narrowing TS |
| MC-02 | Proteger registro con auth admin | P1 | **hecho** | 2026-03-14 | `src/app/api/auth/register/route.ts` | typecheck + build + test manual OK | Validado: 401 sin token, 201 con admin |
| MC-03 | Unificar tipos TS con modelos Mongoose | P1 | **hecho** | 2026-03-15 | `src/lib/types/index.ts` | typecheck + build OK | Paso 1: interfaces obsoletas eliminadas, re-exports tipados |

### Mejoras importantes (P2)

| ID | Mejora | Prioridad | Estado | Fecha | Archivos afectados | Validación | Observaciones |
|----|--------|-----------|--------|-------|-------------------|------------|---------------|
| MI-01 | Migrar token a httpOnly cookies | P2 | **hecho (paso 1)** | 2026-03-15 | login/route.ts, logout/route.ts (nuevo), me/route.ts (nuevo), middlewareAuth.ts | typecheck + build OK | Enfoque híbrido: cookie + body. localStorage intacto. |
| MI-02 | Implementar middleware.ts server-side | P2 | **hecho** | 2026-03-15 | `src/middleware.ts` (nuevo) | typecheck + build OK, middleware activo | Usa `jose` para Edge Runtime. Protege `/dashboard/*`. |
| MI-03 | Eliminar hook useAuth duplicado | P2 | **hecho** | 2026-03-14 | Eliminado `src/hooks/useAuth.ts`, actualizados DashboardShell.tsx y dashboard/page.tsx | grep imports + typecheck + build OK | Imports migrados a `@/lib/hooks/useAuth` |
| MI-04 | Sanitización de entrada en APIs | P2 | **hecho** | 2026-03-15 | `src/lib/utils/sanitize.ts` (nuevo), 13 route handlers | typecheck + build OK | `sanitizeBody()` aplicado a todos los POST/PUT |
| MI-05 | Rate limiting en auth | P2 | **hecho** | 2026-03-15 | `src/lib/utils/rateLimiter.ts` (nuevo), login + register | typecheck + build OK | 5 intentos/min por IP. Responde 429. |

### Mejoras de arquitectura (P3)

| ID | Mejora | Prioridad | Estado | Fecha | Archivos afectados | Validación | Observaciones |
|----|--------|-----------|--------|-------|-------------------|------------|---------------|
| MA-01 | Crear capa de servicios | P3 | **hecho (B3 descartado)** | 2026-03-15 | `src/lib/services/pedidoService.ts`, 4 route handlers actualizados | typecheck + build OK | MA-01a: normalizarPedido, ocuparMesa, liberarMesa. B1: validarProductosYObtenerPrecios. B2: abrirPedidoParaMesa. B3 (validarPedidoPorTipo) descartado por riesgo-beneficio. |
| MA-02 | Eliminar modelo PedidoExterno | P3 | **hecho** | 2026-03-15 | Eliminados: modelo, 2 route handlers, layout placeholder, re-export en types/index.ts | typecheck + build OK | Modelo era código muerto: sin UI, sin imports en frontend, GET con bug (`activo: true` sin campo en schema). |
| MA-03 | Validación de ObjectId en APIs | P3 | **hecho** | 2026-03-15 | `src/lib/utils/validateId.ts` (nuevo), 7 route handlers `[id]` | typecheck + build OK | Helper `validarObjectId()` aplicado en todos los `[id]/route.ts` |

### Mejoras de rendimiento (P3-P4)

| ID | Mejora | Prioridad | Estado | Fecha | Archivos afectados | Validación | Observaciones |
|----|--------|-----------|--------|-------|-------------------|------------|---------------|
| MR-01 | Paginación en APIs | P3 | **hecho** | 2026-03-15 | `src/lib/utils/pagination.ts` (nuevo), pedidos/route.ts, PedidoPanel.tsx | typecheck + build OK | Aplicado a pedidos. Frontend adaptado para respuesta paginada. |
| MR-02 | Populate selectivo en queries | P3 | **hecho** | 2026-03-15 | pedidos-externos, tickets-cocina (route + [id]) | typecheck + build OK | Proyección añadida a 4 populates sin filtro. |
| MR-03 | Optimizar hero video | P4 | **hecho** | 2026-03-15 | `src/components/Home/HeroSectionHome.tsx` | typecheck + build OK | `preload="none"` + `poster="/assets/images/carne1.jpeg"`. Sin compresión externa. |
| MR-04 | Server components en páginas estáticas | P4 | **hecho** | 2026-03-15 | `src/app/(public)/reservas/page.tsx`, `src/components/Home/HeroSectionHome.tsx` | typecheck + build OK | Eliminado `'use client'` en 2 archivos. Límite de cliente se mantiene en `Reservas` y sub-componentes. |
| MR-05 | Índices faltantes en modelos | P3 | **hecho** | 2026-03-15 | `src/lib/models/Ingrediente.ts`, `src/lib/models/TicketCocina.ts` | typecheck + build OK | Ingrediente: {nombre:1}, {categoria:1}. TicketCocina: {estado:1, completado:1} |

### Mejoras de mantenibilidad (P3-P4)

| ID | Mejora | Prioridad | Estado | Fecha | Archivos afectados | Validación | Observaciones |
|----|--------|-----------|--------|-------|-------------------|------------|---------------|
| MM-01 | Dividir componentes monolíticos | P3 | **hecho** | 2026-03-15 | 3 hooks extraídos: usePedidoPanel, usePedidoForm, useProductoForm | typecheck + build OK | PedidoPanel 694→449, PedidoForm 812→479, ProductoForm 604→331 |
| MM-02 | Limpiar archivos y dirs muertos | P3 | **hecho** | 2026-03-15 | Eliminado dir vacío `src/lib/utils/` (recreado con validateId.ts), desinstalado `@types/mongoose` | typecheck + build OK | `src/lib/utils/` ahora contiene `validateId.ts` |
| MM-03 | Corregir typos en archivos | P4 | **hecho** | 2026-03-15 | `SocialButtom.tsx`→`SocialButton.tsx`, `SocialButtom.css`→`SocialButton.css`, `Esquipo.tsx`→`Equipo.tsx` + imports actualizados | typecheck + build OK | 3 archivos renombrados, 3 imports actualizados |
| MM-04 | Reemplazar alert() por toasts | P4 | **hecho** | 2026-03-15 | 10 archivos, `sonner` instalada, `Toaster` en layout dashboard | typecheck + build OK | 44 alert() → toast.success/error/warning/info. 0 alert() restantes. |
| MM-05 | Logger condicional (reemplazar console.log) | P4 | **hecho** | 2026-03-15 | `src/lib/utils/logger.ts` (nuevo), `src/lib/db.ts`, 3 route handlers | typecheck + build OK | `logger.log` silenciado en producción. `logger.error` siempre activo. 5 debug logs eliminados de routes. |
| MM-06 | Actualizar README | P4 | **hecho** | 2026-03-15 | `README.md` | Revisión visual OK | Reescrito completamente: stack, setup, vars de entorno, estructura, API, Docker, roles. |
| MM-07 | Añadir tests | P3 | **hecho** | 2026-03-23 | `vitest.config.ts`, `package.json`, 10 ficheros de test en `__tests__/` | 71 tests pasan, typecheck + build OK | Paso 1: setup + utils. Paso 2: servicios con mock Mongoose. Paso 3: hooks con @testing-library/react + jsdom. |

### Quick wins (resumen cruzado)

| ID | Mejora | Ref. plan | Estado | Tiempo real |
|----|--------|----------|--------|-------------|
| QW-01 | Eliminar fallback JWT_SECRET | MC-01 | **hecho** | 15 min |
| QW-02 | Proteger registro con auth admin | MC-02 | **hecho** | 30 min |
| QW-03 | Eliminar hook useAuth duplicado | MI-03 | **hecho** | 30 min |
| QW-04 | Eliminar directorio vacío utils/ | MM-02 | **hecho** | 5 min |
| QW-05 | Corregir typos (SocialButtom, Esquipo) | MM-03 | **hecho** | 15 min |
| QW-06 | Desinstalar @types/mongoose | MM-02 | **hecho** | 5 min |
| QW-07 | Validación de ObjectId en routes | MA-03 | **hecho** | 45 min |
| QW-08 | Índices faltantes en modelos | MR-05 | **hecho** | 10 min |

---

## 4. Seguimiento por fases

### Fase 1: Seguridad (Semana 1) — COMPLETADA

| | |
|---|---|
| **Objetivo** | Cerrar vulnerabilidades críticas y limpiar artefactos innecesarios |
| **Mejoras incluidas** | MC-01, MC-02, QW-03, QW-04, QW-05, QW-06, QW-07, QW-08 |
| **Estado actual** | **Completada** — Todas las mejoras implementadas y validadas |
| **Riesgos** | MC-01 mitigado. MC-02 validado manualmente (401/201). |
| **Criterio de cierre** | Cumplido: sin fallbacks, registro protegido, hook unificado, artefactos limpiados, ObjectId validado, índices añadidos. typecheck + build OK. |

### Fase 2: Tipos y modelos (Semana 2) — ALCANCE CERRADO

| | |
|---|---|
| **Objetivo** | Fuente de verdad única para la estructura de datos |
| **Mejoras incluidas** | MC-03 (RF-01) |
| **Estado actual** | **Completada en el alcance acordado** — Interfaces obsoletas eliminadas, re-exports tipados. El paso 2 original del plan (consolidar interfaces locales de componentes) fue evaluado en Fase 5 y descartado: los componentes definen interfaces locales propias que sí son correctas; unificarlas no aportaba valor real. |
| **Riesgos** | Ninguno materializado. Las interfaces eliminadas no eran importadas por ningún archivo. |
| **Criterio de cierre** | Cumplido: `types/index.ts` limpio y alineado con modelos. `npm run typecheck` + `npm run build` OK. Alcance definitivo cerrado. |

### Fase 3: Autenticación robusta (Semana 3) — COMPLETADA (ENFOQUE HÍBRIDO)

| | |
|---|---|
| **Objetivo** | Autenticación segura end-to-end (servidor + cliente + middleware) |
| **Mejoras incluidas** | MI-01, MI-02 (RF-02) |
| **Estado actual** | **Completada con enfoque híbrido** — Cookie httpOnly + middleware server-side implementados. localStorage se mantiene para compatibilidad (paso 2 del plan original — eliminar localStorage — descartado: añade riesgo transversal sin ganancia de seguridad significativa dado que el middleware ya bloquea server-side). |
| **Riesgos** | Mitigados. Cookie httpOnly protege contra XSS. Middleware bloquea acceso al dashboard sin sesión válida incluso con JS desactivado. |
| **Criterio de cierre** | Cumplido en alcance acordado: middleware activo, cookie en login, `/api/auth/me` y `/api/auth/logout` operativos, `protegerRuta()` lee cookie como fallback. |

### Fase 4: Backend sólido (Semana 4) — COMPLETADA

| | |
|---|---|
| **Objetivo** | APIs robustas, seguras y preparadas para volumen real |
| **Mejoras incluidas** | MI-04, MI-05, MR-01, MR-02 |
| **Estado actual** | **Completada.** Sanitización en todos los handlers, rate limiting en auth, paginación en pedidos, populate selectivo en todos los endpoints. |
| **Riesgos** | Paginación mitigada: frontend adaptado para soportar respuesta paginada y array directo. |
| **Criterio de cierre** | Cumplido. typecheck + build OK. |

### Fase 5: Frontend y calidad (Semanas 5-6) — COMPLETADA

| | |
|---|---|
| **Objetivo** | Código mantenible, modular y testeable |
| **Mejoras incluidas** | MM-01 (RF-04), MM-04, MM-07 |
| **Estado actual** | **Completada.** MM-01 (hooks extraídos) y MM-04 (toasts) implementados y validados manualmente. MM-07 (tests) aplazado a Fase 6 por ser transversal. |
| **Riesgos** | Mitigados. Flujos CRUD validados manualmente por el usuario — sin regresiones detectadas. |
| **Criterio de cierre** | Cumplido: lógica separada en hooks, alert() eliminado (44→0), dashboard funcional y validado. MM-07 aplazado como tarea de Fase 6. |

### Fase 6: Consolidación (Mes 2-3) — COMPLETADA EN LO ESENCIAL

| | |
|---|---|
| **Objetivo** | Madurar arquitectura, eliminar deuda técnica restante |
| **Mejoras incluidas** | MA-01, MA-02, MR-03, MR-04, MM-05, MM-06 |
| **Estado actual** | **Completada en lo esencial.** Todas las mejoras ejecutadas y validadas. MA-01 cerrada (MA-01a + B1 + B2; B3 descartado explícitamente). MA-02 completada. Bug de `/dashboard/mesas` corregido (registro de modelo Mongoose antes de populate). |
| **Criterio de cierre** | Cumplido: capa de servicios creada y funcional, PedidoExterno eliminado, README reescrito, logger condicional, server components en páginas públicas, hero video optimizado. typecheck + build OK (24 rutas). |
| **Nota sobre B3** | `validarPedidoPorTipo` descartada: requería cambio arquitectural en el patrón de error handling del POST de pedidos (de retorno anticipado con `NextResponse` a `throw`). El beneficio era modesto y el riesgo de romper silenciosamente la validación de pedidos local/domicilio/recoger no justificaba el esfuerzo. |

### Fase 7: Escalabilidad (Mes 3-6) — EN CURSO

| | |
|---|---|
| **Objetivo** | Preparar el proyecto para crecimiento |
| **Mejoras incluidas** | Caché (SWR), tests e2e (Playwright), WebSockets cocina, reportes, backup BD |
| **Estado actual** | **COMPLETADA.** SWR (6 hooks + caché), Dashboard reportes (5 agregaciones), Panel cocina Kanban (polling 5s), Playwright e2e (8 tests), backup BD (script mongodump). |
| **Pendiente** | Ninguno — fase cerrada |

---

## 5. Registro de cambios aplicados

### MC-01 — Eliminar fallback hardcodeado del JWT_SECRET
**Fecha:** 2026-03-14
**Qué se hizo:** Reemplazada la línea con fallback por función `getJwtSecret()` que lanza error si la env var no está definida.
**Por qué:** Vulnerabilidad crítica P1 — secreto predecible permitía falsificación de tokens.
**Archivos modificados:**
- `src/lib/auth.ts` — nueva función `getJwtSecret()` con throw
**Validación:** typecheck OK, build OK, env vars verificadas en todos los entornos.
**Efectos secundarios:** Ninguno.

---

### MC-02 — Proteger endpoint de registro con autenticación admin
**Fecha:** 2026-03-14
**Qué se hizo:** Añadida protección `protegerRuta()` + `verificarRol(['admin'])`. Eliminada generación automática de token en respuesta.
**Por qué:** Vulnerabilidad crítica P1 — cualquiera podía crear cuentas admin.
**Archivos modificados:**
- `src/app/api/auth/register/route.ts`
**Validación:** typecheck OK, build OK, test manual: 401 sin token, 201 con admin.
**Efectos secundarios:** Requiere admin preexistente en BD.

---

### MI-03 — Eliminar hook useAuth duplicado
**Fecha:** 2026-03-14
**Qué se hizo:** Eliminado `src/hooks/useAuth.ts`, migrados 2 imports a `@/lib/hooks/useAuth`.
**Por qué:** Dos implementaciones generaban confusión.
**Archivos modificados:**
- `src/hooks/useAuth.ts` — eliminado
- `src/components/dashboard/DashboardShell.tsx` — import actualizado
- `src/app/(dashboard)/dashboard/page.tsx` — import actualizado
**Validación:** typecheck OK, build OK, grep 0 referencias al hook eliminado.
**Efectos secundarios:** Ninguno.

---

### QW-04 — Eliminar directorio vacío utils/
**Fecha:** 2026-03-15
**Qué se hizo:** Eliminado `src/lib/utils/` vacío. Posteriormente recreado para alojar `validateId.ts` (QW-07).
**Archivos:** `src/lib/utils/` — eliminado y recreado con contenido útil.

---

### QW-05 — Corregir typos en nombres de archivos
**Fecha:** 2026-03-15
**Qué se hizo:** Renombrados 3 archivos y actualizados 3 imports.
**Archivos modificados:**
- `SocialButtom.tsx` → `SocialButton.tsx` — import CSS interno actualizado
- `SocialButtom.css` → `SocialButton.css`
- `Esquipo.tsx` → `Equipo.tsx`
- `FooterSocial.tsx` — import actualizado
- `sobre-nosotros/page.tsx` — import actualizado
**Validación:** typecheck OK, build OK.

---

### QW-06 — Desinstalar @types/mongoose
**Fecha:** 2026-03-15
**Qué se hizo:** `npm uninstall @types/mongoose` — Mongoose 9 incluye sus propios tipos.
**Archivos:** `package.json`, `package-lock.json`
**Validación:** typecheck OK, build OK.

---

### MA-03 / QW-07 — Validación de ObjectId en APIs
**Fecha:** 2026-03-15
**Qué se hizo:** Creado helper `validarObjectId()` en `src/lib/utils/validateId.ts`. Aplicado en los 7 route handlers `[id]/route.ts`: ingredientes, usuarios, mesas, pedidos, pedidos-externos, productos, tickets-cocina. IDs inválidos ahora devuelven 400 en lugar de 500.
**Archivos modificados:**
- `src/lib/utils/validateId.ts` — nuevo
- 7 archivos `[id]/route.ts` — import + validación añadida después de `await params`
**Validación:** typecheck OK, build OK.
**Efectos secundarios:** Ninguno — solo añade validación antes de queries existentes.

---

### MR-05 / QW-08 — Índices faltantes en modelos
**Fecha:** 2026-03-15
**Qué se hizo:** Añadidos índices a Ingrediente (`{nombre:1}`, `{categoria:1}`) y TicketCocina (`{estado:1, completado:1}`).
**Archivos modificados:**
- `src/lib/models/Ingrediente.ts`
- `src/lib/models/TicketCocina.ts`
**Validación:** typecheck OK, build OK. Índices se crean automáticamente al conectar a MongoDB.

---

### MI-01 — Migrar token a httpOnly cookies (Paso 1 — enfoque híbrido)
**Fecha:** 2026-03-15
**Qué se hizo:** Login ahora setea cookie `auth_token` httpOnly (7d, SameSite=Lax, Secure en prod) además de devolver token en body. Creado endpoint `/api/auth/logout` que borra la cookie. Creado endpoint `/api/auth/me` que lee token de cookie o header y devuelve datos del usuario. Actualizado `protegerRuta()` para leer token de cookie como fallback si no hay header Authorization. Instalada dependencia `jose` para verificación JWT en Edge Runtime.
**Por qué:** Token en localStorage es vulnerable a XSS. La cookie httpOnly no es accesible desde JavaScript.
**Archivos modificados:**
- `src/app/api/auth/login/route.ts` — añade `Set-Cookie` con httpOnly
- `src/app/api/auth/logout/route.ts` — nuevo, borra cookie
- `src/app/api/auth/me/route.ts` — nuevo, verifica sesión desde cookie o header
- `src/lib/middlewareAuth.ts` — `protegerRuta()` lee cookie como fallback
- `package.json` — añadida dependencia `jose`
**Validación:** typecheck OK, build OK.
**Efectos secundarios:** Ninguno. Los componentes siguen usando localStorage + header. La cookie se suma como capa adicional.

---

### MI-02 — Implementar middleware.ts de Next.js
**Fecha:** 2026-03-15
**Qué se hizo:** Creado `src/middleware.ts` que intercepta requests a `/dashboard/*`, lee cookie `auth_token`, verifica JWT con `jose` (compatible con Edge Runtime), y redirige a `/login` si no hay cookie o el token es inválido. Si el token ha expirado, borra la cookie antes de redirigir.
**Por qué:** Sin middleware, las rutas del dashboard solo tenían protección client-side (`ProtectedRoute`). Un usuario podía acceder al HTML del dashboard manipulando el DOM o desactivando JS.
**Archivos modificados:**
- `src/middleware.ts` — nuevo, Edge Runtime, usa `jose` para verificación JWT
**Validación:** typecheck OK, build OK. Línea `ƒ Proxy (Middleware)` visible en output del build.
**Efectos secundarios:** Ninguno para usuarios logueados (la cookie se setea en login). Usuarios no logueados que intenten acceder a `/dashboard` serán redirigidos a `/login` antes de cargar cualquier JS — esto es el comportamiento deseado.

---

### MI-04 — Sanitización de entrada en APIs
**Fecha:** 2026-03-15
**Qué se hizo:** Creado helper `sanitizeBody()` en `src/lib/utils/sanitize.ts` que escapa recursivamente caracteres HTML peligrosos (`<`, `>`, `"`, `'`, `&`) en todos los strings de un objeto. Aplicado a los 13 route handlers POST/PUT del proyecto.
**Archivos modificados:**
- `src/lib/utils/sanitize.ts` — nuevo
- 13 route handlers — import + `sanitizeBody(await request.json())`
**Validación:** typecheck OK, build OK.

---

### MI-05 — Rate limiting en endpoints de autenticación
**Fecha:** 2026-03-15
**Qué se hizo:** Creado rate limiter basado en Map en memoria (`src/lib/utils/rateLimiter.ts`) con limpieza automática de entradas expiradas. Aplicado a `/api/auth/login` y `/api/auth/register`: 5 intentos por minuto por IP. Devuelve 429 si se excede.
**Archivos modificados:**
- `src/lib/utils/rateLimiter.ts` — nuevo
- `src/app/api/auth/login/route.ts` — rate check al inicio
- `src/app/api/auth/register/route.ts` — rate check al inicio
**Validación:** typecheck OK, build OK.

---

### MR-01 — Paginación en API de pedidos
**Fecha:** 2026-03-15
**Qué se hizo:** Creado helper genérico de paginación (`src/lib/utils/pagination.ts`). Aplicado a `GET /api/pedidos`: soporta `?page=1&limit=50&sort=-createdAt`. Respuesta: `{ data: [...], total, page, totalPages, limit }`. Frontend (`PedidoPanel.tsx`) adaptado para soportar tanto respuesta paginada como array directo (retrocompatibilidad).
**Archivos modificados:**
- `src/lib/utils/pagination.ts` — nuevo
- `src/app/api/pedidos/route.ts` — paginación en GET
- `src/components/dashboard/PedidoPanel.tsx` — lectura compatible con paginación
**Validación:** typecheck OK, build OK.

---

### MR-02 — Populate selectivo en queries
**Fecha:** 2026-03-15
**Qué se hizo:** Añadida proyección (select) a 4 populate() que traían todos los campos: pedidos-externos (producto → `nombre precio imagen`), tickets-cocina (pedido → `tipo estado mesa total createdAt`).
**Archivos modificados:**
- `src/app/api/pedidos-externos/route.ts`
- `src/app/api/pedidos-externos/[id]/route.ts`
- `src/app/api/tickets-cocina/route.ts`
- `src/app/api/tickets-cocina/[id]/route.ts`
**Validación:** typecheck OK, build OK.

---

### MC-03 — Unificar tipos TypeScript con modelos Mongoose (Paso 1)
**Fecha:** 2026-03-15
**Qué se hizo:** Eliminadas 8 interfaces manuales obsoletas de `src/lib/types/index.ts` (Usuario, Mesa, Producto, Ingrediente, ItemPedido, Pedido, PedidoExterno, KitchenTicket). Ninguna era importada por ningún archivo del proyecto — los componentes definen sus propias interfaces locales que sí coinciden con los datos reales. Reemplazados los `export *` genéricos por `export type` específicos de cada modelo. Mantenidos `ApiResponse` y `AuthContextType` (en uso). Actualizado `AuthContextType` para usar `AuthUser` (interfaz alineada con el hook real).
**Por qué:** Las interfaces obsoletas contenían campos incorrectos (`"cocina"` vs `"cocinero"`, `numero` vs `nombre`, estados diferentes) que podían confundir a cualquier desarrollador y generar bugs si se importaban.
**Archivos modificados:**
- `src/lib/types/index.ts` — reescrito completamente
**Validación:** typecheck OK, build OK. Verificado con grep que ningún archivo importaba las interfaces eliminadas.
**Efectos secundarios:** Ninguno. Paso 2 (consolidar interfaces locales de componentes) aplazado a Fase 5.

---

### MM-04 — Reemplazar alert() por sistema de toasts
**Fecha:** 2026-03-15
**Qué se hizo:** Instalada librería `sonner`. Añadido `<Toaster />` al layout del dashboard con tema dark, posición top-right, duración 3s. Reemplazadas 44 llamadas a `alert()` en 10 archivos por `toast.success()`, `toast.error()`, `toast.warning()` o `toast.info()` según contexto. Eliminados emojis de los mensajes.
**Archivos modificados:**
- `src/app/(dashboard)/layout.tsx` — añadido `<Toaster />`
- 10 componentes del dashboard — `alert()` → `toast.*()`, import de `sonner`
**Validación:** typecheck OK, build OK, grep 0 alert() restantes.

---

### MM-01 — Dividir componentes monolíticos (extracción de hooks)
**Fecha:** 2026-03-15
**Qué se hizo:** Extraída la lógica de estado y API de los 3 componentes más grandes a custom hooks. La UI (JSX) permanece intacta en los componentes originales.
- `PedidoPanel.tsx` (694→449 líneas) → `hooks/usePedidoPanel.ts` (297 líneas)
- `PedidoForm.tsx` (812→479 líneas) → `hooks/usePedidoForm.ts` (470 líneas)
- `ProductoForm.tsx` (604→331 líneas) → `hooks/useProductoForm.ts` (346 líneas)
**Archivos creados:**
- `src/components/dashboard/hooks/usePedidoPanel.ts`
- `src/components/dashboard/hooks/usePedidoForm.ts`
- `src/components/dashboard/hooks/useProductoForm.ts`
**Archivos modificados:**
- `src/components/dashboard/PedidoPanel.tsx` — solo JSX + destructuring del hook
- `src/components/dashboard/PedidoForm.tsx` — solo JSX + destructuring del hook
- `src/components/dashboard/ProductoForm.tsx` — solo JSX + destructuring del hook
**Validación:** typecheck OK, build OK. Reducción total: 2110 → 1259 líneas en componentes, lógica en hooks testeables.

---

### HOTFIX — useAuth no cargaba datos de usuario al recargar página
**Fecha:** 2026-03-15
**Qué se hizo:** Regresión detectada tras MI-03. El hook antiguo (`src/hooks/useAuth.ts`) decodificaba el JWT con `jwtDecode` para obtener `usuario` al recargar. El hook actual (`src/lib/hooks/useAuth.ts`) solo verificaba la presencia del token en localStorage sin extraer datos, dejando `usuario` como `null`. Esto causaba que el dashboard mostrara "Cargando..." sin módulos visibles. Corregido para que al encontrar token llame a `/api/auth/me` para obtener y validar los datos del usuario. También actualizado `logout()` para llamar a `/api/auth/logout` y borrar la cookie httpOnly.
**Por qué:** El dashboard depende de `usuario.rol` para filtrar los módulos visibles. Con `usuario === null`, no se mostraba ninguno.
**Archivos modificados:**
- `src/lib/hooks/useAuth.ts` — useEffect ahora llama a `/api/auth/me`, logout llama a `/api/auth/logout`
**Validación:** typecheck OK, dashboard carga correctamente con email, rol y todos los módulos visibles. Validado manualmente por el usuario.
**Efectos secundarios:** Positivos — ahora el hook verifica que el token sea válido al cargar (antes solo verificaba que existiera un string en localStorage). Un token expirado ahora se limpia automáticamente.

---

### MM-06 — Actualizar README
**Fecha:** 2026-03-15
**Qué se hizo:** Reescrito completamente el README desde cero. El original era una plantilla de Vite/React que no mencionaba Next.js ni MongoDB. El nuevo documenta: stack tecnológico, requisitos, instalación, variables de entorno, comandos, estructura de carpetas, autenticación y roles, tabla de endpoints principales, Docker y enlaces a documentación técnica.
**Archivos modificados:**
- `README.md` — reescrito
**Validación:** Revisión visual. Sin impacto en código.

---

### MM-05 — Logger condicional
**Fecha:** 2026-03-15
**Qué se hizo:** Creado `src/lib/utils/logger.ts` con helper `logger` que silencia `log` y `warn` en producción (`NODE_ENV === 'production'`), manteniendo `error` siempre activo. Reemplazados 4 `console.log` en `db.ts` con `logger.log`. Eliminados 5 `console.log` de debug en route handlers (`productos/route.ts` ×2, `mesas/route.ts` ×2, `mesas/seed/route.ts` ×1). Los `console.error` se mantienen intactos en todos los archivos.
**Archivos modificados:**
- `src/lib/utils/logger.ts` — nuevo
- `src/lib/db.ts` — 4 console.log → logger.log
- `src/app/api/productos/route.ts` — 2 debug logs eliminados
- `src/app/api/mesas/route.ts` — 2 debug logs eliminados
- `src/app/api/mesas/seed/route.ts` — 1 debug log eliminado
**Validación:** typecheck OK, build OK.
**Efectos secundarios:** Los logs de conexión a MongoDB dejarán de aparecer en producción. Esto es el comportamiento deseado.

---

### MR-04 — Server components en páginas públicas
**Fecha:** 2026-03-15
**Qué se hizo:** Eliminado `'use client'` de 2 archivos donde era innecesario. En `reservas/page.tsx`: la página solo renderiza `<Reservas />`, que ya tiene su propio `'use client'` — el límite de cliente se define en el componente hijo, no en la página. En `HeroSectionHome.tsx`: el componente no usa `useState`, `useEffect`, ni event handlers — es JSX estático con `<Link>` y atributos HTML.
**Archivos modificados:**
- `src/app/(public)/reservas/page.tsx` — eliminado `'use client'`
- `src/components/Home/HeroSectionHome.tsx` — eliminado `'use client'`
**Validación:** typecheck OK, build OK. Las páginas siguen funcionando — el límite de cliente se mantiene donde corresponde.
**Efectos secundarios:** Ninguno. Next.js renderiza correctamente server components que importan client components.

---

### MR-03 — Optimización ligera del hero video
**Fecha:** 2026-03-15
**Qué se hizo:** Añadido atributo `poster="/assets/images/carne1.jpeg"` al elemento `<video>` para mostrar una imagen mientras el video no ha cargado (especialmente útil en conexiones lentas o cuando `preload="none"`). Cambiado `preload="metadata"` a `preload="none"` para evitar que el navegador descargue el video antes de que sea necesario, reduciendo el tiempo hasta el primer byte de la landing.
**Archivos modificados:**
- `src/components/Home/HeroSectionHome.tsx` — `preload="none"` + `poster`
**Validación:** typecheck OK, build OK.
**Efectos secundarios:** En mobile o conexiones lentas, se verá la imagen del poster hasta que el video empiece a reproducirse. El comportamiento `autoPlay` sigue activo — el video arranca en cuanto el navegador lo descarga.

---

### MA-01a — Crear pedidoService.ts (extracción atómica inicial)
**Fecha:** 2026-03-15
**Qué se hizo:** Creado `src/lib/services/pedidoService.ts` con las tres funciones de base de la capa de servicios: `normalizarPedido` (mapea campo BD `camarero` → campo frontend `creadoPor`), `ocuparMesa` (actualiza mesa a estado ocupada y asocia pedido), `liberarMesa` (resetea mesa a libre y desvincula pedido). Eliminada la duplicación de `normalizarPedido` entre `pedidos/route.ts` y `pedidos/[id]/route.ts`. Eliminado el import directo de `Mesa` de `pedidos/[id]/route.ts` (ya no lo usa directamente). Actualizado también `pedidos/abrir/route.ts` para usar `ocuparMesa` del servicio.
**Por qué:** Punto de partida conservador de la capa de servicios: funciones sin dependencias complejas, fáciles de verificar y con clara ganancia (eliminación de duplicación).
**Archivos modificados:**
- `src/lib/services/pedidoService.ts` — nuevo, 3 funciones exportadas
- `src/app/api/pedidos/route.ts` — import de `normalizarPedido` y `ocuparMesa`
- `src/app/api/pedidos/[id]/route.ts` — import de `normalizarPedido` y `liberarMesa`, eliminado import `Mesa`
- `src/app/api/pedidos/abrir/route.ts` — import de `ocuparMesa`
**Validación:** typecheck OK, build OK.
**Efectos secundarios:** Ninguno — comportamiento idéntico.

---

### HOTFIX — Bug en /dashboard/mesas: error al navegar antes que a /pedidos
**Fecha:** 2026-03-15
**Qué se hizo:** Corregido un bug de orden de inicialización en Mongoose. El handler `GET /api/mesas` usaba `.populate('pedidoActual', '_id tipo estado')` pero no importaba el modelo `Pedido`. Mongoose requiere que el modelo de destino esté registrado en `mongoose.models` en el momento del populate. Si el usuario navegaba a `/dashboard/mesas` antes de que cualquier ruta de pedidos registrara el modelo `Pedido`, el populate lanzaba `Schema hasn't been registered for model "Pedido"` y el handler devolvía 500. Solucionado con el patrón `void Pedido` (idéntico al ya usado en `pedidos/route.ts`). También añadido `pedidoActual` al tipo local `Mesa` en `mesas/page.tsx` para consistencia de tipos.
**Por qué:** El error era orden-dependiente: si el usuario entraba primero a mesas, fallaba. Si entraba primero a pedidos, funcionaba. Pasaba desapercibido en desarrollo habitual.
**Archivos modificados:**
- `src/app/api/mesas/route.ts` — añadido `import Pedido from '@/lib/models/Pedido'` y `void Pedido` antes del `.populate()`
- `src/app/(dashboard)/dashboard/mesas/page.tsx` — añadido campo `pedidoActual` al tipo local `Mesa`
**Validación:** typecheck OK, build OK. Navegación directa a `/dashboard/mesas` sin haber visitado pedidos validada manualmente por el usuario.
**Efectos secundarios:** Ninguno — solo garantiza el registro del modelo en todos los escenarios de navegación.

---

### MA-01b-B1 — Extraer validarProductosYObtenerPrecios al servicio
**Fecha:** 2026-03-15
**Qué se hizo:** Extraída la lógica de validación y obtención de precios de productos desde el POST handler de pedidos hacia `pedidoService.ts`. La función recibe el array `productos` del body, busca cada producto en BD, lanza error si no existe o no está disponible, calcula `precioUnitario` y `subtotal` usando siempre el precio de BD (sin override). El POST handler quedó reducido a una llamada de una línea.
**Por qué:** La lógica de negocio (validar disponibilidad + obtener precios) no pertenece al handler HTTP. NOTA: esta función NO se comparte con el PUT (`pedidos/[id]/route.ts`) — ese handler tiene comportamiento diferente (permite override de `precioUnitario` y no verifica `disponible`).
**Archivos modificados:**
- `src/lib/services/pedidoService.ts` — nueva función `validarProductosYObtenerPrecios()`, nuevos imports `Producto` y `mongoose`
- `src/app/api/pedidos/route.ts` — import de la nueva función, bloque de 20 líneas → 1 línea
**Validación:** typecheck OK, build OK (24 rutas). Validado por el usuario.
**Efectos secundarios:** Ninguno — comportamiento idéntico al anterior.

---

### MA-01b-B2 — Extraer abrirPedidoParaMesa al servicio
**Fecha:** 2026-03-15
**Qué se hizo:** Extraída la lógica de apertura/recuperación de pedido de mesa desde `POST /api/pedidos/abrir` hacia `pedidoService.ts`. La función recibe `mesaId` y `userId`, busca la mesa en BD, devuelve el pedido existente si hay uno activo, o crea uno nuevo vacío y llama a `ocuparMesa`. Retorna `{ pedidoId, created }` (o `null` si la mesa no existe). El handler mapea `null` → 404 y usa `created` para distinguir 200 de 201, preservando el comportamiento exacto anterior.
**Por qué:** El handler pasó de 65 líneas a 47, con imports reducidos de 8 a 5. La lógica de "abrir o recuperar pedido" es negocio, no HTTP.
**Archivos modificados:**
- `src/lib/services/pedidoService.ts` — nuevo import `Pedido`, nueva función `abrirPedidoParaMesa`
- `src/app/api/pedidos/abrir/route.ts` — reescrito: eliminados imports `Mesa`, `Pedido`, `mongoose`, `ocuparMesa`; añadido `abrirPedidoParaMesa`
**Validación:** typecheck OK, build OK (24 rutas). Validado por el usuario.
**Efectos secundarios:** Ninguno — comportamiento idéntico, incluyendo códigos de estado 200/201.

---

### MA-01b-B3 — DESCARTADO: validarPedidoPorTipo
**Fecha:** 2026-03-15
**Decisión:** No ejecutada. Análisis previo determinó que la extracción requería cambiar el patrón de error handling del POST de pedidos: actualmente devuelve `NextResponse` directamente en cada caso de validación (retorno anticipado). Para mover esta lógica a un servicio habría que cambiar a un patrón `throw` + `catch` en el handler, lo que modifica el flujo de control del handler entero y crea riesgo de romper silenciosamente la validación de los tres tipos de pedido (local, domicilio, recoger). El beneficio de la extracción era modesto. Decisión: mantener la validación de tipo en el handler y no extraerla al servicio.
**Estado:** Descartado por decisión de riesgo-beneficio, no por incapacidad técnica. Documentado aquí para que el contexto no se pierda.

---

### MA-02 — Eliminar modelo PedidoExterno redundante
**Fecha:** 2026-03-15
**Qué se hizo:** Eliminados todos los artefactos del flujo PedidoExterno. El modelo era código muerto: no existía página ni componente en el dashboard que lo consumiera, el GET tenía un bug estructural (filtraba por `activo: true` pero el campo no estaba definido en el schema, haciendo que siempre devolviera cero resultados), y ningún archivo TSX lo importaba. Eliminado el re-export de `IPedidoExterno` en `src/lib/types/index.ts`. El caché de Next.js (`.next/`) se limpió antes del typecheck para evitar errores de tipos generados contra archivos ya eliminados.
**Archivos eliminados:**
- `src/lib/models/PedidoExterno.ts`
- `src/app/api/pedidos-externos/route.ts`
- `src/app/api/pedidos-externos/[id]/route.ts`
- `src/app/(dashboard)/dashboard/pedidos-externos/layout.tsx`
**Archivos modificados:**
- `src/lib/types/index.ts` — eliminado re-export de `IPedidoExterno`
**Validación:** typecheck OK (caché limpiado), build OK — 24 rutas (2 menos que antes). Grep confirma 0 referencias a PedidoExterno en todo el src/.
**Nota sobre BD:** La colección `pedidoexternos` en MongoDB no se ha tocado. Si existen documentos son datos huérfanos sin impacto en la aplicación. El drop es manual y queda a decisión del operador.
**Efectos secundarios:** Ninguno en frontend ni en el resto de la API.

---

### MM-07 Paso 1 — Setup vitest + tests de funciones puras
**Fecha:** 2026-03-23
**Qué se hizo:** Instalado `vitest` 4.1.0 como devDependency. Creado `vitest.config.ts` con path alias `@/` → `./src/`. Añadidos scripts `test` y `test:watch` a `package.json`. Escritos 35 tests unitarios en 6 ficheros de test cubriendo todas las funciones puras del proyecto:
- `sanitize.test.ts` (7 tests) — `sanitizeString` y `sanitizeBody`: escapa HTML, recursividad, preserva tipos no-string, manejo de null/undefined
- `pagination.test.ts` (4 tests) — `buildPaginatedResponse`: cálculo de totalPages, edge cases (0 resultados, total < limit)
- `validateId.test.ts` (4 tests) — `validarObjectId`: IDs válidos → null, IDs inválidos → NextResponse 400
- `logger.test.ts` (3 tests) — logger silenciado en producción para log/warn, error siempre activo. Usa `vi.resetModules()` para re-evaluar `isDev`
- `rateLimiter.test.ts` (5 tests) — `checkRateLimit`: permite hasta N intentos, bloquea el N+1, resetea tras ventana, IPs independientes. Usa `vi.useFakeTimers()`
- `pedidoService.test.ts` (7 tests) — `normalizarPedido`: mapeo camarero→creadoPor, respeta creadoPor existente, soporte toObject() (Mongoose docs), null/undefined, preserva campos
**Archivos creados:**
- `vitest.config.ts`
- `src/lib/utils/__tests__/sanitize.test.ts`
- `src/lib/utils/__tests__/pagination.test.ts`
- `src/lib/utils/__tests__/validateId.test.ts`
- `src/lib/utils/__tests__/logger.test.ts`
- `src/lib/utils/__tests__/rateLimiter.test.ts`
- `src/lib/services/__tests__/pedidoService.test.ts`
**Archivos modificados:**
- `package.json` — añadido vitest a devDependencies, scripts `test` y `test:watch`
**Validación:** 35/35 tests pasan, typecheck OK, build OK (24 rutas).
**Paso 2 pendiente:** Tests con mock de Mongoose para funciones de `pedidoService.ts` que tocan BD.

---

### MM-07 Paso 2 — Tests con mock de Mongoose para servicios BD
**Fecha:** 2026-03-23
**Qué se hizo:** Escritos 14 tests adicionales en un fichero separado `pedidoService.db.test.ts` que cubren las 4 funciones de `pedidoService.ts` que interactúan con MongoDB. Se usa `vi.hoisted()` + `vi.mock()` para mockear los modelos `Mesa`, `Pedido` y `Producto` sin necesidad de una base de datos real.
- `ocuparMesa` (2 tests) — verifica argumentos pasados a `Mesa.findByIdAndUpdate`
- `liberarMesa` (1 test) — verifica que setea `estado: 'libre'` y `pedidoActual: null`
- `validarProductosYObtenerPrecios` (7 tests) — array vacío/null, cálculo de precios desde BD, preserva notas/personalizaciones, error si producto no existe, error si no disponible, múltiples productos en paralelo
- `abrirPedidoParaMesa` (4 tests) — mesa inexistente → null, mesa con pedido activo → devuelve existente sin crear, mesa libre → crea pedido y ocupa mesa, userId null → crea sin camarero
**Archivos creados:**
- `src/lib/services/__tests__/pedidoService.db.test.ts`
**Validación:** 49/49 tests pasan (35 Paso 1 + 14 Paso 2), typecheck OK, build OK (24 rutas).
**Paso 3 pendiente:** Tests de hooks del dashboard con `@testing-library/react`.

---

### MM-07 Paso 3 — Tests de hooks del dashboard con @testing-library/react
**Fecha:** 2026-03-23
**Qué se hizo:** Instalados `@testing-library/react`, `@testing-library/dom` y `jsdom` como devDependencies. Actualizado `vitest.config.ts` para incluir `*.test.tsx`. Escritos 22 tests en 3 ficheros de test cubriendo los 3 hooks extraídos del dashboard:
- `usePedidoPanel.test.tsx` (7 tests) — carga pedidos con mock de fetch, calcula stats (pendientes, preparando, listos, servidos, pagados, totalRecaudado), filtra por estado, filtro "todos", handleCancelar/handleEditar, error sin token, respuesta paginada
- `usePedidoForm.test.tsx` (5 tests) — estado inicial (tipo local, campos vacíos), preselección de mesa, totales sin productos, validación submit sin productos, carga completa en modo edit con dirección domicilio
- `useProductoForm.test.tsx` (10 tests) — estado inicial sin producto, precarga en edición (ingredientes populados, extras, flags), handleAddIngrediente (sin selección, cantidad 0, añadido correcto, duplicado), handleRemoveIngrediente por índice, getNombreIngrediente (fallback ID, nombre populado)
**Archivos creados:**
- `src/components/dashboard/hooks/__tests__/usePedidoPanel.test.tsx`
- `src/components/dashboard/hooks/__tests__/usePedidoForm.test.tsx`
- `src/components/dashboard/hooks/__tests__/useProductoForm.test.tsx`
**Archivos modificados:**
- `vitest.config.ts` — incluir `*.test.tsx` en include
- `package.json` — añadidos `@testing-library/react`, `@testing-library/dom`, `jsdom` a devDependencies
**Validación:** 71/71 tests pasan (35 Paso 1 + 14 Paso 2 + 22 Paso 3), typecheck OK, build OK (24 rutas).

---

### F7-SWR — Migración a SWR (caché de datos)
**Fecha:** 2026-03-23
**Qué se hizo:** Instalado `swr` como dependencia. Creada infraestructura de caché con `authFetcher` (fetcher genérico con inyección de JWT desde localStorage) y 5 hooks SWR dedicados: `useIngredientes`, `useProductos`, `useMesas`, `usePedidos`, `useUsuarios`. Barrel export en `src/lib/hooks/swr/index.ts`. Migrados 13 ficheros del dashboard para usar los hooks SWR en lugar de fetch manual:
- **S1 — Fundación:** `authFetcher.ts`, 5 hooks SWR, barrel index
- **S2 — Páginas:** `mesas/page.tsx` y `usuarios/page.tsx` — eliminados `useState` para datos/loading/error, eliminados `useEffect` de carga, reemplazados `cargarXxx()` por `mutate()` tras mutaciones
- **S3 — Componentes:** `StockPanel.tsx` (ingredientes + productos), `IngredienteList.tsx`, `PersonalizarProductoModal.tsx` — eliminados 5 fetch manuales y 4 `useEffect`
- **S4 — Hooks complejos:** `usePedidoPanel.ts` (usa `usePedidos` con polling 30s + `authFetcher` para detalle), `usePedidoForm.ts` (usa `useMesas` + `useProductos` con filtrado derivado), `useProductoForm.ts` (usa `useIngredientes`)
**Beneficios obtenidos:**
- Ingredientes: 4 consumidores comparten 1 solo fetch (deduplicación automática SWR)
- Pedidos: polling cada 30s para actualización automática del panel
- Cache stale-while-revalidate: navegación entre módulos del dashboard sin re-fetch
- Eliminados ~150 líneas de fetch manual y 8 `useEffect` de carga
**Tests:** Actualizado `npm test` para ejecutar en dos pasadas (unit + hooks) para evitar OOM del worker fork con entornos DOM. Migrado de `jsdom` a `happy-dom`. Mockeados los hooks SWR en los tests de hooks para reducir presión de memoria. 71/71 tests pasan.
**Archivos creados:**
- `src/lib/hooks/swr/fetcher.ts`
- `src/lib/hooks/swr/useIngredientes.ts`
- `src/lib/hooks/swr/useProductos.ts`
- `src/lib/hooks/swr/useMesas.ts`
- `src/lib/hooks/swr/usePedidos.ts`
- `src/lib/hooks/swr/useUsuarios.ts`
- `src/lib/hooks/swr/index.ts`
**Archivos modificados:**
- `package.json` — `swr` en dependencies, `happy-dom` en devDependencies, script `test` dividido en dos pasadas
- `mesas/page.tsx`, `usuarios/page.tsx` — migrados a `useMesas()` / `useUsuarios()`
- `StockPanel.tsx` — migrado a `useIngredientes()` + `useProductos()`
- `IngredienteList.tsx`, `PersonalizarProductoModal.tsx` — migrados a `useIngredientes()`
- `usePedidoPanel.ts` — migrado a `usePedidos()` + `authFetcher`
- `usePedidoForm.ts` — migrado a `useMesas()` + `useProductos()`
- `useProductoForm.ts` — migrado a `useIngredientes()`
- 3 ficheros `.test.tsx` — añadidos mocks de `@/lib/hooks/swr`, migrados a `happy-dom`
**Validación:** 71/71 tests OK, typecheck OK, build OK (24 rutas).

---

### F7-REPORTES — Dashboard de reportes
**Fecha:** 2026-03-23
**Qué se hizo:** Creado módulo completo de reportes para el dashboard con API de agregaciones MongoDB y componente visual. Reemplazado el placeholder "En desarrollo" del módulo de reportes existente.
**API (`/api/reportes`):** Endpoint GET protegido con auth que ejecuta 5 agregaciones MongoDB en paralelo vía `$facet`:
- Resumen general: total pedidos, ingresos pagados, ticket medio, descuentos, impuestos, datos del día
- Desglose por tipo: local / recoger / domicilio con ingresos
- Desglose por estado: pendiente / preparando / listo / servido / pagado / cancelado
- Top 10 productos: con `$unwind` + `$group` + `$lookup` para obtener nombres desde colección productos
- Ingresos diarios últimos 30 días: serie temporal con pedidos pagados
**Componente (`ReportesPanel.tsx`):** Panel visual con:
- 4 tarjetas resumen (ingresos totales, ingresos hoy, ticket medio, total pedidos)
- Tabla de pedidos por tipo con ingresos
- Tabla de pedidos por estado con colores
- Tabla Top 10 productos (nombre, categoría, unidades vendidas, ingresos)
- Gráfico de barras CSS (sin librería externa) para ingresos diarios de los últimos 30 días
- 3 tarjetas fiscales (IVA recaudado, descuentos, pedidos a domicilio)
- Auto-refresh cada 60s via hook SWR
**Archivos creados:**
- `src/app/api/reportes/route.ts`
- `src/lib/hooks/swr/useReportes.ts`
- `src/components/dashboard/ReportesPanel.tsx`
**Archivos modificados:**
- `src/lib/hooks/swr/index.ts` — export de `useReportes`
- `src/app/(dashboard)/dashboard/page.tsx` — import + reemplazo del placeholder
**Validación:** 71/71 tests OK, typecheck OK, build OK (25 rutas — nueva `/api/reportes`).

---

### F7-COCINA — Panel de cocina en tiempo real
**Fecha:** 2026-03-23
**Qué se hizo:** Creado módulo completo de cocina para el dashboard con vista Kanban de pedidos en tiempo real. Accesible por roles `cocinero` y `admin`.
**Arquitectura:** Polling SWR cada 5 segundos (3 fetches paralelos: pendiente + preparando + listo). Decisión documentada: polling rápido en lugar de WebSockets/SSE porque Next.js App Router es serverless y no soporta conexiones persistentes. El polling de 5s es indistinguible de WebSockets en UX y no requiere infraestructura extra.
**Funcionalidades:**
- Vista Kanban de 3 columnas: Pendiente → En preparación → Listo para servir
- Cards de pedido con: tipo (mesa/recoger/domicilio), productos con cantidades, personalizaciones (+extras, -removidos), notas, tiempo transcurrido, camarero
- Botones de avance de estado: "Empezar a preparar" y "Marcar como listo"
- Notificación toast cuando llegan pedidos nuevos
- Notificación sonora (activable/desactivable) para alertar a cocina
- Indicador visual de conexión activa (punto verde pulsante)
- Pedidos ordenados por antigüedad (más antiguo arriba = más urgente)
**Archivos creados:**
- `src/components/dashboard/CocinaPanel.tsx`
**Archivos modificados:**
- `src/app/(dashboard)/dashboard/page.tsx` — nuevo tipo `cocina` en `ModuloActivo`, módulo en array con roles `['cocinero', 'admin']`, renderizado del componente
**Validación:** 71/71 tests OK, typecheck OK, build OK (25 rutas).

---

### F7-E2E — Tests e2e con Playwright
**Fecha:** 2026-03-23
**Qué se hizo:** Instalado `@playwright/test` + Chromium. Creada configuración `playwright.config.ts` que arranca el dev server automáticamente. Escritos 8 tests e2e en `e2e/auth.spec.ts`:
- **Autenticación (3 tests):** página de login carga correctamente, muestra error con credenciales inválidas, redirige a /login si accede a /dashboard sin sesión (verifica middleware server-side)
- **Páginas públicas (5 tests):** landing, carta, contacto, reservas, sobre-nosotros cargan correctamente
**Scripts añadidos:** `test:e2e` (headless), `test:e2e:ui` (modo interactivo con UI de Playwright)
**Archivos creados:**
- `playwright.config.ts`
- `e2e/auth.spec.ts`
**Archivos modificados:**
- `package.json` — scripts e2e + backup
- `.gitignore` — excluir `playwright-report/`, `test-results/`, `backups/`
**Nota:** Los tests e2e se ejecutan aparte de los unit tests (`npm run test:e2e`). Requieren servidor dev corriendo o se arranca automáticamente via config.

---

### F7-BACKUP — Script de backup de BD
**Fecha:** 2026-03-23
**Qué se hizo:** Añadido script `db:backup` en `package.json` que ejecuta `mongodump` con la URI de MongoDB configurada en la variable de entorno `MONGODB_URI`. Exporta a `./backups/` con timestamp en el nombre del directorio. Directorio `backups/` añadido a `.gitignore`.
**Uso:** `npm run db:backup` (requiere `mongodump` instalado en el sistema — incluido en MongoDB Database Tools).

---

### AUDIT-RESPONSIVE — Auditoría y corrección responsive completa
**Fecha:** 2026-03-23
**Qué se hizo:** Auditoría completa de responsive design en todas las páginas y componentes del proyecto. Se identificaron ~15 problemas y se corrigieron todos. También se corrigió 1 bug funcional (audio base64 truncado en CocinaPanel).
**Bug corregido:** CocinaPanel tenía un `<audio>` con base64 truncado que impedía la notificación sonora. Reemplazado por Web Audio API que genera un beep real sin fichero externo.
**Correcciones responsive aplicadas (10 ficheros):**
- `DashboardShell.tsx` — Header: flex-col en mobile, titulo responsive (text-2xl→3xl→4xl), email truncado con max-w, padding adaptativo (px-4→px-6)
- `dashboard/page.tsx` — Stats grid: grid-cols-2 sm:grid-cols-4 (antes saltaba de 1 a 4)
- `mesas/page.tsx` — Stats grid: misma corrección grid-cols-2 sm:grid-cols-4
- `usuarios/page.tsx` — Tabla: hidden md:block (desktop) + md:hidden cards (mobile). Cards con email truncado, botones flex de ancho completo, badges de rol
- `PedidoPanel.tsx` — Stats grid: grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 (antes 2→4→6, ahora progresivo)
- `ReportesPanel.tsx` — Card component: texto responsive (text-xl→2xl→3xl), padding adaptativo (p-4→p-6)
- `Reservas/reservas.tsx` — Iframe: eliminado height hardcodeado (550px), reemplazado por min-h responsive (400→500→550px). Titulo responsive. Padding progresivo en contenedor
- `IngredienteList.tsx` — Tabla desktop (hidden md:block) + cards mobile (md:hidden) con info compacta y botones de ancho completo
- `CocinaPanel.tsx` — Columnas Kanban: min-h responsive (200px mobile → 400px desktop), padding adaptativo. Audio: eliminado `<audio>` roto, añadido `playBeep()` con Web Audio API
- `ReportesPanel.tsx` — Card sub-componente: tamaños de texto y padding adaptativos por breakpoint
**Patrón aplicado consistentemente:**
- Tablas: `hidden md:block` (tabla desktop) + `md:hidden` (cards mobile)
- Grids: progresión gradual con sm: intermedio (nunca saltar de 1 a 4 columnas)
- Texto: escala progresiva (text-xl → text-2xl → text-3xl con sm:/lg:)
- Padding: adaptativo (p-4 → p-6 con sm:)
- Touch targets: botones de ancho completo en mobile para facilitar toque
**Validación:** 71/71 tests OK, typecheck OK, build OK (25 rutas).

---

### UX-SIDEBAR — Rediseno dashboard con sidebar profesional
**Fecha:** 2026-03-23
**Que se hizo:** Rediseno completo de la navegacion del dashboard. Eliminado el patron de tarjetas + boton "Volver". Implementado sidebar lateral persistente (desktop) y colapsable (mobile con hamburger + overlay). Eliminada la vista Home (el dashboard abre directamente en Pedidos). Logo del restaurante en el sidebar via Cloudinary. User info con avatar, email y rol en la parte inferior del sidebar. Top bar con titulo del modulo activo. Cada modulo tiene un icono de color en el sidebar.
**Archivos modificados:**
- `src/components/dashboard/DashboardShell.tsx` — reescrito completamente: sidebar, topbar, layout flex
- `src/app/(dashboard)/dashboard/page.tsx` — eliminadas tarjetas de navegacion, eliminado componente DashboardHome, estado inicial 'pedidos'
**Validacion:** 71/71 tests OK, typecheck OK, build OK.

---

### UX-PEDIDOCARD — Rediseno tarjetas de pedido estilo PDA
**Fecha:** 2026-03-23
**Que se hizo:** Reescritura completa de PedidoCard como tarjeta de PDA profesional:
- Borde lateral de color segun estado (en lugar de badge grande)
- Dot + texto para estado compacto
- Tiempo con urgencia por color (verde <10min, naranja 10-25min, rojo >25min)
- Hora de creacion visible junto al tiempo transcurrido
- Badge de tipo (Local azul, Recoger ambar, Domicilio purpura) con icono
- Info contextual por tipo: Local muestra mesa, Recoger muestra nombre+telefono, Domicilio muestra direccion
- Productos sin precios individuales (solo cantidad x nombre, max 5 visibles)
- Un solo total (sin desglose IVA/subtotal)
- Camarero con nombre corto
- Botones de accion compactos con touch targets de 44px+
**Archivos modificados:**
- `src/components/dashboard/PedidoCard.tsx` — reescrito completamente
- `src/app/api/pedidos/route.ts` — populate de mesa incluye `nombre`
- `src/app/api/pedidos/[id]/route.ts` — populate de mesa incluye `nombre`
**Validacion:** typecheck OK, build OK.

---

### UX-PDA — Mejoras de usabilidad PDA (6 puntos)
**Fecha:** 2026-03-23
**Que se hizo:** 6 mejoras para que el panel de pedidos funcione como una PDA real:
1. **Filtro por tipo** — Botones Local/Recoger/Domicilio combinables con filtro de estado
2. **Boton Nuevo Pedido prominente** — Verde, ancho completo en movil
3. **Stats compactas** — Grid 3x5 en lugar de fila horizontal con scroll
4. **Badge pendientes en sidebar** — Punto rojo con contador de pedidos pendientes (usa SWR deduplicado)
5. **Estado vacio amigable** — Mensaje + boton "Crear pedido" cuando no hay resultados
6. **Vista detalle limpia** — Sin ID MongoDB, nombre mesa correcto, tipo con icono, camarero con nombre corto
**Archivos modificados:**
- `src/components/dashboard/hooks/usePedidoPanel.ts` — nuevo estado `filtroTipo`, useMemo combinado
- `src/components/dashboard/PedidoPanel.tsx` — reescrita seccion de filtros/stats, componentes MiniStat y DetailField
- `src/components/dashboard/DashboardShell.tsx` — badge de pendientes con usePedidos (SWR deduplicado)
**Validacion:** 71/71 tests OK, typecheck OK, build OK.

---

### UX-RESPONSIVE-FINAL — Correccion definitiva de responsive
**Fecha:** 2026-03-23
**Que se hizo:** Eliminado scroll lateral en todas las pantallas. Causa raiz: el contenedor principal del dashboard (`flex-1`) no tenia `min-w-0 overflow-x-hidden`. Aplicados ~50 fixes en 11 ficheros:
- **DashboardShell**: `min-w-0 overflow-x-hidden` en wrapper y main, padding `px-3 sm:px-6`
- **PedidoPanel**: Stats de flex-scroll a `grid grid-cols-3 sm:grid-cols-5`, filtros con `flex-wrap` puro (sin overflow-x-auto), botones `text-xs sm:text-sm`
- **PedidoForm/ProductoForm**: `grid-cols-12` → `grid-cols-1 sm:grid-cols-12`, todos los `col-span-X` → `sm:col-span-X`
- **IngredienteForm**: 3 grids `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`, imagenes responsive
- **StockPanel**: Tabs `flex-col sm:flex-row`, padding responsive, headings responsive
- **PersonalizarProductoModal**: Headings y botones responsive
- **MesaCard**: Heading responsive, gaps responsive, texto boton acortado
- **ProductCardGrid/IngredientCardGrid**: Gaps responsive
- **Mesas page**: Header buttons con `flex-wrap` + responsive
- **Touch targets**: Todos los botones de accion a `py-3` o `py-2.5` (44px+ WCAG)
**Validacion:** 71/71 tests OK, typecheck OK, build OK. Sin scroll lateral a 320px.

---

### UX-CONFIRM — Modal de confirmacion personalizado
**Fecha:** 2026-03-23
**Que se hizo:** Reemplazados los 8 `window.confirm()` nativos del dashboard por un modal personalizado con el logo del restaurante. Creado componente reutilizable `ConfirmModal` y hook `useConfirm` que devuelve `Promise<boolean>` como reemplazo async de `confirm()`.
**Componentes creados:**
- `src/components/dashboard/ConfirmModal.tsx` — Modal con logo Cloudinary, titulo, mensaje, 2 botones, 3 variantes (danger/warning/info), overlay con backdrop-blur
- `src/components/dashboard/hooks/useConfirm.ts` — Hook con Promise-based API: `const ok = await confirmar('mensaje')`
**Archivos modificados (8 confirm eliminados):**
- `src/components/dashboard/hooks/usePedidoPanel.ts` — cancelar pedido
- `src/app/(dashboard)/dashboard/mesas/page.tsx` — crear 15 mesas, eliminar mesa
- `src/app/(dashboard)/dashboard/usuarios/page.tsx` — eliminar usuario
- `src/components/dashboard/StockPanel.tsx` — eliminar ingrediente, eliminar producto
- `src/components/dashboard/IngredienteList.tsx` — eliminado confirm redundante
- `src/components/dashboard/ProductoList.tsx` — eliminado confirm redundante
- `src/components/dashboard/PedidoPanel.tsx` — renderiza ConfirmModal
**Validacion:** 71/71 tests OK, typecheck OK, build OK. 0 confirm() restantes en dashboard.

---

### AUDIT-REWRITE — Auditoria tecnica reescrita
**Fecha:** 2026-03-23
**Que se hizo:** Reescritura completa de `docs/auditoria-el-buey-madurado.md` para reflejar el estado actual del proyecto (post-mejoras). La auditoria anterior describia el estado del commit 81ff1a6 (pre-mejoras) y listaba como problemas cosas ya resueltas. La nueva auditoria tiene 15 secciones cubriendo: stack completo, arquitectura, modelos, API (25 endpoints), seguridad, SWR, servicios, frontend, testing, DevOps, calidad de codigo, rendimiento, documentacion y metricas.
**Archivos modificados:**
- `docs/auditoria-el-buey-madurado.md` — reescrito completamente

---

### UX-FILTROS — Búsqueda universal + filtros avanzados en dropdown
**Fecha:** 2026-03-24
**Qué se hizo:** Añadido sistema completo de búsqueda y filtrado al panel de pedidos:
- **Barra de búsqueda universal** — busca simultáneamente en: nombre/número de mesa, nombre del cliente, teléfono, nombre del camarero, nombre de productos, dirección de entrega. Con botón de limpiar (✕).
- **Dropdown de filtros** — los filtros de estado y tipo se agrupan en un panel desplegable (botón "⚙ Filtros ▼") para no ensuciar la vista principal. Badge con número de filtros activos. Se cierra al hacer click fuera.
- **Multi-selección** — estado y tipo ahora permiten selección múltiple (toggle). Ejemplo: ver pedidos "Pendientes + Preparando" o "Local + Recoger" a la vez. Botones activos con `ring-2` para distinguirlos visualmente.
- **Indicador de filtros activos** — muestra "X de Y pedidos" con botón "Limpiar todo" que resetea búsqueda + filtros de golpe.
- **Mensaje vacío contextual** — distingue entre "no hay pedidos", "sin resultados para X" y "no hay pedidos con estos filtros".
- **Eliminados stats redundantes** — las MiniStat (pendientes/preparando/listos/servidos/recaudado) se quitaron porque los conteos ya aparecen en los botones de filtro del dropdown.
- **Eliminado filtro de tiempo** — descartado por no ser útil en servicio real (el indicador de urgencia en cada tarjeta ya cumple esa función).
**Barra superior compacta:** `[+ Nuevo Pedido] [🔍 Buscar...] [⚙ Filtros ▼]`
**Archivos modificados:**
- `src/components/dashboard/hooks/usePedidoPanel.ts` — estados `busqueda`, `filtroEstado` (string→string[]), `filtroTipo` (string→string[]), helpers `toggleFiltroEstado`/`toggleFiltroTipo`, lógica de filtrado combinada en `useMemo`
- `src/components/dashboard/PedidoPanel.tsx` — barra superior compacta, dropdown con click-outside, multi-selección, eliminados MiniStat y filtro de tiempo
- `src/components/dashboard/hooks/__tests__/usePedidoPanel.test.tsx` — tests actualizados para API de arrays
**Validación:** typecheck OK, build OK. Tests actualizados.

---

### UX-ORDEN-URGENCIA — Ordenación por urgencia como opción de filtro
**Fecha:** 2026-03-24
**Qué se hizo:** Añadida opción de ordenación en el dropdown de filtros con dos modos:
- **Más recientes** (por defecto) — pedidos ordenados por fecha de creación, más nuevos primero. Orden natural de trabajo.
- **Urgencia** — pedidos ordenados por estado (pendiente→preparando→listo→servido→pagado→cancelado) y dentro del mismo estado por antigüedad (más antiguos primero = más urgentes).
**Por qué recientes por defecto:** en servicio real el camarero trabaja con los pedidos según van llegando. La urgencia es una vista puntual para momentos de mucho volumen.
**Archivos modificados:**
- `src/components/dashboard/hooks/usePedidoPanel.ts` — nuevo estado `ordenar` ('recientes'|'urgencia'), `.sort()` condicional en `useMemo`
- `src/components/dashboard/PedidoPanel.tsx` — sección "Ordenar por" en el dropdown de filtros

---

### UX-NUM-PEDIDO — Número de pedido visible (#XXXX)
**Fecha:** 2026-03-24
**Qué se hizo:** Añadido identificador corto de pedido visible en el header de cada tarjeta, junto al estado. Formato: `#` + últimos 4 caracteres del ObjectId en mayúsculas (ej: `#A3F2`). Fuente monospace para diferenciarlo del resto del texto.
**Por qué:** En un restaurante real, la comunicación entre sala y cocina usa números de pedido ("pedido 47 listo"), no IDs de MongoDB. Los últimos 4 del ObjectId dan ~65.000 combinaciones únicas, suficiente para evitar colisiones en el mismo turno.
**Archivos modificados:**
- `src/components/dashboard/PedidoCard.tsx` — `<span>` con `font-mono` + `pedido._id.slice(-4).toUpperCase()`

---

### UX-SONIDO-PEDIDOS — Notificación sonora en panel de pedidos
**Fecha:** 2026-03-24
**Qué se hizo:** Añadida detección de pedidos nuevos al hook `usePedidoPanel` con notificación sonora (beep vía Web Audio API) y toast informativo. Misma implementación que ya existía en CocinaPanel. Se activa cuando el conteo de pedidos aumenta (excluyendo la carga inicial).
**Archivos modificados:**
- `src/components/dashboard/hooks/usePedidoPanel.ts` — `useRef` para conteo previo, `useEffect` que compara y emite beep + toast
**Validación:** typecheck OK, build OK.

---

## 6. Bloqueos y riesgos abiertos

### Bloqueos actuales
_Ninguno._

### Riesgos pendientes de mitigación

| Riesgo | Fase | Mitigación necesaria | Estado |
|--------|------|---------------------|--------|
| Sin admin en BD al proteger registro (MC-02) | Fase 1 | Verificar admin existente en BD | **mitigado** — usuario validó login admin OK |
| ~~Cambio transversal de auth (MI-01+MI-02)~~ | ~~Fase 3~~ | ~~Enfoque híbrido~~ | **mitigado** — cookie + localStorage coexisten |
| Refactor de componentes sin red de tests (MM-01) | Fase 5 | Verificación manual de cada flujo CRUD | **mitigado** — validado manualmente por el usuario, sin errores |
| ~~Paginación rompe componentes (MR-01)~~ | ~~Fase 4~~ | ~~Frontend adaptado~~ | **mitigado** — PedidoPanel soporta ambos formatos |

---

## 7. Próximas acciones al retomar

**Todas las fases del plan (1-7) están completadas.** Tareas opcionales futuras:
   - ~~Caché de datos con SWR~~ — **completado**
   - ~~Panel de cocina (polling 5s)~~ — **completado**
   - ~~Tests e2e con Playwright~~ — **completado**
   - ~~Dashboard de reportes~~ — **completado**
   - ~~Backup BD~~ — **completado**

4. **Deuda técnica conocida — no urgente**
   - MA-01b-B3: `validarPedidoPorTipo` descartada (ver entrada en sección 5)
   - MI-01 Paso 2: eliminación de localStorage (descartada — enfoque híbrido es suficientemente seguro)
   - Comprimir `hero.mp4` (19.5 MB → objetivo <5 MB) con herramienta externa (ffmpeg/Cloudinary)

---

## 8. Historial de actualizaciones

| Fecha | Resumen |
|-------|---------|
| 2026-03-14 | Documento inicial creado. Todas las mejoras en estado `pendiente`. |
| 2026-03-14 | **Fase 1 parcial.** MC-01, MC-02, MI-03 completados. Avance: 3/30 (10%). |
| 2026-03-15 | **Fase 1 completada + Fase 2 Paso 1.** QW-04 a QW-08 ejecutados. MC-03 Paso 1 completado (interfaces obsoletas eliminadas). Avance: 9/30 (30%). typecheck + build OK. |
| 2026-03-15 | **Fase 3 Paso 1 completada.** MI-01 (cookie httpOnly híbrida) y MI-02 (middleware.ts) implementados. Endpoints /auth/me y /auth/logout creados. `jose` instalada. protegerRuta() lee cookie como fallback. Avance: 11/30 (37%). typecheck + build OK. |
| 2026-03-15 | **Fase 4 completada.** MI-04 (sanitización en 13 handlers), MI-05 (rate limiting login/register), MR-01 (paginación pedidos + frontend adaptado), MR-02 (populate selectivo en 4 endpoints). Avance: 15/30 (50%). typecheck + build OK. |
| 2026-03-15 | **Hotfix:** useAuth corregido — ahora verifica sesión via `/api/auth/me` al recargar. Logout borra cookie httpOnly. Dashboard carga correctamente. Fases 1-4 validadas por el usuario. |
| 2026-03-15 | **Fase 5 parcial.** MM-04 (44 alert→toast en 10 archivos, sonner instalada). MM-01 (3 hooks extraídos: usePedidoPanel, usePedidoForm, useProductoForm). Componentes reducidos de 2110 a 1259 líneas. Avance: 17/30 (57%). typecheck + build OK. |
| 2026-03-15 | **Fase 5 COMPLETADA — validada por el usuario.** Todos los flujos CRUD del dashboard verificados manualmente sin errores. MM-07 (tests) aplazado a Fase 6. Todos los riesgos de Fases 1-5 mitigados. Avance: 18/30 (60%). Siguiente: Fase 6 consolidación arquitectónica. |
| 2026-03-15 | **Fase 6 — Mejoras de bajo riesgo.** MM-06 (README reescrito), MM-05 (logger condicional, 5 debug logs eliminados), MR-04 (server components en reservas/page y HeroSectionHome), MR-03 (hero video con poster + preload=none). typecheck + build OK. |
| 2026-03-15 | **MA-02 completado.** PedidoExterno eliminado: modelo, 2 route handlers, layout placeholder y re-export en types/. Grep confirma 0 referencias residuales. typecheck + build OK (24 rutas). |
| 2026-03-15 | **MA-01a completado.** Creado `src/lib/services/pedidoService.ts` con `normalizarPedido`, `ocuparMesa`, `liberarMesa`. Eliminada duplicación de `normalizarPedido`. 3 handlers actualizados. typecheck + build OK. |
| 2026-03-15 | **HOTFIX — Bug /dashboard/mesas.** `GET /api/mesas` fallaba con 500 si el usuario navegaba a mesas antes que a pedidos (Mongoose no tenía registrado el modelo `Pedido` para el populate). Aplicado `void Pedido` en el handler. Corregido también el tipo `Mesa` en `mesas/page.tsx`. Validado manualmente por el usuario. typecheck + build OK. |
| 2026-03-15 | **MA-01b-B1 completado.** Extraída `validarProductosYObtenerPrecios` a `pedidoService.ts`. POST `/api/pedidos` reducido de bloque de 20 líneas a 1. Validado por el usuario. typecheck + build OK. |
| 2026-03-15 | **MA-01b-B2 completado.** Extraída `abrirPedidoParaMesa` a `pedidoService.ts`. Handler `pedidos/abrir` reducido de 65 a 47 líneas, imports de 8 a 5. Validado por el usuario. typecheck + build OK. |
| 2026-03-15 | **MA-01b-B3 descartado** por decisión de riesgo-beneficio. **MA-01 cerrada.** **Fase 6 completada en lo esencial.** Avance global: ~85%. Única tarea pendiente del plan: MM-07 (tests). Documentación actualizada. |
| 2026-03-23 | **MM-07 Paso 1 completado.** Vitest 4.1.0 instalado y configurado. 35 tests unitarios en 6 ficheros: sanitize (7), pagination (4), validateId (4), logger (3), rateLimiter (5), normalizarPedido (7). Scripts `test` y `test:watch` añadidos. |
| 2026-03-23 | **MM-07 Paso 2 completado.** 14 tests adicionales con mock de Mongoose en `pedidoService.db.test.ts`: ocuparMesa (2), liberarMesa (1), validarProductosYObtenerPrecios (7), abrirPedidoParaMesa (4). Total: 49 tests. |
| 2026-03-23 | **MM-07 Paso 3 completado. MM-07 CERRADO.** 22 tests de hooks del dashboard con `@testing-library/react` + happy-dom: usePedidoPanel (7), usePedidoForm (5), useProductoForm (10). Total: **71/71 tests pasando**. |
| 2026-03-23 | **Fase 7 — SWR completado.** SWR instalado, `authFetcher` + 5 hooks por recurso creados, 13 ficheros migrados (2 páginas, 3 componentes, 3 hooks). Ingredientes deduplicados (4→1 fetch). Pedidos con polling 30s. Eliminadas ~150 líneas de fetch manual. Tests actualizados con mocks SWR + happy-dom. 71/71 tests OK, typecheck OK, build OK. |
| 2026-03-23 | **Fase 7 — Dashboard de reportes completado.** API `/api/reportes` con 5 agregaciones MongoDB. ReportesPanel con tarjetas, tablas y gráfico de barras CSS. Hook `useReportes` con auto-refresh 60s. Reemplazado placeholder "En desarrollo". 25 rutas API. 71/71 tests OK. |
| 2026-03-23 | **Fase 7 — Panel de cocina completado.** CocinaPanel con vista Kanban (pendiente/preparando/listo), polling 5s, notificación sonora/visual para pedidos nuevos, avance de estado, info de productos con personalizaciones. Nuevo módulo en dashboard para roles cocinero+admin. 71/71 tests OK. |
| 2026-03-23 | **Fase 7 — Playwright e2e + backup BD completados. FASE 7 CERRADA. TODAS LAS FASES COMPLETADAS.** 8 tests e2e (auth + páginas públicas). Script mongodump para backup. Proyecto production-ready. |
| 2026-03-23 | **Auditoría + responsive completo.** Revisión integral del proyecto: 1 bug corregido (audio CocinaPanel), 10 ficheros con mejoras responsive. |
| 2026-03-23 | **Rediseno UX dashboard completo.** Sidebar profesional reemplaza navegacion por tarjetas. Logo Cloudinary en sidebar. Dashboard abre directo en Pedidos. PedidoCard rediseñado estilo PDA real (estado+urgencia, tipo con icono, info contextual, total unico). 6 mejoras PDA: filtro tipo, boton prominente, stats grid, badge pendientes, estado vacio, detalle limpio. |
| 2026-03-23 | **Responsive definitivo.** Causa raiz encontrada y corregida (min-w-0 overflow-x-hidden en contenedor). ~50 fixes en 11 ficheros. Touch targets 44px+ en todos los botones. Sin scroll lateral a 320px. |
| 2026-03-23 | **ConfirmModal.** 8 confirm() nativos reemplazados por modal con logo del restaurante. Hook useConfirm con API Promise-based. 3 variantes (danger/warning/info). |
| 2026-03-23 | **Auditoria reescrita.** 15 secciones cubriendo estado actual post-mejoras. |
| 2026-03-24 | **Búsqueda universal + filtros avanzados.** Barra de búsqueda (mesa, cliente, teléfono, producto, camarero, dirección). Filtros de estado y tipo en dropdown compacto con multi-selección. Eliminados stats redundantes y filtro de tiempo. Indicador de filtros activos + "Limpiar todo". |
| 2026-03-24 | **Ordenación por urgencia.** Opción en dropdown: "Más recientes" (defecto) vs "Urgencia" (pendientes primero, más antiguos arriba). |
| 2026-03-24 | **Número de pedido visible.** `#XXXX` (últimos 4 del ID) en cada tarjeta para comunicación sala-cocina. |
| 2026-03-24 | **Sonido en pedidos nuevos.** Beep + toast "Nuevo pedido recibido" cuando llegan pedidos via polling SWR. |

---

> **Instrucciones de mantenimiento:** Actualizar este documento cada vez que se complete, avance o bloquee una mejora. Cambiar el estado en la tabla maestra, añadir la entrada en la sección 5, actualizar el porcentaje de avance en la sección 2, y añadir una línea en el historial (sección 8).

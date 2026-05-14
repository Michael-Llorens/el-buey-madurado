# Guía de capturas de pantalla — Memoria del PI

**Objetivo:** capturar 15 pantallas del proyecto en condiciones realistas para incluirlas en la Memoria. Esta es la acción de mayor impacto en la nota (+0,5 puntos según auditoría).

> Documento operativo de uso interno. No forma parte de la entrega oficial.

---

## 1. Preparación previa (10 minutos)

### 1.1. Configurar el entorno de captura

- [ ] **Abrir la web en navegador limpio.** Recomendado: Chrome o Firefox en modo de incógnito para que no aparezcan extensiones, barras de favoritos, etc.
- [ ] **Resolución del navegador:** maximizar a 1920×1080 (Full HD) para capturas de escritorio. La memoria se ve mucho mejor con capturas Full HD que con capturas a baja resolución.
- [ ] **Tema oscuro del sistema operativo:** el proyecto tiene paleta oscura; activarlo en Windows hace que las capturas sean más coherentes.
- [ ] **Datos de demo cargados en la base de datos:** que haya productos, ingredientes, mesas, pedidos de ejemplo y un par de usuarios con distintos roles. Si no hay, ejecutar el seed antes de capturar.

### 1.2. Herramienta de captura recomendada

- **Windows:** `Win + Shift + S` (Snipping Tool integrado) o **ShareX** (gratis, profesional, captura ventana específica).
- **Para capturas móvil:** abrir DevTools (`F12`) → modo responsive → seleccionar `iPhone 14 Pro` o `Pixel 7` → capturar.

### 1.3. Convenciones

- **Carpeta destino:** `docs/screenshots/`
- **Formato:** PNG (mejor calidad para textos e interfaces).
- **Nomenclatura:** `01-home.png`, `02-carta.png`, `03-detalle-producto.png`, etc. Números prefijados para mantener orden.
- **Resolución mínima:** 1280×720; ideal 1920×1080.
- **Sin datos sensibles:** verificar que no aparezcan tokens, emails reales del cliente, ni datos personales en pantalla.

---

## 2. Lista de capturas a tomar (priorizadas)

Marca cada una conforme las tomes. El orden es el sugerido para insertarlas en la Memoria.

### 2.1. Web pública (cara al cliente)

- [ ] **01-home.png** — Página de inicio (`/`)
  - **Qué mostrar:** hero principal con animación GSAP visible, eslogan, logo, llamada a la acción.
  - **Tip:** desplazar ligeramente para que se vea el inicio de la segunda sección.

- [ ] **02-carta.png** — Carta digital (`/carta`)
  - **Qué mostrar:** vista general con productos en grid, filtros por categoría visibles, búsqueda.
  - **Tip:** que se vean al menos 4-6 productos con imagen.

- [ ] **03-detalle-producto.png** — Detalle de un producto con personalización
  - **Qué mostrar:** modal/página de producto con extras, ingredientes a quitar, punto de carne (4 opciones), notas para cocina.
  - **Tip:** usa un chuletón o una hamburguesa premium con todas las opciones.

- [ ] **04-alergenos.png** — Información de alérgenos UE
  - **Qué mostrar:** los 14 alérgenos visibles en un producto, según Reglamento UE 1169/2011.
  - **Tip:** acerca el zoom del navegador al 110-125 % para que los iconos se lean bien.

- [ ] **05-carrito.png** — Carrito de la compra (`/pedir/carrito`)
  - **Qué mostrar:** al menos 2-3 productos añadidos, total calculado, selector recoger/domicilio.

- [ ] **06-checkout.png** — Checkout con Stripe Elements (`/pedir/checkout`)
  - **Qué mostrar:** formulario de datos del cliente + selector de método de pago + Stripe Elements visible (tarjeta, Apple Pay, Google Pay).
  - **Tip:** usa datos de prueba; nunca tu tarjeta real.

- [ ] **07-confirmacion.png** — Confirmación de pedido
  - **Qué mostrar:** página de confirmación con número de pedido y resumen.

- [ ] **08-seguimiento.png** — Seguimiento en tiempo real
  - **Qué mostrar:** página de tracking con barra animada de estado, tiempo estimado.

- [ ] **09-reservas.png** — Página de reservas (`/reservas`)
  - **Qué mostrar:** widget de CoverManager integrado o formulario de reserva.

- [ ] **10-sobre-nosotros.png** — Sobre nosotros (`/sobre-nosotros`)
  - **Qué mostrar:** sección con historia, valores, fotos del equipo, museo de la carne, reseñas Google integradas.

### 2.2. Dashboard interno (cara al staff)

- [ ] **11-login.png** — Pantalla de login del dashboard
  - **Qué mostrar:** formulario de acceso con campos email/contraseña.
  - **Tip:** sin credenciales rellenas.

- [ ] **12-dashboard-pedidos.png** — Vista principal de pedidos
  - **Qué mostrar:** panel con filtros, búsqueda, lista de pedidos del día, stats por turno.

- [ ] **13-dashboard-cocina.png** — Panel Kanban de cocina en vivo
  - **Qué mostrar:** las tres columnas (pendiente / preparando / listo) con tickets, **TimeBadge con semáforo de color visible** (verde/amarillo/rojo según tiempo). **Esta es una de las capturas más importantes** porque muestra el valor diferencial técnico.

- [ ] **14-dashboard-mesas.png** — Gestión de mesas
  - **Qué mostrar:** mapa visual con estado de mesas (libre/ocupada/reservada) y comensales por mesa.

- [ ] **15-dashboard-reportes.png** — Módulo de reportes con métricas
  - **Qué mostrar:** stats de ventas, productos top, comparativa hoy vs ayer, recaudación por turno.

### 2.3. Opcionales (suman pero no son críticas)

- [ ] **16-dashboard-productos.png** — CRUD de productos con imagen y alérgenos.
- [ ] **17-dashboard-usuarios.png** — Gestión de usuarios con asignación de roles.
- [ ] **18-movil-home.png** — Versión móvil de la home (modo responsive DevTools).
- [ ] **19-movil-carta.png** — Versión móvil de la carta.
- [ ] **20-google-business.png** — Perfil de Google Business gestionado por el promotor.

---

## 3. Dónde se insertan en la Memoria

Las capturas se referencian con sintaxis Markdown:

```markdown
![Descripción accesible de la captura](./screenshots/01-home.png)
*Figura 1: Página de inicio de El Buey Madurado*
```

| Captura | Sección de la Memoria donde se inserta |
|---|---|
| 01-home | §7.1. Web pública — apartado "Páginas" |
| 02-carta | §7.1. Web pública — apartado "Páginas" |
| 03-detalle-producto | §7.1. Web pública — apartado "Carrito persistente" |
| 04-alergenos | §4.5 PESTEL (Político-legal) o §7.1 |
| 05-carrito | §7.1. Web pública — apartado "Carrito persistente" |
| 06-checkout | §9. Integración de pagos (Stripe) |
| 07-confirmacion | §9. Integración de pagos |
| 08-seguimiento | §7.1. Web pública |
| 09-reservas | §7.1. Web pública |
| 10-sobre-nosotros | §4.4 Identidad de marca (refuerza el logo y la paleta) |
| 11-login | §8. Sistema de autenticación y autorización |
| 12-dashboard-pedidos | §7.2. Dashboard interno |
| 13-dashboard-cocina | §7.2. Dashboard interno — apartado "Cocina en vivo" |
| 14-dashboard-mesas | §7.2. Dashboard interno |
| 15-dashboard-reportes | §7.2. Dashboard interno — apartado "Reportes" |

> Después de tomar las capturas, avísame y te ayudo a insertarlas exactamente en cada sección, con su pie de figura ("Figura X: …") siguiendo numeración correlativa.

---

## 4. Checklist final de capturas

- [ ] Las 15 capturas principales tomadas.
- [ ] Todas guardadas en `docs/screenshots/` con la nomenclatura correcta.
- [ ] Resolución mínima 1280×720 (ideal 1920×1080).
- [ ] Sin datos sensibles visibles (tokens, contraseñas, emails reales).
- [ ] Insertadas en la Memoria con su pie de figura.
- [ ] Ningún archivo `.png` supera los 500 KB (comprimir con [tinypng.com](https://tinypng.com) si pesan más).

---

**Tiempo total estimado:** 1-2 horas.
**Impacto en nota:** +0,5 puntos sobre 10.

# 🎬 Guion del vídeo del funcionamiento

**Proyecto:** El Buey Madurado · Plataforma de transformación digital
**Duración objetivo:** 5–7 minutos
**Propósito:** vídeo de respaldo para la defensa del PI, por si el despliegue
falla durante la presentación. Las *Instruccions del PI* lo recomiendan explícitamente.

> Documento operativo de uso interno. No forma parte de la entrega oficial.

---

## 📋 Plan de tiempos

| Escena | Bloque | Duración |
|---|---|---:|
| 1 | Web pública — landing y carta | 1:00 |
| 2 | Pedido online completo (carrito → pago Stripe → seguimiento) | 1:30 |
| 3 | Login al panel de administración | 0:20 |
| 4 | Vista de cocina en vivo (Kanban) | 0:45 |
| 5 | Panel de pedidos + cobro | 1:00 |
| 6 | Gestión de mesas | 0:30 |
| 7 | Stock (productos + ingredientes) | 0:30 |
| 8 | Reportes con métricas | 0:30 |
| 9 | Modo claro (toggle) — el detalle final | 0:20 |
| | **Total** | **~6:25** |

---

## 🛠️ Antes de empezar — preparación

### Configuración del entorno

- [ ] **Cerrar todo lo que no sea el navegador.** Quita Slack, Discord, notificaciones de Windows.
- [ ] **Pestaña limpia en Chrome o Firefox.** Modo incógnito si tienes extensiones que se vean.
- [ ] **Resolución 1920×1080.** Si grabas en otra, ajusta zoom del navegador a 100 %.
- [ ] **Modo oscuro del SO activo.** El proyecto se ve mejor así.
- [ ] **Datos demo cargados:** productos, ingredientes, mesas, pedidos de ejemplo, varios usuarios con distintos roles. Si no, ejecutar el seed antes.
- [ ] **2 pestañas abiertas:**
  1. Web pública: `https://www.restauranteelbueymadurado.com`
  2. Otra pestaña con el login del dashboard

### Herramienta de grabación

- **Recomendado:** [OBS Studio](https://obsproject.com/) (gratis, profesional).
  - Configurar escena "Pantalla completa" capturando solo el monitor donde está Chrome.
  - Audio: si vas a narrar en directo, conectar micro. Si NO vas a narrar (vídeo sin voz),
    desactiva el audio en OBS.
  - Salida: 1920×1080, 30 fps, MP4.
- **Alternativa Windows:** `Win + G` (Game Bar). Más simple, menos control.

### Decisión: ¿con voz o sin voz?

- **Sin voz (más fácil):** vídeo de pantalla puro. Recomendado si no te sientes
  cómodo narrando en directo. Durante la defensa puedes tú comentar en voz
  mientras pasa el vídeo.
- **Con voz:** narras lo que pasa. Más profesional pero requiere más ensayos.

Este guion vale para ambas opciones — si grabas sin voz, ignora las **frases entre comillas**.

---

## 🎥 Escena 1 — Web pública: landing y carta (1:00)

**Acción:**
1. Cargar `https://www.restauranteelbueymadurado.com/` desde una pestaña nueva.
2. Esperar a que terminen las animaciones de entrada del hero.
3. Hacer **scroll lento** por la home: ver hero, galería, marquee, contacto, footer.
4. Click en **"Carta"** del menú superior.
5. Ver carta digital: scroll lento por las categorías (Entrantes, Carnes, Hamburguesas, Postres, Bebidas).
6. Hacer scroll horizontal por los slides de categorías (mostrar la animación GSAP).

**Si narras:**
> *"El Buey Madurado es un restaurante real de carne madurada en Xàtiva, Valencia. La web pública combina diseño con identidad de marca y carta digital con filtros, alérgenos UE visibles y búsqueda."*

**Tips:**
- Movimientos de ratón lentos. No hagas scroll a 1000 km/h.
- Para que se vean bien las animaciones GSAP, haz pausas de 1-2 segundos al llegar a cada sección.

---

## 🎥 Escena 2 — Pedido online completo (1:30)

**Acción:**
1. Desde la carta, ir a **"Pedir"** del menú superior (o pulsar el CTA de "Hacer pedido").
2. Elegir **"Recoger"** como tipo de pedido.
3. Click en **una hamburguesa** (ej: "Búfalo") → se abre el modal de personalización.
4. **Mostrar el modal en detalle:** los 4 puntos de carne con sus colores reales (poco hecho rojo, al punto rosa, hecho marrón, muy hecho gris). Pulsa cualquiera.
5. Quitar 1 ingrediente (ej: cebolla).
6. Añadir 1 extra si lo hay.
7. Cambiar cantidad a 2.
8. Click en **"Añadir al carrito"**.
9. Click en **una segunda hamburguesa igual** pero con **otro punto de carne**.
10. **Abrir el carrito** (panel lateral derecho).
11. **Mostrar que el carrito tiene 2 líneas separadas** — una con cada punto de carne (no las mezcló).
12. Click en **"Ir al checkout"**.
13. Rellenar formulario: nombre, teléfono, notas.
14. Elegir método de pago: **"Pagar ahora con tarjeta"**.
15. Click en **"Continuar al pago"**.
16. En el formulario de Stripe Elements:
    - Tarjeta: `4242 4242 4242 4242`
    - Fecha: cualquier futura (ej: `12/29`)
    - CVC: `123`
    - CP: `46800`
17. Click en **"Pagar"**.
18. Esperar a la página de **confirmación con número de pedido**.
19. Click en **"Seguir mi pedido"**.
20. **Mostrar la barra de progreso animada** del seguimiento en tiempo real.

**Si narras:**
> *"Flujo completo de pedido online: el cliente personaliza cada plato — punto de carne, extras, ingredientes a quitar — y el carrito diferencia productos idénticos con personalizaciones distintas. El pago va por Stripe en modo test, y el cliente recibe seguimiento en tiempo real con barra de progreso animada."*

**Tips:**
- El paso del pago Stripe es crítico — asegúrate de no tener errores antes de grabar.
- Si Stripe pide 3D Secure, completa el flujo (es parte de la demo).
- Si la página de seguimiento tarda en cargar, haz pausa de 2-3 segundos antes de cortar la escena.

---

## 🎥 Escena 3 — Login al dashboard (0:20)

**Acción:**
1. En otra pestaña: ir a `/login`.
2. **Mostrar el toggle de modo claro/oscuro arriba a la derecha** (la pill "Claro/Oscuro").
3. Introducir credenciales de admin (ej: `admin@buey.es` / `password123`).
4. Click en **"Iniciar Sesión"**.
5. Aterrizar en el dashboard.

**Si narras:**
> *"El panel de administración tiene autenticación JWT con cookie httpOnly. Tres roles: admin, camarero y cocinero, con permisos granulares en cada endpoint."*

---

## 🎥 Escena 4 — Vista de cocina en vivo (0:45)

**Acción:**
1. En el menú lateral, click en **"Cocina"**.
2. **Mostrar las 3 columnas Kanban:** Pendiente / Preparando / Listo.
3. Hacer hover sobre una tarjeta de pedido — mostrar el TimeBadge con el semáforo de color (verde / amarillo / rojo según tiempo).
4. Click en **"Empezar a preparar"** sobre un pedido pendiente → el pedido se mueve a "Preparando".
5. Click en **"Marcar como listo"** sobre uno en preparación → se mueve a "Listo".
6. Esperar 5 segundos sin hacer nada → el panel se refresca automáticamente vía SWR.

**Si narras:**
> *"Vista en vivo para la cocina con tres columnas estilo Kanban, refresh automático cada 5 segundos, semáforo de tiempo y notificación sonora cuando entra un pedido nuevo."*

**Tips:**
- El sonido del beep no se grabará bien si tienes los altavoces bajos — opcional silenciar.
- Si tienes pocos pedidos pendientes, abre una pestaña con la web pública y haz un pedido rápido durante la grabación. Verás cómo aparece en cocina en tiempo real.

---

## 🎥 Escena 5 — Panel de pedidos + cobro (1:00)

**Acción:**
1. En el sidebar, click en **"Pedidos"**.
2. **Mostrar la cabecera:** filtros por estado, tipo, tiempo, búsqueda libre, ordenación.
3. Pulsar el filtro **"Listo"** — solo aparecen los listos.
4. Limpiar filtros, click en una **tarjeta de pedido de tipo "local"** (con mesa asignada).
5. Mostrar el detalle del pedido en el modal.
6. Click en **"Cobrar"**.
7. **Mostrar el modal de cobro:**
   - Elegir **"Efectivo"**.
   - Introducir importe recibido (ej: si total es 33,88 €, recibido 40 €).
   - **Mostrar el cálculo automático del cambio:** 6,12 €.
8. Click en **"Confirmar cobro"**.
9. Mostrar el toast de éxito.
10. **Mostrar las stats arriba** del panel (total recaudado actualizado).

**Si narras:**
> *"Panel de pedidos con filtros multi-selección, búsqueda libre y stats por turno. Cobro con cálculo automático de cambio. Al cobrar, la mesa se libera automáticamente."*

---

## 🎥 Escena 6 — Gestión de mesas (0:30)

**Acción:**
1. Click en **"Mesas"** del sidebar.
2. **Mostrar la vista mapa con todas las mesas:** libres (verde), ocupadas (rojo), reservadas (amarillo).
3. Click sobre una mesa libre → se ofrece **"Abrir pedido"** o **"Reservar"**.
4. Click en **"Abrir pedido"** → se redirige al formulario de pedido en mesa.
5. Volver atrás.
6. Mostrar también la vista lista con stats arriba: X libres, X ocupadas, X reservadas.

**Si narras:**
> *"Mapa visual de mesas con stats en tiempo real. Cuando se cobra un pedido, la mesa se libera automáticamente y resetea los comensales a cero."*

---

## 🎥 Escena 7 — Stock (productos + ingredientes) (0:30)

**Acción:**
1. Click en **"Stock"** del sidebar.
2. Mostrar el panel con tabs: **Productos** / **Ingredientes**.
3. Aplicar filtros: categoría, búsqueda, disponibilidad.
4. Click en un producto para mostrar el formulario de edición → cerrarlo sin guardar.
5. Cambiar a tab **"Ingredientes"**.
6. **Mostrar los alérgenos UE** de algún ingrediente (los 14 regulados).

**Si narras:**
> *"Gestión unificada de productos e ingredientes con filtros y CRUD inline. Cada ingrediente declara los alérgenos según el Reglamento UE 1169/2011, validado a nivel de schema."*

---

## 🎥 Escena 8 — Reportes (0:30)

**Acción:**
1. Click en **"Reportes"** del sidebar.
2. **Mostrar las métricas principales** que vayan apareciendo: total recaudado, número de pedidos, ticket medio, comparativa hoy vs ayer.
3. Mostrar la **gráfica de productos top** (10 más vendidos en 30 días).
4. Mostrar la **gráfica de evolución mensual** o **distribución horaria**.
5. Si hay distribución por método de pago / tipo de pedido, mostrarla.

**Si narras:**
> *"Módulo de reportes con agregaciones de MongoDB sobre datos reales del negocio: productos top, evolución mensual, distribución por método de pago y pedidos por hora para detectar picos de demanda."*

---

## 🎥 Escena 9 — Modo claro como detalle final (0:20)

**Acción:**
1. Volver al panel de **Pedidos** (cualquier módulo con datos visibles funciona).
2. **Click en el icono 🌙 del header** (esquina superior derecha).
3. **Mostrar la transición** instantánea a modo claro:
   - El logo del sidebar cambia al toro del favicon sobre cuadrado blanco.
   - El header se vuelve blanco.
   - Las cards mantienen sus colores de marca.
4. Hacer **scroll por las tarjetas** para mostrar que todo se ve coherente.
5. **Pulsar de nuevo** el toggle → vuelve a oscuro.

**Si narras:**
> *"Y como detalle final, el panel admin tiene modo claro completo: toggle persistente, sin parpadeo al recargar, y la web pública mantiene su tema oscuro fijo sin afectarse."*

---

## 🎬 Post-producción (opcional)

Si quieres editar el vídeo después de grabar:

- **Cortar inicios/finales sin contenido** (las animaciones de carga inicial pueden ser largas).
- **Acelerar partes lentas** (ej: rellenar un formulario largo a 1.5×).
- **Subtítulos** o **texto on-screen** indicando qué pantalla aparece, especialmente si vas a usar el vídeo sin narración durante la presentación.
- **Música de fondo** opcional: baja, instrumental, no copyright. Royalty-free en YouTube Audio Library.

**Software gratuito recomendado:**
- DaVinci Resolve (profesional, gratis)
- OpenShot (más simple)
- ClipChamp (viene con Windows)

---

## ✅ Checklist final antes de exportar

- [ ] Resolución 1920×1080 o 1280×720
- [ ] Duración entre 5 y 8 minutos
- [ ] Sin notificaciones, popups, ni datos personales visibles
- [ ] Audio (si lo hay) sin ruidos de fondo
- [ ] Formato MP4 (más compatible)
- [ ] Tamaño < 500 MB (si lo subes a OneDrive del tutor)
- [ ] Nombrado: `Demo-ElBueyMadurado-v1.mp4`

---

## 📁 Dónde guardarlo

- **Local:** carpeta del proyecto, fuera de git: `~/Videos/PI/`
- **Compartido con tutor:** subirlo al **OneDrive del centro** donde están las entregas
- **Para presentación:** copiarlo a un **USB de respaldo** + tenerlo abierto en una pestaña local del navegador durante la defensa (por si falla el deploy en vivo)

---

**Tiempo estimado de grabación:** 1-2 horas (incluyendo retomas y ajustes).
**Tiempo de edición opcional:** 30-60 min.

Suerte 🥩

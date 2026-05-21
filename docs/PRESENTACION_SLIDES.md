# Presentación oral — Defensa del Proyecto Integrado

**Proyecto:** El Buey Madurado · Plataforma de transformación digital
**Ponente:** Michael Llorens Barbera
**Ciclo:** 2º DAW SEMI (semipresencial) · IES L'Estació (Ontinyent)
**Tutor:** Juan Torres Mancheño
**Curso:** 2025 / 2026
**Duración oficial:** 20 minutos (según las Instruccions PI 2025-26).
**Estructura real:** 14 slides de defensa (≈ 12 min) + demo en vivo del dashboard (5 min) ≈ **17-18 minutos totales** · margen de 2-3 minutos para preguntas o si te alargas.

---

## Cómo leer este documento

Cada slide tiene tres bloques:

- 📺 **VISUAL** — lo que se proyecta en pantalla. Bullets ultracortos, cifras grandes, una idea por slide. Tú lo enseñas, no lo lees.
- 🎤 **LO QUE DICES** — frase concreta para memorizar. **No la leas en pantalla; improvisa a partir de ella.**
- ⏱️ **Tiempo** — meta objetivo por slide.

**Reglas de oro para defender bien:**

1. Tras cada **cifra clave** (121 %, 10 meses, 27 endpoints, 71 tests), haz una **pausa de 1-2 segundos**. Da peso al dato.
2. **Mira al tribunal**, no al portátil. La pantalla solo acompaña.
3. Si te trabas, respira y vuelve a la frase. No te disculpes.
4. Si la demo falla, di con tranquilidad: *"Os enseño el vídeo de respaldo, lo tenía preparado por si acaso."*

---

# Slide 1 · Portada

### 📺 VISUAL

- **Fondo oscuro** (`#160a00`) con detalles ámbar/dorados.
- **Logo grande** del restaurante centrado.
- **EL BUEY MADURADO** (título principal, 28 pt).
- *Transformación digital de un restaurante real* (subtítulo, 16 pt).
- Pie pequeño: Michael Llorens Barbera · 2º DAW SEMI · IES L'Estació (Ontinyent) · 2025/26.

### 🎤 LO QUE DICES

> *"Buenos días, soy Michael Llorens, alumno de 2º DAW SEMI. Os presento la defensa del Proyecto Integrado: la transformación digital de El Buey Madurado, un restaurante real en Xàtiva. Cubro la parte de negocio y la parte técnica en doce minutos, y luego os enseño la plataforma funcionando en vivo durante cinco."*

### ⏱️ **20 segundos**

---

# Slide 2 · Índice · ¿Qué veremos hoy?

### 📺 VISUAL

**Título:** ÍNDICE · ¿QUÉ VEREMOS HOY?

| | Bloque | Tiempo |
|---|---|---:|
| 1️⃣ | **El proyecto y los problemas que resuelve** | 4 min |
| 2️⃣ | **Cómo lo he construido** (stack + arquitectura) | 4 min |
| 3️⃣ | **Plan de empresa y viabilidad** | 4 min |
| 4️⃣ | **🎥 Demo en vivo del dashboard** | 5 min |
| 5️⃣ | **Limitaciones, roadmap y resultados** | 1 min |
| 6️⃣ | **Valoración personal del ciclo** | 1 min |

**Pie del slide:** *"20 minutos · 14 slides + demo en vivo"*

**Tip de diseño:**
- Iconos grandes (los emojis o iconos SVG limpios) para cada bloque.
- Tiempos a la derecha en color ámbar discreto.
- Bloque **🎥 Demo** destacado en negrita o con fondo ámbar suave — capta atención.

### 🎤 LO QUE DICES

> *"Lo que veremos en estos veinte minutos se divide en seis bloques. Empiezo presentando el proyecto y los problemas reales que resuelve. Después la parte técnica: stack y arquitectura. Luego el plan de empresa y la viabilidad económica. A continuación os enseño la plataforma funcionando en vivo durante cinco minutos. Y cierro con limitaciones, roadmap y una breve valoración personal del ciclo. Vamos."*

### ⏱️ **20-30 segundos**

> **Tip:** **no leas los bloques uno a uno**. El índice está para ubicar al tribunal mentalmente, no para narrar. Lánzalo con la frase de 20 segundos y pasa al siguiente slide.

---

# Slide 3 · ¿Qué es esto?

### 📺 VISUAL

**Título:** ¿DE QUÉ VA ESTE PROYECTO?

| | |
|---|---|
| 🥩 **Restaurante real** | El Buey Madurado · Calle Reina 41 · Xàtiva |
| 👥 **Para quién** | Propietarios amigos míos de toda la vida |
| 💻 **Lo que he hecho** | Plataforma full-stack + Google Business |
| 🌐 **Estado** | Web pública en producción · Panel en pruebas |

Pie: `www.restauranteelbueymadurado.com`

### 🎤 LO QUE DICES

> *"El Buey Madurado es un restaurante real, no un caso de estudio. Está en Xàtiva, ofrece carne madurada premium y hamburguesas gourmet. Lo importante es que los propietarios son amigos míos de toda la vida; eso me ha dado acceso a la cocina, al equipo y al feedback honesto del día a día. Lo que veis hoy es una plataforma full-stack que cubre toda la operativa del restaurante: la web pública ya está en producción bajo dominio propio, y el panel interno y los pedidos online están en pruebas controladas con el equipo antes del lanzamiento al cliente final."*

### ⏱️ **1 minuto**

---

# Slide 4 · Los 5 problemas que detecté

### 📺 VISUAL

**Título:** 5 PROBLEMAS REALES DEL SECTOR

- 📞 **Pedidos por teléfono** que se cruzan y se pierden
- 📄 **Cartas en PDF** imposibles de actualizar a tiempo
- 💸 **Glovo / UberEats:** 25-30 % de comisión por pedido
- 🍳 **Cocina coordinada a gritos** (tickets en papel)
- 📊 **Cero datos** para decidir qué se vende y cuándo

### 🎤 LO QUE DICES

> *"Antes de escribir una sola línea de código, me senté con ellos a ver qué les daba más dolores de cabeza. La lista era larga. Pedidos por teléfono que se cruzaban un viernes a las nueve y media. Una carta en PDF que no podían actualizar fácilmente cada vez que cambiaba el precio del wagyu. Comisiones del 25 al 30 % que se llevaban Glovo y Uber por cada pedido a domicilio. Una cocina coordinada a gritos con tickets en papel. Y sobre todo, ningún dato para decidir si reforzar el viernes noche o el sábado mediodía. Cada problema tenía un coste real en margen y en tiempo."*

### ⏱️ **1 minuto**

---

# Slide 5 · La solución + Identidad

### 📺 VISUAL

**Título:** LA SOLUCIÓN EN UNA FRASE

> ### **"Una plataforma full-stack a medida, sin intermediarios."**

Debajo, 3 iconos en horizontal:

- 🍽️ **Web pública** (carta, pedidos, reservas)
- 👨‍🍳 **Dashboard interno** (3 roles)
- 📈 **Reportes** con datos reales

Pie: *"No hablamos de comida rápida, hablamos de alta cocina."*

### 🎤 LO QUE DICES

> *"La respuesta no fue contratar un SaaS genérico, fue construir una solución a medida que cubre toda la operativa en una sola plataforma. Tres bloques: web pública para el cliente final con carta, pedidos, reservas y seguimiento; dashboard interno con tres roles diferenciados —admin, camarero y cocinero— para gestionar mesas, cocina y cobros; y un módulo de reportes con datos reales del negocio. La identidad de marca acompaña: el nombre del restaurante comunica el producto directamente, y el eslogan principal —'no hablamos de comida rápida, hablamos de alta cocina'— defiende el posicionamiento premium frente a la confusión con la hamburguesería estándar."*

### ⏱️ **1 minuto**

---

# Slide 6 · Stack técnico

### 📺 VISUAL

**Título:** STACK TÉCNICO

Logos o nombres en grid 3×3:

| Frontend | Backend | Datos |
|---|---|---|
| Next.js 16 | Route Handlers | MongoDB Atlas |
| React 19 | jose (JWT) | Mongoose |
| TypeScript | bcrypt | Cloudinary |

| Pagos | Calidad | DevOps |
|---|---|---|
| Stripe | Vitest | Docker |
| Apple/Google Pay | Playwright | GitHub Actions |
| | ESLint v9 | Vercel |

**Cifra ancla (en grande):** 71/71 tests passing · 0 errores TypeScript

### 🎤 LO QUE DICES

> *"El stack es JavaScript moderno completo. Next.js 16 con App Router para frontend y backend, React 19, TypeScript en modo estricto. MongoDB Atlas para datos, Stripe para pagos, Vitest y Playwright para tests, GitHub Actions para CI/CD y Vercel para despliegue. Las métricas técnicas: cero errores de TypeScript en modo estricto, cero errores de ESLint, y 71 tests automatizados pasando en 10 archivos. Cada elección la justifico si me preguntáis."*

### ⏱️ **45 segundos**

---

# Slide 7 · Arquitectura + Modelo de datos

### 📺 VISUAL

**Título:** CÓMO ESTÁ ESTRUCTURADO

A la izquierda, **diagrama de arquitectura** (cajas simples):

```
Cliente (web/móvil)
      ↓
Next.js (Edge Middleware + Route Handlers)
      ↓
MongoDB Atlas · Stripe · Cloudinary
```

A la derecha, **6 modelos MongoDB**:

- Usuario · Pedido · Producto
- Ingrediente · Mesa · TicketCocina

**Cifra ancla:** 27 endpoints REST · 6 colecciones

### 🎤 LO QUE DICES

> *"La arquitectura es un monolito modular Next.js desplegado en serverless. El cliente puede ser web pública, dashboard interno o móvil responsive: todo es la misma SPA con App Router. El backend son Route Handlers que conectan con MongoDB Atlas, Stripe para pagos y Cloudinary para imágenes optimizadas. El middleware Edge con jose verifica el JWT en cada petición a rutas protegidas. El modelo de datos lo forman seis colecciones que cubren todo el dominio: Usuario, Pedido, Producto, Ingrediente, Mesa y TicketCocina. Un detalle de diseño importante: cada Pedido guarda snapshot del precio en el momento de la compra, así si mañana sube el precio de una hamburguesa, los pedidos pasados no se desincronizan. La API REST son 27 endpoints documentados en el anexo de la memoria."*

### ⏱️ **1 minuto 30 segundos**

---

# Slide 8 · Decisión técnica clave: MongoDB vs PostgreSQL

### 📺 VISUAL

**Título:** ¿POR QUÉ MONGODB Y NO POSTGRESQL?

| **MongoDB** (elegido) | **PostgreSQL** (descartado para esta fase) |
|---|---|
| 1 documento por producto | 5-6 tablas con joins |
| Variantes sin migración | Migración por cada extra nuevo |
| Carta con 1 consulta | Carta con múltiples joins |

**Limitaciones que asumo:**

- ⚠️ Transacciones multi-documento más complejas
- ⚠️ Integridad referencial validada en código

### 🎤 LO QUE DICES

> *"Esta es probablemente la decisión sobre la que más me van a preguntar. Elegí MongoDB sobre PostgreSQL, y no fue una elección de moda. Una hamburguesa tiene un nombre y un precio, pero también ingredientes que se pueden añadir o quitar, punto de la carne, alérgenos heredados de cada ingrediente y notas libres para cocina. En PostgreSQL serían cinco o seis tablas con joins por cada lectura de carta y migraciones cada vez que el restaurante quiere añadir un tipo nuevo de extra. Con un modelo documental, todo eso vive en un único documento del producto y la carta se sirve con una sola consulta. A cambio asumo dos limitaciones: las transacciones multi-documento son más complejas y la integridad referencial la valido en el código en vez de en la base de datos. Para el dominio de este restaurante el balance es favorable; si en el futuro el cliente necesitara reporting analítico avanzado, volvería a poner PostgreSQL sobre la mesa."*

### ⏱️ **1 minuto**

---

# Slide 9 · Mercado y propuesta de valor

### 📺 VISUAL

**Título:** MERCADO Y PROPUESTA DE VALOR

**4 segmentos** en cajas con icono y ticket medio:

- 🍷 **Foodie local** · 40-60 €/persona
- 🍔 **Joven urbano** · 18-28 €/persona
- 💼 **Profesional / empresa** · 35-55 €/persona
- 🛵 **Cliente a domicilio** · 25-40 €/pedido

**Propuesta de valor** (frase grande abajo):

> ### **"Carne madurada premium + plataforma propia, sin intermediarios."**

### 🎤 LO QUE DICES

> *"El mercado objetivo lo segmento por características psicográficas en cuatro perfiles. El foodie local es la base del negocio: viene por convicción, ticket alto, comparte en Instagram. El joven urbano es la oportunidad de crecimiento: decide por redes y móvil, ticket medio. El profesional aporta volumen estable en comidas de trabajo. Y el cliente a domicilio es el canal nuevo que queremos capturar sin marketplaces. La propuesta de valor única combina carne madurada premium —vaca rubia gallega con maduración superior a 45 días, wagyu Tajima-gyu— con una experiencia digital propia que permite reservar, pedir, pagar y seguir el pedido sin depender de intermediarios. Frente a la competencia: la mayoría es fuerte en producto o en canal digital, raramente en los dos. Aquí cubrimos todo el funnel."*

### ⏱️ **1 minuto 30 segundos**

---

# Slide 10 · Viabilidad económica

### 📺 VISUAL

**Título:** VIABILIDAD ECONÓMICA · ESCENARIO BASE

**4 cifras enormes** (cada una en 40-60 pt, ámbar):

> # **121 %**
> ROI anual
>
> # **10 meses**
> Payback de la plataforma
>
> # **5.640 €/año**
> Ahorro vs marketplaces
>
> # **69.624 €/año**
> Resultado operativo

**Pie pequeño:** Inversión inicial valorada: 11.470 € · Punto de equilibrio: 16.154 €/mes

### 🎤 LO QUE DICES

> *"La parte que más interesa a un tribunal: ¿esto vale la pena económicamente? Las cifras del escenario base son claras. La inversión inicial valorada en la plataforma —desarrollo, fotografía, formación, equipamiento— ronda los 11.470 €. El restaurante necesita facturar unos 16.150 € al mes para cubrir costes fijos, equivalente a unos 15 comensales al día, una cifra totalmente alcanzable. Solo por evitar las comisiones de Glovo y UberEats, el restaurante ahorra alrededor de 5.640 € anuales. La plataforma se paga sola en aproximadamente 10 meses, con un ROI anual del 121 % en escenario base. El resultado operativo anual previsto antes de impuestos: cerca de 70.000 €. Estas cifras cuadran con un análisis de sensibilidad detallado en el documento del Plan de Empresa, con escenarios pesimista, base y optimista."*

### ⏱️ **1 minuto 30 segundos**

---

# Slide 11 · Sostenibilidad ASG + transición al demo

### 📺 VISUAL

**Título:** SOSTENIBILIDAD · ASG + 5 ODS ALINEADOS

**3 columnas:**

| 🌱 **Ambiental** | 👥 **Social** | 🛡️ **Gobernanza** |
|---|---|---|
| Menos papel (carta digital) | Alérgenos UE en cada plato | RGPD aplicado |
| Menos merma (reportes stock) | Empleo local en Xàtiva | PCI-DSS vía Stripe |
| Packaging biodegradable | Formación digital del equipo | Trazabilidad de proveedores |

**ODS alineados:** 3 · 8 · 9 · 12 · 17

**Pie del slide (texto grande, ámbar):**

> ## 🎥 OS ENSEÑO EL DASHBOARD FUNCIONANDO →

### 🎤 LO QUE DICES

> *"La sostenibilidad no es un eslogan, es un subproducto natural del modelo. Tres pilares ASG. Ambiental: la carta digital elimina papel impreso, los reportes de stock reducen merma alimentaria, y el packaging biodegradable está en el roadmap. Social: información de alérgenos UE en cada plato según el Reglamento 1169, empleo local en Xàtiva, formación digital del equipo. Gobernanza: RGPD aplicado en toda la captura de datos, PCI-DSS automático porque los datos de tarjeta nunca tocan mi servidor —los gestiona Stripe—, y trazabilidad de proveedores. Esto se alinea directamente con cinco Objetivos de Desarrollo Sostenible. Y ahora, lo más interesante: os enseño el dashboard funcionando en vivo, que es donde se ve todo esto en acción."*

### ⏱️ **1 minuto** · Cierras con: *"Cambio a la web ahora mismo."*

---

# 🎥 DEMO EN VIVO · Dashboard interno (5 minutos)

> **Importante:** memorízate este recorrido, no improvises el orden. Si la web cae, di *"abro el vídeo de respaldo"* y siguelo con calma.

### Plan del recorrido (5 minutos exactos)

#### 1️⃣ Login + roles · 30 segundos
- Entras a `/dashboard` y haces login.
- **Lo que dices:** *"Tengo tres roles cargados: admin, camarero y cocinero. Lo que cada uno ve está limitado por su rol. El middleware Edge verifica el JWT en cada petición."*

#### 2️⃣ Mesas · 45 segundos
- Vista visual del mapa de mesas.
- Muestras una mesa libre, una ocupada, una reservada.
- **Lo que dices:** *"Cada cambio de estado se persiste y se valida en código: una mesa no puede tener más comensales que su capacidad."*

#### 3️⃣ Pedidos · 60 segundos
- Filtros por turno, estado, tipo (local/recoger/domicilio).
- Búsqueda por número de pedido.
- Editas un pedido para mostrar el cambio en vivo.
- **Lo que dices:** *"Todo se persiste en MongoDB y el panel se refresca cada 5 segundos con SWR. Esto es lo que ven los camareros."*

#### 4️⃣ Cocina Kanban en vivo · 90 segundos · LA JOYA
- Tres columnas: **pendiente / en preparación / listo**.
- Muestras el TimeBadge con semáforo (verde < 10 min · amarillo 10-19 · rojo ≥ 20).
- Si puedes, dispara el sonido de notificación de pedido nuevo.
- Cambias un ticket de columna en vivo.
- **Lo que dices:** *"Este es probablemente el panel con más cariño puesto. La cocina ve de un vistazo qué priorizar. El semáforo cambia automáticamente cada 30 segundos, y a partir de 20 minutos suena un triple beep grave para avisar de pedidos urgentes."*

#### 5️⃣ Reportes · 60 segundos
- Stats de ventas, productos top, comparativa hoy vs ayer, ticket medio.
- **Lo que dices:** *"Estas métricas se calculan con agregaciones de MongoDB sobre los pedidos reales. El propietario puede decidir con datos: qué producto rotar, qué turno reforzar, qué hora hay capacidad ociosa. En lugar de decidir a ojo."*

#### Cierre del demo · 15 segundos
- **Lo que dices:** *"Y todo esto lo vamos a activar al público en cuanto cerremos las pruebas internas con el equipo. La web pública ya lleva tiempo en uso real con clientes."*
- Cambias de pestaña al PowerPoint para volver a las slides.

---

# Slide 12 · Resumen post-demo

### 📺 VISUAL

**Título:** LO QUE ACABÁIS DE VER

> ## **"5 problemas. 1 sola plataforma. Sin intermediarios."**

Pequeños iconos al pie (los 5 problemas del slide 3, marcados con ✓):

- ✓ 📞 Pedidos coordinados
- ✓ 📄 Carta actualizable
- ✓ 💸 Cero comisiones
- ✓ 🍳 Cocina con visibilidad
- ✓ 📊 Datos reales

### 🎤 LO QUE DICES

> *"Lo que acabáis de ver resuelve exactamente los cinco problemas que mencionaba al principio. Pedidos coordinados sin papel ni gritos, carta actualizable al instante, cero comisiones a marketplaces, cocina con visibilidad de tiempos y reportes con datos reales para decidir. Todo en una sola plataforma, sin depender de terceros."*

### ⏱️ **30 segundos**

---

# Slide 13 · Limitaciones reconocidas + Roadmap

### 📺 VISUAL

**Título:** LO QUE NO CUBRE EL MVP · LO QUE VIENE

| ❌ **Limitaciones reconocidas** | 🚀 **Roadmap** |
|---|---|
| Sin app móvil nativa (PWA sí) | **3 meses:** analítica completa |
| Sin programa de fidelización | **6 meses:** fidelización + cupones |
| Reportes analíticos básicos | **12 meses:** webhook Stripe + offline |
| | **24 meses:** modelo replicable |

### 🎤 LO QUE DICES

> *"Soy honesto con lo que el MVP no cubre. No hay app móvil nativa: es PWA responsive porque el cliente de hostelería local no instala apps de restaurantes concretos. No hay programa de fidelización todavía: priorizamos cerrar el flujo de pedido y pago antes de añadir capas que dependen de tener histórico. Y los reportes son básicos: faltan predicción de demanda y análisis de cohortes. El roadmap está claro: tres meses para analítica completa y campañas, seis para fidelización con cupones segmentados, doce para mejoras técnicas como el webhook robusto de Stripe y el modo offline del dashboard, y a veinticuatro meses la idea es convertir esto en un modelo replicable a otros restaurantes y comercios locales de la zona."*

### ⏱️ **1 minuto**

---

# Slide 14 · Valoración personal + Cierre

### 📺 VISUAL

**Fondo oscuro** (`#160a00`) con detalles ámbar — espejo de la portada.

**Título:** VALORACIÓN PERSONAL DEL CICLO

- 🎓 **Trayectoria:** ESO → prueba de acceso → DAM (2024/25) → DAW SEMI (actual)
- 💡 He pasado de **"que funcione"** a **"que funcione, sea seguro, sea mantenible y aporte valor"**
- 🥩 Hecho **con y para amigos**: no era una nota, era confianza

**Pie del slide:**

> ### GRACIAS
>
> `restauranteelbueymadurado.com` · `github.com/Michael-Llorens`

### 🎤 LO QUE DICES

> *"Cierro con una reflexión personal del ciclo. Mi trayectoria no ha sido la habitual: tras la ESO entré a Formación Profesional por la vía de la prueba de acceso, sin pasar por bachillerato. Hice primero el ciclo de Desarrollo de Aplicaciones Multiplataforma, DAM, que terminé el curso pasado. Este curso estoy haciendo este segundo Grado Superior, DAW SEMI. La elección fue deliberada: quería completar mi perfil con la parte web full-stack que DAM tocaba solo parcialmente. En estos años he pasado de querer simplemente que el código funcione a entender que un proyecto real exige mucho más: que sea seguro, mantenible, comprensible y útil. Trabajar con El Buey Madurado ha sido la mejor escuela que podía tener: no era una nota, era la confianza de unos amigos que me dejaron entrar a su negocio. Quiero agradecer también a mi tutor, Juan Torres, por el seguimiento durante el curso. Gracias. Encantado de responder preguntas."*

### ⏱️ **1 minuto**

---

# ⏱️ Resumen de tiempos

| Slide | Bloque | Tiempo |
|---|---|---:|
| 1 | Portada | 20 s |
| 2 | **Índice · ¿Qué veremos hoy?** | 20-30 s |
| 3 | ¿De qué va este proyecto? | 1 min |
| 4 | Los 5 problemas | 1 min |
| 5 | La solución + Identidad | 1 min |
| 6 | Stack técnico | 45 s |
| 7 | Arquitectura + Modelo de datos | 1 min 30 s |
| 8 | Decisión MongoDB vs PostgreSQL | 1 min |
| 9 | Mercado + Propuesta de valor | 1 min 30 s |
| 10 | Viabilidad económica | 1 min 30 s |
| 11 | ASG + transición al demo | 1 min |
| **—** | **🎥 Demo en vivo del dashboard** | **5 min** |
| 12 | Resumen post-demo | 30 s |
| 13 | Limitaciones + Roadmap | 1 min |
| 14 | Valoración personal + Cierre | 1 min |
| | **Total presentación** | **≈ 17-18 min** |
| | **Margen para preguntas o si te alargas** | **2-3 min** |
| | **Total absoluto** | **20 min ✅** |

---

# 🎯 Tips finales de defensa

### Antes de empezar

- ✅ Llega **30 minutos antes** al aula.
- ✅ Carga el portátil al 100 % + lleva cargador + adaptador HDMI propio.
- ✅ Abre en pestañas antes de empezar: presentación · web del restaurante · dashboard logueado · vídeo de respaldo · GitHub.
- ✅ Bebe agua. Respira hondo dos veces.

### Lo que NO debes hacer

- ❌ **Leer la pantalla.** Si lees, eres pasivo. La pantalla acompaña tu voz, no la reemplaza.
- ❌ **Excusarte** ("perdón, esto no me ha dado tiempo a..."). Defiende lo que tienes con seguridad.
- ❌ **Mirar al portátil**. Mira al tribunal.
- ❌ Decir **"me las he inventado"** si te preguntan por las cifras económicas. Responde según el kit del checklist §6.4.

### Lo que SÍ debes hacer

- ✅ Tras cada **cifra clave** (121 %, 10 meses, 27 endpoints, 71 tests, 5.640 €), haz una **pausa de 1-2 segundos**. Da peso al dato.
- ✅ Si la demo falla, di con calma: *"Os enseño el vídeo de respaldo, lo había preparado por si acaso."* No es un fallo, es prevención.
- ✅ Cuando preguntes *"¿alguna pregunta?"*, **sonríe**. La actitud transmite confianza.
- ✅ Si te ponen una pregunta que no sabes, di: *"Buena pregunta. No tengo el dato exacto ahora mismo, pero sí sé que..."* y aporta lo que sepas alrededor.

---

# 🛡️ Preguntas frecuentes preparadas

> Tener leídas estas respuestas la noche antes vale más que ensayar 5 veces más la presentación.

### "¿Por qué MongoDB y no PostgreSQL?"
> *"Por la naturaleza variante del modelo de producto del restaurante. Una hamburguesa tiene ingredientes opcionales, punto de carne, alérgenos heredados y notas para cocina. En SQL serían cinco tablas con joins por cada lectura; en MongoDB es un documento que se sirve con una consulta. Asumo dos limitaciones: transacciones multi-documento más complejas e integridad referencial validada en código."*

### "¿Has usado IA para hacer esto?"
> *"Sí, como herramienta de edición y refuerzo estructural. Todo el contenido, las decisiones técnicas, los datos del cliente, la historia y la voz personal son míos. He usado IA del mismo modo que un desarrollador profesional usa Copilot o ChatGPT: como apoyo, no como sustituto."*

### "¿Cuánto tiempo te ha llevado?"
> *"Tres meses de desarrollo activo en paralelo a las clases del ciclo. Aproveché el formato SEMI para poder dedicarle el tiempo que un proyecto real exige."*

### "¿De dónde sacas las cifras económicas?"
> *"Son estimaciones coherentes con ratios habituales del sector hostelero español para un restaurante premium pequeño-mediano en una ciudad como Xàtiva. He partido del convenio de hostelería de la Comunitat Valenciana para personal, ratios sectoriales de Hostelería de España y ABEX para coste variable y ticket medio, y rangos de alquiler de zona céntrica de Xàtiva. En años posteriores se afinarán con datos reales de explotación."*

### "¿Cómo gestionas la seguridad de los pagos?"
> *"Stripe con PaymentIntents. Los datos de tarjeta nunca tocan mi servidor; viven en el iframe de Stripe Elements. Mi backend solo recibe el `paymentIntentId` y, antes de marcar el pedido como pagado, verifica con Stripe que el estado es `succeeded`. Cumplimiento PCI-DSS automático."*

### "¿Cuántas personas usan el dashboard ahora mismo?"
> *"Está en pruebas controladas con el equipo del restaurante antes del lanzamiento al uso diario. La web pública sí lleva tiempo en uso real con clientes finales."*

### "¿Por qué Vercel y no un VPS propio?"
> *"Por coste, mantenimiento y CI/CD integrado. En tier inicial es prácticamente gratuito y escala automáticamente. Con un VPS tendría que gestionar yo certificados SSL, parches, balanceo... eso no aporta valor al cliente, sí coste. Si el proyecto creciera mucho, lo reconsideraría."*

### "¿Y si Vercel cae?"
> *"Hay plan de continuidad documentado en el §11 del Plan de Empresa: WhatsApp para reservas urgentes, carta estática de emergencia, pago al recoger si Stripe falla. La cocina puede volver a comanda manual si el dashboard cae."*

### "¿Has hecho tú solo todo el proyecto?"
> *"Sí, todo el desarrollo, despliegue, documentación y la gestión del Google Business son míos. El branding visual y la fotografía los decidimos juntos con los propietarios."*

### "¿Tienes tests? ¿Cuántos?"
> *"71 tests automatizados en 10 archivos, repartidos entre unitarios, integración con base de datos real y tests de hooks de React. CI bloquea merges a main si los tests fallan."*

### "¿Cómo gestionas los roles?"
> *"Tres roles: admin, camarero y cocinero. El middleware Edge verifica el JWT, y cada endpoint usa el helper `protegerRutaPorRol()` para validar permisos. Frontend y backend están sincronizados, pero la verdad la dice el backend siempre."*

---

**El proyecto está bien. Las cifras cuadran. La demo funciona. Solo queda salir ahí y contarlo.**

**Suerte, Michael.** 🥩

---

# 🎙️ GUION COMPLETO PARA ENSAYAR (texto corrido)

> Todos los textos de "Lo que dices" juntos, en orden. Léelo en voz alta dos veces con cronómetro: el objetivo es ≈ 12 minutos hablando + 5 min de demo. Si te pasas de 14, recorta algún párrafo. Si te quedas corto, respira y haz más pausas tras las cifras.

---

## 🎬 Slide 1 · Portada · 20 s

> *"Buenos días, soy Michael Llorens, alumno de 2º DAW SEMI. Os presento la defensa del Proyecto Integrado: la transformación digital de El Buey Madurado, un restaurante real en Xàtiva. Cubro la parte de negocio y la parte técnica en doce minutos, y luego os enseño la plataforma funcionando en vivo durante cinco."*

## 🎬 Slide 2 · Índice · 20-30 s

> *"Lo que veremos en estos veinte minutos se divide en seis bloques. Empiezo presentando el proyecto y los problemas reales que resuelve. Después la parte técnica: stack y arquitectura. Luego el plan de empresa y la viabilidad económica. A continuación os enseño la plataforma funcionando en vivo durante cinco minutos. Y cierro con limitaciones, roadmap y una breve valoración personal del ciclo. Vamos."*

## 🎬 Slide 3 · ¿Qué es esto? · 1 min

> *"El Buey Madurado es un restaurante real, no un caso de estudio. Está en Xàtiva, ofrece carne madurada premium y hamburguesas gourmet. Lo importante es que los propietarios son amigos míos de toda la vida; eso me ha dado acceso a la cocina, al equipo y al feedback honesto del día a día. Lo que veis hoy es una plataforma full-stack que cubre toda la operativa del restaurante: la web pública ya está en producción bajo dominio propio, y el panel interno y los pedidos online están en pruebas controladas con el equipo antes del lanzamiento al cliente final."*

## 🎬 Slide 4 · 5 problemas · 1 min

> *"Antes de escribir una sola línea de código, me senté con ellos a ver qué les daba más dolores de cabeza. La lista era larga. Pedidos por teléfono que se cruzaban un viernes a las nueve y media. Una carta en PDF que no podían actualizar fácilmente cada vez que cambiaba el precio del wagyu. Comisiones del 25 al 30 % que se llevaban Glovo y Uber por cada pedido a domicilio. Una cocina coordinada a gritos con tickets en papel. Y sobre todo, ningún dato para decidir si reforzar el viernes noche o el sábado mediodía. Cada problema tenía un coste real en margen y en tiempo."*

## 🎬 Slide 5 · Solución + Identidad · 1 min

> *"La respuesta no fue contratar un SaaS genérico, fue construir una solución a medida que cubre toda la operativa en una sola plataforma. Tres bloques: web pública para el cliente final con carta, pedidos, reservas y seguimiento; dashboard interno con tres roles diferenciados —admin, camarero y cocinero— para gestionar mesas, cocina y cobros; y un módulo de reportes con datos reales del negocio. La identidad de marca acompaña: el nombre del restaurante comunica el producto directamente, y el eslogan principal —'no hablamos de comida rápida, hablamos de alta cocina'— defiende el posicionamiento premium frente a la confusión con la hamburguesería estándar."*

## 🎬 Slide 6 · Stack técnico · 45 s

> *"El stack es JavaScript moderno completo. Next.js 16 con App Router para frontend y backend, React 19, TypeScript en modo estricto. MongoDB Atlas para datos, Stripe para pagos, Vitest y Playwright para tests, GitHub Actions para CI/CD y Vercel para despliegue. Las métricas técnicas: cero errores de TypeScript en modo estricto, cero errores de ESLint, y 71 tests automatizados pasando en 10 archivos. Cada elección la justifico si me preguntáis."*

## 🎬 Slide 7 · Arquitectura + Modelo de datos · 1 min 30 s

> *"La arquitectura es un monolito modular Next.js desplegado en serverless. El cliente puede ser web pública, dashboard interno o móvil responsive: todo es la misma SPA con App Router. El backend son Route Handlers que conectan con MongoDB Atlas, Stripe para pagos y Cloudinary para imágenes optimizadas. El middleware Edge con jose verifica el JWT en cada petición a rutas protegidas. El modelo de datos lo forman seis colecciones que cubren todo el dominio: Usuario, Pedido, Producto, Ingrediente, Mesa y TicketCocina. Un detalle de diseño importante: cada Pedido guarda snapshot del precio en el momento de la compra, así si mañana sube el precio de una hamburguesa, los pedidos pasados no se desincronizan. La API REST son 27 endpoints documentados en el anexo de la memoria."*

## 🎬 Slide 8 · MongoDB vs PostgreSQL · 1 min

> *"Esta es probablemente la decisión sobre la que más me van a preguntar. Elegí MongoDB sobre PostgreSQL, y no fue una elección de moda. Una hamburguesa tiene un nombre y un precio, pero también ingredientes que se pueden añadir o quitar, punto de la carne, alérgenos heredados de cada ingrediente y notas libres para cocina. En PostgreSQL serían cinco o seis tablas con joins por cada lectura de carta y migraciones cada vez que el restaurante quiere añadir un tipo nuevo de extra. Con un modelo documental, todo eso vive en un único documento del producto y la carta se sirve con una sola consulta. A cambio asumo dos limitaciones: las transacciones multi-documento son más complejas y la integridad referencial la valido en el código en vez de en la base de datos. Para el dominio de este restaurante el balance es favorable; si en el futuro el cliente necesitara reporting analítico avanzado, volvería a poner PostgreSQL sobre la mesa."*

## 🎬 Slide 9 · Mercado + Propuesta de valor · 1 min 30 s

> *"El mercado objetivo lo segmento por características psicográficas en cuatro perfiles. El foodie local es la base del negocio: viene por convicción, ticket alto, comparte en Instagram. El joven urbano es la oportunidad de crecimiento: decide por redes y móvil, ticket medio. El profesional aporta volumen estable en comidas de trabajo. Y el cliente a domicilio es el canal nuevo que queremos capturar sin marketplaces. La propuesta de valor única combina carne madurada premium —vaca rubia gallega con maduración superior a 45 días, wagyu Tajima-gyu— con una experiencia digital propia que permite reservar, pedir, pagar y seguir el pedido sin depender de intermediarios. Frente a la competencia: la mayoría es fuerte en producto o en canal digital, raramente en los dos. Aquí cubrimos todo el funnel."*

## 🎬 Slide 10 · Viabilidad económica · 1 min 30 s

> *"La parte que más interesa a un tribunal: ¿esto vale la pena económicamente? Las cifras del escenario base son claras. La inversión inicial valorada en la plataforma —desarrollo, fotografía, formación, equipamiento— ronda los 11.470 €. El restaurante necesita facturar unos 16.150 € al mes para cubrir costes fijos, equivalente a unos 15 comensales al día, una cifra totalmente alcanzable. Solo por evitar las comisiones de Glovo y UberEats, el restaurante ahorra alrededor de 5.640 € anuales. La plataforma se paga sola en aproximadamente 10 meses, con un ROI anual del 121 % en escenario base. El resultado operativo anual previsto antes de impuestos: cerca de 70.000 €. Estas cifras cuadran con un análisis de sensibilidad detallado en el documento del Plan de Empresa, con escenarios pesimista, base y optimista."*

## 🎬 Slide 11 · ASG + transición al demo · 1 min

> *"La sostenibilidad no es un eslogan, es un subproducto natural del modelo. Tres pilares ASG. Ambiental: la carta digital elimina papel impreso, los reportes de stock reducen merma alimentaria, y el packaging biodegradable está en el roadmap. Social: información de alérgenos UE en cada plato según el Reglamento 1169, empleo local en Xàtiva, formación digital del equipo. Gobernanza: RGPD aplicado en toda la captura de datos, PCI-DSS automático porque los datos de tarjeta nunca tocan mi servidor —los gestiona Stripe—, y trazabilidad de proveedores. Esto se alinea directamente con cinco Objetivos de Desarrollo Sostenible. Y ahora, lo más interesante: os enseño el dashboard funcionando en vivo, que es donde se ve todo esto en acción."*

> **Cambias a la pestaña del dashboard.** *"Cambio a la web ahora mismo."*

---

## 🎥 DEMO EN VIVO · 5 min (los 6 momentos en orden)

### 1️⃣ Login + roles · 30 s
> *"Tengo tres roles cargados: admin, camarero y cocinero. Lo que cada uno ve está limitado por su rol. El middleware Edge verifica el JWT en cada petición."*

### 2️⃣ Mesas · 45 s
> *"Cada cambio de estado se persiste y se valida en código: una mesa no puede tener más comensales que su capacidad."*

### 3️⃣ Pedidos · 60 s
> *"Todo se persiste en MongoDB y el panel se refresca cada 5 segundos con SWR. Esto es lo que ven los camareros."*

### 4️⃣ Cocina Kanban en vivo · 90 s · LA JOYA
> *"Este es probablemente el panel con más cariño puesto. La cocina ve de un vistazo qué priorizar. El semáforo cambia automáticamente cada 30 segundos, y a partir de 20 minutos suena un triple beep grave para avisar de pedidos urgentes."*

### 5️⃣ Reportes · 60 s
> *"Estas métricas se calculan con agregaciones de MongoDB sobre los pedidos reales. El propietario puede decidir con datos: qué producto rotar, qué turno reforzar, qué hora hay capacidad ociosa. En lugar de decidir a ojo."*

### Cierre del demo · 15 s
> *"Y todo esto lo vamos a activar al público en cuanto cerremos las pruebas internas con el equipo. La web pública ya lleva tiempo en uso real con clientes."*

> **Vuelves a la presentación.**

---

## 🎬 Slide 12 · Resumen post-demo · 30 s

> *"Lo que acabáis de ver resuelve exactamente los cinco problemas que mencionaba al principio. Pedidos coordinados sin papel ni gritos, carta actualizable al instante, cero comisiones a marketplaces, cocina con visibilidad de tiempos y reportes con datos reales para decidir. Todo en una sola plataforma, sin depender de terceros."*

## 🎬 Slide 13 · Limitaciones + Roadmap · 1 min

> *"Soy honesto con lo que el MVP no cubre. No hay app móvil nativa: es PWA responsive porque el cliente de hostelería local no instala apps de restaurantes concretos. No hay programa de fidelización todavía: priorizamos cerrar el flujo de pedido y pago antes de añadir capas que dependen de tener histórico. Y los reportes son básicos: faltan predicción de demanda y análisis de cohortes. El roadmap está claro: tres meses para analítica completa y campañas, seis para fidelización con cupones segmentados, doce para mejoras técnicas como el webhook robusto de Stripe y el modo offline del dashboard, y a veinticuatro meses la idea es convertir esto en un modelo replicable a otros restaurantes y comercios locales de la zona."*

## 🎬 Slide 14 · Valoración personal + Cierre · 1 min

> *"Cierro con una reflexión personal del ciclo. Mi trayectoria no ha sido la habitual: tras la ESO entré a Formación Profesional por la vía de la prueba de acceso, sin pasar por bachillerato. Hice primero el ciclo de Desarrollo de Aplicaciones Multiplataforma, DAM, que terminé el curso pasado. Este curso estoy haciendo este segundo Grado Superior, DAW SEMI. La elección fue deliberada: quería completar mi perfil con la parte web full-stack que DAM tocaba solo parcialmente. En estos años he pasado de querer simplemente que el código funcione a entender que un proyecto real exige mucho más: que sea seguro, mantenible, comprensible y útil. Trabajar con El Buey Madurado ha sido la mejor escuela que podía tener: no era una nota, era la confianza de unos amigos que me dejaron entrar a su negocio. Quiero agradecer también a mi tutor, Juan Torres, por el seguimiento durante el curso. Gracias. Encantado de responder preguntas."*

---

## 📋 Checklist de ensayo

Marca cada vez que ensayes en voz alta cronometrando:

- [ ] **1.ª pasada completa** (sin demo en vivo, solo el texto). Cronometra. Objetivo: ≈ 12 minutos.
- [ ] **2.ª pasada con demo en vivo del dashboard incluida.** Objetivo: ≈ 17 minutos totales.
- [ ] **3.ª pasada solo del bloque de viabilidad económica (Slide 10).** Es el que más cifras tiene; conviene tenerlo fluido.
- [ ] **Lectura mental de las 10 preguntas frecuentes** la noche antes.

**Si te pasas de 14 min hablando** → corta los slides 7 (arquitectura) y 9 (mercado) en lugar de improvisar más.
**Si te quedas corto de 11 min** → respira más entre frases. No improvises rellenos.

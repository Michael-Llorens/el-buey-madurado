# Guion de la presentación — Defensa del Proyecto Integrado

**Proyecto:** El Buey Madurado · Plataforma de transformación digital
**Ponente:** Michael Llorens Barbera
**Ciclo:** 2º DAW SEMI (semipresencial) · IES L'Estació (Ontinyent)
**Tutor:** Juan Torres Mancheño
**Curso:** 2025 / 2026
**Duración:** 20 minutos (recomendada por las Instruccions del PI 2025-26)
**Formato:** PowerPoint, Keynote, Google Slides o equivalente
**Recomendación:** preparar vídeo de respaldo del funcionamiento (3-5 min) por si falla el despliegue durante la defensa.

> Este documento es el **guion completo**: contenido de cada diapositiva, sugerencia visual y **notas del ponente** (lo que decir realmente en cada momento).
> Tiempo total objetivo: **18 minutos de exposición + 2 minutos de margen para preguntas iniciales**.

---

## Plan de tiempos

| Bloque | Diapositivas | Tiempo |
|---|---|---:|
| Apertura y contexto | 1 - 3 | 2 min |
| Problema y solución | 4 - 6 | 3 min |
| Demo guiada (capturas o web en vivo) | 7 - 9 | 4 min |
| Arquitectura y decisiones técnicas | 10 - 12 | 3 min |
| Plan de empresa (viabilidad) | 13 - 14 | 2 min |
| Riesgos, limitaciones y futuro | 15 - 16 | 2 min |
| Valoración personal y cierre | 17 - 18 | 2 min |
| **Total** | **18 slides** | **18 min** |

---

## Diapositiva 1 — Portada

**Contenido:**
- Título: **El Buey Madurado**
- Subtítulo: **Plataforma de transformación digital de un restaurante real**
- Nombre: Michael Llorens Barbera
- Ciclo: 2.º DAW SEMI (semipresencial) · IES L'Estació (Ontinyent)
- Tutor: Juan Torres Mancheño
- Curso: 2025 / 2026
- Logo del restaurante

**Visual:**
- Fondo oscuro (`#160a00`) con detalles dorados/ámbar.
- Logo grande centrado.
- Foto de producto (chuletón maduradoa) como elemento sutil.

**Notas del ponente (30 s):**
> "Buenas, soy Michael Llorens. Os presento el proyecto integrado de este curso: la transformación digital de El Buey Madurado, un restaurante real en Xàtiva. No es una simulación: la web pública lleva tiempo en uso y voy a enseñaros cómo funciona y por qué creemos que aporta valor real al negocio."

---

## Diapositiva 2 — De qué va esto

**Contenido:**
- **Restaurante** · hamburguesería gourmet, Calle Reina 41, Xàtiva.
- **Especialidad:** carne madurada (vaca rubia gallega, buey, wagyu) + hamburguesas gourmet.
- **Mi rol:** desarrollo de la plataforma full-stack + gestión del canal digital.
- **Estado:** web pública en producción, panel y pedidos en pruebas controladas.

**Visual:**
- Tres iconos / fotos en horizontal: producto, web, dashboard.
- URL del proyecto visible: `restauranteelbueymadurado.com`.

**Notas del ponente (40 s):**
> "El Buey Madurado es un restaurante real, no un caso de estudio. Los propietarios son amigos míos de toda la vida. Cuando vi cómo gestionaban el día a día, me ofrecí a construirles una plataforma digital. La web pública está desplegada en dominio propio, y el panel interno y los pedidos online están en pruebas con el equipo antes de abrirlos al público."

---

## Diapositiva 3 — El problema que resolvemos

**Contenido (tabla a dos columnas):**

| Problema actual | Coste para el negocio |
|---|---|
| Pedidos por teléfono que se confunden | Errores, llamadas duplicadas, clientes molestos |
| Carta en PDF / foto en redes | Sin SEO, sin filtros, no actualizable |
| Glovo / UberEats: 25-30 % de comisión | Margen reducido por pedido |
| Cocina con tickets en papel | Errores, sin métricas de tiempos |
| Decisiones de carta y stock sin datos | Mermas, productos que no se venden |

**Notas del ponente (50 s):**
> "Antes de escribir una sola línea de código, me senté con ellos a ver qué les daba más dolores de cabeza. La lista era larga: pedidos perdidos por teléfono, una carta que no podían actualizar fácilmente, comisiones del 25-30 % que se llevaban Glovo y Uber, una cocina coordinada a gritos y, sobre todo, cero datos para decidir qué se vende cuándo. Cada uno de estos problemas tenía un coste real en margen y en tiempo."

---

## Diapositiva 4 — La solución, en una frase

**Contenido:**
> **Una plataforma full-stack a medida que digitaliza carta, pedidos, pagos, reservas, cocina y reportes, sin depender de intermediarios.**

- **Web pública:** carta digital, pedidos online, reservas, seguimiento.
- **Dashboard interno:** mesas, cocina Kanban, cobros, reportes.
- **Roles:** admin, camarero, cocinero — con permisos granulares.

**Visual:**
- Un solo bloque grande con la frase principal.
- Debajo, tres iconos: 🍽️ web · 👨‍🍳 cocina · 📊 reportes.

**Notas del ponente (30 s):**
> "La respuesta no fue un SaaS genérico. Fue construir una solución a medida que cubre los puntos clave de su operativa en una sola plataforma. Web pública para el cliente, dashboard interno para el equipo, y permisos diferenciados por rol."

---

## Diapositiva 5 — Stack técnico

**Contenido (logos en grid 4×3):**

| Capa | Tecnologías |
|---|---|
| **Frontend** | Next.js 16 · React 19 · TypeScript · Tailwind CSS · GSAP · SWR |
| **Backend** | Next.js Route Handlers · Node 20 · `jose` · `bcryptjs` |
| **Datos** | MongoDB Atlas · Mongoose · Cloudinary |
| **Pagos** | Stripe (PaymentIntents · Apple Pay · Google Pay) |
| **Calidad** | TypeScript estricto · Vitest · Playwright · ESLint 9 |
| **DevOps** | Docker · GitHub Actions · Vercel |

**Notas del ponente (50 s):**
> "El stack es JavaScript moderno completo. Next.js 16 con App Router para el frontend y backend, MongoDB para la base de datos, Stripe para pagos. Toda la capa de calidad está cubierta: TypeScript estricto sin errores, ESLint, 71 tests automatizados con Vitest y Playwright, despliegue continuo con GitHub Actions y Vercel. No hay tecnología que esté aquí porque sí: cada elección la justificaré si me preguntáis."

---

## Diapositiva 6 — Demo: web pública (clientes)

**Contenido:**
- **Captura 1:** Home animada con GSAP.
- **Captura 2:** Carta digital con filtros y alérgenos.
- **Captura 3:** Detalle de producto con personalización.

**Notas del ponente (1 min 30 s):**
> "Esta es la parte que ve el cliente final. La home tiene animaciones con GSAP que dan personalidad a la marca sin entorpecer la navegación. La carta es completamente interactiva: filtros por categoría, búsqueda y los 14 alérgenos UE aplicados a cada producto según el Reglamento 1169/2011. Cuando entras a un producto premium como un chuletón, puedes elegir el punto de la carne, añadir o quitar ingredientes y dejar notas para cocina. Todo eso viaja al carrito y se persiste en localStorage."

---

## Diapositiva 7 — Demo: flujo de pedido y pago

**Contenido:**
- **Captura 4:** Carrito.
- **Captura 5:** Checkout con Stripe Elements (tarjeta, Apple Pay, Google Pay).
- **Captura 6:** Página de seguimiento en tiempo real.

**Notas del ponente (1 min):**
> "El flujo de pedido es: añadir al carrito, elegir si quieres recoger o domicilio, ir al checkout, rellenar datos y pagar con Stripe Elements. El cliente puede pagar con tarjeta, Apple Pay, Google Pay o elegir pagar al recoger. Una vez confirmado, el pedido aparece automáticamente en el panel de cocina y el cliente tiene una página de seguimiento en vivo con una barra animada de estado. **Detalle técnico importante:** los precios siempre se recalculan en el servidor, nunca confío en lo que envía el cliente. Esto previene manipulación del JSON para pagar menos."

---

## Diapositiva 8 — Demo: dashboard interno

**Contenido:**
- **Captura 7:** Vista de pedidos del staff.
- **Captura 8:** Panel Kanban de cocina con semáforo de tiempo.
- **Captura 9:** Módulo de reportes.

**Notas del ponente (1 min 30 s):**
> "El dashboard interno está pensado para tres roles diferentes: admin, camarero y cocinero. Cada uno ve y puede hacer cosas distintas. El panel Kanban de cocina es probablemente la pieza con más cariño puesto: refresca cada 5 segundos vía SWR, notifica con sonido al recibir pedidos nuevos, y cada ticket tiene un `TimeBadge` con semáforo de color — verde si lleva menos de 10 minutos, amarillo entre 10 y 19, rojo a partir de 20. Esto da a la cocina información visual instantánea sobre qué hay que priorizar. El módulo de reportes usa agregaciones de MongoDB para calcular ventas, productos top, ticket medio y comparativa día a día."

---

## Diapositiva 9 — Decisión técnica destacada: MongoDB vs PostgreSQL

**Contenido (a dos columnas):**

| **MongoDB** (elegido) | **PostgreSQL** (descartado para esta fase) |
|---|---|
| Un producto = un documento con todo dentro | Producto requiere 5-6 tablas con joins |
| Variantes del producto (punto, extras, alérgenos) sin migración | Cada nuevo tipo de extra = migración |
| Agregaciones nativas para reportes | Queries complejas con `JOIN` y `GROUP BY` |
| **Asumo:** transacciones multi-doc más complejas, integridad referencial en código |  |

**Notas del ponente (1 min):**
> "Si tuviera que destacar una sola decisión técnica, sería esta. Elegí MongoDB sobre PostgreSQL, y no fue una elección de moda. Un producto del restaurante tiene un nombre, un precio, una foto, pero también ingredientes opcionales, punto de carne, alérgenos heredados, notas para cocina... En SQL son cinco o seis tablas con joins por cada lectura. En MongoDB es un documento que se sirve con una consulta. A cambio, asumo dos limitaciones que reconozco abiertamente: las transacciones multi-documento son más complicadas, y la integridad referencial la valido en el código en lugar de en la base de datos. Para el dominio de este negocio, el balance es favorable. Si el cliente necesitara reporting analítico avanzado a futuro, PostgreSQL volvería a la conversación."

---

## Diapositiva 10 — Seguridad

**Contenido:**
- **OWASP Top 10 aplicado.**
- JWT con `jose` (Edge-compatible), cookies httpOnly.
- bcryptjs con 12 rounds, sanitización de inputs.
- Rate limiting (5/min login · 10/15 min checkout).
- Stripe PCI-DSS — los datos de tarjeta no llegan al servidor.
- Cálculo de precios siempre server-side.

**Notas del ponente (45 s):**
> "Seguridad no fue una capa que añadí al final, fue parte del diseño. Apliqué las mitigaciones del OWASP Top 10 una por una: JWT con `jose` para que funcione en Edge Runtime, contraseñas con bcrypt 12 rounds, rate limiting en login y checkout, sanitización de entradas. Los datos de tarjeta nunca tocan mi servidor: Stripe Elements los gestiona en un iframe propio y mi backend solo recibe el `paymentIntentId`. Y un detalle importante: los precios siempre se calculan server-side. Nunca confío en lo que envía el cliente."

---

## Diapositiva 11 — Modelo de datos

**Contenido:**
- Diagrama Mermaid del modelo entidad-relación.
- 6 colecciones: Usuario · Pedido · Producto · Ingrediente · Mesa · TicketCocina.
- Refs entre colecciones gestionadas con `Types.ObjectId` y `populate()`.

**Notas del ponente (45 s):**
> "El modelo tiene seis colecciones que cubren todo el dominio. Lo que destaca: cada Pedido guarda un **snapshot del precio** de los productos en el momento de la compra. Si mañana sube el precio de una hamburguesa, los pedidos pasados siguen mostrando el precio al que se compraron. Es una decisión de diseño consciente para no romper el histórico contable."

---

## Diapositiva 12 — CI/CD y despliegue

**Contenido:**
- Tres entornos: local (Docker) · staging (Vercel preview) · producción (Vercel + Atlas).
- GitHub Actions: typecheck + build en cada PR.
- Rama `main` protegida: merge bloqueado si CI falla.
- Despliegue automático en push a `main`.

**Visual:**
- Diagrama del flujo: `local → develop → PR → main → Vercel`.

**Notas del ponente (30 s):**
> "El pipeline está completo. Trabajo en feature branches, hago PR a develop, CI ejecuta typecheck y build, y si todo pasa, merge a main que despliega automáticamente en Vercel. La rama main está protegida: nadie hace push directo, todo va por PR con CI verde."

---

## Diapositiva 13 — Plan de empresa: viabilidad económica

**Contenido (tabla compacta):**

| Indicador | Valor estimado |
|---|---:|
| Inversión inicial valorada | 7.950 – 14.400 € |
| Ingresos mensuales (escenario base) | ≈ 25.000 € |
| Punto de equilibrio mensual | ≈ 16.150 € |
| Ahorro anual vs marketplaces | ≈ 5.640 € |
| Payback de la plataforma | 8 – 11 meses |
| ROI anual estimado | 116 % – 156 % |

**Notas del ponente (1 min):**
> "Más allá de lo técnico, el plan de empresa cuantifica la viabilidad. La inversión valorada en la plataforma ronda los 10.000 €. El restaurante necesita facturar unos 16.000 € mensuales para cubrir costes fijos, una cifra que se alcanza con unos 15 comensales de media al día — muy razonable para un restaurante de su tamaño. El ahorro anual por evitar comisiones de marketplaces, en escenario base, ronda los 5.600 €. La plataforma se paga sola en 8-11 meses. Estos números están en el documento del Plan de Empresa con análisis de sensibilidad pesimista, base y optimista."

---

## Diapositiva 14 — Sostenibilidad: ASG y ODS

**Contenido:**
- **Marco ASG:** Ambiental, Social, Gobernanza.
- **ODS alineados:** 3 (Salud), 8 (Empleo), 9 (Innovación), 12 (Consumo), 17 (Alianzas).
- **Grupos de interés:** clientes, equipo, propietarios, proveedores locales, administración, comunidad.

**Notas del ponente (45 s):**
> "El módulo de Empresa pedía analizar la sostenibilidad. Lo hice desde dos marcos: el ASG, que usan inversores e instituciones, y los ODS de Naciones Unidas. La parte ambiental se concreta en menos papel, menos merma, packaging biodegradable. La social en alérgenos visibles, empleo local y formación digital del equipo. La de gobernanza en RGPD, PCI-DSS y trazabilidad. Cinco ODS quedan tocados por el proyecto de forma directa, no como discurso."

---

## Diapositiva 15 — Riesgos y mitigación

**Contenido:**
- Matriz P×I de riesgos (visualización del Plan §11).
- Top 3 riesgos críticos:
  1. Ciberseguridad → JWT httpOnly, bcrypt, rate limiting, backups.
  2. Dependencia del promotor técnico → documentación, scripts, formación.
  3. Sobrecarga de cocina → pausar pedidos online, franjas limitadas.

**Notas del ponente (45 s):**
> "Reconocí 14 riesgos del proyecto y los puntué en una matriz probabilidad × impacto del 1 al 5. Los más críticos no son técnicos, son organizativos: la dependencia de una sola persona técnica (yo), la dependencia de un solo proveedor de carne, y la sobrecarga de cocina si el canal online escala antes de tiempo. Para cada uno, hay una mitigación documentada en el Plan."

---

## Diapositiva 16 — Limitaciones honestas y trabajo futuro

**Contenido:**

**Limitaciones del MVP actual:**
- Sin app móvil nativa (PWA responsive sí).
- Sin programa de fidelización ni cupones automáticos.
- Reportes analíticos básicos, sin predicción de demanda.

**Roadmap:**
- **3 meses:** analítica completa, conversión, campañas locales.
- **6 meses:** fidelización, cupones segmentados, eventos.
- **12 meses:** modo offline dashboard, webhook robusto Stripe.
- **24 meses:** modelo replicable a otros restaurantes.

**Notas del ponente (45 s):**
> "El MVP no lo cubre todo, y prefiero ser honesto antes que vender humo. No hay app nativa, no hay programa de fidelización todavía, los reportes son básicos. Cada limitación tiene su sitio en el roadmap: tres meses, seis meses, doce meses, dos años. La idea no es construirlo todo de golpe, es iterar con el negocio real."

---

## Diapositiva 17 — Valoración personal del ciclo

**Contenido (en bullets cortos):**
- Trayectoria: ESO → prueba de acceso → DAM (terminado 2024/2025) → **DAW SEMI ahora**.
- Dos ciclos superiores complementarios: aplicaciones multiplataforma + web full-stack.
- He pasado de "que funcione" a **"que funcione, sea seguro, sea mantenible y aporte valor"**.
- Aprendizajes clave: TypeScript estricto, OWASP, RSC vs Cliente, validación server-side, CI/CD real.
- Soft skills: autoaprendizaje, comunicación técnica, trabajo con cliente real.

**Notas del ponente (1 min 15 s):**
> "Cerrar con una reflexión personal. Mi trayectoria no ha sido lineal pero sí coherente: tras la ESO entré a la FP por la vía de la prueba de acceso, hice primero el ciclo de Desarrollo de Aplicaciones Multiplataforma —DAM, que terminé el año pasado— y este curso estoy haciendo este segundo Grado Superior, DAW SEMI. La elección de hacer ambos ciclos fue deliberada: quería completar mi perfil con la parte web full-stack que DAM solo tocaba parcialmente. En estos años he pasado de querer simplemente que el código funcione a entender que un proyecto real exige mucho más: que sea seguro, mantenible, comprensible y útil. Trabajar con El Buey Madurado ha sido la mejor escuela. Cada decisión técnica tenía consecuencias visibles, y eso obliga a pensar diferente. Quiero agradecer al profesorado, a mi tutor Juan Torres por el seguimiento, a mis compañeros por las dudas resueltas en común y al equipo del restaurante por confiar en mí cuando aún estaba en formación."

---

## Diapositiva 18 — Cierre y preguntas

**Contenido:**
- **Web en producción:** www.restauranteelbueymadurado.com
- **Repositorio:** github.com/Michael-Llorens/el-buey-madurado
- **Contacto:** GitHub @Michael-Llorens
- Logo grande del restaurante.
- **"Gracias. ¿Preguntas?"**

**Notas del ponente (30 s):**
> "La web está viva ahora mismo en `restauranteelbueymadurado.com`. El código completo está en mi repositorio público. Gracias por escucharme. Encantado de responder preguntas."

---

## Anexo: preguntas frecuentes que pueden hacer y respuestas preparadas

### "¿Por qué MongoDB y no PostgreSQL?"
*Respuesta breve:* "Por la naturaleza documental del producto del restaurante: ingredientes opcionales, variantes, alérgenos. En SQL serían cinco tablas con joins; en MongoDB es un documento. Asumo dos limitaciones: transacciones multi-doc y la integridad referencial la valido en código."

### "¿Has usado IA para escribir la memoria?"
*Respuesta:* "Sí, como herramienta de edición y refuerzo estructural. Todo el contenido, las decisiones técnicas, los datos del cliente, la historia y la voz personal son reales y míos."

### "¿Por qué Vercel y no un VPS propio?"
*Respuesta:* "Por coste, mantenimiento y CI/CD integrado. En tier inicial es prácticamente gratuito y escala automáticamente. Con un VPS tendría que gestionar yo certificados SSL, parches de seguridad, balanceo... no aporta valor al cliente, sí coste. Si el proyecto creciera mucho y el coste mensual de Vercel superara al de un VPS gestionado, lo reconsideraría."

### "¿Cómo gestionas la seguridad de los pagos?"
*Respuesta:* "Stripe en modo `PaymentIntents`. Los datos de tarjeta nunca llegan a mi servidor — viven en el iframe de Stripe Elements. Mi backend solo recibe el `paymentIntentId` y, antes de marcar el pedido como pagado, verifica con Stripe que el estado es `succeeded`. Además, recalculo los precios server-side leyendo de la BD, así que un usuario malintencionado no puede pagar menos manipulando el JSON."

### "¿Cuántas personas usan el dashboard ahora mismo?"
*Respuesta:* "Está en pruebas controladas con el equipo del restaurante antes de lanzarlo al uso diario. La web pública sí lleva tiempo en uso real con clientes finales."

### "¿Y si en futuro quieres añadir Y o Z funcionalidad?"
*Respuesta:* "Tengo un roadmap a 3, 6, 12 y 24 meses documentado en el Plan. Las prioridades inmediatas son consolidar analítica y fidelización."

### "¿Tienes tests? ¿Cuántos?"
*Respuesta:* "71 tests automatizados en 10 archivos, divididos entre tests unitarios, integración con la base de datos real, y tests de hooks de React. CI bloquea merges a main si los tests fallan."

### "¿Cómo gestionas el acceso de los distintos roles?"
*Respuesta:* "Sistema de roles con tres niveles: admin, camarero, cocinero. El middleware Edge verifica el JWT, y cada endpoint usa `protegerRutaPorRol()` para validar permisos. Frontend y backend están sincronizados, pero la verdad la dice el backend."

### "¿Has hecho tú solo todo el proyecto?"
*Respuesta:* "Sí, todo el desarrollo, despliegue, documentación y gestión del Google Business son míos. El branding visual (paleta, fotografía) lo decidimos juntos con los propietarios del restaurante."

### "¿Qué pasa si Vercel cae?"
*Respuesta:* "Hay plan de continuidad documentado: WhatsApp para reservas, carta estática de emergencia, pago al recoger si Stripe falla. La cocina puede volver a comanda manual si el dashboard cae. Todo está en §11 del Plan de Empresa."

---

## Cómo convertir este guion a `.pptx`

1. **Opción rápida — Google Slides:**
   - Crear presentación nueva con plantilla oscura.
   - Copiar el contenido de cada slide manualmente (15-20 min).
   - Aplicar paleta del proyecto (`#160a00` fondo, dorado `#d97706` acentos).
   - Exportar como `.pptx`.

2. **Opción técnica — Pandoc + revealjs/marp:**
   - `pandoc PRESENTACION.md -t pptx -o presentacion.pptx`
   - Funciona aunque pierde algo de control sobre el diseño.
   - Recomendable solo si te apetece trastear, no si vas con prisa.

3. **Opción con plantilla — Canva o Slidesgo:**
   - Buscar plantilla "restaurant pitch deck" o "tech project presentation" oscura.
   - Pegar el contenido de cada slide en el orden del guion.
   - Sustituir imágenes de plantilla por capturas reales del proyecto.

**Recomendación honesta:** usa Google Slides o Canva. Pandoc → pptx funciona, pero el resultado visual no convence en una defensa donde el diseño cuenta.

---

## Checklist final para el día de la defensa

- [ ] Presentación `.pptx` lista y revisada.
- [ ] Vídeo de respaldo del funcionamiento grabado y exportado.
- [ ] Web en producción comprobada el día antes (sin errores 500, sin rate-limit roto).
- [ ] Credenciales de demo del dashboard preparadas en papel o portátil.
- [ ] Plan de Empresa y Memoria impresos en PDF, por si los piden en mano.
- [ ] Repositorio de GitHub accesible (pestaña abierta antes de empezar).
- [ ] Cable HDMI / adaptador propio para la pantalla del aula.
- [ ] Botella de agua.
- [ ] Llegada con 30 minutos de antelación.
- [ ] Respiración profunda antes de empezar.

---

**Suerte.** 🥩

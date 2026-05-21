---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping-covered-in-step-03', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
classification:
  projectType: web_app
  domain: hosteleria_restaurant_management
  complexity: medium
  projectContext: brownfield
inputDocuments: ['docs/index.md', 'docs/project-overview.md', 'docs/architecture.md', 'docs/api-contracts.md', 'docs/data-models.md', 'docs/component-inventory.md', 'docs/development-guide.md', 'docs/deployment-guide.md', 'docs/auditoria-el-buey-madurado.md', 'docs/plan-mejoras-el-buey-madurado.md', 'docs/seguimiento-mejoras-el-buey-madurado.md', '_bmad-output/project-context.md']
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 12
---

# Product Requirements Document - El Buey Madurado

**Author:** Micha
**Date:** 2026-03-25

## Resumen Ejecutivo

El Buey Madurado evolucionara de su actual dashboard de gestion a un **sistema TPV/PDA profesional completo**, disenado para operar como herramienta de trabajo real del personal de un restaurante premium de carnes maduradas. El sistema se instalara como PWA en tablets y moviles, permitiendo a camareros, cocineros y administradores gestionar toda la operativa diaria desde dispositivos tactiles: toma de comandas rapida, mapa de mesas en tiempo real, comunicacion instantanea cocina-sala, cobros con cuentas divididas, gestion de turnos y cierres de caja, y control de alergenos.

El producto se dirige a tres perfiles de usuario diferenciados: **camareros** (toma de comandas, gestion de mesas, cobros), **cocineros** (recepcion de tickets, gestion de tiempos, alergenos) y **administradores** (reportes, stock, turnos, configuracion del sistema). El problema central es que los sistemas PDA profesionales del mercado (Agora, Revo, Casio) son costosos, cerrados y dificiles de personalizar — El Buey Madurado ofrecera una alternativa moderna, abierta y optimizada para la operativa real de un restaurante.

### Lo Que Hace Especial a Este Producto

A diferencia de un proyecto academico tipico, este sistema esta disenado para funcionar en un entorno de alto estres donde cada segundo cuenta. La PDA prioriza la velocidad de interaccion (minimos toques para completar una comanda), la comunicacion en tiempo real entre sala y cocina, y la fiabilidad operativa que un restaurante necesita durante un servicio completo. El core insight es que una PDA profesional no solo gestiona pedidos — **orquesta toda la operativa del restaurante** desde que el cliente se sienta hasta que paga, integrando mesas, cocina, stock, alergenos, turnos y cierres de caja en un flujo continuo y coherente.

## Clasificacion del Proyecto

- **Tipo de proyecto:** Web App (PWA) — aplicacion web progresiva optimizada para dispositivos tactiles
- **Dominio:** Hosteleria / Gestion de restaurante premium
- **Complejidad:** Media — operaciones en tiempo real, multiples roles, UX critica para entornos de alto estres, sin regulaciones estrictas del dominio
- **Contexto:** Brownfield — evolucion del sistema existente (Next.js 16, React 19, MongoDB, 25 API routes, 6 modelos, 20+ componentes, 74 tests)

## Criterios de Exito

### Exito de Usuario

- **Camarero:** Completa una comanda de 4 productos en menos de 30 segundos (maximo 6 toques)
- **Camarero:** Localiza visualmente el estado de cualquier mesa en menos de 2 segundos desde el mapa
- **Camarero:** Divide una cuenta entre comensales y cobra en menos de 1 minuto
- **Cocinero:** Recibe un ticket nuevo en pantalla en menos de 2 segundos tras ser enviado por el camarero
- **Cocinero:** Identifica alergenos e instrucciones especiales de un vistazo, sin tocar la pantalla
- **Admin:** Accede al resumen de ventas del dia, cierre de caja y estado del turno en una sola vista
- **Todos:** La PWA se instala y funciona como app nativa en tablet/movil sin friccion

### Exito de Negocio

- El sistema soporta un servicio completo de restaurante (apertura → servicio → cierre) sin necesidad de herramientas externas
- Reduccion del tiempo medio de toma de comanda frente al flujo actual del dashboard
- Trazabilidad completa: cada pedido tiene camarero, mesa, hora, productos con personalizaciones, metodo de pago y propina
- El sistema es demostrable como proyecto academico de alto nivel (2 DAW - Proyecto Integrado)

### Exito Tecnico

- Tiempo de respuesta de API < 200ms en operaciones criticas (crear pedido, actualizar estado)
- Comunicacion cocina-sala en tiempo real (polling <= 5 segundos o WebSocket)
- PWA instalable con puntuacion Lighthouse PWA > 90
- 0 errores de TypeScript en modo estricto
- Cobertura de tests >= 80% en logica de negocio critica (servicios, utilidades, hooks)
- Build de produccion exitoso en CI antes de cada merge

### Resultados Medibles

| Metrica | Objetivo | Como se mide |
|---------|----------|--------------|
| Toques por comanda (4 productos) | <= 6 | Test de usabilidad manual |
| Tiempo crear pedido completo | < 30s | Cronometro en test E2E |
| Latencia API (p95) | < 200ms | Logs de servidor |
| Lighthouse PWA score | > 90 | Lighthouse audit |
| Tests pasando | 100% | CI pipeline |
| TypeScript errors | 0 | `npm run typecheck` |

## Alcance del Producto

### MVP - Producto Minimo Viable

**Lo esencial para que la PDA funcione en un servicio real:**

1. **Toma de comandas rapida** — Seleccion de productos por categoria con grid tactil, personalizacion (extras, quitar ingredientes), notas por producto
2. **Mapa de mesas en tiempo real** — Vista visual con estados (libre/ocupada/reservada), toque para abrir pedido o ver detalle
3. **Tickets de cocina mejorados** — Kanban con prioridades, alergenos visibles, notas del camarero, actualizacion en tiempo real
4. **Cobro y cierre de pedido** — Metodo de pago (efectivo/tarjeta/mixto), calculo de cambio, cierre de mesa automatico
5. **Cuentas divididas** — Dividir por productos o por partes iguales entre comensales
6. **PWA completa** — Instalable, pantalla completa, icono personalizado, funcionamiento offline basico (cache de carta y productos)
7. **Alergenos** — Campo de alergenos en productos/ingredientes, visible en comanda y en ticket de cocina

### Funcionalidades de Crecimiento (Post-MVP)

8. **Turnos de personal** — Apertura/cierre de turno por usuario, registro de horas
9. **Cierre de caja** — Resumen de ventas del turno, desglose por metodo de pago, cuadre de caja
10. **Propinas** — Registro de propina por pedido, desglose en cierre de caja
11. **Notificaciones push** — Aviso al cocinero cuando llega pedido nuevo, aviso al camarero cuando pedido esta listo
12. **Historial de pedidos** — Busqueda avanzada por fecha, mesa, camarero, estado
13. **Exportacion PDF mejorada** — Tickets de cocina, facturas simplificadas, resumen de cierre

### Vision (Futuro)

14. **Reservas integradas** — Sustituir iframe de CoverManager por sistema propio con calendario y confirmacion
15. **Internacionalizacion** — Espanol, ingles, valenciano (next-intl)
16. **Dashboard analytics avanzado** — Graficos de tendencias, productos mas vendidos, horas punta, rendimiento por camarero
17. **Carta interactiva para cliente** — QR en mesa que abre la carta con fotos, ingredientes, alergenos y posibilidad de pedir desde el movil
18. **Gestion de stock automatica** — Descuento automatico de ingredientes al confirmar pedido, alertas de stock bajo

## User Journeys

### Journey 1: Carlos, Camarero — Servicio de mediodia (Happy Path)

**Carlos**, 28 anos, lleva 3 anos como camarero en El Buey Madurado. Acaba de empezar el turno de mediodia y tiene 8 mesas asignadas.

**Escena inicial:** Carlos llega al restaurante, saca la tablet del cajon y abre la PDA. Se loguea y ve el mapa de mesas — todas libres, turno limpio. Entra una pareja y se sientan en la Mesa 5.

**Accion:** Carlos toca la Mesa 5 en el mapa → la marca como ocupada (2 comensales) → se abre automaticamente un nuevo pedido. La pareja pide dos entrantes y dos carnes. Carlos toca "Entrantes" en el grid de categorias, selecciona "Carpaccio de buey" x1 y "Tartar" x1. Luego toca "Carnes", selecciona "Chuleton 1kg" y el modal de personalizacion se abre: el cliente quiere punto medio y sin sal. Carlos lo anota en 2 toques. Anade "Solomillo" con extra de salsa chimichurri. Total: 4 productos en 25 segundos.

**Climax:** Carlos envia la comanda. En cocina, el ticket aparece instantaneamente con prioridad media, los alergenos marcados y las notas visibles. Mientras, Carlos ya esta atendiendo la Mesa 3. Cuando la cocina marca el pedido como "listo", Carlos recibe una notificacion visual en su PDA y sabe exactamente que mesa servir.

**Resolucion:** La pareja termina de comer. Carlos abre el pedido de la Mesa 5, toca "Cobrar". El total aparece con IVA desglosado. El cliente quiere pagar con tarjeta. Carlos selecciona "tarjeta", confirma, y la mesa vuelve automaticamente a estado "libre" en el mapa. Todo el ciclo — desde sentarse hasta pagar — gestionado desde la PDA sin papel ni idas al TPV fisico.

### Journey 2: Carlos, Camarero — Cuenta dividida y edge case (Error Recovery)

**Escena:** Un grupo de 6 amigos en la Mesa 12 ha terminado de cenar. Quieren dividir la cuenta: 4 pagan a partes iguales y 2 pagan sus propios platos por separado.

**Accion:** Carlos abre el pedido de la Mesa 12 y toca "Dividir cuenta". Selecciona modo "Por productos" para los 2 que pagan individual — arrastra sus platos a subcuentas separadas. Los otros 4 quedan en una cuenta comun que se divide a partes iguales. Resultado: 3 subcuentas.

**Complicacion:** Uno de los del grupo dice "yo no pedi postre, no quiero pagarlo". Carlos edita la subcuenta comun, mueve el postre al que lo pidio. Los totales se recalculan automaticamente con IVA.

**Resolucion:** Carlos cobra cada subcuenta por separado: 2 con tarjeta, 1 en efectivo. La PDA muestra el cambio a devolver en la subcuenta de efectivo. Mesa liberada. Propina registrada.

### Journey 3: Laura, Cocinera — Servicio de noche con urgencia

**Laura**, 35 anos, jefa de cocina. Lleva la linea de carnes y coordina 2 ayudantes.

**Escena inicial:** Viernes noche, servicio completo. Laura tiene la tablet de cocina montada en la pared junto a la linea. La pantalla muestra el kanban: 3 tickets pendientes, 2 en preparacion, 1 completado.

**Accion:** Llega un nuevo ticket con sonido de alerta. Laura lo ve aparecer en la columna "Pendiente" con prioridad **alta** (la mesa lleva 10 minutos esperando). El ticket muestra: Mesa 7 — Chuleton 1kg (punto medio, SIN SAL), Solomillo (+chimichurri). Debajo, en rojo: **ALERGENO: Gluten** en el acompanamiento. Laura toca el ticket y lo arrastra a "En preparacion", marcando la hora de inicio.

**Climax:** Laura ve que tiene 3 tickets pendientes con tiempos acumulados. Reorganiza prioridades: la Mesa 2 lleva mas tiempo esperando, sube su prioridad. El sistema muestra un indicador de color (verde < 10min, amarillo 10-20min, rojo > 20min) que le permite gestionar los tiempos sin calcular mentalmente.

**Resolucion:** Cuando las carnes estan listas, Laura arrastra el ticket a "Completado". El camarero Carlos recibe la notificacion instantaneamente en su PDA. Laura sigue con el siguiente ticket sin perder el ritmo.

### Journey 4: Miguel, Administrador — Cierre del dia

**Miguel**, 45 anos, dueno del restaurante. Revisa la operativa al final de cada jornada.

**Escena inicial:** Son las 00:30, el ultimo cliente acaba de pagar. Miguel abre la PDA en su despacho para hacer el cierre del dia.

**Accion:** En el panel de administracion, Miguel ve el resumen del turno: 47 pedidos servidos, 3 cancelados, facturacion total de 4.230 EUR. Desglosa por metodo de pago: 2.890 EUR en tarjeta, 1.180 EUR en efectivo, 160 EUR mixto. Las propinas suman 285 EUR.

**Revision:** Miguel entra en reportes y ve los productos mas vendidos: el Chuleton 1kg lidera con 18 unidades. Detecta que el Tartar ha bajado un 30% respecto a la semana pasada — toma nota mental para revisar el proveedor. Ve que el camarero Carlos ha gestionado 22 pedidos (el mas activo) y que el tiempo medio de servicio ha sido 45 minutos por mesa.

**Resolucion:** Miguel exporta el resumen de cierre en PDF para su contable, cierra el turno del dia y la aplicacion queda lista para el dia siguiente. Stock actualizado, caja cuadrada, datos trazables.

### Journey 5: Carlos, Camarero — Pedido a domicilio

**Escena:** Suena el telefono del restaurante. Un cliente habitual quiere pedir para llevar a domicilio.

**Accion:** Carlos abre un nuevo pedido y selecciona tipo "Domicilio". Rellena los datos del cliente: nombre, telefono, direccion de entrega. Selecciona los productos de la carta. El sistema calcula automaticamente el gasto de envio segun la zona. Carlos confirma y el ticket de cocina se genera con la etiqueta "DOMICILIO" bien visible.

**Resolucion:** Cuando la cocina completa el pedido, el estado cambia a "Listo". Carlos lo marca como "En camino" cuando sale el repartidor. Finalmente, al confirmar la entrega, el pedido se cierra con el metodo de pago correspondiente.

### Resumen de Requisitos por Journey

| Journey | Capacidades Reveladas |
|---------|----------------------|
| Carlos - Happy Path | Mapa de mesas, crear pedido rapido, grid por categorias, personalizacion, envio a cocina, cobro, cierre de mesa |
| Carlos - Cuenta dividida | Division de cuenta (por productos/partes iguales), subcuentas, recalculo automatico, cobro multiple |
| Laura - Cocina | Kanban tickets, prioridades, alergenos visibles, indicadores de tiempo, notificacion a sala |
| Miguel - Admin | Resumen de turno, desglose metodos de pago, propinas, reportes de productos, exportacion PDF, cierre de caja |
| Carlos - Domicilio | Pedido tipo domicilio, datos de cliente/direccion, gasto envio, etiqueta visible en cocina, tracking de estado |

## Requisitos Especificos del Tipo de Proyecto (Web App PWA)

### Compatibilidad de Navegadores

| Navegador | Version minima | Prioridad |
|-----------|---------------|-----------|
| Chrome (Android/Desktop) | 90+ | Critica — navegador principal en tablets Android |
| Safari (iOS/iPadOS) | 15+ | Critica — iPads en hosteleria |
| Firefox | 90+ | Secundaria |
| Edge | 90+ | Secundaria |

### PWA Requirements

- **Instalable:** Manifest completo con iconos, splash screen, display: standalone
- **Pantalla completa:** Sin barra de navegador en modo instalado
- **Offline basico:** Cache de carta, productos y configuracion. Operaciones de escritura requieren conexion
- **Actualizacion automatica:** Service Worker con estrategia stale-while-revalidate y prompt de actualizacion
- **Responsive:** Optimizado para tablets (768px-1024px) como dispositivo principal, funcional en moviles (360px+) y desktop

### Requisitos de Rendimiento Web

- **First Contentful Paint:** < 1.5s en WiFi del restaurante
- **Time to Interactive:** < 3s en dispositivo medio (tablet Android gama media)
- **Lighthouse Performance:** > 80
- **Lighthouse PWA:** > 90
- **Bundle size:** < 500KB gzipped para carga inicial

### Requisitos de Accesibilidad

- **Touch targets:** Minimo 44x44px en todos los botones y areas interactivas
- **Contraste:** WCAG AA minimo (4.5:1 para texto, 3:1 para elementos grandes)
- **Tamano de fuente:** Minimo 16px base, escalable
- **Feedback tactil:** Feedback visual inmediato en cada toque (< 100ms)

## Requisitos Funcionales

### FR-01: Gestion de Mesas

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-01.1 | El sistema debe mostrar un mapa visual de todas las mesas con su estado actual (libre/ocupada/reservada) en tiempo real | MVP |
| FR-01.2 | El camarero debe poder tocar una mesa para ver su detalle (pedido actual, comensales, tiempo ocupada) | MVP |
| FR-01.3 | El camarero debe poder marcar una mesa como ocupada indicando numero de comensales | MVP |
| FR-01.4 | El sistema debe liberar automaticamente una mesa cuando se cobra el pedido asociado | MVP |
| FR-01.5 | El admin debe poder crear, editar y eliminar mesas (nombre, capacidad, posicion en mapa) | MVP |
| FR-01.6 | El mapa debe usar codigos de color: verde (libre), rojo (ocupada), amarillo (reservada) | MVP |
| FR-01.7 | El sistema debe mostrar el tiempo que lleva ocupada cada mesa | MVP |

### FR-02: Toma de Comandas

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-02.1 | El camarero debe poder crear un pedido desde una mesa con un solo toque | MVP |
| FR-02.2 | El sistema debe mostrar productos organizados por categorias en un grid tactil | MVP |
| FR-02.3 | El camarero debe poder anadir productos al pedido con un solo toque | MVP |
| FR-02.4 | El camarero debe poder personalizar cada producto (extras, quitar ingredientes, notas) | MVP |
| FR-02.5 | El sistema debe calcular automaticamente subtotal, IVA (21%) y total en tiempo real | MVP |
| FR-02.6 | El camarero debe poder enviar la comanda a cocina con un solo toque | MVP |
| FR-02.7 | El camarero debe poder anadir productos a un pedido ya existente (segunda ronda) | MVP |
| FR-02.8 | El sistema debe permitir busqueda rapida de productos por nombre | MVP |
| FR-02.9 | El camarero debe poder crear pedidos de tipo local, recoger y domicilio | MVP |
| FR-02.10 | Para pedidos a domicilio, el sistema debe capturar direccion de entrega y telefono | MVP |

### FR-03: Comunicacion Cocina-Sala

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-03.1 | El sistema debe generar un ticket de cocina automaticamente al enviar una comanda | MVP |
| FR-03.2 | El cocinero debe ver tickets en formato kanban (pendiente/en preparacion/completado) | MVP |
| FR-03.3 | El cocinero debe poder cambiar el estado de un ticket con un toque o arrastre | MVP |
| FR-03.4 | El sistema debe mostrar alergenos de cada producto de forma destacada en el ticket | MVP |
| FR-03.5 | El sistema debe mostrar notas del camarero en cada item del ticket | MVP |
| FR-03.6 | El sistema debe mostrar indicadores de tiempo por ticket (verde/amarillo/rojo) | MVP |
| FR-03.7 | El cocinero debe poder cambiar la prioridad de un ticket | MVP |
| FR-03.8 | El camarero debe recibir notificacion visual cuando un pedido esta listo | MVP |
| FR-03.9 | El sistema debe emitir sonido al llegar un nuevo ticket a cocina | MVP |
| FR-03.10 | El sistema debe permitir notificaciones push cuando la app esta en segundo plano | Crecimiento |

### FR-04: Cobro y Cierre de Pedido

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-04.1 | El camarero debe poder iniciar el cobro de un pedido mostrando el resumen con IVA | MVP |
| FR-04.2 | El sistema debe soportar metodos de pago: efectivo, tarjeta y mixto | MVP |
| FR-04.3 | Para pago en efectivo, el sistema debe calcular el cambio a devolver | MVP |
| FR-04.4 | El sistema debe cerrar automaticamente la mesa al confirmar el cobro | MVP |
| FR-04.5 | El camarero debe poder registrar propina en el cobro | Crecimiento |

### FR-05: Cuentas Divididas

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-05.1 | El camarero debe poder dividir una cuenta a partes iguales entre N comensales | MVP |
| FR-05.2 | El camarero debe poder dividir una cuenta por productos (asignar productos a comensales) | MVP |
| FR-05.3 | El sistema debe recalcular automaticamente subtotal, IVA y total de cada subcuenta | MVP |
| FR-05.4 | El camarero debe poder cobrar cada subcuenta con metodo de pago diferente | MVP |
| FR-05.5 | El camarero debe poder mover productos entre subcuentas antes de cobrar | MVP |

### FR-06: Alergenos

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-06.1 | El admin debe poder asignar alergenos a ingredientes | MVP |
| FR-06.2 | El sistema debe mostrar automaticamente los alergenos de un producto basandose en sus ingredientes | MVP |
| FR-06.3 | Los alergenos deben ser visibles en la comanda del camarero y en el ticket de cocina | MVP |
| FR-06.4 | El sistema debe usar iconografia estandar para los 14 alergenos regulados por la UE | MVP |

### FR-07: PWA y Experiencia Movil

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-07.1 | La aplicacion debe ser instalable como PWA en tablets y moviles | MVP |
| FR-07.2 | La app instalada debe funcionar en modo pantalla completa (sin barra de navegador) | MVP |
| FR-07.3 | El sistema debe cachear carta y productos para consulta offline | MVP |
| FR-07.4 | La interfaz debe estar optimizada para interaccion tactil (botones grandes, gestos) | MVP |
| FR-07.5 | El sistema debe mostrar prompt de actualizacion cuando haya nueva version disponible | MVP |

### FR-08: Turnos y Cierre de Caja

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-08.1 | El usuario debe poder abrir y cerrar turno al inicio/fin de su jornada | Crecimiento |
| FR-08.2 | El sistema debe registrar hora de inicio y fin de cada turno | Crecimiento |
| FR-08.3 | El admin debe poder ver resumen de cierre de caja: ventas totales, desglose por metodo de pago | Crecimiento |
| FR-08.4 | El admin debe poder ver desglose de propinas del turno | Crecimiento |
| FR-08.5 | El admin debe poder exportar el resumen de cierre a PDF | Crecimiento |

### FR-09: Reportes y Analiticas

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-09.1 | El admin debe ver resumen de ventas del dia (total, pedidos, ticket medio) | MVP |
| FR-09.2 | El admin debe ver productos mas vendidos | MVP |
| FR-09.3 | El admin debe ver desglose por metodo de pago | MVP |
| FR-09.4 | El admin debe poder filtrar reportes por rango de fechas | Crecimiento |
| FR-09.5 | El admin debe ver rendimiento por camarero (pedidos gestionados, ventas) | Crecimiento |
| FR-09.6 | El admin debe ver tiempo medio de servicio por mesa | Crecimiento |

### FR-10: Gestion de Stock e Ingredientes

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-10.1 | El admin debe poder gestionar ingredientes (CRUD) con inventario y precios | MVP (existente) |
| FR-10.2 | El admin debe poder gestionar productos (CRUD) con ingredientes, extras e imagenes | MVP (existente) |
| FR-10.3 | El sistema debe marcar productos como no disponibles cuando falte stock de ingredientes | Vision |
| FR-10.4 | El sistema debe descontar automaticamente ingredientes del inventario al confirmar pedido | Vision |
| FR-10.5 | El sistema debe alertar cuando el stock de un ingrediente baje del minimo | Vision |

### FR-11: Autenticacion y Usuarios

| ID | Capacidad | Scope |
|----|-----------|-------|
| FR-11.1 | El sistema debe autenticar usuarios con email y contrasena | MVP (existente) |
| FR-11.2 | El sistema debe soportar roles: admin, camarero, cocinero | MVP (existente) |
| FR-11.3 | El admin debe poder gestionar usuarios (crear, editar, desactivar) | MVP (existente) |
| FR-11.4 | El sistema debe proteger rutas del dashboard con verificacion JWT | MVP (existente) |
| FR-11.5 | El sistema debe cerrar sesion automaticamente cuando expire el token | MVP (existente) |

## Requisitos No Funcionales

### Rendimiento

| ID | Requisito | Objetivo | Justificacion |
|----|-----------|----------|---------------|
| NFR-01 | Tiempo de respuesta API (operaciones CRUD) | < 200ms (p95) | Un camarero no puede esperar durante el servicio |
| NFR-02 | Tiempo de carga inicial de la app | < 3s en WiFi del restaurante | Primera impresion y uso diario |
| NFR-03 | Actualizacion de estado cocina-sala | <= 5s (polling) | La comida se enfria si el camarero no sabe que esta lista |
| NFR-04 | Renderizado de mapa de mesas | < 500ms | El camarero necesita ver el estado instantaneamente |

### Seguridad

| ID | Requisito | Objetivo | Justificacion |
|----|-----------|----------|---------------|
| NFR-05 | Autenticacion JWT con cookies httpOnly | Tokens no accesibles desde JS | Prevenir XSS token theft |
| NFR-06 | Sanitizacion de toda entrada de usuario | 0 vulnerabilidades XSS | Proteccion contra inyeccion |
| NFR-07 | Rate limiting en autenticacion | 5 intentos/min por IP | Prevenir ataques de fuerza bruta |
| NFR-08 | Hashing de passwords con bcrypt | 12 salt rounds | Estandar de seguridad para passwords |
| NFR-09 | Proteccion de rutas con middleware Edge | Verificacion antes de llegar al servidor | Defensa en profundidad |

### Fiabilidad

| ID | Requisito | Objetivo | Justificacion |
|----|-----------|----------|---------------|
| NFR-10 | Disponibilidad durante servicio | 99.5% en horas de servicio | Un restaurante no puede operar sin su PDA |
| NFR-11 | Persistencia de datos | 0 pedidos perdidos | Cada pedido es dinero |
| NFR-12 | Recuperacion ante desconexion | Reconexion automatica con retry | WiFi del restaurante puede ser inestable |

### Usabilidad

| ID | Requisito | Objetivo | Justificacion |
|----|-----------|----------|---------------|
| NFR-13 | Touch targets minimos | 44x44px | Uso con manos mojadas/engrasadas en cocina |
| NFR-14 | Contraste minimo | WCAG AA (4.5:1) | Legibilidad en cocina con vapor/luz variable |
| NFR-15 | Feedback tactil visual | < 100ms | El usuario debe saber que toco correctamente |
| NFR-16 | Curva de aprendizaje | Camarero operativo en < 15 minutos | Alta rotacion de personal en hosteleria |

### Mantenibilidad

| ID | Requisito | Objetivo | Justificacion |
|----|-----------|----------|---------------|
| NFR-17 | TypeScript strict mode | 0 errores | Prevenir bugs en produccion |
| NFR-18 | Cobertura de tests (logica de negocio) | >= 80% | Confianza en cambios |
| NFR-19 | CI pipeline | Build + typecheck en cada PR | Prevenir regresiones |
| NFR-20 | Componentes < 350 lineas | Logica extraida a hooks | Mantenibilidad del codigo |

## Restricciones Tecnicas

### Stack Existente (No Negociable)

El proyecto brownfield impone las siguientes restricciones que deben respetarse:

- **Framework:** Next.js 16 con App Router — no migrar a otro framework
- **Frontend:** React 19 con TypeScript estricto — no relajar strict mode
- **Base de datos:** MongoDB con Mongoose — no migrar a SQL
- **Estilos:** Tailwind CSS — no introducir CSS Modules ni styled-components
- **Autenticacion:** JWT con jose (edge) + jsonwebtoken (server) — no introducir NextAuth u otro proveedor
- **Data fetching:** SWR — no migrar a React Query u otra libreria
- **Hosting:** Vercel — optimizar para su plataforma (output: standalone)
- **CI:** GitHub Actions — mantener pipeline existente

### Restricciones de Compatibilidad

- Todas las nuevas funcionalidades deben ser retrocompatibles con la API existente
- Los 6 modelos Mongoose existentes pueden extenderse pero no reestructurarse de forma destructiva
- Los 74 tests existentes deben seguir pasando tras cada cambio

## Dependencias y Riesgos

### Dependencias

| Dependencia | Tipo | Impacto |
|-------------|------|---------|
| MongoDB Atlas | Servicio externo | BD de produccion — caida = sistema offline |
| Cloudinary | Servicio externo | Imagenes de productos — degradacion graceful si falla |
| Vercel | Hosting | Despliegue y serving — caida = app inaccesible |
| WiFi del restaurante | Infraestructura | Conectividad — offline mode mitiga parcialmente |

### Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| WiFi inestable durante servicio | Media | Alto | Cache offline de productos/carta, reconexion automatica |
| Tablet con bateria baja | Media | Medio | Notificacion de bateria baja, autoguardado frecuente |
| Multiples camareros editando misma mesa | Baja | Alto | Optimistic locking con SWR revalidation, indicador visual de mesa "en uso" |
| Volumen de pedidos en hora punta | Media | Medio | Indices MongoDB optimizados, paginacion, cache SWR |

---

*PRD generado el 2026-03-25 — El Buey Madurado PDA Profesional*

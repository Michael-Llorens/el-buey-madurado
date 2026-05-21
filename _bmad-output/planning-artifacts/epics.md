---
stepsCompleted: ['step-01-validate', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md', '_bmad-output/project-context.md']
status: 'complete'
---

# El Buey Madurado - Epic Breakdown

## Overview

Este documento descompone los requisitos del PRD y las decisiones de arquitectura en epicas y stories implementables para la PDA profesional de El Buey Madurado.

## Inventario de Requisitos

### Requisitos Funcionales

- FR-01: Gestion de Mesas (7 capacidades)
- FR-02: Toma de Comandas (10 capacidades)
- FR-03: Comunicacion Cocina-Sala (10 capacidades)
- FR-04: Cobro y Cierre de Pedido (5 capacidades)
- FR-05: Cuentas Divididas (5 capacidades)
- FR-06: Alergenos (4 capacidades)
- FR-07: PWA y Experiencia Movil (5 capacidades)
- FR-08: Turnos y Cierre de Caja (5 capacidades)
- FR-09: Reportes y Analiticas (6 capacidades)
- FR-10: Gestion de Stock e Ingredientes (5 capacidades)
- FR-11: Autenticacion y Usuarios (5 capacidades)

### Requisitos No Funcionales

- NFR-01 a NFR-04: Rendimiento (API < 200ms, carga < 3s, polling 3-5s, mapa < 500ms)
- NFR-05 a NFR-09: Seguridad (JWT httpOnly, sanitizacion, rate limiting, bcrypt, middleware Edge)
- NFR-10 a NFR-12: Fiabilidad (99.5%, 0 pedidos perdidos, reconexion)
- NFR-13 a NFR-16: Usabilidad (touch 44px, contraste AA, feedback < 100ms, curva < 15min)
- NFR-17 a NFR-20: Mantenibilidad (TS strict, tests 80%, CI, componentes < 350 lineas)

### Requisitos Adicionales (Arquitectura)

- ADR-01: Mantener SWR polling (cocina 3s, pedidos 5s, mesas 10s)
- ADR-02: useReducer local para cuentas divididas
- ADR-03: Campo alergenos en Ingrediente con enum 14 UE
- ADR-04: Subdocumentos subcuentas[] en Pedido
- ADR-05: Service Worker manual extendido para PWA
- ADR-06: Nuevo modelo Turno para cierres de caja
- Nuevos endpoints: dividir, cobrar, cobrar-subcuenta, turnos

### Mapa de Cobertura FR → Epica

| FR | Epica |
|----|-------|
| FR-01 | Epic 2: Mapa de Mesas |
| FR-02 | Epic 3: Toma de Comandas |
| FR-03 | Epic 4: Cocina en Tiempo Real |
| FR-04 | Epic 5: Cobro |
| FR-05 | Epic 5: Cobro (cuentas divididas) |
| FR-06 | Epic 1: Alergenos (base de datos) + Epic 3/4 (visualizacion) |
| FR-07 | Epic 6: PWA |
| FR-08 | Epic 7: Turnos y Caja |
| FR-09 | Epic 8: Reportes |
| FR-10 | Existente (mejoras menores) |
| FR-11 | Existente (sin cambios) |

## Lista de Epicas

| # | Epica | Scope | Stories |
|---|-------|-------|---------|
| 1 | Alergenos y Modelo de Datos | MVP | 3 |
| 2 | Mapa de Mesas Profesional | MVP | 4 |
| 3 | Toma de Comandas Rapida | MVP | 5 |
| 4 | Cocina en Tiempo Real | MVP | 3 |
| 5 | Cobro y Cuentas Divididas | MVP | 5 |
| 6 | PWA Completa | MVP | 3 |
| 7 | Turnos y Cierre de Caja | Crecimiento | 4 |
| 8 | Reportes Avanzados | Crecimiento | 3 |

---

## Epic 1: Alergenos y Modelo de Datos

**Objetivo:** Establecer el soporte de alergenos en el modelo de datos como base para su visualizacion en comandas y cocina.

### Story 1.1: Constantes y utilidades de alergenos

Como **administrador**,
quiero que el sistema soporte los 14 alergenos regulados por la UE,
para que se puedan asignar a ingredientes y mostrar automaticamente en productos.

**Acceptance Criteria:**

**Given** el sistema tiene definidos los 14 alergenos UE como constante
**When** un desarrollador importa `ALERGENOS_UE` desde `@/lib/constants/alergenos.ts`
**Then** obtiene un array con los 14 alergenos tipados como union type
**And** existe una utilidad `getAlergenosProducto(producto)` que devuelve los alergenos unicos heredados de sus ingredientes

### Story 1.2: Campo alergenos en modelo Ingrediente

Como **administrador**,
quiero poder asignar alergenos a cada ingrediente,
para que los productos hereden automaticamente los alergenos de sus ingredientes.

**Acceptance Criteria:**

**Given** el modelo Ingrediente existe en la base de datos
**When** se anade el campo `alergenos: string[]` con validacion enum de los 14 alergenos UE
**Then** los ingredientes existentes tienen `alergenos: []` por defecto
**And** la API `PUT /api/ingredientes/[id]` acepta el campo alergenos
**And** la API `GET /api/ingredientes` devuelve el campo alergenos

### Story 1.3: UI de asignacion de alergenos en IngredienteForm

Como **administrador**,
quiero seleccionar los alergenos de un ingrediente mediante checkboxes con iconografia estandar,
para que sea rapido y visual asignar alergenos al gestionar ingredientes.

**Acceptance Criteria:**

**Given** el formulario de ingrediente esta abierto
**When** el admin ve la seccion de alergenos
**Then** se muestran los 14 alergenos como checkboxes con icono y nombre
**And** los alergenos previamente asignados aparecen marcados
**And** al guardar, los alergenos seleccionados se envian a la API

---

## Epic 2: Mapa de Mesas Profesional

**Objetivo:** Transformar la vista de mesas en un mapa visual interactivo en tiempo real optimizado para tablets.

### Story 2.1: Mapa de mesas con estados visuales en tiempo real

Como **camarero**,
quiero ver un mapa visual de todas las mesas con codigos de color por estado,
para saber de un vistazo que mesas estan libres, ocupadas o reservadas.

**Acceptance Criteria:**

**Given** el camarero esta en la vista de mesas
**When** el mapa se carga
**Then** cada mesa se muestra con color: verde (libre), rojo (ocupada), amarillo (reservada)
**And** los datos se actualizan automaticamente cada 10 segundos via SWR polling
**And** cada mesa muestra su nombre y numero de comensales actuales

### Story 2.2: Interaccion tactil con mesas

Como **camarero**,
quiero tocar una mesa para ver su detalle o abrir un pedido,
para gestionar mesas con minimos toques.

**Acceptance Criteria:**

**Given** el camarero toca una mesa libre
**When** selecciona numero de comensales
**Then** la mesa se marca como ocupada y se crea un nuevo pedido automaticamente
**And** se redirige al formulario de comanda

**Given** el camarero toca una mesa ocupada
**When** se abre el panel de detalle
**Then** ve el pedido actual, productos, total parcial y tiempo ocupada

### Story 2.3: Indicador de tiempo en mesas ocupadas

Como **camarero**,
quiero ver cuanto tiempo lleva ocupada cada mesa,
para priorizar el servicio en mesas que llevan mas tiempo.

**Acceptance Criteria:**

**Given** una mesa esta ocupada
**When** el camarero ve el mapa
**Then** la mesa muestra un badge con el tiempo transcurrido (ej: "25 min")
**And** el badge cambia de color: verde < 30min, amarillo 30-60min, rojo > 60min

### Story 2.4: Gestion de mesas (admin)

Como **administrador**,
quiero poder crear, editar y eliminar mesas con su nombre y capacidad,
para configurar el plano del restaurante.

**Acceptance Criteria:**

**Given** el admin esta en configuracion de mesas
**When** crea o edita una mesa
**Then** puede asignar nombre (unico), capacidad (1-20) y estado inicial
**And** la mesa aparece inmediatamente en el mapa

---

## Epic 3: Toma de Comandas Rapida

**Objetivo:** Permitir al camarero crear una comanda completa en < 30 segundos con maximo 6 toques.

### Story 3.1: Grid de productos por categorias tactil

Como **camarero**,
quiero seleccionar productos de un grid organizado por categorias,
para anadir productos al pedido con un solo toque.

**Acceptance Criteria:**

**Given** el camarero esta creando una comanda
**When** ve el selector de productos
**Then** los productos aparecen en un grid con botones grandes (min 44x44px) organizados por categoria
**And** cada producto muestra nombre, precio y disponibilidad
**And** un toque en un producto lo anade al pedido con cantidad 1
**And** toques adicionales incrementan la cantidad

### Story 3.2: Personalizacion de producto en comanda

Como **camarero**,
quiero personalizar un producto (extras, quitar ingredientes, notas),
para registrar las preferencias del cliente.

**Acceptance Criteria:**

**Given** el camarero ha anadido un producto al pedido
**When** toca el producto para personalizar
**Then** se abre un modal con opciones de personalizacion
**And** puede anadir extras (con precio adicional)
**And** puede quitar ingredientes
**And** puede anadir notas de texto libre (max 200 chars)
**And** los alergenos del producto se muestran automaticamente
**And** el precio se recalcula en tiempo real

### Story 3.3: Resumen de comanda con totales en tiempo real

Como **camarero**,
quiero ver un resumen del pedido con totales actualizados automaticamente,
para confirmar la comanda antes de enviarla a cocina.

**Acceptance Criteria:**

**Given** el camarero tiene productos en el pedido
**When** revisa el resumen
**Then** ve lista de productos con cantidad, precio unitario y subtotal
**And** ve subtotal, IVA (21%) y total calculados automaticamente
**And** puede modificar cantidades o eliminar productos
**And** un boton "Enviar a Cocina" envia la comanda

### Story 3.4: Busqueda rapida de productos

Como **camarero**,
quiero buscar un producto por nombre,
para encontrarlo rapidamente sin navegar por categorias.

**Acceptance Criteria:**

**Given** el camarero esta en el selector de productos
**When** escribe en el campo de busqueda
**Then** los resultados se filtran en tiempo real mientras escribe
**And** puede seleccionar un producto del resultado con un toque

### Story 3.5: Segunda ronda (anadir a pedido existente)

Como **camarero**,
quiero anadir productos a un pedido ya existente,
para gestionar segundas rondas sin crear un nuevo pedido.

**Acceptance Criteria:**

**Given** una mesa tiene un pedido abierto
**When** el camarero toca la mesa y selecciona "Anadir productos"
**Then** se abre el selector de productos
**And** los nuevos productos se anaden al pedido existente
**And** los totales se recalculan

---

## Epic 4: Cocina en Tiempo Real

**Objetivo:** Mejorar el panel de cocina con alergenos, indicadores de tiempo y notificaciones.

### Story 4.1: Alergenos visibles en tickets de cocina

Como **cocinero**,
quiero ver los alergenos de cada producto destacados en el ticket,
para preparar los platos con seguridad alimentaria.

**Acceptance Criteria:**

**Given** un ticket de cocina contiene productos con alergenos
**When** el cocinero ve el ticket
**Then** cada producto muestra sus alergenos con iconografia estandar UE
**And** los alergenos aparecen en color rojo/naranja destacado
**And** las notas del camarero se muestran debajo de cada item

### Story 4.2: Indicadores de tiempo por ticket

Como **cocinero**,
quiero ver indicadores de color que muestren cuanto tiempo lleva cada ticket,
para priorizar la preparacion sin calcular mentalmente.

**Acceptance Criteria:**

**Given** hay tickets en el kanban de cocina
**When** el cocinero ve la columna "Pendiente" o "En preparacion"
**Then** cada ticket muestra un badge de tiempo con color: verde < 10min, amarillo 10-20min, rojo > 20min
**And** el tiempo se actualiza automaticamente
**And** el cocinero puede cambiar la prioridad de un ticket con un toque

### Story 4.3: Sonido y notificacion de nuevo ticket

Como **cocinero**,
quiero recibir una alerta sonora cuando llega un nuevo ticket,
para no perder pedidos durante la preparacion.

**Acceptance Criteria:**

**Given** la tablet de cocina tiene la app abierta
**When** llega un nuevo ticket de cocina
**Then** suena una alerta sonora
**And** el ticket aparece en la columna "Pendiente" con animacion de entrada
**And** si la prioridad es alta, el sonido es diferenciado

---

## Epic 5: Cobro y Cuentas Divididas

**Objetivo:** Implementar cobro completo con soporte para cuentas divididas y propinas.

### Story 5.1: Modal de cobro de pedido

Como **camarero**,
quiero cobrar un pedido seleccionando el metodo de pago,
para cerrar la mesa al finalizar el servicio.

**Acceptance Criteria:**

**Given** un pedido esta en estado "servido" o "listo"
**When** el camarero toca "Cobrar"
**Then** se abre un modal con: resumen del pedido, subtotal, IVA, total
**And** puede seleccionar metodo de pago: efectivo, tarjeta o mixto
**And** para efectivo, introduce el importe recibido y ve el cambio a devolver
**And** al confirmar, el pedido pasa a "pagado" y la mesa se libera automaticamente

### Story 5.2: Endpoint API de cobro

Como **sistema**,
quiero un endpoint para procesar cobros de pedidos,
para persistir el metodo de pago y cerrar el ciclo del pedido.

**Acceptance Criteria:**

**Given** un pedido existe y no esta cancelado
**When** se llama a `PUT /api/pedidos/[id]/cobrar` con `{ metodoPago, importeRecibido? }`
**Then** el pedido se actualiza con estado "pagado" y metodo de pago
**And** si es pedido local, la mesa asociada se libera (estado "libre", pedidoActual null)
**And** se retorna el pedido actualizado

### Story 5.3: Division de cuenta a partes iguales

Como **camarero**,
quiero dividir una cuenta a partes iguales entre N comensales,
para facilitar el pago grupal.

**Acceptance Criteria:**

**Given** el camarero abre el modal de cobro
**When** selecciona "Dividir cuenta" → "A partes iguales"
**Then** introduce el numero de comensales
**And** el sistema crea N subcuentas con el mismo importe (total/N con redondeo correcto)
**And** cada subcuenta puede cobrarse con metodo de pago diferente

### Story 5.4: Division de cuenta por productos

Como **camarero**,
quiero asignar productos a comensales individuales,
para que cada uno pague lo que pidio.

**Acceptance Criteria:**

**Given** el camarero selecciona "Dividir cuenta" → "Por productos"
**When** arrastra o asigna productos a subcuentas
**Then** cada subcuenta muestra sus productos, subtotal, IVA y total
**And** puede mover productos entre subcuentas
**And** los totales se recalculan automaticamente al mover

### Story 5.5: Backend de cuentas divididas

Como **sistema**,
quiero endpoints para crear subcuentas y cobrar individualmente,
para persistir la division de cuenta.

**Acceptance Criteria:**

**Given** un pedido existe
**When** se llama a `PUT /api/pedidos/[id]/dividir` con `{ tipo: 'igual' | 'por_productos', subcuentas[] }`
**Then** se crean subdocumentos subcuentas[] en el pedido
**And** `PUT /api/pedidos/[id]/cobrar-subcuenta` cobra una subcuenta individual
**And** cuando todas las subcuentas estan pagadas, el pedido pasa a "pagado"

---

## Epic 6: PWA Completa

**Objetivo:** Hacer la aplicacion instalable como app nativa en tablets y moviles.

### Story 6.1: Manifest y meta tags PWA completos

Como **usuario**,
quiero instalar la app en mi tablet como aplicacion nativa,
para acceder con un toque sin abrir el navegador.

**Acceptance Criteria:**

**Given** el usuario accede a la app desde Chrome/Safari
**When** el navegador detecta el manifest
**Then** ofrece instalar la app
**And** la app instalada se abre en modo standalone (sin barra de navegador)
**And** tiene icono personalizado y splash screen
**And** Lighthouse PWA score > 90

### Story 6.2: Service Worker con cache inteligente

Como **camarero**,
quiero que la carta y productos esten disponibles aunque la conexion sea lenta,
para no quedarme bloqueado durante el servicio.

**Acceptance Criteria:**

**Given** la app ha cargado al menos una vez con conexion
**When** la conexion es lenta o intermitente
**Then** los productos, ingredientes y mesas se sirven desde cache (stale-while-revalidate)
**And** las operaciones de escritura (crear pedido, cobrar) requieren conexion y muestran error claro si no hay
**And** al recuperar conexion, los datos se revalidan automaticamente

### Story 6.3: Prompt de actualizacion

Como **administrador**,
quiero que los usuarios vean un aviso cuando haya nueva version,
para que todos usen la ultima version de la app.

**Acceptance Criteria:**

**Given** se despliega una nueva version de la app
**When** el Service Worker detecta el cambio
**Then** muestra un toast "Nueva version disponible - Actualizar"
**And** al tocar, recarga la app con la nueva version

---

## Epic 7: Turnos y Cierre de Caja

**Objetivo:** Implementar gestion de turnos y cierre de caja para control operativo.

### Story 7.1: Modelo Turno y API

Como **sistema**,
quiero un modelo de datos y endpoints para gestionar turnos,
para registrar las jornadas del personal y los datos de caja.

**Acceptance Criteria:**

**Given** se necesita un nuevo modelo Turno
**When** se crea el modelo con: usuario, horaInicio, horaFin, estado, resumenCaja
**Then** los endpoints `POST /api/turnos/abrir`, `POST /api/turnos/cerrar`, `GET /api/turnos`, `GET /api/turnos/actual` funcionan correctamente
**And** solo puede haber un turno abierto por usuario a la vez

### Story 7.2: UI apertura/cierre de turno

Como **camarero**,
quiero abrir mi turno al llegar y cerrarlo al irme,
para que el sistema registre mis horas de trabajo.

**Acceptance Criteria:**

**Given** el usuario se loguea
**When** no tiene turno abierto
**Then** ve un boton "Abrir turno" en la cabecera del dashboard
**And** al abrirlo, se registra la hora de inicio
**And** al cerrar turno, se registra la hora de fin y se genera resumen

### Story 7.3: Panel de cierre de caja

Como **administrador**,
quiero ver el resumen de caja al cerrar el turno,
para cuadrar la caja diariamente.

**Acceptance Criteria:**

**Given** el admin cierra el turno del dia
**When** ve el panel de cierre de caja
**Then** muestra: total ventas, desglose por metodo de pago (efectivo/tarjeta/mixto), propinas, numero de pedidos
**And** puede exportar el resumen a PDF

### Story 7.4: Historial de turnos

Como **administrador**,
quiero consultar turnos pasados,
para revisar el historico de caja y horas del personal.

**Acceptance Criteria:**

**Given** el admin accede al historial de turnos
**When** filtra por fecha o usuario
**Then** ve una lista de turnos con: usuario, fecha, horas, total ventas
**And** puede ver el detalle de cierre de caja de cada turno

---

## Epic 8: Reportes Avanzados

**Objetivo:** Ampliar el panel de reportes con filtros, rendimiento por camarero y exportacion.

### Story 8.1: Filtro de reportes por rango de fechas

Como **administrador**,
quiero filtrar reportes por rango de fechas,
para analizar periodos especificos (dia, semana, mes).

**Acceptance Criteria:**

**Given** el admin esta en el panel de reportes
**When** selecciona un rango de fechas
**Then** los datos se filtran y actualizan (ventas, productos, pedidos)
**And** incluye presets: hoy, esta semana, este mes, personalizado

### Story 8.2: Rendimiento por camarero

Como **administrador**,
quiero ver las metricas de cada camarero,
para evaluar el rendimiento del equipo.

**Acceptance Criteria:**

**Given** el admin ve reportes de rendimiento
**When** selecciona la vista por camarero
**Then** ve: pedidos gestionados, ventas totales, ticket medio, tiempo medio de servicio
**And** puede ordenar por cualquier metrica

### Story 8.3: Exportacion de reportes a PDF

Como **administrador**,
quiero exportar el resumen de reportes a PDF,
para enviarlo al contable o archivarlo.

**Acceptance Criteria:**

**Given** el admin tiene un reporte visible
**When** toca "Exportar PDF"
**Then** se genera un PDF con los datos del reporte actual
**And** incluye: titulo, rango de fechas, tablas y totales
**And** se descarga automaticamente

---

*Epicas generadas el 2026-03-25 — El Buey Madurado PDA Profesional*
*Total: 8 epicas, 30 stories*

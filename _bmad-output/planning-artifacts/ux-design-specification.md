---
stepsCompleted: ['step-01-init', 'step-02-discovery']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md', '_bmad-output/planning-artifacts/epics.md', '_bmad-output/project-context.md', 'docs/auditoria-el-buey-madurado.md', 'docs/component-inventory.md']
---

# UX Design Specification El Buey Madurado

**Author:** Micha
**Date:** 2026-03-25

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Resumen Ejecutivo

### Vision del Proyecto

El Buey Madurado evolucionara de un dashboard web a una **PDA profesional tactil** para la gestion completa de un restaurante premium de carnes maduradas. El sistema debe funcionar como herramienta de trabajo real comparable a soluciones comerciales (Agora, Revo), instalable como PWA en tablets y moviles, cubriendo todo el ciclo operativo: apertura de turno → toma de comandas → cocina → servicio → cobro → cierre de caja.

### Usuarios Objetivo

| Usuario | Contexto de uso | Dispositivo | Entorno | Pantalla inicial |
|---------|----------------|-------------|---------|-----------------|
| **Camarero** | En movimiento, manos ocupadas, prisa, ruido | Tablet 10" portrait (una mano) | Sala, de pie entre mesas | Mapa de mesas |
| **Cocinero** | Posicion fija, manos mojadas/engrasadas, vapor, calor | Tablet 10" landscape (montada en pared, 1-2m distancia) | Cocina | Kanban cocina |
| **Admin** | Revision detallada, despacho, fin de turno | Tablet o desktop | Oficina, sentado | Reportes/dashboard |

### Retos de Diseno Clave

1. **Velocidad critica** — 4 productos en < 30s, <= 6 toques. Cada toque extra es friccion real durante el servicio
2. **Manos no ideales** — Touch targets >= 48px, gestos simples (toque, no swipe complejo). Cocina con guantes/manos mojadas
3. **Legibilidad bajo estres** — Jerarquia visual clara, colores de estado, fuentes grandes. El camarero escanea en 1-2 segundos
4. **Alergenos = seguridad alimentaria** — Iconografia UE estandar, color rojo/naranja, posicion prominente, imposible de ignorar
5. **Modo visual por entorno** — Sala con iluminacion tenue (tema oscuro), cocina con fluorescentes (necesita alto contraste). Considerar variacion de tema por rol
6. **Orientacion de tablet** — Portrait en sala (una mano, camarero en movimiento), landscape en cocina (mas columnas kanban, montaje en pared)
7. **Errores tactiles bajo estres** — Undo rapido en comanda, confirmacion SOLO en acciones destructivas (cancelar, cobrar), nunca en acciones reversibles (anadir producto)
8. **Feedback de conexion** — Banner fijo rojo "Sin conexion" visible inmediatamente si cae el WiFi. El camarero debe saber al instante que no puede enviar comandas
9. **Legibilidad a distancia en cocina** — Fuentes minimo 20-24px para productos, 28-32px para alergenos. La tablet esta a 1-2 metros en la pared
10. **Curva de aprendizaje** — Personal operativo en < 15 minutos. Estado vacio autoexplicativo al abrir el restaurante por primera vez

### Oportunidades de Diseno

1. **Grid TPV por categorias** — Botones grandes de color por categoria, comanda a velocidad de conversacion
2. **Mapa de mesas como dashboard principal** — Vista bird's-eye con estados, tiempos y pedidos de un vistazo
3. **Semaforo de tiempos** — Verde/amarillo/rojo para espera en cocina y mesas, eliminando calculo mental
4. **Cobro touch-first** — 3 toques: metodo → confirmar → cerrar. Cuentas divididas con drag-and-drop tactil
5. **Sonidos diferenciados** — Nuevo pedido, pedido listo, pedido urgente (>20min). El cocinero distingue por sonido sin mirar
6. **Navegacion por rol** — Tab bar inferior fija (3-4 iconos) en movil/tablet portrait. Pantalla inicial automatica segun rol
7. **Haptic feedback** — Vibracion corta al confirmar acciones para dar seguridad al camarero de que el toque se registro
8. **Atajos por rol** — Login → pantalla principal del rol sin navegacion extra (camarero → mesas, cocinero → kanban, admin → reportes)

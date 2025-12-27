import mongoose from 'mongoose';

const ingredienteSchema = new mongoose.Schema({
  // ============================================
  // IDENTIFICACIÓN DEL INGREDIENTE
  // ============================================
  
  // NOMBRE ÚNICO
  // - Nombre que identifica el ingrediente
  // - DEBE SER ÚNICO (no puede haber dos "Queso Cheddar")
  // - Se trimea para eliminar espacios
  // Ejemplo: "Queso Cheddar Ahumado", "Bacon Ibérico", "Trufa Negra"
  nombre: {
    type: String,
    required: true,        // Obligatorio, no puedes dejar vacío
    unique: true,          // No se puede repetir en la BD
    trim: true,            // Elimina espacios al inicio y final
  },

  // CATEGORÍA
  // - Sirve para clasificar los ingredientes
  // - Facilita filtrar en el admin
  // - Solo permite estos valores específicos
  // Categorías disponibles:
  //   - "carne": Carnes (vaca, pollo, cerdo, etc)
  //   - "queso": Quesos
  //   - "salsa": Salsas y condimentos
  //   - "vegetal": Vegetales y verduras
  //   - "topping": Toppings y adiciones (huevo, cebolla frita, etc)
  //   - "pan": Tipos de pan
  //   - "otros": Otros ingredientes
  // Ejemplo: "queso" para Queso Cheddar
  categoria: {
    type: String,
    enum: ['carne', 'queso', 'salsa', 'vegetal', 'topping', 'pan', 'otros'],
    required: true,        // Obligatorio
  },

  // DESCRIPCIÓN (OPCIONAL)
  // - Información adicional sobre el ingrediente
  // - No es obligatoria (puede ser vacía)
  // - Se muestra en el admin para dar contexto
  // Ejemplo: "Queso cheddar de 6 meses de maduración, importado de USA"
  descripcion: String,

  // ============================================
  // PRECIOS
  // ============================================

  // PRECIO BASE
  // - Costo para el restaurante (costo de producción)
  // - Se usa SOLO para contabilidad interna
  // - NO es lo que cobras al cliente
  // - NO afecta el precio de venta
  // - Mínimo 0, no puede ser negativo
  // Ejemplo: 0.50 (50 céntimos)
  // 
  // Caso real:
  // Te cuesta 0.50€ hacer el ingrediente
  // Pero cobras 1.50€ si el cliente lo agrega como extra
  precioBase: {
    type: Number,
    required: true,        // Obligatorio
    min: 0,                // No puede ser negativo
  },

  // PRECIO EXTRA
  // - Precio que cobras SI el cliente lo agrega como ingrediente extra
  // - Lo que aparece en el menú como "Extra"
  // - Es lo que el cliente PAGA
  // - Es diferente al precioBase (que es lo que cuesta)
  // - Mínimo 0, no puede ser negativo
  // Ejemplo: 1.50 (cobras 1.50€ si lo agrega)
  //
  // Caso real:
  // Queso Cheddar:
  //   - precioBase: 0.50 (lo que cuesta hacerlo)
  //   - precioExtra: 1.50 (lo que cobras si lo agrega)
  //   - Ganancia: 1.00€ por cada extra agregado
  precioExtra: {
    type: Number,
    required: true,        // Obligatorio
    min: 0,                // No puede ser negativo
  },

  // ============================================
  // IMAGEN
  // ============================================

  // IMAGEN (OPCIONAL)
  // - URL de la imagen desde Cloudinary
  // - Se muestra en el admin para identificar visualmente
  // - No es obligatoria
  // Ejemplo: "https://res.cloudinary.com/mi-cuenta/image/upload/v1234/queso.jpg"
  imagen: String,

  // ============================================
  // INVENTARIO / STOCK
  // ============================================

  inventario: {
    // CANTIDAD DISPONIBLE
    // - Stock actual que tienes disponible
    // - Se reduce cada vez que se usa en un pedido
    // - Por defecto empieza con 100
    // - Mínimo 0, no puede ser negativo
    // Ejemplo: 85 (te quedan 85 unidades)
    cantidad: {
      type: Number,
      default: 100,        // Si no especificas, empieza con 100
      min: 0,              // No puede ser negativo
    },

    // UNIDAD DE MEDIDA
    // - En qué se mide el ingrediente
    // - Solo permite estos valores:
    //   - "g" = gramos (para carnes, quesos, etc)
    //   - "ml" = mililitros (para salsas, bebidas)
    //   - "unidad" = unidades individuales (huevo, pan individual)
    //   - "porcion" = porciones (para platos preparados)
    // - Por defecto es "g" (gramos)
    // Ejemplo: 
    //   Carne Molida: 200 g (200 gramos)
    //   Salsa BBQ: 500 ml (500 mililitros)
    //   Huevo: 50 unidad (50 huevos individuales)
    unidad: {
      type: String,
      enum: ['g', 'ml', 'unidad', 'porcion'],
      default: 'g',
    },
  },

  // ============================================
  // ALÉRGENOS Y DISPONIBILIDAD
  // ============================================

  // ALÉRGENOS
  // - Lista de alérgenos que contiene este ingrediente
  // - Se muestra al cliente para advertencias de seguridad
  // - Es un array de strings (puede tener varios)
  // Ejemplos:
  //   [] = sin alérgenos
  //   ["gluten"] = contiene gluten
  //   ["lácteos", "frutos secos"] = contiene lácteos y frutos secos
  alergenicos: [String],

  // DISPONIBLE
  // - ¿Se puede usar este ingrediente HOY?
  // - true = sí, se puede usar hoy
  // - false = no, se puede usar hoy (agotado, descontinuado, etc)
  // - Si es false, no aparece en la carta para el cliente
  // - Por defecto es true
  // Ejemplo:
  //   true = está disponible hoy, se puede pedir
  //   false = no está disponible (quizás se acabó ese día)
  disponible: {
    type: Boolean,
    default: true,
  },

  // ACTIVO
  // - ¿Existe este ingrediente en el sistema?
  // - true = sí, existe
  // - false = no, fue eliminado (pero datos se conservan en BD)
  // - Usamos "soft delete" (no borramos, marcamos como inactivo)
  // - Sirve para conservar histórico de pedidos
  // - Por defecto es true
  // Ejemplo:
  //   true = ingrediente activo en el sistema
  //   false = ingrediente eliminado (pero no se borra de BD)
  activo: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Ingrediente || mongoose.model('Ingrediente', ingredienteSchema, 'ingredientes'); 
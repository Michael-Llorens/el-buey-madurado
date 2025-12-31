import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // ============================================
  // IDENTIFICACIÓN DEL PRODUCTO
  // ============================================

  // NOMBRE DEL PRODUCTO
  // - Nombre que ve el cliente en la carta
  // - Se trimea para eliminar espacios
  // Ejemplo: "Hamburguesa El Buey", "Carne a la Parrilla", "Postre de Chocolate"
  nombre: {
    type: String,
    required: true,        // Obligatorio
    trim: true,            // Elimina espacios
  },

  // CATEGORÍA DEL PRODUCTO
  // - Sección en la que aparece en la carta
  // - Solo permite estos valores:
  //   - "Entrantes": Primeros platos, apertivos
  //   - "Carnes": Carnes a la parrilla, asadas
  //   - "Sándwich y hamburguesas": Sandwiches y hamburguesas
  //   - "Postres": Postres y dulces
  // - Sirve para organizar la carta por secciones
  // Ejemplo: "Carnes" para Hamburguesa El Buey
  categoria: {
    type: String,
    enum: ['Entrantes', 'Carnes', 'Sándwich y hamburguesas', 'Postres'],
    required: true,        // Obligatorio
  },

  // PRECIO BASE DEL PRODUCTO
  // - Precio que ve el cliente en la carta
  // - Precio sin extras agregados
  // - Si el cliente agrega extras, se suma al final
  // - Mínimo 0, no puede ser negativo
  // Ejemplo: 15.00 (15 euros)
  // 
  // Cálculo final con extras:
  // Precio = 15.00 (base) + 0.80 (bacon) + 2.50 (trufa) = 18.30€
  precio: {
    type: Number,
    required: true,        // Obligatorio
    min: 0,                // No puede ser negativo
  },

  // DESCRIPCIÓN DEL PRODUCTO
  // - Lo que ves en la carta debajo del nombre
  // - Texto que describe el plato, ingredientes, etc
  // - Es lo que el cliente lee para decidir
  // Ejemplo: "200g de vaca rubia gallega, pastrami de vaca madurada, queso cheddar inglés madurado y una suave capa de crema de trufa"
  descripcion: {
    type: String,
    required: true,        // Obligatorio
  },

  // IMAGEN (OPCIONAL)
  // - Foto del producto en Cloudinary
  // - Se muestra en la carta o admin
  // - No es obligatoria
  // Ejemplo: "https://res.cloudinary.com/mi-cuenta/image/upload/v1234/hamburguesa.jpg"
  imagen: String,

  // ============================================
  // INGREDIENTES BASE (LO QUE SIEMPRE LLEVA)
  // ============================================

  // ARRAY DE INGREDIENTES BASE
  // - Lista de ingredientes que siempre lleva este producto
  // - El cliente puede modificarlos (quitar algunos, agregar extras)
  // - Cada ingrediente tiene su propia información
  ingredientes: [
    {
      // NO GENERAR ID PARA CADA INGREDIENTE
      // - Esto evita que MongoDB cree un _id automático para cada elemento
      // - Hace la estructura más limpia
      _id: false,

      // REFERENCIA AL INGREDIENTE
      // - ID del ingrediente en la colección "Ingrediente"
      // - Se usa para traer datos completos del ingrediente
      // - Necesario para populate (traer toda la información del ingrediente)
      // Ejemplo: ObjectId("507f1f77bcf86cd799439001")
      ingrediente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingrediente',           // Referencia a la colección Ingrediente
        required: true,               // Obligatorio
      },

      // NOMBRE DEL INGREDIENTE (SNAPSHOT)
      // - Se guarda el NOMBRE en este momento (snapshot)
      // - Si después cambias el nombre en la colección Ingrediente, este no cambia
      // - Útil para histórico: ver exactamente qué llevaba cuando se pidió
      // Ejemplo: "Queso Cheddar"
      // 
      // ¿Por qué snapshot?
      // - Si cambias el nombre en el ingrediente, los pedidos anteriores 
      //   muestran el nombre antiguo (histórico correcto)
      // - Es como una "foto" del nombre en ese momento
      nombre: String,

      // CANTIDAD DEL INGREDIENTE
      // - Cuánto de este ingrediente lleva el producto
      // - Número obligatorio
      // - Ej: 200g, 50ml, 2 unidades
      // Ejemplo: 200
      cantidad: {
        type: Number,
        required: true,               // Obligatorio
      },

      // UNIDAD DE MEDIDA
      // - En qué se mide este ingrediente en el producto
      // - Por defecto es "g" (gramos)
      // Ejemplo: "g" para 200g de carne
      unidad: {
        type: String,
        default: 'g',
      },

      // ¿ES OPCIONAL?
      // - ¿El cliente PUEDE REMOVER este ingrediente?
      // - true = SÍ puede quitarlo (el cliente puede decir "sin queso")
      // - false = NO puede quitarlo (es obligatorio, ej: pan, carne)
      // - Solo se pueden quitar los que tienen esOpcional: true
      // - Además depende de permitirRemover del producto
      // Ejemplo:
      //   true = cliente puede decir "sin queso"
      //   false = siempre lleva este ingrediente
      esOpcional: {
        type: Boolean,
        default: false,               // Por defecto no es opcional
      },
    },
  ],

  // ============================================
  // INGREDIENTES EXTRAS DISPONIBLES
  // ============================================

  // ARRAY DE INGREDIENTES EXTRAS
  // - Lista de ingredientes que se PUEDEN AGREGAR como extras
  // - Solo contiene IDs de ingredientes disponibles
  // - Se usan cuando el cliente quiere algo adicional
  // - El cliente puede agregar CUALQUIER ingrediente de esta lista
  // Ejemplo: [
  //   ObjectId("507f1f77bcf86cd799439010"),  // Bacon Extra
  //   ObjectId("507f1f77bcf86cd799439011"),  // Trufa Negra
  //   ObjectId("507f1f77bcf86cd799439012")   // Foie Fresco
  // ]
  ingredientesExtra: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingrediente',
    },
  ],

  // ============================================
  // CONFIGURACIÓN DE PERSONALIZACIÓN
  // ============================================

  // ¿PERMITIR PERSONALIZACIÓN?
  // - ¿Este producto se puede modificar de alguna forma?
  // - true = sí, cliente puede personalizar (quitar/agregar)
  // - false = no, es un producto fijo, no se modifica
  // - Si es false, ignora permitirExtras y permitirRemover
  // - Por defecto es true
  // Ejemplo:
  //   true = cliente puede personalizar la hamburguesa
  //   false = es un combo fijo, no se puede cambiar nada
  permitirPersonalizacion: {
    type: Boolean,
    default: true,
  },

  // ¿PERMITIR AGREGAR EXTRAS?
  // - ¿Se pueden agregar ingredientes adicionales?
  // - true = sí, cliente puede agregar extras (pagando más)
  // - false = no, no se pueden agregar ingredientes extra
  // - Solo tiene efecto si permitirPersonalizacion es true
  // - Por defecto es true
  // Ejemplo:
  //   true = cliente puede agregar bacon, trufa, etc
  //   false = no puede agregar nada extra
  permitirExtras: {
    type: Boolean,
    default: true,
  },

  // ¿PERMITIR REMOVER INGREDIENTES?
  // - ¿Se pueden quitar ingredientes opcionales?
  // - true = sí, cliente puede quitar cosas (ej: queso, salsa)
  // - false = no, no puede quitar nada
  // - Solo quita los que tienen "esOpcional: true"
  // - Solo tiene efecto si permitirPersonalizacion es true
  // - Por defecto es true
  // Ejemplo:
  //   true = cliente puede quitar queso, salsa, etc
  //   false = no puede quitar nada, debe llevar todo
  permitirRemover: {
    type: Boolean,
    default: true,
  },

  // ============================================
  // DISPONIBILIDAD
  // ============================================

  // ¿DISPONIBLE HOY?
  // - ¿Se vende este producto hoy?
  // - true = sí está disponible, aparece en la carta
  // - false = no se vende hoy, no aparece en la carta (agotado, etc)
  // - Por defecto es true
  // Ejemplo:
  //   true = sí se vende, aparece en la carta
  //   false = no se vende hoy (agotado, fuera de servicio)
  disponible: {
    type: Boolean,
    default: true,
  },

  // ¿ACTIVO EN EL SISTEMA?
  // - ¿Existe este producto en el sistema?
  // - true = sí, existe
  // - false = no, fue eliminado (pero datos se conservan)
  // - Usamos "soft delete" (no borramos, marcamos como inactivo)
  // - Sirve para conservar histórico de pedidos
  // - Por defecto es true
  // Ejemplo:
  //   true = producto activo en el sistema
  //   false = producto eliminado (pero no se borra de BD)
  activo: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
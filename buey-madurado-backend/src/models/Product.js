// models/Product.js
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  // Nombre del producto
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Tipo/categoría del producto
  type: {
    type: String,
    enum: ["hamburguesa", "sandwich", "postre", "bebida", "entrante", "carne"],
    required: true
  },
  
  // Precio del producto
  precio: { 
    type: Number, 
    required: true 
  },
  
  // Descripción para mostrar en menú
  description: String,
  
  // ⭐ INGREDIENTES BASE (vienen por defecto con el producto)
  ingredientes: [
    {
      _id: false,  // No generar ID para cada ingrediente dentro del array
      
      // Referencia al ingrediente en la colección Ingredientes
      ingrediente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Ingrediente", 
        required: true 
      },
      
      // Nombre del ingrediente (snapshot para mostrar sin hacer query)
      nombre: String,
      
      // Cantidad de este ingrediente en el producto
      cantidad: { type: Number, required: true },
      
      // ¿El cliente puede remover este ingrediente?
      // true = SÍ puede remover (checkbox en menú)
      // false = NO puede remover (fijo, obligatorio)
      esOpcional: { type: Boolean, default: false }
    }
  ],
  
  // ⭐ INGREDIENTES EXTRA (se pueden agregar adicionales)
  // Solo contiene IDs de ingredientes que se pueden comprar como extras
  ingredientesExtra: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ingrediente" }
  ],
  
  // ¿Permite personalización de ingredientes?
  permitirPersonalizacion: { type: Boolean, default: true },
  
  // ¿Se pueden agregar ingredientes extras?
  permitirExtras: { type: Boolean, default: true },
  
  // ¿Se pueden remover ingredientes opcionales?
  permitirRemover: { type: Boolean, default: true },
  
  // URL de la imagen del producto
  imagen: String,
  
  // ¿Se puede comprar este producto hoy? (stock, disponibilidad)
  disponible: { type: Boolean, default: true }
});

export default mongoose.model("Product", productoSchema);
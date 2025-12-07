// models/Ingrediente.js
import mongoose from "mongoose";

const ingredienteSchema = new mongoose.Schema({
  // Nombre único del ingrediente
  nombre: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  
  // Categoría para clasificar ingredientes
  categoria: {
    type: String,
    enum: ["carne", "queso", "salsa", "vegetal", "topping", "pan", "otros"],
    required: true
  },
  
  // Precio base del ingrediente (costo para el restaurante)
  precioBase: { 
    type: Number, 
    required: true,
    default: 0 
  },
  
  // Precio extra si se vende como adicional
  precioExtra: { 
    type: Number,
    default: function() { return this.precioBase; }
  },
  
  // Gestión de inventario/stock
  inventario: {
    cantidad: { type: Number, default: 100 },      // Cuánto hay disponible
    unidad: { type: String, default: "g" }         // Unidad de medida (gramos, ml, etc)
  },
  
  // Lista de alérgenos para informar al cliente
  alergenicos: [String],  // ej: ["gluten", "lactosa"]
  
  // ¿Se puede usar este ingrediente? (stock disponible, etc)
  disponible: { type: Boolean, default: true }
});

export default mongoose.model("Ingrediente", ingredienteSchema);
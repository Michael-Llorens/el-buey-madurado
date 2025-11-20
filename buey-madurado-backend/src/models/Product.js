import mongoose from "mongoose";
import "./Ingredientes.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Tipos ampliados
  type: {
    type: String,
    enum: ["hamburguesa", "sandwich", "postre", "bebida", "entrante", "carne"],
    required: true
  },

  price: { type: Number, required: true },
  description: { type: String },

  ingredients: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }
  ],

  allowExtras: { type: Boolean, default: true }
});

export default mongoose.model("Product", productSchema);

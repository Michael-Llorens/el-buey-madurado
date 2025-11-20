import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["carne", "queso", "salsa", "vegetal", "topping", "pan", "otros"],
    required: true
  },
  price: { type: Number, required: true } // precio del ingrediente
});

export default mongoose.model("Ingredient", ingredientSchema);

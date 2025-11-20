import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

// Modelos
import Product from "../models/Product.js";
import Ingredient from "../models/Ingredientes.js";

import { readFileSync } from "fs";

dotenv.config();

// Cargar JSON manualmente
const productsData = JSON.parse(
  readFileSync(new URL("./products.json", import.meta.url), "utf-8")
);

const ingredientsData = JSON.parse(
  readFileSync(new URL("./ingredientes.json", import.meta.url), "utf-8")
);


const seedDatabase = async () => {
  try {
    console.log("⏳ Conectando a la base de datos...");
    await connectDB();

    console.log("🗑 Borrando colecciones anteriores...");
    await Product.deleteMany({});
    await Ingredient.deleteMany({});

    console.log("📥 Insertando ingredientes...");
    const createdIngredients = await Ingredient.insertMany(ingredientsData);

    console.log("🔗 Preparando productos con referencias a ingredientes...");
    const productsWithRefs = productsData.map((product) => {
      if (!product.ingredients || product.ingredients.length === 0) {
        return { ...product, ingredients: [] };
      }

      const ingredientIds = createdIngredients
        .filter((ing) => product.ingredients.includes(ing.name))
        .map((ing) => ing._id);

      return {
        ...product,
        ingredients: ingredientIds
      };
    });

    console.log("🍔 Insertando productos...");
    await Product.insertMany(productsWithRefs);

    console.log("🎉 Base de datos inicializada correctamente");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar seed:", error);
    process.exit(1);
  }
};

seedDatabase();

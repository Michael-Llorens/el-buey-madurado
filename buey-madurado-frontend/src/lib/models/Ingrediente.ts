import mongoose from "mongoose";
import { Ingrediente } from "@/lib/types";

const ingredienteSchema = new mongoose.Schema<Ingrediente>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      unique: true,
      index: true,
      minlength: [2, "Mínimo 2 caracteres"],
      maxlength: [50, "Máximo 50 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [200, "Máximo 200 caracteres"],
    },
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
    alergeno: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const IngredienteModel =
  mongoose.models.Ingrediente ||
  mongoose.model("Ingrediente", ingredienteSchema);
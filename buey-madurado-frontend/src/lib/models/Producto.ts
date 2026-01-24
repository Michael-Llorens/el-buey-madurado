import mongoose from "mongoose";
import { Producto } from "@/lib/types";

const productoSchema = new mongoose.Schema<Producto>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minlength: [2, "Mínimo 2 caracteres"],
      maxlength: [100, "Máximo 100 caracteres"],
      unique: true,
      index: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: [500, "Máximo 500 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0.01, "El precio debe ser mayor a 0"],
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    categoria: {
      type: String,
      enum: {
        values: [
          "Entrantes",
          "Carnes",
          "Sándwich y hamburguesas",
          "Postres",
        ],
        message: "Categoría inválida",
      },
      required: [true, "La categoría es requerida"],
      index: true,
    },
    ingredientes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingrediente",
      },
    ],
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
    imagen: {
      type: String,
      maxlength: [500, "URL muy larga"],
    },
    stock: {
      type: Number,
      default: 999,
      min: 0,
    },
    esPlatoPrincipal: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productoSchema.index({ categoria: 1, activo: 1 });
productoSchema.index({ nombre: "text", descripcion: "text" });

export const ProductoModel =
  mongoose.models.Producto ||
  mongoose.model("Producto", productoSchema);
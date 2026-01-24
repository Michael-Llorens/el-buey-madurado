import mongoose from "mongoose";
import { Mesa } from "@/lib/types";

const mesaSchema = new mongoose.Schema<Mesa>(
  {
    numero: {
      type: Number,
      required: [true, "El número de mesa es requerido"],
      unique: true,
      index: true,
      min: [1, "El número debe ser mayor a 0"],
      max: [100, "El número máximo es 100"],
    },
    capacidad: {
      type: Number,
      required: [true, "La capacidad es requerida"],
      min: [1, "Capacidad mínima es 1"],
      max: [20, "Capacidad máxima es 20"],
    },
    estado: {
      type: String,
      enum: {
        values: ["libre", "ocupada", "cerrada"],
        message: "Estado debe ser: libre, ocupada o cerrada",
      },
      default: "libre",
      index: true,
    },
    comensales: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    pedidoActivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      default: null,
    },
    notas: {
      type: String,
      maxlength: 500,
    },
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

mesaSchema.index({ estado: 1, activo: 1 });

export const MesaModel =
  mongoose.models.Mesa || mongoose.model("Mesa", mesaSchema);
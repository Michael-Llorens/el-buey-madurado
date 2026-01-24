import mongoose from "mongoose";
import { PedidoExterno } from "@/lib/types";

const pedidoExternoSchema = new mongoose.Schema<PedidoExterno>(
  {
    tipo: {
      type: String,
      enum: {
        values: ["recoger", "domicilio"],
        message: "Tipo debe ser recoger o domicilio",
      },
      required: [true, "El tipo es requerido"],
      index: true,
    },
    items: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: [true, "El producto es requerido"],
        },
        cantidad: {
          type: Number,
          required: [true, "La cantidad es requerida"],
          min: [1, "Mínimo 1"],
        },
        precioUnitario: {
          type: Number,
          default: 0,
        },
        notas: {
          type: String,
          maxlength: [300, "Máximo 300 caracteres"],
        },
        ingredientesQuitar: [String],
      },
    ],
    total: {
      type: Number,
      required: [true, "El total es requerido"],
      min: 0,
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    estado: {
      type: String,
      enum: {
        values: [
          "pendiente",
          "preparando",
          "listo",
          "entregado",
          "cancelado",
        ],
        message: "Estado inválido",
      },
      default: "pendiente",
      index: true,
    },
    cliente: {
      nombre: {
        type: String,
        required: [true, "Nombre cliente requerido"],
        trim: true,
        minlength: [2, "Mínimo 2 caracteres"],
      },
      telefono: {
        type: String,
        required: [true, "Teléfono requerido"],
        match: [/^[0-9]{6,15}$/, "Teléfono inválido"],
      },
      email: {
        type: String,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Email inválido",
        ],
      },
      direccion: {
        type: String,
        maxlength: [300, "Máximo 300 caracteres"],
      },
    },
    horaRecogida: Date,
    horaEntrega: Date,
    notas: {
      type: String,
      maxlength: [500, "Máximo 500 caracteres"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

pedidoExternoSchema.index({ estado: 1, createdAt: -1 });
pedidoExternoSchema.index({ "cliente.telefono": 1 });
pedidoExternoSchema.index({ tipo: 1, estado: 1 });

export const PedidoExternoModel =
  mongoose.models.PedidoExterno ||
  mongoose.model("PedidoExterno", pedidoExternoSchema);
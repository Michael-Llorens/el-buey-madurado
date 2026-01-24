import mongoose from "mongoose";
import { Pedido } from "@/lib/types";

const pedidoSchema = new mongoose.Schema<Pedido>(
  {
    mesaId: {
      type: String,
      required: [true, "La mesa es requerida"],
      index: true,
    },
    items: [
      {
        productoId: {
          type: String,
          required: [true, "El producto es requerido"],
        },
        cantidad: {
          type: Number,
          required: [true, "La cantidad es requerida"],
          min: [1, "Mínimo 1"],
          max: [100, "Máximo 100"],
        },
        precioUnitario: {
          type: Number,
          default: 0,
        },
        notas: {
          type: String,
          maxlength: [300, "Máximo 300 caracteres"],
        },
        ingredientesQuitar: [
          {
            type: String,
            maxlength: [50, "Máximo 50 caracteres"],
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    estado: {
      type: String,
      enum: {
        values: [
          "abierto",
          "enviado_cocina",
          "preparado",
          "servido",
          "pagado",
        ],
        message: "Estado de pedido inválido",
      },
      default: "abierto",
      index: true,
    },
    totalEstimado: {
      type: Number,
      default: 0,
      min: 0,
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    comensales: {
      type: Number,
      required: [true, "Número de comensales requerido"],
      min: [1, "Mínimo 1"],
      max: [20, "Máximo 20"],
    },
    importePorPersona: {
      type: Number,
      default: 0,
      min: 0,
    },
    usuarioCreador: {
      type: String,
      required: [true, "Usuario creador requerido"],
    },
    notas: {
      type: String,
      maxlength: [500, "Máximo 500 caracteres"],
    },
    horaEnvioCocina: Date,
    horaPagado: Date,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

pedidoSchema.index({ mesaId: 1, estado: 1 });
pedidoSchema.index({ usuarioCreador: 1, createdAt: -1 });
pedidoSchema.index({ estado: 1, createdAt: -1 });

export const PedidoModel =
  mongoose.models.Pedido || mongoose.model("Pedido", pedidoSchema);
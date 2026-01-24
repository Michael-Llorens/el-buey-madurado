import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUsuario extends mongoose.Document {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "camarero" | "cocina";
  activo: boolean;
  ultimoLogin?: Date;
  compararPassword(passwordIngresada: string): Promise<boolean>;
}

const usuarioSchema = new mongoose.Schema<IUsuario>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minlength: [2, "Mínimo 2 caracteres"],
      maxlength: [50, "Máximo 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor usa un email válido",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "Mínimo 6 caracteres"],
      select: false,
    },
    rol: {
      type: String,
      enum: {
        values: ["admin", "camarero", "cocina"],
        message: "Rol inválido",
      },
      default: "camarero",
      index: true,
    },
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
    ultimoLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

usuarioSchema.pre<IUsuario>("save", async function () {
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});


usuarioSchema.methods.compararPassword = async function (passwordIngresada: string): Promise<boolean> {
  return await bcrypt.compare(passwordIngresada, this.password);
};

export const UsuarioModel =
  mongoose.models.Usuario ||
  mongoose.model<IUsuario>("Usuario", usuarioSchema);
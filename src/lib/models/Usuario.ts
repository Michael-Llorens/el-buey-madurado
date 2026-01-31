import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  email: string;
  password: string;
  rol: 'admin' | 'camarero' | 'cocinero';
  activo: boolean;
  ultimoLogin?: Date;
  comparePassword(passwordIngresado: string): Promise<boolean>;
}

const UsuarioSchema = new Schema<IUsuario>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6,
    select: false
  },
  rol: { 
    type: String, 
    enum: ['admin', 'camarero', 'cocinero'],
    default: 'camarero' 
  },
  activo: { 
    type: Boolean, 
    default: true 
  },
  ultimoLogin: { type: Date },
}, { 
  timestamps: true 
});

// Hash password antes de guardar
UsuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Método para comparar passwords
UsuarioSchema.methods.comparePassword = async function(
  this: IUsuario, 
  passwordIngresado: string
): Promise<boolean> {
  return bcrypt.compare(passwordIngresado, this.password);
};

const Usuario: Model<IUsuario> = mongoose.models.Usuario || 
  mongoose.model<IUsuario>('Usuario', UsuarioSchema);

export default Usuario;
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMesa extends Document {
  numero: number;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  pedidoActual?: Types.ObjectId;
  activa: boolean;
}

const MesaSchema: Schema = new Schema({
  numero: { 
    type: Number, 
    required: true, 
    unique: true,
    min: 1
  },
  capacidad: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 20
  },
  estado: { 
    type: String, 
    enum: ['libre', 'ocupada', 'reservada'], 
    default: 'libre' 
  },
  pedidoActual: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pedido' 
  },
  activa: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Índice para búsquedas rápidas por estado
MesaSchema.index({ estado: 1 });

const Mesa: Model<IMesa> = mongoose.models.Mesa || mongoose.model<IMesa>('Mesa', MesaSchema);
export default Mesa;
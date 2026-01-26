import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMesa extends Document {
  numero: number;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  pedidoActual?: Types.ObjectId;
}

const MesaSchema: Schema = new Schema({
  numero: { type: Number, required: true, unique: true },
  capacidad: { type: Number, required: true, min: 1 },
  estado: { 
    type: String, 
    enum: ['libre', 'ocupada', 'reservada'], 
    default: 'libre' 
  },
  pedidoActual: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' },
}, { timestamps: true });

const Mesa: Model<IMesa> = mongoose.models.Mesa || mongoose.model<IMesa>('Mesa', MesaSchema);
export default Mesa;
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPedidoExterno extends Document {
  cliente: string;
  telefono: string;
  productos: { producto: Types.ObjectId; cantidad: number }[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  direccionEntrega?: string;
}

const PedidoExternoSchema: Schema = new Schema({
  cliente: { type: String, required: true },
  telefono: { type: String, required: true },
  direccionEntrega: String,
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1 },
  }],
  total: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'preparando', 'listo', 'entregado'],
    default: 'pendiente' 
  },
}, { timestamps: true });

const PedidoExterno: Model<IPedidoExterno> = mongoose.models.PedidoExterno || 
  mongoose.model<IPedidoExterno>('PedidoExterno', PedidoExternoSchema);
export default PedidoExterno;
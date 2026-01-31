import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPedido extends Document {
  mesa: Types.ObjectId;
  productos: { producto: Types.ObjectId; cantidad: number; notas?: string }[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'servido' | 'pagado';
  timestamp: Date;
}

const PedidoSchema: Schema = new Schema({
  mesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Mesa', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    notas: String,
  }],
  total: { type: Number, required: true, default: 0 },
  estado: { 
    type: String, 
    enum: ['pendiente', 'preparando', 'listo', 'servido', 'pagado'],
    default: 'pendiente' 
  },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Pedido: Model<IPedido> = mongoose.models.Pedido || mongoose.model<IPedido>('Pedido', PedidoSchema);
export default Pedido;
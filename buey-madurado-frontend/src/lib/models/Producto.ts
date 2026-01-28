import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProducto extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  ingredientes: Types.ObjectId[];
  activo: boolean;
}

const ProductoSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String },
  ingredientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente' }],
  activo: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Producto: Model<IProducto> = mongoose.models.Producto || 
  mongoose.model<IProducto>('Producto', ProductoSchema);

export default Producto;
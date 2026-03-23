import mongoose, { Schema, Document, Model} from 'mongoose';

export interface IIngrediente extends Document {
  nombre: string;
  categoria: string;
  precioBase: number;
  precioExtra: number;
  inventario: {
    cantidad: number;
    unidad: string;
  };
  disponible: boolean;
  activo: boolean;
}

const IngredienteSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precioBase: { type: Number, required: true, default: 0 },
  precioExtra: { type: Number, required: true, default: 0 },
  inventario: {
    cantidad: { type: Number, required: true, default: 0 },
    unidad: { type: String, required: true, default: 'kg' },
  },
  disponible: { type: Boolean, default: true },
  activo: { type: Boolean, default: true },
}, {
  timestamps: true,
});

IngredienteSchema.index({ nombre: 1 });
IngredienteSchema.index({ categoria: 1 });

const Ingrediente: Model<IIngrediente> = mongoose.models.Ingrediente ||
  mongoose.model<IIngrediente>('Ingrediente', IngredienteSchema);

export default Ingrediente;
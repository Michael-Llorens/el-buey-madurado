import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMesa extends Document {
  nombre: string;
  capacidad: number;
  comensalesActuales: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  pedidoActual?: Types.ObjectId;
  activa: boolean;
}

const MesaSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,     // ⚠️ Esto crea índice único, no dupliques con schema.index({nombre:1})
      trim: true,
      minlength: 1,
      maxlength: 40,
    },
    capacidad: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    comensalesActuales: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        // ✅ Funciona en save() (document validators) y en findByIdAndUpdate() (update validators)
        validator: function (this: any, v: number) {
          // 1) Validación en documento (save)
          const capDoc = this?.get?.('capacidad');
          if (typeof capDoc === 'number') return v <= capDoc;

          // 2) Validación en query (findOneAndUpdate / findByIdAndUpdate)
          const upd = this?.getUpdate?.() || {};
          const $set = upd.$set || upd;

          // Si en el mismo update viene capacidad, validamos contra esa.
          const capUpd = $set.capacidad;
          if (typeof capUpd === 'number') return v <= capUpd;

          // Si NO viene capacidad en este update, no podemos comparar aquí.
          // (Lo estás validando en tu endpoint PUT consultando la capacidad real).
          return true;
        },
        message: 'Comensales actuales no pueden superar la capacidad',
      },
    },
    estado: {
      type: String,
      enum: ['libre', 'ocupada', 'reservada'],
      default: 'libre',
    },
    pedidoActual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

MesaSchema.index({ estado: 1 });

const Mesa: Model<IMesa> =
  mongoose.models.Mesa || mongoose.model<IMesa>('Mesa', MesaSchema);

export default Mesa;
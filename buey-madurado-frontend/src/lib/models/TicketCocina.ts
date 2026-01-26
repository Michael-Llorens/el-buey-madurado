import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicketCocina extends Document {
  pedido: mongoose.Schema.Types.ObjectId;
  items: Array<{
    producto: mongoose.Schema.Types.ObjectId;
    cantidad: number;
    notas: string;
  }>;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en-preparacion' | 'completado';
  completado: boolean;
  horaInicio?: Date;
  horaFin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketCocinaSchema: Schema = new Schema({
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true,
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },
      notas: {
        type: String,
        default: '',
      },
    },
  ],
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media',
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en-preparacion', 'completado'],
    default: 'pendiente',
  },
  completado: {
    type: Boolean,
    default: false,
  },
  horaInicio: Date,
  horaFin: Date,
}, {
  timestamps: true,
});

const TicketCocina: Model<ITicketCocina> = mongoose.models.TicketCocina ||
  mongoose.model<ITicketCocina>('TicketCocina', TicketCocinaSchema);

export default TicketCocina;
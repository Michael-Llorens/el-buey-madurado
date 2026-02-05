import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import './Mesa';
import './Producto';
import './Usuario';

export interface IProductoPedido {
  producto: Types.ObjectId;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  notas?: string;
  personalizaciones?: {
    ingredientesExtra?: string[];
    ingredientesRemovidos?: string[];
  };
}

export interface IPedido extends Document {
  tipo: 'local' | 'recoger' | 'domicilio'; // ✅ NUEVO
  mesa?: Types.ObjectId; // ✅ Ahora opcional (solo para "local")
  direccionEntrega?: {    // ✅ NUEVO (solo para "domicilio")
    calle: string;
    numero: string;
    piso?: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    notas?: string;
  };
  productos: IProductoPedido[];
  subtotal: number;
  impuestos: number;
  descuento: number;
  gastoEnvio: number;     // ✅ NUEVO (solo para "domicilio")
  total: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'en_camino' | 'servido' | 'entregado' | 'pagado' | 'cancelado'; // ✅ Actualizado
  camarero?: Types.ObjectId;
  repartidor?: Types.ObjectId; // ✅ NUEVO (para domicilio)
  cliente?: string;
  telefono?: string;       // ✅ NUEVO
  metodoPago?: 'efectivo' | 'tarjeta' | 'mixto';
  notas?: string;
  calcularTotales(): IPedido;
}

const ProductoPedidoSchema = new Schema({
  producto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  notas: { 
    type: String,
    maxlength: 200 
  },
  personalizaciones: {
    ingredientesExtra: [String],
    ingredientesRemovidos: [String]
  }
}, { _id: false });

const DireccionEntregaSchema = new Schema({
  calle: { type: String, required: true },
  numero: { type: String, required: true },
  piso: String,
  ciudad: { type: String, required: true },
  codigoPostal: { type: String, required: true },
  telefono: { type: String, required: true },
  notas: String
}, { _id: false });

const PedidoSchema: Schema = new Schema({
  tipo: {
    type: String,
    enum: ['local', 'recoger', 'domicilio'],
    required: true,
    default: 'local'
  },
  mesa: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mesa',
    // ✅ Requerido solo si tipo === 'local'
    required: function(this: IPedido) {
      return this.tipo === 'local';
    }
  },
  direccionEntrega: {
    type: DireccionEntregaSchema,
    // ✅ Requerido solo si tipo === 'domicilio'
    required: function(this: IPedido) {
      return this.tipo === 'domicilio';
    }
  },
  productos: [ProductoPedidoSchema],
  subtotal: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  impuestos: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  descuento: {
    type: Number,
    default: 0,
    min: 0
  },
  gastoEnvio: {
    type: Number,
    default: 0,
    min: 0
  },
  total: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'preparando', 'listo', 'en_camino', 'servido', 'entregado', 'pagado', 'cancelado'],
    default: 'pendiente' 
  },
  camarero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    alias: 'creadoPor'
  },
  repartidor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  cliente: {
    type: String,
    maxlength: 100
  },
  telefono: {
    type: String,
    maxlength: 20
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'mixto']
  },
  notas: {
    type: String,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

// Índices
PedidoSchema.index({ tipo: 1, estado: 1 });
PedidoSchema.index({ mesa: 1, estado: 1 });
PedidoSchema.index({ estado: 1, createdAt: -1 });
PedidoSchema.index({ camarero: 1, createdAt: -1 });

// Método para calcular totales
PedidoSchema.methods.calcularTotales = function() {
  // Calcular subtotal de productos
  this.subtotal = this.productos.reduce((sum: number, prod: IProductoPedido) => {
    return sum + prod.subtotal;
  }, 0);

  // Calcular IVA (21% en España)
  this.impuestos = Math.round(this.subtotal * 0.21 * 100) / 100;

  // Calcular total final (incluye gasto de envío)
  this.total = Math.round(
    (this.subtotal + this.impuestos + (this.gastoEnvio || 0) - (this.descuento || 0)) * 100
  ) / 100;
  
  return this;
};

const Pedido: Model<IPedido> = mongoose.models.Pedido || 
  mongoose.model<IPedido>('Pedido', PedidoSchema);

export default Pedido;
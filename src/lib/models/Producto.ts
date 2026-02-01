import mongoose, { Schema, Document, Model, Types } from 'mongoose';
// ✅ IMPORTAR INGREDIENTE PRIMERO (fuerza registro)
import './Ingrediente';

// ✅ Subdocumento para ingredientes con cantidad
export interface IProductoIngrediente {
  ingrediente: Types.ObjectId;
  cantidad: number;
  unidad: string;
}

// ✅ NUEVO: Ingredientes extra con precio
export interface IIngredienteExtra {
  nombre: string;
  precio: number;
}

export interface IProducto extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  ingredientes: IProductoIngrediente[];
  ingredientesExtra?: IIngredienteExtra[];  // ✅ NUEVO: Extras disponibles con precio
  permitirPersonalizacion: boolean;         // ✅ NUEVO: Permite modificar ingredientes
  permitirExtras: boolean;                  // ✅ NUEVO: Permite añadir extras
  permitirRemover: boolean;                 // ✅ NUEVO: Permite quitar ingredientes
  disponible: boolean;
  activo: boolean;
}

const ProductoIngredienteSchema = new Schema({
  ingrediente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ingrediente',
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true,
    min: 0
  },
  unidad: { 
    type: String, 
    required: true,
    default: 'gramos'
  }
}, { _id: false });

// ✅ NUEVO: Schema para ingredientes extra
const IngredienteExtraSchema = new Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  precio: { 
    type: Number, 
    required: true, 
    min: 0,
    default: 0
  }
}, { _id: false });

const ProductoSchema: Schema = new Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  descripcion: { 
    type: String,
    trim: true
  },
  precio: { 
    type: Number, 
    required: true,
    min: 0
  },
  categoria: { 
    type: String, 
    required: true 
  },
  imagen: { type: String },
  ingredientes: [ProductoIngredienteSchema],
  
  // ✅ NUEVO: Gestión de extras y personalizaciones
  ingredientesExtra: {
    type: [IngredienteExtraSchema],
    default: []
  },
  permitirPersonalizacion: {
    type: Boolean,
    default: true
  },
  permitirExtras: {
    type: Boolean,
    default: true
  },
  permitirRemover: {
    type: Boolean,
    default: true
  },
  
  disponible: { 
    type: Boolean, 
    default: true 
  },
  activo: { 
    type: Boolean, 
    default: true 
  },
}, {
  timestamps: true,
});

// ✅ Índices para búsquedas rápidas
ProductoSchema.index({ categoria: 1, disponible: 1 });
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });

const Producto: Model<IProducto> = mongoose.models.Producto || 
  mongoose.model<IProducto>('Producto', ProductoSchema);

export default Producto;
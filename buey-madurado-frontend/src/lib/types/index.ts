// ========== USUARIO ==========
export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  password?: string;
  rol: "admin" | "camarero" | "cocina";
  activo?: boolean;
  ultimoLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== MESAS ==========
export interface Mesa {
  _id?: string;
  numero: number;
  capacidad: number;
  estado: "libre" | "ocupada" | "cerrada";
  comensales: number;
  pedidoActivo?: string;
  notas?: string;
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== PRODUCTOS ==========
export interface Producto {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: "Entrantes" | "Carnes" | "Sándwich y hamburguesas" | "Postres";
  ingredientes?: string[];
  activo?: boolean;
  imagen?: string;
  stock?: number;
  esPlatoPrincipal?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== INGREDIENTES ==========
export interface Ingrediente {
  _id?: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  alergeno?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== ITEMS DE PEDIDO ==========
export interface ItemPedido {
  _id?: string;
  productoId: string;
  productoNombre?: string;
  cantidad: number;
  precioUnitario?: number;
  notas?: string;
  ingredientesQuitar?: string[];
  createdAt?: Date;
}

// ========== PEDIDOS (POR MESA) ==========
export interface Pedido {
  _id?: string;
  mesaId: string;
  items: ItemPedido[];
  estado: "abierto" | "enviado_cocina" | "preparado" | "servido" | "pagado";
  totalEstimado: number;
  comensales: number;
  importePorPersona?: number;
  usuarioCreador: string;
  notas?: string;
  horaEnvioCocina?: Date;
  horaPagado?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== PEDIDOS EXTERNOS ==========
export interface PedidoExterno {
  _id?: string;
  tipo: "recoger" | "domicilio";
  items: ItemPedido[];
  total: number;
  estado: "pendiente" | "preparando" | "listo" | "entregado" | "cancelado";
  cliente: {
    nombre: string;
    telefono: string;
    email?: string;
    direccion?: string;
  };
  horaRecogida?: Date;
  horaEntrega?: Date;
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========== TICKET COCINA ==========
export interface KitchenTicket {
  _id?: string;
  numero: string;
  items: ItemPedido[];
  origen: "mesa" | "externo";
  referenciaId: string;
  estado: "nuevo" | "recibido" | "preparando" | "listo";
  horaRecibido: Date;
  horaPreparado?: Date;
  notas?: string;
}

// ========== RESPUESTAS API ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========== CONTEXTO AUTENTICACIÓN ==========
export interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAutenticado: boolean;
}
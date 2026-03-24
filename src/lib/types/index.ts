// ========== RE-EXPORTS DE INTERFACES MONGOOSE ==========
// Las interfaces de backend (IUsuario, IMesa, IProducto, etc.)
// están definidas en cada modelo y se re-exportan aquí.
export type { IUsuario } from '../models/Usuario';
export type { IIngrediente } from '../models/Ingrediente';
export type { IProducto, IProductoIngrediente, IIngredienteExtra } from '../models/Producto';
export type { IMesa } from '../models/Mesa';
export type { IPedido, IProductoPedido } from '../models/Pedido';
export type { ITicketCocina } from '../models/TicketCocina';

// ========== INTERFACES DE API ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========== INTERFACES DE AUTH (FRONTEND) ==========
export interface AuthUser {
  id: string;
  email: string;
  rol: 'admin' | 'camarero' | 'cocinero';
}

export interface AuthContextType {
  usuario: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAutenticado: boolean;
}

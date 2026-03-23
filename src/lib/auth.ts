import jwt from 'jsonwebtoken';
import { IUsuario } from '@/lib/models/Usuario';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno. La aplicación no puede arrancar sin esta variable.');
  }
  return secret;
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRE = '7d'; // Token válido 7 días

export interface TokenPayload {
  userId: string;
  email: string;
  rol: 'admin' | 'camarero' | 'cocinero';
  iat?: number;
  exp?: number;
}

// ========== GENERAR TOKEN ==========
export function generarToken(usuario: IUsuario): string {
  const payload: TokenPayload = {
    userId: usuario._id.toString(),
    email: usuario.email,
    rol: usuario.rol,
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRE 
  });
}

// ========== VERIFICAR TOKEN ==========
export function verificarToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// ========== EXTRAER TOKEN DEL HEADER ==========
export function extraerTokenDelHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') return null;
  
  return partes[1];
}

// ========== MIDDLEWARE DE AUTENTICACIÓN ==========
export function middlewareAutenticacion(token: string | null): TokenPayload | null {
  if (!token) return null;
  
  return verificarToken(token);
}
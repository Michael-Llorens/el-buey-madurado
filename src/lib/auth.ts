import { SignJWT, jwtVerify } from 'jose';
import { IUsuario } from '@/lib/models/Usuario';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno. La aplicación no puede arrancar sin esta variable.');
  }
  return new TextEncoder().encode(secret);
}

const JWT_EXPIRE = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  rol: 'admin' | 'camarero' | 'cocinero';
  iat?: number;
  exp?: number;
}

export async function generarToken(usuario: IUsuario): Promise<string> {
  return await new SignJWT({
    userId: usuario._id.toString(),
    email: usuario.email,
    rol: usuario.rol,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRE)
    .sign(getJwtSecret());
}

export async function verificarToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function extraerTokenDelHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') return null;
  return partes[1];
}

export async function middlewareAutenticacion(token: string | null): Promise<TokenPayload | null> {
  if (!token) return null;
  return verificarToken(token);
}

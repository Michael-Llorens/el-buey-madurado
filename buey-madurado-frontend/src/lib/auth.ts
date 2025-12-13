import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secretoNode';
const JWT_EXPIRATION = '2 hours';

export interface TokenPayload {
  usuario: string;
  rol: string;
  iat: number;
  exp: number;
}

// Generar token (Bearer)
export function generarToken(usuario: string, rol: string): string {
  return jwt.sign(
    { usuario, rol }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
}

// Validar token
export function validarToken(token: string): TokenPayload | null {
  try {
    const resultado = jwt.verify(token, JWT_SECRET);
    return resultado as TokenPayload;
  } catch (e) {
    return null;
  }
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// Comparar contraseña
export async function compararPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}

// Extraer "Bearer <token>" del header Authorization
export function extraerTokenDelHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Middleware de protección
export function protegerRuta(rolesPermitidos: string[] = []) {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: 'Usuario no autorizado - No token'
      });
    }

    const resultado = validarToken(token);
    
    if (!resultado) {
      return res.status(401).json({
        ok: false,
        error: 'Usuario no autorizado - Invalid token'
      });
    }

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(resultado.rol)) {
      return res.status(403).json({
        ok: false,
        error: 'Permiso denegado - Rol insuficiente'
      });
    }

    req.user = resultado;
    next();
  };
}
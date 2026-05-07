import { NextRequest, NextResponse } from 'next/server';
import { extraerTokenDelHeader, verificarToken, TokenPayload } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function protegerRuta(request: NextRequest): Promise<{
  valido: boolean;
  payload?: TokenPayload;
  response?: NextResponse;
}> {
  // Token: header Authorization (Bearer) o cookie httpOnly
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = extraerTokenDelHeader(authHeader);
  const tokenFromCookie = request.cookies.get('auth_token')?.value;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return {
      valido: false,
      response: NextResponse.json<ApiResponse>({
        success: false,
        error: 'Token no proporcionado',
      }, { status: 401 }),
    };
  }

  const payload = await verificarToken(token);

  if (!payload) {
    return {
      valido: false,
      response: NextResponse.json<ApiResponse>({
        success: false,
        error: 'Token inválido o expirado',
      }, { status: 401 }),
    };
  }

  return { valido: true, payload };
}

/**
 * Helper combinado: protege la ruta y valida que el rol esté permitido.
 * Devuelve { valido: false, response } si falla cualquier comprobación.
 */
export async function protegerRutaPorRol(
  request: NextRequest,
  rolesPermitidos: TokenPayload['rol'][]
): Promise<{ valido: boolean; payload?: TokenPayload; response?: NextResponse }> {
  const auth = await protegerRuta(request);
  if (!auth.valido || !auth.payload) return auth;

  if (!rolesPermitidos.includes(auth.payload.rol)) {
    return {
      valido: false,
      response: NextResponse.json<ApiResponse>({
        success: false,
        error: 'No tienes permisos para realizar esta acción',
      }, { status: 403 }),
    };
  }

  return auth;
}

export function verificarRol(
  payload: TokenPayload, 
  rolesPermitidos: string[]
): boolean {
  return rolesPermitidos.includes(payload.rol);
}
import { NextRequest, NextResponse } from 'next/server';
import { extraerTokenDelHeader, verificarToken, TokenPayload } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export function protegerRuta(request: NextRequest): { 
  valido: boolean; 
  payload?: TokenPayload; 
  response?: NextResponse;
} {
  const authHeader = request.headers.get('authorization');
  const token = extraerTokenDelHeader(authHeader);

  if (!token) {
    return {
      valido: false,
      response: NextResponse.json<ApiResponse>({
        success: false,
        error: 'Token no proporcionado',
      }, { status: 401 }),
    };
  }

  const payload = verificarToken(token);

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

export function verificarRol(
  payload: TokenPayload, 
  rolesPermitidos: string[]
): boolean {
  return rolesPermitidos.includes(payload.rol);
}
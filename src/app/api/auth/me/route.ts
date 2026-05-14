import { NextRequest, NextResponse } from 'next/server';
import { verificarToken, extraerTokenDelHeader } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  // Intentar leer token de cookie primero, luego de header Authorization
  const tokenFromCookie = request.cookies.get('auth_token')?.value;
  const tokenFromHeader = extraerTokenDelHeader(
    request.headers.get('authorization')
  );

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No autenticado',
    }, { status: 401 });
  }

  const payload = await verificarToken(token);

  if (!payload) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Token inválido o expirado',
    }, { status: 401 });
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      id: payload.userId,
      email: payload.email,
      rol: payload.rol,
    },
  });
}

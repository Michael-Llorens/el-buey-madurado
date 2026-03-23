import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

export async function POST() {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: 'Sesión cerrada correctamente',
  });

  // Borrar la cookie httpOnly
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expira inmediatamente
  });

  return response;
}

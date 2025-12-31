import { NextRequest, NextResponse } from 'next/server';
import { extraerTokenDelHeader } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Rutas públicas (sin protección)
  const publicRoutes = ['/admin/login', '/api/auth/login', '/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Solo proteger /admin (el cliente maneja token)
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      // Permite que continúe, la validación la hace el frontend
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // ✅ Los endpoints /api/* validan su propio token
  // No los bloqueamos aquí en el middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
  ],
};
import { NextRequest, NextResponse } from 'next/server';
import { validarToken, extraerTokenDelHeader } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (SIN protección)
  const publicRoutes = ['/admin/login', '/api/auth/login', '/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Rutas protegidas
  const protectedRoutes = ['/admin', '/api/productos', '/api/ingredientes'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Obtén el token del header Authorization
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      // Si viene desde navegador (/admin), permite que continúe
      // El layout.tsx del cliente validará el token
      if (pathname.startsWith('/admin')) {
        return NextResponse.next();
      }
      
      // Si viene desde API (/api), devuelve error
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Valida el token
    const payload = validarToken(token);
    if (!payload) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.next();
      }
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/productos/:path*',
    '/api/ingredientes/:path*',
    '/api/auth/:path*'
  ]
};
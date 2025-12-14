import { NextRequest, NextResponse } from 'next/server';
import { extraerTokenDelHeader } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Rutas públicas (SIN protección)
  const publicRoutes = ['/admin/login', '/api/auth/login', '/'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Rutas protegidas
  const protectedRoutes = ['/admin', '/api/productos', '/api/ingredientes'];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Solo obtén el token del header
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    // ✅ SOLO verificar que exista token
    if (!token) {
      // Si viene desde navegador (/admin), permite que continúe
      if (pathname.startsWith('/admin')) {
        return NextResponse.next();
      }

      // Si viene desde API (/api), rechaza sin token
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // ✅ Token existe, permite pasar
    // La validación real la hará cada ruta API
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/productos/:path*',
    '/api/ingredientes/:path*',
    '/api/auth/:path*',
  ],
};
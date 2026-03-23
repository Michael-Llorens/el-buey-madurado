import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // jose requiere Uint8Array como secreto
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);

    return NextResponse.next();
  } catch {
    // Token inválido o expirado — borrar cookie y redirigir
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return response;
  }
}

// Solo proteger rutas del dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};

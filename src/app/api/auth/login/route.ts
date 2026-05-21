import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { generarToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 intentos por minuto por IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateCheck = checkRateLimit(`login:${ip}`);
    if (rateCheck.limited) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Demasiados intentos. Inténtalo de nuevo en un minuto.',
      }, { status: 429 });
    }

    await connectDB();
    
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email y contraseña son requeridos',
      }, { status: 400 });
    }

    // Buscar usuario (incluir password)
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email o contraseña incorrectos',
      }, { status: 401 });
    }

    // Verificar contraseña
    const passwordValido = await usuario.comparePassword(password);

    if (!passwordValido) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email o contraseña incorrectos',
      }, { status: 401 });
    }

    if (!usuario.activo) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuario inactivo',
      }, { status: 403 });
    }

    // Generar token
    const token = await generarToken(usuario);

    // Actualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        token,
        usuario: {
          id: usuario._id,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    }, { status: 200 });

    // Setear cookie httpOnly (protección server-side)
    // El token también se devuelve en body para compatibilidad con localStorage
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días (mismo que JWT_EXPIRE)
    });

    return response;

  } catch (error) {
    logger.error('Error login:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Error al iniciar sesión',
    }, { status: 500 });
  }
}
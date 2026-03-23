import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { ApiResponse } from '@/lib/types';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { checkRateLimit } from '@/lib/utils/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 intentos por minuto por IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateCheck = checkRateLimit(`register:${ip}`);
    if (rateCheck.limited) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Demasiados intentos. Inténtalo de nuevo en un minuto.',
      }, { status: 429 });
    }

    // Solo un admin autenticado puede registrar usuarios
    const auth = protegerRuta(request);
    if (!auth.valido || !auth.payload) {
      return auth.response!;
    }

    if (!verificarRol(auth.payload, ['admin'])) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Solo un administrador puede crear usuarios',
      }, { status: 403 });
    }

    await connectDB();

    const { email, password, rol } = sanitizeBody(await request.json());

    // Validaciones
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email y contraseña son requeridos',
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Contraseña debe tener al menos 6 caracteres',
      }, { status: 400 });
    }

    // Verificar si existe
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'El email ya está registrado',
      }, { status: 409 });
    }

    // Crear usuario
    const nuevoUsuario = new Usuario({
      email,
      password,
      rol: rol || 'camarero',
      activo: true,
    });

    await nuevoUsuario.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        usuario: {
          id: nuevoUsuario._id,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
        },
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error registro:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Error al registrar usuario',
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { ApiResponse } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/seed/admin
 *
 * Bootstrap del primer usuario admin cuando la BD está vacía.
 * SOLO funciona si no existe ningún usuario con rol 'admin'.
 * Una vez que hay un admin, este endpoint se vuelve inútil (devuelve 409).
 *
 * Body: { email: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Si ya hay algún admin, este endpoint queda bloqueado para siempre
    const adminExistente = await Usuario.findOne({ rol: 'admin' });
    if (adminExistente) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ya existe un administrador. Este endpoint solo funciona cuando la BD está vacía.',
      }, { status: 409 });
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email y contraseña son requeridos',
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      }, { status: 400 });
    }

    const nuevoAdmin = new Usuario({
      email,
      password,
      rol: 'admin',
      activo: true,
    });

    await nuevoAdmin.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        usuario: {
          id: nuevoAdmin._id,
          email: nuevoAdmin.email,
          rol: nuevoAdmin.rol,
        },
      },
      message: 'Admin creado. Ya puedes iniciar sesión en /login.',
    }, { status: 201 });
  } catch (error) {
    logger.error('Error en seed admin:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Error al crear admin inicial',
    }, { status: 500 });
  }
}

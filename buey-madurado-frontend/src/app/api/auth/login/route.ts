import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Usuario from '@/lib/models/Usuario';
import { generarToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

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
    const token = generarToken(usuario);

    // Actualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();

    return NextResponse.json<ApiResponse>({
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

  } catch (error: any) {
    console.error('Error login:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Error al iniciar sesión',
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { generarToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, rol } = await request.json();

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

    // Generar token
    const token = generarToken(nuevoUsuario);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        token,
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
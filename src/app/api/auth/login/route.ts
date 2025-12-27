import { NextRequest, NextResponse } from 'next/server';
import { generarToken, compararPassword, hashPassword } from '@/lib/auth';

// SIMULAMOS USUARIOS (en producción: MongoDB)
const usuarios = [
  {
    usuario: 'admin',
    password: '', // Se llenará con hash
    rol: 'admin'
  },
  {
    usuario: 'editor',
    password: '',
    rol: 'editor'
  }
];

// Inicializa los passwords hasheados (solo primera vez)
async function initUsers() {
  if (usuarios[0].password === '') {
    usuarios[0].password = await hashPassword('admin123');
    usuarios[1].password = await hashPassword('editor123');
  }
}

export async function POST(request: NextRequest) {
  try {
    await initUsers();

    const { usuario, password } = await request.json();

    // Validación básica
    if (!usuario || !password) {
      return NextResponse.json(
        { ok: false, error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);
    if (!usuarioEncontrado) {
      return NextResponse.json(
        { ok: false, error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Comparar contraseña
    const passwordValido = await compararPassword(password, usuarioEncontrado.password);
    if (!passwordValido) {
      return NextResponse.json(
        { ok: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar token con usuario Y rol (como en PDF)
    const token = generarToken(usuarioEncontrado.usuario, usuarioEncontrado.rol);

    return NextResponse.json({
      ok: true,
      token: token,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
      mensaje: 'Login exitoso'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
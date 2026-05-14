import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { getErrorMessage } from '@/lib/utils/errors';

export async function GET(request: NextRequest) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  // 🔐 SOLO ADMIN
  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Solo administradores pueden ver usuarios',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const usuarios = await Usuario.find()
      .select('-password') // No mostrar passwords
      .sort({ email: 1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: usuarios,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  // 🔐 SOLO ADMIN CREA
  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Solo administradores pueden crear usuarios',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = sanitizeBody(await request.json());

    const usuario = new Usuario(body);
    await usuario.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: usuario._id, email: usuario.email, rol: usuario.rol },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 400 });
  }
}
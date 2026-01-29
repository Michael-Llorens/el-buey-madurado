import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const auth = protegerRuta(request);
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
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = protegerRuta(request);
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
    const body = await request.json();
    
    const usuario = new Usuario(body);
    await usuario.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: usuario._id, email: usuario.email, rol: usuario.rol },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
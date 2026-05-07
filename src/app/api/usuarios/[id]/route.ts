import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Usuario from '@/lib/models/Usuario';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { validarObjectId } from '@/lib/utils/validateId';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { getErrorMessage } from '@/lib/utils/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No autorizado',
    }, { status: 403 });
  }

  try {
    const { id } = await params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    await connectDB();
    
    const usuario = await Usuario.findById(id)
      .select('-password')
      .lean();

    if (!usuario) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: usuario,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No autorizado',
    }, { status: 403 });
  }

  try {
    const { id } = await params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    await connectDB();
    
    const body = sanitizeBody(await request.json());
    const { password, ...updateData } = body; // No actualizar password aquí

    const usuario = await Usuario.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password').lean();

    if (!usuario) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: usuario,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No autorizado',
    }, { status: 403 });
  }

  try {
    const { id } = await params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    await connectDB();
    
    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Usuario no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: usuario._id },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TicketCocina from '@/lib/models/TicketCocina';
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

  try {
    const { id } = await params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    await connectDB();
    const ticket = await TicketCocina.findById(id)
      .populate('pedido', 'tipo estado mesa total createdAt')
      .lean();

    if (!ticket) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ticket de cocina no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ticket,
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

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar tickets de cocina',
    }, { status: 403 });
  }

  try {
    const { id } = await params;
    const idError = validarObjectId(id);
    if (idError) return idError;

    await connectDB();
    const body = sanitizeBody(await request.json());
    const ticket = await TicketCocina.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!ticket) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Ticket de cocina no encontrado',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ticket,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 400 });
  }
}
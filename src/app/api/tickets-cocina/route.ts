import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TicketCocina from '@/lib/models/TicketCocina';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';
import { sanitizeBody } from '@/lib/utils/sanitize';
import { getErrorMessage } from '@/lib/utils/errors';

export async function GET(request: NextRequest) {
  const auth = await protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para ver tickets de cocina',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const tickets = await TicketCocina.find({ completado: false })
      .populate('pedido', 'tipo estado mesa total createdAt')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: tickets,
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

  if (!verificarRol(auth.payload!, ['admin', 'camarero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para crear tickets de cocina',
    }, { status: 403 });
  }

  try {
    await connectDB();
    const body = sanitizeBody(await request.json());
    const ticket = new TicketCocina(body);
    await ticket.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: ticket,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: getErrorMessage(error),
    }, { status: 400 });
  }
}
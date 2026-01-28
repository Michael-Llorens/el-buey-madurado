import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/bd';
import TicketCocina from '@/lib/models/TicketCocina';
import { protegerRuta, verificarRol } from '@/lib/middlewareAuth';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  try {
    const { id } = await params;  // Resolver Promise
    await connectDB();
    const ticket = await TicketCocina.findById(id)
      .populate('pedido')
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
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protegerRuta(request);
  if (!auth.valido) return auth.response!;

  if (!verificarRol(auth.payload!, ['admin', 'cocinero'])) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'No tienes permiso para actualizar tickets de cocina',
    }, { status: 403 });
  }

  try {
    const { id } = await params;  // Resolver Promise
    await connectDB();
    const body = await request.json();
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
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message,
    }, { status: 400 });
  }
}
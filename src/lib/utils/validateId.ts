import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

/**
 * Valida que un string sea un ObjectId válido de MongoDB.
 * Devuelve null si es válido, o una NextResponse con error 400 si no lo es.
 */
export function validarObjectId(id: string): NextResponse<ApiResponse> | null {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'ID no válido' },
      { status: 400 }
    );
  }
  return null;
}

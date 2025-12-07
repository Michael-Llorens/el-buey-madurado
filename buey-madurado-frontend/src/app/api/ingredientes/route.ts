import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Ingrediente from '@/app/api/models/Ingredientes';

// GET - LISTAR TODOS LOS INGREDIENTES
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activo = searchParams.get('activo');
    const disponible = searchParams.get('disponible');
    const categoria = searchParams.get('categoria');

    const filter: any = {};
    if (activo !== null) filter.activo = activo === 'true';
    if (disponible !== null) filter.disponible = disponible === 'true';
    if (categoria) filter.categoria = categoria;

    const ingredientes = await Ingrediente.find(filter).sort({ nombre: 1 });

    return NextResponse.json({
      success: true,
      data: ingredientes,
      total: ingredientes.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - CREAR NUEVO INGREDIENTE
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.nombre || !body.categoria || body.precioBase === undefined || body.precioExtra === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const existe = await Ingrediente.findOne({ nombre: body.nombre });
    if (existe) {
      return NextResponse.json(
        { success: false, error: 'El ingrediente ya existe' },
        { status: 400 }
      );
    }

    const nuevoIngrediente = new Ingrediente(body);
    await nuevoIngrediente.save();

    return NextResponse.json(
      { success: true, message: 'Ingrediente creado exitosamente', data: nuevoIngrediente },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { validarToken, extraerTokenDelHeader } from '@/lib/auth';
import conectarDB from '@/app/api/lib/conectBD';
import Ingrediente from '@/app/api/models/Ingredientes';

// ✅ GET: Obtener ingredientes
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = validarToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await conectarDB();
    const ingredientes = await Ingrediente.find({});

    return NextResponse.json({
      ok: true,
      success: true,
      data: ingredientes,
    });
  } catch (error: any) {
    console.error('Error fetching ingredientes:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: Crear ingrediente
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = validarToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await conectarDB();

    const body = await request.json();

    // Validar campos obligatorios
    if (!body.nombre || !body.categoria || body.precioBase === undefined || body.precioExtra === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Crear nuevo ingrediente
    const nuevoIngrediente = new Ingrediente({
      nombre: body.nombre,
      categoria: body.categoria,
      descripcion: body.descripcion || '',
      precioBase: Number(body.precioBase),
      precioExtra: Number(body.precioExtra),
      imagen: body.imagen || '',
      inventario: {
        cantidad: Number(body.inventario?.cantidad || 100),
        unidad: body.inventario?.unidad || 'g',
      },
      alergenicos: body.alergenicos || [],
      disponible: body.disponible !== undefined ? body.disponible : true,
      activo: body.activo !== undefined ? body.activo : true,
    });

    await nuevoIngrediente.save();

    return NextResponse.json(
      {
        ok: true,
        success: true,
        data: nuevoIngrediente,
        message: 'Ingrediente creado exitosamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ingrediente:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT: Actualizar ingrediente
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extraerTokenDelHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = validarToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await conectarDB();

    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { ok: false, error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Validar campos obligatorios
    if (!body.nombre || !body.categoria || body.precioBase === undefined || body.precioExtra === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Actualizar ingrediente
    const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
      _id,
      {
        nombre: body.nombre,
        categoria: body.categoria,
        descripcion: body.descripcion || '',
        precioBase: Number(body.precioBase),
        precioExtra: Number(body.precioExtra),
        imagen: body.imagen || '',
        inventario: {
          cantidad: Number(body.inventario?.cantidad || 100),
          unidad: body.inventario?.unidad || 'g',
        },
        alergenicos: body.alergenicos || [],
        disponible: body.disponible !== undefined ? body.disponible : true,
        activo: body.activo !== undefined ? body.activo : true,
      },
      { new: true, runValidators: true }
    );

    if (!ingredienteActualizado) {
      return NextResponse.json(
        { ok: false, error: 'Ingrediente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        success: true,
        data: ingredienteActualizado,
        message: 'Ingrediente actualizado exitosamente',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating ingrediente:', error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
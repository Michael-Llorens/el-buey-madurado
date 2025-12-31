import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/conectBD';
import Product from '@/app/api/models/Product';

// ============================================
// GET - LISTAR TODOS LOS PRODUCTOS
// ============================================
// Endpoints:
//   GET /api/productos
//   GET /api/productos?activo=true
//   GET /api/productos?disponible=true&categoria=Carnes
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activo = searchParams.get('activo');
    const disponible = searchParams.get('disponible');
    const categoria = searchParams.get('categoria');

    // Construir filtro
    const filter: any = {};
    if (activo !== null) filter.activo = activo === 'true';
    if (disponible !== null) filter.disponible = disponible === 'true';
    if (categoria) filter.categoria = categoria;

    // ⭐ IMPORTANTE: POPULATE
    // Los productos tienen referencias a ingredientes (IDs)
    // populate() trae la información completa del ingrediente
    // Así en lugar de solo el ID, trae todo el objeto
    const productos = await Product.find(filter)
      .populate('ingredientes.ingrediente')  // Traer datos completos de ingredientes base
      .populate('ingredientesExtra')         // Traer datos completos de ingredientes extras
      .sort({ nombre: 1 });

    return NextResponse.json({
      success: true,
      data: productos,
      total: productos.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST - CREAR NUEVO PRODUCTO
// ============================================
// Endpoint: POST /api/productos
// Body:
// {
//   "nombre": "Hamburguesa El Buey",
//   "categoria": "Sándwich y hamburguesas",
//   "precio": 15.00,
//   "descripcion": "Descripción del producto",
//   "ingredientes": [
//     {
//       "ingrediente": "507f1f77bcf86cd799439001",
//       "nombre": "Queso Cheddar",
//       "cantidad": 60,
//       "unidad": "g",
//       "esOpcional": true
//     }
//   ],
//   "ingredientesExtra": ["507f1f77bcf86cd799439010"],
//   "permitirPersonalizacion": true,
//   "permitirExtras": true,
//   "permitirRemover": true
// }
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validaciones - campos obligatorios
    if (!body.nombre || !body.categoria || !body.precio || !body.descripcion) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos requeridos: nombre, categoria, precio, descripcion' 
        },
        { status: 400 }
      );
    }

    // Crear producto
    const nuevoProducto = new Product(body);
    await nuevoProducto.save();

    // Poblar ingredientes DESPUÉS de guardar
    // Esto trae los datos completos de los ingredientes referenciados
    await nuevoProducto.populate('ingredientes.ingrediente');
    await nuevoProducto.populate('ingredientesExtra');

    return NextResponse.json(
      {
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
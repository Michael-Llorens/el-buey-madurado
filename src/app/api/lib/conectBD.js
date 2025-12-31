// Importar mongoose para conectar a MongoDB
import mongoose from 'mongoose';

// Obtener la URL de conexión de las variables de entorno
// Esto está en .env.local: MONGODB_URI=mongodb+srv://...
const MONGODB_URI = process.env.MONGODB_URI;

// Validación: Si no existe la variable de entorno, lanzar error
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI no está definida en .env');
}

// ============================================
// CACHING DE CONEXIÓN
// ============================================
// En Next.js, la función puede ejecutarse varias veces
// Guardamos la conexión en caché para no crear múltiples conexiones
// Esto es importante para evitar memory leaks

// global.mongoose almacena la conexión entre ejecuciones
// Inicializamos si no existe
let cached = global.mongoose;

if (!cached) {
  // Crear objeto para almacenar conexión y promesa
  cached = global.mongoose = { conn: null, promise: null };
}

// ============================================
// FUNCIÓN DE CONEXIÓN
// ============================================
async function connectDB() {
  // Si ya hay conexión activa, devolverla (reutilizar)
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay promesa de conexión, crearla
  if (!cached.promise) {
    // mongoose.connect devuelve una promesa
    // Conectamos a MongoDB y guardamos la promesa
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      // Retornar mongoose para poder usarlo después
      return mongoose;
    });
  }

  // Esperar a que la promesa se resuelva
  cached.conn = await cached.promise;
  
  // Retornar la conexión para usarla en las rutas
  return cached.conn;
}

// Exportar la función para usarla en los API Routes
export default connectDB;
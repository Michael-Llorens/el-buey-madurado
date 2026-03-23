import mongoose from "mongoose";
import { logger } from "@/lib/utils/logger";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Por favor define MONGODB_URI en .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    logger.log("✅ Usando conexión MongoDB existente (cacheada)");
    return cached.conn;
  }

  if (!cached.promise) {
    logger.log("🔄 Conectando a MongoDB...");
    logger.log(`📍 URI: ${MONGODB_URI.split("@")[1] || "***"}`); // Mostrar sin credenciales
    
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        logger.log("✅ Conectado a MongoDB correctamente");
        logger.log(`📦 Base de datos: ${mongoose.connection.db?.databaseName}`);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ Error al conectar a MongoDB:", error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error("❌ Fallo en la conexión a MongoDB:", e.message);
    throw e;
  }

  return cached.conn;
}
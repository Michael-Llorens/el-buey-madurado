import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
      tlsAllowInvalidCertificates: true, // 🔧 desarrollo en Windows
    });
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
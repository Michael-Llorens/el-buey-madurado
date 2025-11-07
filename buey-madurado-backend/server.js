import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Importamos las rutas
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor del Buey Madurado funcionando 🐂🔥");
});

// Rutas
app.use("/api/productos", productRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

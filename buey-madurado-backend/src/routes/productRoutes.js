import express from "express";

import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", crearProducto);             // Crear producto
router.get("/", obtenerProductos);           // Obtener todos
router.get("/:id", obtenerProductoPorId);    // Obtener uno
router.put("/:id", actualizarProducto);      // Actualizar
router.delete("/:id", eliminarProducto);     // Eliminar

export default router;

import express from "express";
import { crearProducto, obtenerProductos } from "../controllers/productController.js";

const router = express.Router();

router.post("/", crearProducto);
router.get("/", obtenerProductos);

export default router;
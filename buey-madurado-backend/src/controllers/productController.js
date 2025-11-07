import Product from "../models/Product.js";

// Crear un producto nuevo
export const crearProducto = async (req, res) => {
  try {
    const producto = new Product(req.body);
    await producto.save();
    res.status(201).json({ message: "✅ Producto creado correctamente", producto });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al crear el producto", error: error.message });
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "❌ Error al obtener productos", error: error.message });
  }
};
